import _ from 'lodash';
import CONSTANTS from './constants';

const {Global, Instance} = CONSTANTS.get();
const instStatus = Instance.status;

const findCityNameById = (id, cities) => {
  let name = '';
  _.each(cities, (c) => {
    if (c.id === id) name = c.name;
  });
  return name;
};

const findCityByName = (name, cities) => {
  let city = null;
  _.each(cities, (c) => {
    if (c.name === name) city = c;
  });
  return city;
};

const findAttractionById = (id, cities) => {
  let attraction = null;
  _.each(cities, (c) => {
    const matcher = _.find(c.attractions, function(a) {
      return a.id === id;
    });
    if (matcher) {
      attraction = matcher;
      attraction.city = c.name;
    }
  });
  return attraction;
};

const findHotelById = (id, cities) => {
  let hotel = null;
  _.each(cities, (c) => {
    const matcher = _.find(c.hotels, function(h) {
      return h.id === id;
    });
    if (matcher) {
      hotel = matcher;
      hotel.city = c.name;
    }
  });
  return hotel;
};

const findCityByAttraction = (id, cities) => {
  let name = '';
  _.each(cities, (c) => {
    if (
      _.find(c.attractions, function(a) {
        return a.id === id;
      })
    ) {
      name = c.name;
    }
  });
  if (name) {
    return name;
  }
  return null;
};

const findCityByHotel = (id, cities) => {
  let name = '';
  _.each(cities, (c) => {
    if (
      _.find(c.hotels, function(h) {
        return h.id === id;
      })
    ) {
      name = c.name;
    }
  });
  if (name) {
    return name;
  }
  return null;
};

const enhanceItem = (item, cities) => {
  if (item.attraction) {
    const match = findAttractionById(item.attraction, cities);
    item.attraction = match;
  }
  return item;
};

const enhanceHotel = (hotel, cities) => {
  if (hotel.hotel) {
    const match = findHotelById(hotel.hotel, cities);
    hotel.hotel = match;
  }
  return hotel;
};

const getValidCarOptions = (carRates) => {
  const tmp = {};
  const result = [];
  if (carRates && carRates.length > 0) {
    _.each(carRates, (cr) => {
      if (cr.carRates && cr.carRates.length > 0) {
        _.each(cr.carRates, (r) => {
          tmp[r.type] = {count: (tmp[r.type] ? tmp[r.type].count : 0) + 1};
          if (tmp[r.type].count === carRates.length) result.push(r.type);
        });
      }
    });
  }

  return result;
};

export default {
  enhanceItem,
  enhanceHotel,
  getValidCarOptions,
  findCityByHotel,
  findCityNameById,
  findCityByName,
  findAttractionById,
  findHotelById,
  findCityByAttraction,
};
