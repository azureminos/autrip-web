import _ from 'lodash';
import async from 'async';
import mongoose from './mongoose';
import ObjectParser from '../lib/object-parser';
import CONSTANTS from '../lib/constants';

const {Global, User, Instance} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const Schema = mongoose.Schema;

/* ============= Schemas ============= */
// Members
const scMember = new Schema({
  name: Schema.Types.String,
  profilePic: Schema.Types.String,
  loginId: Schema.Types.String,
  source: Schema.Types.String,
  email: Schema.Types.String,
  contactNumber: Schema.Types.String,
  linkedAccount: {type: [Schema.Types.ObjectId], ref: 'Member'},
  isActive: Schema.Types.Boolean,
});
const Member = mongoose.model('Member', scMember);
// City
const scCity = new Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
  attractions: {type: [Schema.Types.ObjectId], ref: 'Attraction'},
  hotels: {type: [Schema.Types.ObjectId], ref: 'Hotel'},
  carRates: {type: [Schema.Types.ObjectId], ref: 'CarRate'},
});
const City = mongoose.model('City', scCity);
// Car Rate
const scCarRate = new Schema({
  city: {type: [Schema.Types.ObjectId], ref: 'City'},
  type: Schema.Types.String,
  minParticipant: Schema.Types.Number,
  maxParticipant: Schema.Types.Number,
  rangeFrom: Schema.Types.Date,
  rangeTo: Schema.Types.Date,
  rate: Schema.Types.Number,
  rateLocalGuide: Schema.Types.Number,
  rateAirport: Schema.Types.Number,
  rateExtra: Schema.Types.Number,
  priority: Schema.Types.Number,
});
const CarRate = mongoose.model('CarRate', scCarRate);
// Attraction
const scAttraction = new Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
  city: {type: Schema.Types.ObjectId, ref: 'City'},
  image: Schema.Types.Object,
  cost: Schema.Types.Number,
  rate: Schema.Types.Number,
  timeTraffic: Schema.Types.Number,
  timeVisit: Schema.Types.Number,
  nearByAttractions: {type: [Schema.Types.ObjectId], ref: 'Attraction'},
  parentAttractions: {type: [Schema.Types.ObjectId], ref: 'Attraction'},
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
});
const Attraction = mongoose.model('Attraction', scAttraction);
// Hotel
const scHotel = new mongoose.Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
  city: {type: Schema.Types.ObjectId, ref: 'City'},
  stars: Schema.Types.Number,
  type: Schema.Types.String,
  defaultRate: Schema.Types.Number,
  rateExtraBed: Schema.Types.Number,
  image: Schema.Types.Object,
  carouselImages: [Schema.Types.Object],
  timeTraffic: Schema.Types.Number,
  nearByAttractions: {type: [Schema.Types.ObjectId], ref: 'Attraction'},
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
});
const Hotel = mongoose.model('Hotel', scHotel);
// Travel Package
const scTravelPackage = new Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
  finePrint: Schema.Types.String,
  highlight: Schema.Types.String,
  // country: { type: Schema.Types.ObjectId, ref: 'Country' },
  totalDays: Schema.Types.Number,
  maxParticipant: Schema.Types.Number,
  minParticipant: Schema.Types.Number,
  departureDate: Schema.Types.String,
  retailPrice: Schema.Types.Number,
  isSnapshot: {type: Schema.Types.Boolean},
  status: Schema.Types.String,
  carOption: Schema.Types.String,
  isPromoted: Schema.Types.Boolean,
  isCustomisable: Schema.Types.Boolean,
  isExtention: Schema.Types.Boolean,
  image: Schema.Types.Object,
  titleImage: Schema.Types.Object,
  carouselImages: [Schema.Types.Object],
  effectiveTo: Schema.Types.Date,
  effectiveFrom: Schema.Types.Date,
  flightRates: {type: [Schema.Types.ObjectId], ref: 'FlightRate'},
  packageRates: {type: [Schema.Types.ObjectId], ref: 'PackageRate'},
  packageItems: {type: [Schema.Types.ObjectId], ref: 'PackageItem'},
  packageHotels: {type: [Schema.Types.ObjectId], ref: 'PackageHotel'},
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
});
const TravelPackage = mongoose.model('TravelPackage', scTravelPackage);
// Package Item
const scPackageItem = new Schema({
  package: {type: Schema.Types.ObjectId, ref: 'TravelPackage'},
  name: Schema.Types.String,
  description: Schema.Types.String,
  dayNo: Schema.Types.Number,
  daySeq: Schema.Types.Number,
  timePlannable: Schema.Types.Number,
  isMustVisit: Schema.Types.Boolean,
  attraction: {type: Schema.Types.ObjectId, ref: 'Attraction'},
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
});
const PackageItem = mongoose.model('PackageItem', scPackageItem);
// Package Hotel
const scPackageHotel = new mongoose.Schema({
  package: {type: Schema.Types.ObjectId, ref: 'TravelPackage'},
  name: Schema.Types.String,
  description: Schema.Types.String,
  dayNo: Schema.Types.Number,
  isOvernight: Schema.Types.Boolean,
  hotel: {type: Schema.Types.ObjectId, ref: 'Hotel'},
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
});
const PackageHotel = mongoose.model('PackageHotel', scPackageHotel);
// Flight Rate
const scFlightRate = new mongoose.Schema({
  package: {type: Schema.Types.ObjectId, ref: 'FlightRate'},
  name: Schema.Types.String,
  description: Schema.Types.String,
  airline: Schema.Types.String,
  type: Schema.Types.String,
  rangeFrom: Schema.Types.Date,
  rangeTo: Schema.Types.Date,
  rate: Schema.Types.Number,
  rateDomesticTotal: Schema.Types.Number,
  priority: Schema.Types.Number,
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
});
const FlightRate = mongoose.model('FlightRate', scFlightRate);
// Package Rate
const scPackageRate = new mongoose.Schema({
  package: {type: Schema.Types.ObjectId, ref: 'TravelPackage'},
  name: Schema.Types.String,
  description: Schema.Types.String,
  premiumFee: Schema.Types.Number,
  minParticipant: Schema.Types.Number,
  maxParticipant: Schema.Types.Number,
  rate: Schema.Types.Number,
  rangeFrom: Schema.Types.Date,
  rangeTo: Schema.Types.Date,
  priority: Schema.Types.Number,
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
});
const PackageRate = mongoose.model('PackageRate', scPackageRate);
// Instance - Travel Package
const scInstPackage = new mongoose.Schema({
  package: {type: Schema.Types.ObjectId, ref: 'TravelPackage'},
  status: Schema.Types.String,
  startDate: Schema.Types.Date,
  endDate: Schema.Types.Date,
  carOption: Schema.Types.String,
  isCustomised: Schema.Types.Boolean,
  isCustomisable: Schema.Types.Boolean,
  totalDays: Schema.Types.Number,
  totalPeople: Schema.Types.Number,
  totalRooms: Schema.Types.Number,
  rate: Schema.Types.Number,
  items: [],
  hotels: [],
  members: [],
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
  createdAt: Schema.Types.Date,
  createdBy: Schema.Types.String,
  updatedAt: Schema.Types.Date,
  updatedBy: Schema.Types.String,
});
const InstPackage = mongoose.model('InstPackage', scInstPackage);
// Instance - Package Item
const scInstPackageItem = new mongoose.Schema({
  instPackage: {type: Schema.Types.ObjectId, ref: 'InstPackage'},
  dayNo: Schema.Types.Number,
  daySeq: Schema.Types.Number,
  description: Schema.Types.String,
  timePlannable: Schema.Types.Number,
  isMustVisit: Schema.Types.Boolean,
  attraction: {type: Schema.Types.ObjectId, ref: 'Attraction'},
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
  createdAt: Schema.Types.Date,
  createdBy: Schema.Types.String,
  updatedAt: Schema.Types.Date,
  updatedBy: Schema.Types.String,
});
const InstPackageItem = mongoose.model('InstPackageItem', scInstPackageItem);
// Instance - Package Hotel
const scInstPackageHotel = new mongoose.Schema({
  instPackage: {type: Schema.Types.ObjectId, ref: 'InstPackage'},
  dayNo: Schema.Types.Number,
  isOvernight: Schema.Types.Boolean,
  hotel: {type: Schema.Types.ObjectId, ref: 'Hotel'},
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
  createdAt: Schema.Types.Date,
  createdBy: Schema.Types.String,
  updatedAt: Schema.Types.Date,
  updatedBy: Schema.Types.String,
});
const InstPackageHotel = mongoose.model('InstPackageHotel', scInstPackageHotel);
// Instance - Package Member
const scInstPackageMember = new mongoose.Schema({
  instPackage: {type: Schema.Types.ObjectId, ref: 'InstPackage'},
  memberId: {type: Schema.Types.ObjectId, ref: 'Member'},
  loginId: Schema.Types.String,
  name: Schema.Types.String,
  isOwner: Schema.Types.Boolean,
  status: Schema.Types.String,
  people: Schema.Types.Number,
  rooms: Schema.Types.Number,
  notes: Schema.Types.String,
  additionalField: Schema.Types.String,
  createdAt: Schema.Types.Date,
  createdBy: Schema.Types.String,
  updatedAt: Schema.Types.Date,
  updatedBy: Schema.Types.String,
});
const InstPackageMember = mongoose.model(
  'InstPackageMember',
  scInstPackageMember
);
/* =========== Functions ============ */
// Member
const getUserByLoginId = (loginId, callback) => {
  console.log('>>>>Model.getUserByLoginId', loginId);
  return Member.findOne({loginId, isActive: true}).exec(callback);
};
const createUser = (user, callback) => {
  const member = new Member(user);
  member.save(callback);
};
// Travel Package
const selectPackage =
  '_id departureDate description name effectiveTo effectiveFrom ' +
  'highlight finePrint titleImage.secure_url image.secure_url ' +
  'isExtention isCustomisable isPromoted totalDays carOption ' +
  'additionalField, carouselImages.secure_url';
