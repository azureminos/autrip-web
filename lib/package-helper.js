import _ from 'lodash';
import Rate from './rate-calculator';
import CONSTANTS from './constants';

const {Instance, Global} = CONSTANTS.get();
const InstanceStatus = Instance.status;
const {maxRoomCapacity, standardRoomCapacity} = Global;

// ======== Local Helpers ========
const getCityDetails = ({isCustomised, city, items, hotel, cities}) => {
  let cityDesc = '';
  let cityDescShort = '';
  let timePlannable = 0;
  let attractions = [];
  let hotels = [];
  const isRequired = !!_.find(items, (i) => {
    return i.isMustVisit;
  });
  for (let i = 0; i < cities.length; i++) {
    if (cities[i].name === city) {
      // Check Liked Attractions
      if (items && items[0] && items[0].timePlannable > 0) {
        timePlannable = items[0].timePlannable;
        cityDesc = isCustomised ? cities[i].description : items[0].description;
        attractions = _.map(cities[i].attractions, (a) => {
          const isLiked =
            _.findIndex(items, (pi) => {
              return pi.attraction && pi.attraction.id === a.id;
            }) !== -1;
          const isRequired =
            _.findIndex(items, (pi) => {
              return (
                pi.isMustVisit && pi.attraction && pi.attraction.id === a.id
              );
            }) !== -1;
          return {...a, isLiked: isLiked, isRequired: isRequired};
        });
        attractions = _.sortBy(attractions, [
          (o) => {
            return !o.isLiked;
          },
        ]);
      } else {
        cityDesc =
          items && items[0] && items[0].description
            ? items[0].description
            : cityDesc;
      }
      // Check Liked Hotel
      if (hotel && hotel.isOvernight) {
        hotels = _.map(cities[i].hotels, (h) => {
          const isLiked = hotel.hotel && hotel.hotel.id === h.id;
          return {...h, isLiked: isLiked};
        });
        hotels = _.sortBy(hotels, [
          (o) => {
            return !o.isLiked;
          },
        ]);
      }
      // Set City Short Description
      cityDescShort =
        cityDesc.length > 80 ? `${cityDesc.substring(0, 80)}...` : cityDesc;
      break;
    }
  }
  return {
    cityDesc,
    cityDescShort,
    attractions,
    hotels,
    isRequired,
    timePlannable,
  };
};

const getCityBase = ({dayItems, dayHotel}) => {
  let cityBase = '';
  if (dayHotel.isOvernight && dayHotel.hotel) {
    cityBase = dayHotel.hotel.city || '';
  } else if (dayItems && dayItems.length > 0) {
    for (let n = 0; n < dayItems.length; n++) {
      const dayItem = dayItems[n];
      if (dayItem && dayItem.attraction) {
        cityBase = dayItem.attraction.city || '';
      }
    }
  }

  return cityBase;
};

const getCityVisit = (dayItems) => {
  let cityVisit = '';
  if (dayItems && dayItems.length > 0) {
    const cities = _.groupBy(dayItems, (dayItem) => {
      return dayItem.attraction ? dayItem.attraction.city : '';
    });
    _.each(_.keys(cities), (city) => {
      if (city) {
        cityVisit = `${cityVisit}, ${city}`;
      }
    });
    cityVisit = cityVisit.length > 2 ? cityVisit.substring(2) : cityVisit;
  }
  return cityVisit;
};

// ======== Exported Helpers ========
const getFullItinerary = ({
  isCustomised,
  packageItems,
  packageHotels,
  cities,
}) => {
  const daysItems = _.groupBy(packageItems, (it) => {
    return it.dayNo;
  });
  const daysHotels = _.groupBy(packageHotels, (it) => {
    return it.dayNo;
  });

  let prevCity = '';
  const itineraries = [];
  for (let i = 1; daysItems[i] && daysHotels[i]; i++) {
    const hasNext = !!daysItems[i + 1] && !!daysHotels[i + 1];
    const dayItems = daysItems[i] ? daysItems[i] : [];
    const dayHotel = daysHotels[i][0] ? daysHotels[i][0] : {};
    const cityBase = getCityBase({dayItems, dayHotel}) || prevCity;
    const cityVisit = getCityVisit(dayItems) || cityBase;
    const cityDetails = getCityDetails({
      isCustomised,
      city: cityBase,
      items: dayItems,
      hotel: dayHotel,
      cities,
    });
    prevCity = cityBase;

    itineraries.push({
      dayNo: i,
      cityBase: cityBase,
      cityVisit: cityVisit,
      cityDesc: cityDetails.cityDesc,
      cityDescShort: cityDetails.cityDescShort,
      attractions: cityDetails.attractions,
      hotels: cityDetails.hotels,
      isRequired: cityDetails.isRequired,
      isClonable: i !== 1 && hasNext,
      timePlannable: cityDetails.timePlannable,
    });
  }

  return itineraries;
};

