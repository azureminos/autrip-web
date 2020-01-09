import _ from 'lodash';
import async from 'async';
import MongoDB from '../db/schema';
import helper from '../lib/object-parser';

const getPackage = ({request: {id, isCustomisable}, sendStatus, socket}) => {
  console.log('>>>>server received event[push:package:get]', {
    id,
    isCustomisable,
  });
  if (isCustomisable) {
    // async calls
    async.parallel(
      {
        packageSummary: (callback) => {
          MongoDB.getPackageById(id, (err, item) => {
            console.log(
              '>>>>server async calls for event[push:package:get]',
              item
            );
            return callback(null, helper.parseTravelPackage(item));
          });
        },
        packageItems: (callback) => {
          MongoDB.getItemsByPackageId(id, (err, items) => {
            console.log('>>>>Event[push:package:get].packageItems', items);
            return callback(null, helper.parsePackageItem(items));
          });
        },
        packageHotels: (callback) => {
          MongoDB.getHotels({package: id}, (err, items) => {
            return callback(null, helper.parsePackageHotel(items));
          });
        },
      },
      function(err, results) {
        console.log(
          '>>>>server final callback for event[push:package:get]',
          results
        );
        socket.emit('product:get', results);
      }
    );
  } else {
    // async calls
    async.parallel(
      {
        packageSummary: (callback) => {
          MongoDB.getPackageById(id, (err, item) => {
            console.log(
              '>>>>server async calls for event[push:package:get]',
              item
            );
            return callback(null, helper.parseTravelPackage(item));
          });
        },
        packageItems: (callback) => {
          MongoDB.getItemsByPackageId(id, (err, items) => {
            console.log('>>>>Event[push:package:get].packageItems', items);
            return callback(null, helper.parsePackageItem(items));
          });
        },
        packageHotels: (callback) => {
          MongoDB.getHotelsByPackageId(id, (err, items) => {
            console.log('>>>>Event[push:package:get].packageHotels', items);
            async.parallel(
              {
                dayHotels: (callback) => {
                  return callback(null, helper.parsePackageHotel(items));
                },
                hotels: (callback) => {
                  const hotelIds = _.map(items, (item) => {
                    return item.hotel;
                  });
                  // console.log('>>>>Event[push:package:get].packageHotels Input', hotelIds);
                  MongoDB.getHotelsByIds(hotelIds, (err, items) => {
                    // console.log('>>>>Event[push:package:get].packageHotels Output',	items);
                    return callback(null, helper.parseHotel(items));
                  });
                },
              },
              function(err, results) {
                // console.log('>>>>server final callback for event[push:package:get]', results);
                return callback(null, results);
              }
            );
          });
        },
      },
      function(err, results) {
        // console.log('>>>>server final callback for event[push:package:get]', results);
        socket.emit('product:get', results);
      }
    );
  }
};