const getAllPackages = (callback) => {
  console.log('>>>>Model.getAllPackages');
  return TravelPackage.find()
    .select(selectPackage)
    .exec((err, docs) => {
      callback(err, ObjectParser.parseTravelPackage(docs));
    });
};
const getFilteredPackages = (filter, callback) => {
  console.log('>>>>Model.getFilteredPackages', filter);
  return TravelPackage.find(filter)
    .select(selectPackage)
    .exec((err, docs) => {
      callback(err, ObjectParser.parseTravelPackage(docs));
    });
};
const getPackageById = (id, callback) => {
  console.log('>>>>Model.getPackageById', id);
  return TravelPackage.findById(id)
    .select(selectPackage)
    .exec((err, docs) => {
      callback(err, ObjectParser.parseTravelPackage(docs));
    });
};
// Package Item
const getItemsByPackageId = (packageId, callback) => {
  console.log('>>>>Model.getItemsByPackageId', packageId);
  const params = {package: packageId};
  PackageItem.find(params)
    .sort({dayNo: 'asc', daySeq: 'asc'})
    .populate({
      path: 'attraction',
      model: 'Attraction',
    })
    .exec((err, docs) => {
      callback(err, ObjectParser.parsePackageItem(docs));
    });
};
// Package Hotel
const getHotelsByPackageId = (packageId, callback) => {
  console.log('>>>>Model.getHotelsByPackageId', packageId);
  const params = {package: new mongoose.Types.ObjectId(packageId)};
  PackageHotel.find(params)
    .sort({dayNo: 'asc'})
    .populate({
      path: 'hotel',
      model: 'Hotel',
    })
    .exec((err, docs) => {
      callback(err, ObjectParser.parsePackageHotel(docs));
    });
};
// Hotel
const getHotelsByIds = (ids, callback) => {
  const input = _.filter(ids, (id) => {
    return !!id;
  });
  // console.log('>>>>Model >> Hotel.getHotelsByIds', input);
  return Hotel.find({_id: {$in: input}}).exec((err, docs) => {
    callback(err, ObjectParser.parseHotel(docs));
  });
};
// Flight Rate
const getFlightRatesByPackageId = (packageId, callback) => {
  console.log('>>>>Model.getFlightRatesByPackageId', packageId);
  const params = {package: new mongoose.Types.ObjectId(packageId)};
  return FlightRate.find(params)
    .sort({priority: 'desc'})
    .exec(callback);
};
// Package Rate
const getPackageRatesByPackageId = (packageId, callback) => {
  console.log('>>>>Model.getPackageRatesByPackageId', packageId);
  const params = {package: new mongoose.Types.ObjectId(packageId)};
  return PackageRate.find(params)
    .sort({priority: 'desc'})
    .exec(callback);
};
// Package City
const getCitiesByPackageId = (packageId, callback) => {
  console.log('>>>>Model.getCitiesByPackageId', packageId);
  getItemsByPackageId(packageId, (err, docs) => {
    const tmpCities = _.map(docs, (item) => {
      return item.cityId;
    });
    const allCities = _.filter(tmpCities, (city) => {
      return !!city;
    });
    City.find({_id: {$in: allCities}})
      .populate([
        {path: 'attractions', model: 'Attraction'},
        {path: 'carRates', model: 'CarRate'},
        {path: 'hotels', model: 'Hotel'},
      ])
      .exec((err, docs) => {
        callback(err, ObjectParser.parseCity(docs));
      });
  });
};
// Inst Package Items
const getInstanceItemsByInstId = (instId, callback) => {
  console.log('>>>>Model.getInstanceItemsByInstId', instId);
  const params = {instPackage: new mongoose.Types.ObjectId(instId)};
  return InstPackageItem.find(params)
    .sort({dayNo: 'asc', daySeq: 'asc'})
    .exec(callback);
};
const createInstanceItems = (items, callback) => {
  console.log('>>>>Model.createInstanceItems', items);
  return InstPackageItem.insertMany(items, callback);
};
const updateInstanceItems = (params, callback) => {
  InstPackageItem.update(params.query, params.update, callback);
};
const deleteAllInstanceItems = () => {
  return InstPackageItem.remove({}, () => {
    console.log('>>>>Function [deleteAllInstanceItems] executed');
  });
};
// Inst Package Hotels
const getInstanceHotelsByInstId = (instId, callback) => {
  console.log('>>>>Model.getInstanceHotelsByInstId', instId);
  const params = {instPackage: new mongoose.Types.ObjectId(instId)};
  return InstPackageHotel.find(params)
    .sort({dayNo: 'asc', daySeq: 'asc'})
    .exec(callback);
};
const createInstanceHotels = (hotels, callback) => {
  console.log('>>>>Model.createInstanceHotels', hotels);
  return InstPackageHotel.insertMany(hotels, callback);
};
const updateInstanceHotels = (params, callback) => {
  InstPackageHotel.update(params.query, params.update, callback);
};
const deleteAllInstanceHotels = () => {
  return InstPackageHotel.remove({}, () => {
    console.log('>>>>Function [deleteAllInstanceHotels] executed');
  });
};
// Inst Package Members
const getInstanceMembersByParams = (params, callback) => {
  console.log('>>>>Model.getInstanceMembersById', params);
  return InstPackageMember.find(params).exec(callback);
};
const getInstanceMembersByInstId = (instId, callback) => {
  console.log('>>>>Model.getInstanceMembersByInstId', instId);
  const params = {instPackage: new mongoose.Types.ObjectId(instId)};
  return InstPackageMember.find(params).exec(callback);
};
const createInstanceMembers = (members, callback) => {
  console.log('>>>>Model.createInstanceMembers', members);
  return InstPackageMember.insertMany(members, callback);
};
const updateInstanceMembers = (params, callback) => {
  InstPackageMember.update(params.query, params.update, callback);
};
const deleteInstanceByParams = (params, callback) => {
  console.log('>>>>Model.deleteInstanceByParams', params);
  return InstPackageMember.deleteMany(params, callback);
};
const deleteAllInstanceMembers = () => {
  return InstPackageMember.remove({}, () => {
    console.log('>>>>Function [deleteAllInstanceMembers] executed');
  });
};
// Inst Package
const getLatestInstByUserId = (userId, callback) => {
  const listStatus = [
    InstanceStatus.IN_PROGRESS,
    InstanceStatus.SELECT_ATTRACTION,
    InstanceStatus.SELECT_HOTEL,
    InstanceStatus.REVIEW_ITINERARY,
    InstanceStatus.PENDING_PAYMENT,
    InstanceStatus.DEPOSIT_PAID,
  ];
  const params = {createdBy: userId, status: {$in: listStatus}};
  const select = '_id';
  const options = {sort: {createdAt: -1}};
  InstPackage.findOne(params, select, options).exec((err, docs) => {
    callback(err, docs);
  });
};
const getInstanceByInstId = (instId, callback) => {
  InstPackage.findById(instId)
    .populate({
      path: 'package',
      model: 'TravelPackage',
    })
    .exec(callback);
};
const createInstance = (inst, callback) => {
  const instPackage = new InstPackage(inst);
  instPackage.save(callback);
};
const updateInstance = (params, callback) => {
  InstPackage.updateOne(params.query, params.update, callback);
};
const createInstanceByPackageId = (request, handler) => {
  console.log('>>>>Modal.createInstanceByPackageId', request);
  const {packageId, user, isCustomised, carOption, totalDays} = request;
  const now = new Date();
  const createdBy = user ? user.loginId : Global.sysUser;
  const instance = {
    status: InstanceStatus.INITIATED,
    package: packageId,
    isCustomised: isCustomised,
    carOption: carOption,
    rate: 0,
    totalPeople: 0,
    totalRooms: 0,
    totalDays: totalDays,
    createdBy: createdBy,
    createdAt: now,
  };
  const handleInstance = (err, inst) => {
    if (err) return console.log(err);
    console.log('>>>>Instance Created', inst);

    return async.parallel(
      {
        instance: (callback) => {
          callback(err, inst);
        },
        items: (callback) => {
          getItemsByPackageId(packageId, (err, items) => {
            console.log(`>>>>Model.getItemsByPackageId [${packageId}]`, items);
            const iItems = _.map(items, (item) => {
              const iItem = {
                instPackage: inst.id,
                dayNo: item.dayNo,
                daySeq: item.daySeq,
                description: item.description,
                timePlannable: item.timePlannable,
                isMustVisit: item.isMustVisit,
                createdBy: createdBy,
                createdAt: now,
              };
              if (item.attraction) {
                iItem.attraction = item.attraction.id;
              }
              return iItem;
            });
            return createInstanceItems(iItems, function(err, docs) {
              console.log('>>>>Model.createInstanceItems', docs);
              return callback(null, docs);
            });
          });
        },
        hotels: (callback) => {
          getHotelsByPackageId(packageId, (err, hotels) => {
            console.log(
              `>>>>Model.getHotelsByPackageId [${packageId}]`,
              hotels
            );
            const iHotels = _.map(hotels, (hotel) => {
              const iHotel = {
                instPackage: inst.id,
                dayNo: hotel.dayNo,
                isOvernight: hotel.isOvernight,
                createdBy: createdBy,
                createdAt: now,
              };
              if (hotel.hotel) {
                iHotel.hotel = hotel.hotel.id;
              }
              return iHotel;
            });
            return createInstanceHotels(iHotels, function(err, docs) {
              console.log('>>>>Model.createInstanceHotels', docs);
              return callback(null, docs);
            });
          });
        },
        members: (callback) => {
          if (user) {
            const instanceMember = [
              {
                instPackage: inst.id,
                loginId: createdBy,
                name: user.name,
                createdBy: createdBy,
                createdAt: now,
                people: Global.defaultPeople,
                rooms: Global.defaultRooms,
                isOwner: true,
                status: InstanceStatus.INITIATED,
              },
            ];
            const instanceMembers = [instanceMember];

            return createInstanceMembers(instanceMembers, function(err, docs) {
              console.log('>>>>Model.createInstanceMembers', docs);
              return callback(null, docs);
            });
          }
          return callback(null, []);
        },
      },
      function(err, results) {
        console.log('>>>>Instance Saved', {err, results});
        handler({err, results});
      }
    );
  };
  createInstance(instance, handleInstance);
};
const updateInstanceStatus = (params, callback) => {
  const filter = {_id: params.id};
  const doc = {
    status: params.status,
    updatedBy: params.user,
    updatedAt: new Date(),
  };
  return InstPackage.updateOne(filter, doc, callback);
};
const archiveInstanceByUserId = (params, callback) => {
  console.log('>>>>Model.archiveInstanceByUserId params', params);
  const filter = {createdBy: params.userId, status: InstanceStatus.INITIATED};
  InstPackage.find(filter)
    .select('_id')
    .exec((err, docs) => {
      if (err) {
        console.log('>>>>Model.archiveInstanceByUserId query error', err);
        return callback(err, null);
      }
      const query = {
        _id: {
          $in: _.map(docs, (d) => {
            return d._id;
          }),
        },
      };
      const doc = {
        status: InstanceStatus.ARCHIVED,
        updatedBy: params.userId,
        updatedAt: new Date(),
      };
      console.log('>>>>Model.archiveInstanceByUserId', {docs, query, doc});
      return InstPackage.updateMany(query, doc, callback);
    });
};
const deleteAllInstances = () => {
  return InstPackage.remove({}, () => {
    console.log('>>>>Function [deleteAllInstances] executed');
  });
};

export default {
  getUserByLoginId,
  getPackageById,
  getAllPackages,
  getFilteredPackages,
  getItemsByPackageId,
  getHotelsByIds,
  getHotelsByPackageId,
  getFlightRatesByPackageId,
  getPackageRatesByPackageId,
  getCitiesByPackageId,
  getLatestInstByUserId,
  getInstanceByInstId,
  getInstanceItemsByInstId,
  getInstanceHotelsByInstId,
  getInstanceMembersByParams,
  getInstanceMembersByInstId,
  createUser,
  createInstanceByPackageId,
  createInstance,
  createInstanceItems,
  createInstanceHotels,
  createInstanceMembers,
  updateInstance,
  updateInstanceStatus,
  updateInstanceMembers,
  updateInstanceItems,
  updateInstanceHotels,
  deleteAllInstances,
  deleteAllInstanceItems,
  deleteAllInstanceHotels,
  deleteAllInstanceMembers,
  deleteInstanceByParams,
  archiveInstanceByUserId,
};