const deleteItinerary = (instPackage, dayNo) => {
  // Reorg items
  const items = [];
  for (let m = 0; m < instPackage.items.length; m++) {
    const item = instPackage.items[m];
    if (item.dayNo < dayNo) {
      items.push(item);
    } else if (item.dayNo > dayNo) {
      item.dayNo--;
      items.push(item);
    }
  }
  // Reorg hotels
  const hotels = [];
  for (let n = 0; n < instPackage.hotels.length; n++) {
    const hotel = instPackage.hotels[n];
    if (hotel.dayNo < dayNo) {
      hotels.push(hotel);
    } else if (hotel.dayNo > dayNo) {
      hotel.dayNo--;
      hotels.push(hotel);
    }
  }
  instPackage.totalDays = hotels.length;
  instPackage.items = items;
  instPackage.hotels = hotels;
  if (instPackage.startDate) {
    instPackage.endDate = new Date(instPackage.startDate);
    instPackage.endDate.setDate(
      instPackage.endDate.getDate() + instPackage.totalDays
    );
  }

  return instPackage;
};

const addItinerary = (instPackage, dayNo) => {
  // Reorg items
  let items = [];
  for (let m = 0; m < instPackage.items.length; m++) {
    const item = instPackage.items[m];
    if (item.dayNo < dayNo) {
      items.push(item);
    } else if (item.dayNo === dayNo) {
      items.push(item);
      const copy = {...item};
      copy.id = -1;
      copy.dayNo++;
      copy.isMustVisit = false;
      items.push(copy);
    } else if (item.dayNo > dayNo) {
      item.dayNo++;
      items.push(item);
    }
  }
  items = _.sortBy(items, (i) => {
    return i.dayNo;
  });
  // Reorg hotels
  const hotels = [];
  for (let n = 0; n < instPackage.hotels.length; n++) {
    const hotel = instPackage.hotels[n];
    if (hotel.dayNo < dayNo) {
      hotels.push(hotel);
    } else if (hotel.dayNo === dayNo) {
      hotels.push(hotel);
      const copy = {...hotel};
      copy.id = -1;
      copy.dayNo++;
      hotels.push(copy);
    } else if (hotel.dayNo > dayNo) {
      hotel.dayNo++;
      hotels.push(hotel);
    }
  }

  instPackage.totalDays = hotels.length;
  instPackage.items = items;
  instPackage.hotels = hotels;
  if (instPackage.startDate) {
    instPackage.endDate = new Date(instPackage.startDate);
    instPackage.endDate.setDate(
      instPackage.endDate.getDate() + instPackage.totalDays
    );
  }

  return instPackage;
};