const getRatesByPackage = ({
  request: {id, isCustomised},
  sendStatus,
  socket,
}) => {
  console.log('>>>>server received event[push:rate:getByProduct]', {
    id,
    isCustomised,
  });
  if (isCustomised) {
    // async calls
    async.parallel(
      {
        packageRates: (callback) => {
          MongoDB.getPackageRatesByPackageId(id, (err, item) => {
            console.log('>>>>Event[push:rate:getByProduct].packageRates', item);
            const sortedRates = (item.packageRates || []).sort(function(a, b) {
              return b.priority - a.priority;
            });
            return callback(null, sortedRates);
          });
        },
        flightRates: (callback) => {
          MongoDB.getFlightRatesByPackageId(id, (err, item) => {
            console.log('>>>>Event[push:rate:getByProduct].flightRates', item);
            const sortedRates = (item.flightRates || []).sort(function(a, b) {
              return b.priority - a.priority;
            });
            return callback(null, sortedRates);
          });
        },
        carRates: (callback) => {
          MongoDB.getPackageById(id).populate('carRates', (err, item) => {
            const sortedRates = (item.carRates || []).sort(function(a, b) {
              return b.priority - a.priority;
            });
            return callback(null, sortedRates);
          });
        },
        /* cities: callback => {
					MongoDB.getItems({ package: id })
						.populate('attraction')
						.exec(function (err, items) {
							const cities = _.map(items, item => {
								return item.attraction ? item.attraction.city : null;
							});
							// console.log('>>>>getRatesByPackage.cityAttractions : cities', cities);
							return MongoDB.getCities({ _id: { $in: cities } })
								.populate('attractions hotels')
								.exec(function (err, items) {
									// console.log('>>>>getRatesByPackage.cityAttractions : result', items);
									return callback(null, helper.parseCity(items, 'all'));
								});
						});
				},*/
      },
      function(err, results) {
        // console.log('>>>>server final callback for event[push:rate:getByProduct]', results);
        socket.emit('rate:getByProduct', results);
      }
    );
  } else {
    // async calls
    async.parallel(
      {
        packageRates: (callback) => {
          MongoDB.getPackageRatesByPackageId(id, (err, items) => {
            console.log(
              '>>>>Event[push:rate:getByProduct].packageRates',
              items
            );
            const sortedRates = (items || []).sort(function(a, b) {
              return b.priority - a.priority;
            });
            return callback(null, sortedRates);
          });
        },
        flightRates: (callback) => {
          MongoDB.getFlightRatesByPackageId(id, (err, items) => {
            console.log('>>>>Event[push:rate:getByProduct].flightRates', items);
            const sortedRates = (items || []).sort(function(a, b) {
              return b.priority - a.priority;
            });
            return callback(null, sortedRates);
          });
        },
      },
      function(err, results) {
        // console.log('>>>>server final callback for event[push:rate:getByProduct]', results);
        socket.emit('rate:getByProduct', results);
      }
    );
  }
};

const filterPackage = ({request, sendStatus, socket}) => {
  // console.log('>>>>server received event[push:package:filter]', request);
  if (process.env.LOCAL === 'true') {
    MongoDB.deleteAllInstanceMembers();
    MongoDB.deleteAllInstanceItems();
    MongoDB.deleteAllInstanceHotels();
    MongoDB.deleteAllInstances();
  }
  MongoDB.getFilteredPackages(request, (err, items) => {
    // console.log('>>>>Result of event[push:package:filter]', items);
    socket.emit('product:refreshAll', {
      packages: helper.parseTravelPackage(items),
    });
  });
};

const joinPackage = ({request, sendStatus, socket}) => {};

const paidPackage = ({request, sendStatus, socket}) => {
  console.log('>>>>server received event[push:product:paid]', request);
  const callback = (error, writeOpResult) => {
    console.log('Callback of updateInstPackageStatus()', {
      error,
      writeOpResult,
    });
    if (!error) {
      socket.emit('product:paid', request);
    }
  };
  MongoDB.updateInstPackageStatus(request, callback);
};

const customisePackage = ({request, sendStatus, socket}) => {
  console.log('>>>>server received event[push:product:checkout]', request);
  // New Instance: insert inst/items/hotels/members
  const instPackage = _.pick(
    request,
    'status',
    'startDate',
    'endDate',
    'isCustomised',
    'rate'
  );
  instPackage.package = request.packageId;
  instPackage.createdBy = request.createdBy;
  instPackage.createdAt = new Date(request.createdAt);
  instPackage.slug = `${request.createdBy}_${
    request.packageId
  }_${instPackage.createdAt.getTime()}`;
  instPackage.totalKids = _.sumBy(request.members, (o) => {
    return o.kids || 0;
  });
  instPackage.totalAdults = _.sumBy(request.members, (o) => {
    return o.adults || 0;
  });
  const handleInstPackage = (err, doc) => {
    if (err) return console.log(err);
    console.log('>>>>createInstance', {request, doc, instPackage});
    const instPackageItems = _.map(request.items, (item) => {
      const instPackageItem = {...item};
      instPackageItem.instPackage = doc._id;
      instPackageItem.createdBy = instPackage.createdBy;
      instPackageItem.createdAt = instPackage.createdAt;
      return instPackageItem;
    });
    const instPackageHotels = _.map(request.hotels, (hotel) => {
      const instPackageHotel = {...hotel};
      instPackageHotel.instPackage = doc._id;
      instPackageHotel.createdBy = instPackage.createdBy;
      instPackageHotel.createdAt = instPackage.createdAt;
      return instPackageHotel;
    });
    const instPackageMembers = _.map(request.members, (member) => {
      const instPackageMember = {...member};
      instPackageMember.instPackage = doc._id;
      instPackageMember.createdBy = instPackage.createdBy;
      instPackageMember.createdAt = instPackage.createdAt;
      return instPackageMember;
    });

    async.parallel(
      {
        items: (callback) => {
          MongoDB.createInstanceItems(instPackageItems, function(err, docs) {
            console.log('>>>>createInstanceItems', docs);
            return callback(null, docs);
          });
        },
        hotels: (callback) => {
          MongoDB.createInstanceHotels(instPackageHotels, function(err, docs) {
            console.log('>>>>createInstanceHotels', docs);
            return callback(null, docs);
          });
        },
        members: (callback) => {
          MongoDB.createInstanceMembers(instPackageMembers, function(
            err,
            docs
          ) {
            console.log('>>>>createInstanceMembers', docs);
            return callback(null, docs);
          });
        },
      },
      function(err, results) {
        console.log('>>>>Instance Saved', {doc, results});
        const inst = {...doc._doc};
        inst.items = results.items;
        inst.hotels = results.hotels;
        inst.members = results.members;
        socket.emit('product:customise', inst);
      }
    );
  };
  MongoDB.createInstance(instPackage, handleInstPackage);
};

