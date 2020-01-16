import _ from 'lodash';

const parseTravelPackage = function(input) {
  const parseObj = (item) => {
    const r = _.pick(
      item,
      'slug',
      'name',
      'description',
      'finePrint',
      'notes',
      'departureDate',
      'effectiveTo',
      'effectiveFrom',
      'isSnapshot',
      'isExtention',
      'isCustomisable',
      'isPromoted',
      'type',
      'carOption',
      'maxParticipant',
      'totalDays',
      'additionalField',
      'createdAt',
      'updatedAt'
    );
    r.id = item._id;
    r.imageUrl = item.image ? item.image.secure_url : '';
    r.titleImageUrl = item.titleImage ? item.titleImage.secure_url : '';
    r.carouselImageUrls = item.carouselImages
      ? _.map(item.carouselImages, (image) => {
        return image.secure_url || '';
      })
      : [];
    return r;
  };

  if (Array.isArray(input)) {
    const rs = [];
    _.each(input, function(item) {
      rs.push(parseObj(item));
    });
    return rs;
  }
  return parseObj(input);
};

const parsePackageItem = function(input) {
  const parseObj = (item) => {
    const r = _.pick(
      item,
      'additionalField',
      'dayNo',
      'daySeq',
      'name',
      'description',
      'notes',
      'timePlannable',
      'isMustVisit'
    );
    r.id = item._id;
    if (item.attraction && !(item.attraction instanceof String)) {
      r.cityId = item.attraction.city;
      r.attraction = {
        id: item.attraction._id,
        name: item.attraction.name,
        timeTraffic: item.attraction.timeTraffic,
        timeVisit: item.attraction.timeVisit,
        imageUrl: item.attraction.image ? item.attraction.image.secure_url : '',
      };
    }
    return r;
  };

  if (Array.isArray(input)) {
    const rs = [];
    _.each(input, function(item) {
      rs.push(parseObj(item));
    });
    return rs;
  }
  return parseObj(input);
};

const parsePackageHotel = function(input) {
  const parseObj = (item) => {
    const r = _.pick(
      item,
      'additionalField',
      'dayNo',
      'name',
      'description',
      'isOvernight',
      'notes'
    );
    r.id = item._id;
    if (item.hotel && !(item.hotel instanceof String)) {
      r.cityId = item.hotel.city;
      r.hotel = {
        id: item.hotel._id,
        name: item.hotel.name,
        type: item.hotel.type,
        stars: item.hotel.stars,
      };
      r.hotel.imageUrl = item.hotel.image ? item.hotel.image.secure_url : '';
      r.hotel.carouselImageUrls = item.hotel.carouselImages
        ? _.map(item.hotel.carouselImages, (image) => {
          return image.secure_url || '';
        })
        : [];
    }
    return r;
  };

  if (Array.isArray(input)) {
    const rs = [];
    _.each(input, function(item) {
      rs.push(parseObj(item));
    });
    return rs;
  }
  return parseObj(input);
};

const parseCarRate = function(input) {
  if (Array.isArray(input)) {
    const rs = [];
    _.each(input, function(item) {
      const r = _.pick(
        item,
        'type',
        'priority',
        'cost',
        'rate',
        'rangeFrom',
        'rangeTo',
        'minParticipant',
        'maxParticipant'
      );
      r.id = item._id;
      rs.push(r);
    });
    return rs;
  }
  const r = _.pick(
    input,
    'type',
    'priority',
    'cost',
    'rate',
    'rangeFrom',
    'rangeTo',
    'minParticipant',
    'maxParticipant'
  );
  r.id = input._id;
  return r;
};

const parseAttraction = function(input) {
  const parseObj = (item) => {
    const r = _.pick(
      item,
      'name',
      'description',
      'alias',
      'tag',
      'additionalField',
      'timeVisit',
      'timeTraffic',
      'rate',
      'cost',
      'nearByAttractions'
    );
    r.id = item._id;
    r.imageUrl = item.image ? item.image.secure_url : '';
    return r;
  };

  if (Array.isArray(input)) {
    const rs = [];
    _.each(input, function(item) {
      rs.push(parseObj(item));
    });
    return rs;
  }
  return parseObj(input);
};

const parseHotel = function(input) {
  const parseObj = (item) => {
    const r = _.pick(
      item,
      'name',
      'description',
      'stars',
      'type',
      'defaultRate',
      'timeTraffic',
      'nearByAttractions'
    );
    r.id = item._id;
    r.imageUrl = item.image ? item.image.secure_url : '';
    r.carouselImageUrls = item.carouselImages
      ? _.map(item.carouselImages, (image) => {
        return image.secure_url || '';
      })
      : [];
    return r;
  };

  if (Array.isArray(input)) {
    const rs = [];
    _.each(input, function(item) {
      rs.push(parseObj(item));
    });
    return rs;
  }
  return parseObj(input);
};

const parseCity = function(input, child) {
  const parseObj = (item) => {
    const output = _.pick(item, 'name', 'description');
    output.id = item._id;

    if (item.hotels && item.hotels.length > 0) {
      output.hotels = _.map(item.hotels, (h) => {
        const r = _.pick(
          h,
          'name',
          'description',
          'stars',
          'type',
          'defaultRate',
          'timeTraffic',
          'nearByAttractions'
        );
        r.id = h._id;
        r.imageUrl = h.image ? h.image.secure_url : '';
        r.carouselImageUrls = h.carouselImages
          ? _.map(h.carouselImages, (image) => {
            return image.secure_url || '';
          })
          : [];
        return r;
      });
    }
    if (item.attractions && item.attractions.length > 0) {
      output.attractions = _.map(item.attractions, (a) => {
        const r = _.pick(
          a,
          'name',
          'description',
          'cost',
          'rate',
          'timeTraffic',
          'timeVisit',
          'nearByAttractions'
        );
        r.id = a._id;
        r.imageUrl = a.image ? a.image.secure_url : '';
        return r;
      });
    }
    if (item.carRates && item.carRates.length > 0) {
      output.carRates = _.map(item.carRates, (c) => {
        const r = _.pick(
          c,
          'type',
          'minParticipant',
          'maxParticipant',
          'rangeFrom',
          'rangeTo',
          'rate',
          'rateLocalGuide',
          'rateAirport',
          'rateExtra',
          'priority',
          'notes',
          'additionalField'
        );
        return r;
      });
    }
    return output;
  };

  if (Array.isArray(input)) {
    const rs = [];
    _.each(input, function(item) {
      const r = parseObj(item, child);
      rs.push(r);
    });
    return rs;
  }
  const r = parseObj(input, child);
  return r;
};

const parseCountry = function(input) {
  if (Array.isArray(input)) {
    const rs = [];
    _.each(input, function(item) {
      const r = _.pick(
        item,
        'name',
        'region',
        'description',
        'tag',
        'alias',
        'additionalField'
      );
      r.id = item._id;
      rs.push(r);
    });
    return rs;
  }
  const r = _.pick(
    input,
    'name',
    'region',
    'description',
    'tag',
    'alias',
    'additionalField'
  );
  r.id = input._id;
  return r;
};

export default {
  parseCountry,
  parseTravelPackage,
  parseAttraction,
  parseHotel,
  parsePackageItem,
  parsePackageHotel,
  parseCarRate,
  parseCity,
};
