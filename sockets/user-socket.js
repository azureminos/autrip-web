/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== Module ================================================================
import _ from 'lodash';
import async from 'async';
import CONSTANTS from '../lib/constants';
import ObjectParser from '../lib/object-parser';
// ===== DB ====================================================================
import Model from '../db/schema';
// ===== MESSENGER =============================================================

// Variables
const {Global, Instance, SocketChannel} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const SocketAction = SocketChannel.Action;
const SocketStatus = SocketChannel.Status;

// ===== HANDLER ===============================================================
const getUserFromDB = (senderId, callback) => {
  Model.getUserByLoginId(senderId, (err, docs) => {
    if (err) {
      return console.error('>>>>Model.getUserByLoginId error', err);
    }
    console.log('>>>>Model.getUserByLoginId result', docs);
    return callback(err, docs);
  });
};
const getUserDetails = (senderId, callback) => {
  if (process.env.IS_DUMMY_USER === 'true') {
    return callback(null, {
      loginId: senderId,
      source: 'facebook',
      profilePic: '',
      name: `FB User ${senderId}`,
      email: '',
      mobile: '',
      phone: '',
    });
  }
  return getUserFromDB(senderId, (err, dbUser) => {
    console.log('>>>>UserSocket.getUserFromDB', {err, dbUser});
    return callback(err, dbUser);
  });
};
const view = (input) => {
  const {
    request,
    allInRoom,
    sendStatus,
    socket,
    socketUsers,
    userSocket,
  } = input;
  console.log('>>>>Socket.view start', {request, socketUsers, sendStatus});
  const {senderId, instId} = request;
  // Validate UserId and InstanceId
  if (!senderId) {
    console.error('User not registered to socket');
    sendStatus(SocketStatus.INVALID_USER);
    return;
  }
  if (!instId) {
    console.error('Invalid Package Instance ID');
    sendStatus(SocketStatus.INVALID_INSTANCE);
    return;
  }
  // Persist socket details
  if (!socketUsers.get(socket.id)) {
    socketUsers.set(socket.id, {instId, senderId});
    socket.join(instId);
  }
  // Get instance details (package, attractions, hotels, members)
  async.parallel(
    {
      instance: (callback) => {
        Model.getInstanceByInstId(instId, callback);
      },
      instanceItems: (callback) => {
        Model.getInstanceItemsByInstId(instId, callback);
      },
      instanceHotels: (callback) => {
        Model.getInstanceHotelsByInstId(instId, callback);
      },
      instanceMembers: (callback) => {
        Model.getInstanceMembersByInstId(instId, callback);
      },
    },
    function(err, results1) {
      if (err) {
        console.error('>>>>Database Error', err);
        sendStatus(SocketStatus.DB_ERROR);
      } else {
        const {
          instance,
          instanceItems,
          instanceHotels,
          instanceMembers,
        } = results1;
        if (!instance) {
          console.error(">>>>Package instance doesn't exist!");
          sendStatus(SocketStatus.NO_INSTANCE);
        } else {
          console.log('>>>>Model.view Level 1 Result', results1);
          const packageSummary = ObjectParser.parseTravelPackage(
            instance.package
          );
          instance.package = packageSummary.id;
          instance.items = [...instanceItems];
          instance.hotels = [...instanceHotels];
          instance.members = [...instanceMembers];
          const getInstance = (inst, pack) => {
            async.parallel(
              {
                instance: (callback) => {
                  callback(null, inst);
                },
                packageSummary: (callback) => {
                  callback(null, pack);
                },
                cities: (callback) => {
                  Model.getCitiesByPackageId(pack.id, callback);
                },
                packageRates: (callback) => {
                  Model.getPackageRatesByPackageId(pack.id, callback);
                },
                flightRates: (callback) => {
                  Model.getFlightRatesByPackageId(pack.id, callback);
                },
                user: (callback) => {
                  getUserDetails(senderId, callback);
                },
              },
              function(err, results2) {
                if (err) {
                  console.error('>>>>Database Error', err);
                  sendStatus(SocketStatus.DB_ERROR);
                } else {
                  console.log('>>>>Model.view Level 2 Result', results2);
                  socket.emit('init', results2);
                  sendStatus(SocketStatus.OK);
                }
              }
            );
          };
          if (instanceMembers && instanceMembers.length > 0) {
            // If not empty, then return existing instance details
            getInstance(instance, packageSummary);
          } else {
            // Archive all instances in INITIATED status and owned by user
            Model.archiveInstanceByUserId({userId: senderId}, (err, docs) => {
              // If empty list, then add current user and mark as owner
              return getUserDetails(senderId, (err, userDetails) => {
                console.log('>>>>Model.getUserDetails', userDetails);
                const owner = {
                  instPackage: instId,
                  memberId: userDetails._id,
                  loginId: senderId,
                  name: userDetails.name,
                  isOwner: true,
                  status: InstanceStatus.INITIATED,
                  people: Global.defaultPeople,
                  rooms: Global.defaultRooms,
                  createdAt: new Date(),
                  createdBy: senderId,
                };
                instance.members = [owner];
                async.parallel(
                  {
                    member: (callback) => {
                      Model.createInstanceMembers(instance.members, callback);
                    },
                    instance: (callback) => {
                      const params = {
                        query: {_id: instId},
                        update: {createdBy: senderId},
                      };
                      Model.updateInstance(params, callback);
                    },
                  },
                  function(err, output) {
                    if (err) {
                      console.error('>>>>Database Error', err);
                      sendStatus(SocketStatus.DB_ERROR);
                    } else {
                      console.error('>>>>Member added', output);
                      getInstance(instance, packageSummary);
                    }
                  }
                );
              });
            });
          }
        }
      }
    }
  );
};