const doRating = ({instPackage, instPackageExt, rates}) => {
  // Business object
  const rateDetails = {
    curGap: 999,
    curRate: 9999,
    nxtGap: 999,
    nxtRate: 9999,
  };
  // Local variables
  const {packageRates, carRates, flightRates} = rates;
  const {isCustomised, hotels, items, startDate, carOption} = instPackage;
  const {min, max, people, otherPeople, rooms, otherRooms} = instPackageExt;
  // Setup params for calculate current rate
  const params = {
    startDate: startDate,
  };
  if (otherPeople + people > min) {
    params.totalPeople = otherPeople + people;
    params.totalRooms = otherRooms + rooms;
  } else {
    params.totalPeople = min;
    params.totalRooms =
      Math.ceil(params.totalPeople / standardRoomCapacity) || 1;
  }

  let rateCurrent = null;
  let rateNext = null;
  // Business logic (TODO: Add rooms)
  const rateFlight = Rate.calFlightRate(startDate, flightRates);
  if (rateFlight) {
    console.log('>>>>Rate.calFlightRate', rateFlight);
    if (!isCustomised) {
      /* ==== Regular tour group ====
       * - packageRates: totalPeople
       * - flightRates: startDate, endDate
       * ============================ */
      rateCurrent = Rate.calPackageRate(params, packageRates);
      if (rateCurrent) {
        // Setup params for calculate next rate
        if (rateCurrent.maxParticipant && max > rateCurrent.maxParticipant) {
          params.totalPeople = rateCurrent.maxParticipant + 1;
          params.totalRooms =
            Math.ceil(params.totalPeople / standardRoomCapacity) || 1;
          rateNext = Rate.calPackageRate(params, packageRates);
        }
        // Finalize rate calculation
        rateDetails.curRate =
          rateCurrent.price + rateFlight.rate + rateFlight.rateDomesticTotal;
        rateDetails.nxtRate = rateNext
          ? rateNext.price + rateFlight.rate + rateFlight.rateDomesticTotal
          : 0;
        // Finalize people calculation
        if (otherPeople + people > min) {
          rateDetails.curGap = 0;
          rateDetails.nxtGap = rateNext
            ? rateCurrent.maxParticipant + 1 - (people + otherPeople)
            : 0;
        } else {
          rateDetails.curGap =
            rateCurrent.minParticipant - (people + otherPeople);
          rateDetails.nxtGap = rateNext
            ? rateCurrent.maxParticipant + 1 - (people + otherPeople)
            : 0;
        }
      }
    } else {
      /* ==== DIY tour group ====
       * - packageRates: people, [startDate]
       * - flightRates: [startDate], [type]
       * - carRates: people, [startDate], [type]
       * - packageItems: all package items
       * - packageHotels: rooms
       * ============================ */
      rateCurrent = Rate.calPackageRate(params, packageRates);
      console.log('>>>>Rate.calPackageRate', rateCurrent);
      if (rateCurrent) {
        const rateCarCurrent = Rate.calCarRate(
          {...params, carOption, hotels, items},
          carRates
        );
        console.log('>>>>Rate.calCarRate', rateCarCurrent);
        if (rateCarCurrent) {
          const rateItemCurrent = Rate.calItemRate({startDate}, items);
          const rateHotelCurrent = Rate.calHotelRate(params, hotels);
          let rateCarNext;
          if (rateCurrent.maxParticipant && max > rateCurrent.maxParticipant) {
            params.totalPeople = rateCurrent.maxParticipant + 1;
            rateNext = Rate.calPackageRate(params, packageRates);
            rateCarNext = Rate.calCarRate(
              {...params, carOption, hotels, items},
              carRates
            );
          } else {
            rateNext = null;
            rateCarNext = null;
          }
          // Finalize rate calculation
          rateDetails.curRate =
            rateCurrent.premiumFee +
            rateFlight.rate +
            rateFlight.rateDomesticTotal +
            rateCarCurrent +
            rateItemCurrent +
            rateHotelCurrent;
          rateDetails.nxtRate =
            rateNext && rateCarNext
              ? rateNext.premiumFee +
                rateFlight.rate +
                rateFlight.rateDomesticTotal +
                rateCarNext +
                rateItemCurrent +
                rateHotelCurrent
              : 99999;
          // Finalize people calculation
          if (otherPeople + people > min) {
            rateDetails.curGap = 0;
            rateDetails.nxtGap = rateNext
              ? rateCurrent.maxParticipant + 1 - (people + otherPeople)
              : 0;
          } else {
            rateDetails.curGap =
              rateCurrent.minParticipant - (people + otherPeople);
            rateDetails.nxtGap = rateNext
              ? rateCurrent.maxParticipant + 1 - (people + otherPeople)
              : 0;
          }
        }
      }
    }
  }

  return rateDetails;
};

const enhanceInstance = ({userId, instPackage, rates}) => {
  console.log('>>>>PackageHelper.enhanceInstance', {instPackage, userId});
  const isCustomised = instPackage.isCustomised || false;
  const member =
    _.find(instPackage.members, (m) => {
      return m.loginId === userId;
    }) || {};
  const isOwner = !!member.isOwner;
  const defaultPeople = isOwner ? Global.defaultPeople : 0;
  const defaultRooms = isOwner ? Global.defaultRooms : 0;
  const extras = {
    statusMember: member.status,
    isOwner: isOwner,
    min: 999,
    max: 0,
    people: member.people ? member.people : defaultPeople,
    rooms: member.rooms ? member.rooms : defaultRooms,
    otherRooms: 0,
    otherPeople: 0,
  };
  // Set min & max
  _.each(rates.packageRates, (pr) => {
    if (pr.maxParticipant >= extras.max) {
      extras.max = pr.maxParticipant;
    }
    if (pr.minParticipant <= extras.min) {
      extras.min = pr.minParticipant;
    }
  });
  // Get people & rooms
  for (let i = 0; i < instPackage.members.length; i++) {
    const m = instPackage.members[i];
    if (m.loginId !== userId) {
      extras.otherRooms += m.rooms;
      extras.otherPeople += m.people;
    }
  }
  // Calculate step
  if (!isCustomised) {
    if (
      instPackage.status === Instance.status.INITIATED ||
      instPackage.status === Instance.status.IN_PROGRESS
    ) {
      extras.step = 0;
    } else if (instPackage.status === Instance.status.PENDING_PAYMENT) {
      extras.step = 1;
    }
  } else if (member.isOwner) {
    // Owner of the package
    if (
      instPackage.status === Instance.status.INITIATED ||
      instPackage.status === Instance.status.SELECT_ATTRACTION
    ) {
      extras.step = 0;
    } else if (instPackage.status === Instance.status.SELECT_HOTEL) {
      extras.step = 1;
    } else if (instPackage.status === Instance.status.REVIEW_ITINERARY) {
      extras.step = 2;
    } else if (instPackage.status === Instance.status.PENDING_PAYMENT) {
      extras.step = 3;
    }
  } else {
    // visitor of the package
    if (
      instPackage.status === Instance.status.INITIATED ||
      instPackage.status === Instance.status.SELECT_ATTRACTION ||
      instPackage.status === Instance.status.SELECT_HOTEL ||
      instPackage.status === Instance.status.REVIEW_ITINERARY
    ) {
      extras.step = 0;
    } else if (instPackage.status === Instance.status.PENDING_PAYMENT) {
      extras.step = 1;
    }
  }
  return extras;
};