const checkoutPackage = ({request, sendStatus, socket}) => {
  console.log('>>>>server received event[push:product:checkout]', request);
  if (!request._id) {
    // New Instance: insert inst/items/hotels/members
    const instPackage = _.pick(
      request,
      'status',
      'startDate',
      'endDate',
      'isCustomised',
      'rate'
    );
    instPackage.package = request.packageId;
    instPackage.createdBy = request.createdBy;
    instPackage.createdAt = new Date(request.createdAt);
    instPackage.totalKids = _.sumBy(request.members, (o) => {
      return o.kids || 0;
    });
    instPackage.totalAdults = _.sumBy(request.members, (o) => {
      return o.adults || 0;
    });
    const handleInstPackage = (err, doc) => {
      if (err) return console.log(err);
      console.log('>>>>createInstance', {request, doc, instPackage});
      const instanceItems = _.map(request.items, (item) => {
        const instPackageItem = {...item};
        instPackageItem.instPackage = doc._id;
        instPackageItem.createdBy = instPackage.createdBy;
        instPackageItem.createdAt = instPackage.createdAt;
        return instPackageItem;
      });
      const instanceHotels = _.map(request.hotels, (hotel) => {
        const instPackageHotel = {...hotel};
        instPackageHotel.instPackage = doc._id;
        instPackageHotel.createdBy = instPackage.createdBy;
        instPackageHotel.createdAt = instPackage.createdAt;
        return instPackageHotel;
      });
      const instanceMembers = _.map(request.members, (member) => {
        const instPackageMember = {...member};
        instPackageMember.instPackage = doc._id;
        instPackageMember.createdBy = instPackage.createdBy;
        instPackageMember.createdAt = instPackage.createdAt;
        return instPackageMember;
      });

      async.parallel(
        {
          items: (callback) => {
            MongoDB.createInstanceItems(instanceItems, (err, docs) => {
              console.log('>>>>createInstanceItems', docs);
              return callback(null, docs);
            });
          },
          hotels: (callback) => {
            MongoDB.createInstanceHotels(instanceHotels, (err, docs) => {
              console.log('>>>>createInstanceHotels', docs);
              return callback(null, docs);
            });
          },
          members: (callback) => {
            MongoDB.createInstanceMembers(instanceMembers, (err, docs) => {
              console.log('>>>>createInstanceMembers', docs);
              return callback(null, docs);
            });
          },
        },
        function(err, results) {
          console.log('>>>>Instance Saved', {doc, results});
          const inst = {...doc._doc};
          inst.items = results.items;
          inst.hotels = results.hotels;
          inst.members = results.members;
          socket.emit('product:checkout', inst);
        }
      );
    };
    MongoDB.createInstance(instPackage, handleInstPackage);
  } else {
    // Existing Instance: update inst, insert members
  }
};

export default {
  filterPackage,
  getPackage,
  getRatesByPackage,
  joinPackage,
  customisePackage,
  checkoutPackage,
  paidPackage,
};
