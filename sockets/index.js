/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== SOCKETS ===============================================================
import UserSocket from './user-socket';
import PackageSocket from './package-socket';

const socketUsers = new Map(); // {socketId: {userId, listId}}

export default function attachSockets(io) {
  io.on('connection', (socket) => {
    const allInRoom = (roomId) => io.sockets.in(roomId);
    const userSocket = io.sockets.connected[socket.id];

    const channel = (channel, handler) => {
      socket.on(channel, (request, sendStatus) => {
        console.log(`>>>>Captured event[${channel}] on socket[${socket.id}]`, {
          request,
          socketUsers,
        });
        const {senderId, instId} = socketUsers.get(socket.id) || {};
        let newRequest = {};
        console.log(`>>>>Socket Incoming Request [${typeof request}]`, {
          cache: {
            senderId,
            instId,
          },
        });
        if (typeof request === 'object') {
          newRequest = {...request};
          if (!request.senderId && senderId) {
            console.log(`>>>>Overwriting Request.senderId with [${senderId}]`);
            newRequest.senderId = senderId;
          }
          if (!request.instId && instId) {
            console.log(`>>>>Overwriting Request.instId with [${instId}]`);
            newRequest.instId = instId;
          }
        } else if (typeof request === 'string') {
          newRequest.senderId = senderId;
          newRequest.instId = instId;
        }
        console.log('>>>>before handler', newRequest);
        handler({
          allInRoom,
          request: newRequest,
          sendStatus,
          socket,
          socketUsers,
          userSocket,
        });
      });
    };

    console.log(`A user connected (socket ID ${socket.id})`);

    channel('disconnect', UserSocket.leave);
    channel('push:register', UserSocket.register);
    channel('push:instance:view', UserSocket.view);
    channel('push:user:view', UserSocket.view);
    channel('push:user:join', UserSocket.joinPackage);
    channel('push:user:leave', UserSocket.leavePackage);
    channel('push:package:filter', PackageSocket.showAllPackages);
    channel('push:package:showAll', PackageSocket.showAllPackages);
    channel('push:package:view', PackageSocket.showPackage);
    channel('push:package:create', PackageSocket.createInstPackage);
    channel('push:package:share', PackageSocket.shareInstPackage);
    channel('push:package:update', PackageSocket.updateInstPackage);
    channel('push:likedAttractions:update', UserSocket.updateLikedAttractions);
  });
}