const validateInstance = (instPackage) => {
  console.log('>>>>PackageHelper.validateInstance', instPackage);
  return true;
};

const getPreviousStatus = (isCustomised, status) => {
  console.log('>>>>PackageHelper.getPreviousStatus', {isCustomised, status});
  if (isCustomised) {
    if (status === Instance.status.SELECT_HOTEL) {
      return Instance.status.SELECT_ATTRACTION;
    } else if (status === Instance.status.REVIEW_ITINERARY) {
      return Instance.status.SELECT_HOTEL;
    }
  }
  return status;
};

const getNextStatus = (isCustomised, status) => {
  console.log('>>>>PackageHelper.getNextStatus', {isCustomised, status});
  if (isCustomised) {
    if (
      status === Instance.status.SELECT_ATTRACTION ||
      status === Instance.status.INITIATED
    ) {
      return Instance.status.SELECT_HOTEL;
    } else if (status === Instance.status.SELECT_HOTEL) {
      return Instance.status.REVIEW_ITINERARY;
    }
  }
  return status;
};

const getCityImage = (itinerary, cities) => {
  console.log('>>>>PackageHelper.getNextStatus', {itinerary, cities});
  if (itinerary.attractions) {
    const liked = _.filter(itinerary.attractions, (a) => {
      return !!a.isLiked;
    });
    if (liked && liked.length > 0) {
      return liked[0].imageUrl;
    } else if (itinerary.attractions && itinerary.attractions.length > 0) {
      return itinerary.attractions[0].imageUrl;
    }
  }
  const city = _.find(cities, function(c) {
    return c.name === itinerary.cityBase;
  });
  return city && city.attractions && city.attractions.length > 0
    ? city.attractions[0].imageUrl
    : '';
};

const dummyInstance = ({
  packageSummary,
  packageItems,
  packageHotels,
  userId,
}) => {
  const getUniqueId = () => {
    /* return Math.random()
      .toString(36)
      .substr(2, 9);*/
    return -1;
  };
  // Dummy package instance
  const rs = {
    id: getUniqueId(),
    packageId: packageSummary.id,
    status: InstanceStatus.INITIATED,
    startDate: null,
    endDate: null,
    isCustomisable: !!packageSummary.isCustomisable,
    isCustomised: false,
    totalDays: packageSummary.totalDays,
    totalPeople: 0,
    totalRooms: 0,
    carOption: packageSummary.carOption,
    rate: 0,
    items: [],
    hotels: [],
    members: [],
  };
  // Dummy package instance items
  _.each(packageItems, (item) => {
    const it = {
      id: getUniqueId(),
      dayNo: item.dayNo,
      daySeq: item.daySeq,
      description: item.description,
      timePlannable:
        item.timePlannable || (item.attraction ? Global.timePlannable : 0),
      isMustVisit: item.isMustVisit || false,
      attraction: item.attraction ? item.attraction.id : null,
    };
    rs.items.push(it);
  });
  // Dummy package instance hotels
  _.each(packageHotels, (item) => {
    const ho = {
      id: getUniqueId(),
      dayNo: item.dayNo,
      isOvernight: item.isOvernight || !!item.hotel,
      hotel: item.hotel ? item.hotel.id : null,
    };
    rs.hotels.push(ho);
  });
  // Dummy package instance members
  const us = {
    id: userId,
    loginId: '',
    isOwner: true,
    status: InstanceStatus.INITIATED,
    people: 2,
    rooms: 1,
  };
  rs.members.push(us);
  // Return final dummy
  return rs;
};

export default {
  getNextStatus,
  getPreviousStatus,
  validateInstance,
  enhanceInstance,
  doRating,
  addItinerary,
  deleteItinerary,
  getFullItinerary,
  dummyInstance,
  getCityImage,
};