// Register User to Socket
const register = (input) => {
  const {request, allInRoom, sendStatus, socketUsers, socket} = input;
  const {senderId, instId} = request;
  console.log('>>>>Socket.register', {request, sendStatus});
  // Validate UserId and InstanceId
  if (!senderId) {
    console.error('User not registered to socket');
    if (sendStatus) sendStatus(SocketStatus.INVALID_USER);
    return;
  }
  if (!instId) {
    console.error('Invalid Package Instance ID');
    if (sendStatus) sendStatus(SocketStatus.INVALID_INSTANCE);
    return;
  }
  // Persist socket details
  if (!socketUsers.get(socket.id)) {
    socketUsers.set(socket.id, {instId, senderId});
    socket.join(instId);
  }
  if (sendStatus) sendStatus(SocketStatus.OK);
};

// Join Room, Update Necessary List Info, Notify All Users in room of changes.
const joinPackage = (input) => {
  const {request, allInRoom, sendStatus, socketUsers, socket} = input;
  const {senderId, instId, people, rooms} = request;
  console.log('>>>>Socket.joinPackage', {request, sendStatus});
  // Validate UserId and InstanceId
  if (!senderId) {
    console.error('User not registered to socket');
    sendStatus(SocketStatus.INVALID_USER);
    return;
  }
  if (!instId) {
    console.error('Invalid Package Instance ID');
    sendStatus(SocketStatus.INVALID_INSTANCE);
    return;
  }
  // Persist socket details
  if (!socketUsers.get(socket.id)) {
    socketUsers.set(socket.id, {instId, senderId});
  }
  getUserDetails(senderId, (err, userDetails) => {
    const member = {
      instPackage: instId,
      memberId: userDetails._id,
      loginId: senderId,
      name: userDetails.name,
      isOwner: false,
      status: InstanceStatus.INITIATED,
      people: people,
      rooms: rooms,
      createdAt: new Date(),
      createdBy: senderId,
    };
    const params = {
      instPackage: instId,
      loginId: senderId,
    };
    Model.getInstanceMembersByParams(params, (err, docs) => {
      if (err) {
        console.log('>>>>Model.findInstanceMemberById error', err);
      } else {
        console.log('>>>>Model.findInstanceMemberById completed', docs);
        if (!docs || docs.length === 0) {
          Model.createInstanceMembers(member, (err, docs) => {
            if (err) {
              console.log('>>>>Model.createInstanceMembers error', err);
              sendStatus(SocketStatus.DB_ERROR);
            } else {
              console.log('>>>>Model.createInstanceMembers completed', docs);
              const output = {
                action: SocketAction.USER_JOIN,
                senderId,
                instId,
                params: member,
              };
              allInRoom(instId).emit('package:update', output);
              sendStatus(SocketStatus.OK);
            }
          });
        } else {
          console.log('>>>>User existed already');
          sendStatus(SocketStatus.EXISTING_USER);
        }
      }
    });
  });
};
// User Leave Package
const leavePackage = (input) => {
  const {request, allInRoom, sendStatus, socket, socketUsers} = input;
  const {senderId, instId} = request;
  console.log('>>>>Socket.leavePackage', {request, sendStatus});
  // Validate UserId and InstanceId
  if (!senderId) {
    console.error('User not registered to socket');
    sendStatus(SocketStatus.INVALID_USER);
    return;
  }
  if (!instId) {
    console.error('Invalid Package Instance ID');
    sendStatus(SocketStatus.INVALID_INSTANCE);
    return;
  }
  // Persist socket details
  if (!socketUsers.get(socket.id)) {
    socketUsers.set(socket.id, {instId, senderId});
  }
  const params = {
    instPackage: instId,
    loginId: senderId,
  };
  Model.deleteInstanceByParams(params, (err, docs) => {
    if (err) {
      console.log('>>>>Model.deleteInstanceByParams error', err);
      sendStatus(SocketStatus.DB_ERROR);
    } else {
      console.log('>>>>Model.deleteInstanceByParams completed', docs);
      const output = {
        action: SocketAction.USER_LEAVE,
        senderId,
        instId,
      };
      allInRoom(instId).emit('package:update', output);
      sendStatus(SocketStatus.OK);
    }
  });
};

// Notify users in room when user leaves.
const leave = (input) => {
  const {request, allInRoom, socket, socketUsers, sendStatus} = input;
  console.log('>>>>Socket.leave', {request, sendStatus});
  /* const {senderId} = request;
  if (!senderId) {
    console.error('User not registered to socket');
    return;
  }

  socketUsers.delete(socket.id);

  // Detect online status via socketUser with matching list & FB IDs.
  const onlineUsers = [...socketUsers.values()].reduce(
    (onlineUsers, socketUser) =>
      socketUser.instId === instId
        ? [...onlineUsers, socketUser.senderId]
        : onlineUsers,
    []
  );

  allInRoom(instId).emit('users:setOnline', onlineUsers);*/
};

export default {
  register,
  view,
  joinPackage,
  leavePackage,
  leave,
  getUserDetails,
};
