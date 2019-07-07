const _ = require('lodash');

const findCityById = (id, cities) => {
	var name = '';
	_.each(cities, c => {
		if (c.id === id) name = c.name;
	});
	return name;
};

const findAttractionById = (id, cities) => {
	var attraction = null;
	_.each(cities, c => {
		const matcher = _.find(c.attractions, function (a) {
			return a.id === id;
		});
		if (matcher) attraction = matcher;
	});
	if (attraction) {
		return attraction;
	}
	return;
};

const findHotelById = (id, cities) => {
	var hotel = null;
	_.each(cities, c => {
		const matcher = _.find(c.hotel, function (h) {
			return h.id === id;
		});
		if (matcher) hotel = matcher;
	});
	if (hotel) {
		return hotel;
	}
	return;
};

const findCityByAttraction = (id, cities) => {
	var name = '';
	_.each(cities, c => {
		if (
			_.find(c.attractions, function (a) {
				return a.id === id;
			})
		) {
			name = c.name;
		}
	});
	if (name) {
		return name;
	}
	return;
};

const findCityByHotel = (id, cities) => {
	var name = '';
	_.each(cities, c => {
		if (
			_.find(c.hotels, function (h) {
				return h.id === id;
			})
		) {
			name = c.name;
		}
	});
	if (name) {
		return name;
	}
	return;
};

const enhanceItem = (item, cities) => {
	if (item.attraction) {
		item.attraction = this.findAttractionById(item.attraction, cities);
	}
	return item;
};

const resizeImage = (imageUrl, resize) => {
	const dm = 'image/upload';
	const sec = imageUrl.split(dm);
	if (imageUrl && sec.length > 1) {
		return sec[0] + dm + '/' + resize + sec[1];
	}
	return imageUrl;
};

const initInstance = ({ extra, product }) => {
	var rs = {
		packageId: product.id,
		startDate: extra.startDate,
		endDate: extra.endDate,
		isCustomised: extra.isCustomised,
		totalDays: product.totalDays,
		rate: extra.rate,
		items: [],
		hotels: [],
		members: [],
	};
	// Package instance items
	rs.items = _.map(product.items, item => {
		return {
			dayNo: item.dayNo,
			daySeq: item.daySeq,
			timePlannable: item.timePlannable || (item.attraction ? 10 : 0),
			attraction: item.attraction ? item.attraction.id : null,
		};
	});
	// Package instance hotels
	rs.hotels = _.map(product.hotels, item => {
		return {
			dayNo: item.dayNo,
			isOverNight: item.isOverNight || !!item.hotel,
			hotel: item.hotel ? item.hotel.id : null,
		};
	});
	// Dummy package instance members
	rs.members = [
		{
			loginId: 'dummy',
			isOwner: true,
			kids: extra.kids || 0,
			adults: extra.adults || 1,
		},
	];
	// Return final dummy
	return rs;
};

const dummyInstance = ({ packageSummary, packageItems, packageHotels }) => {
	var getUniqueId = () => {
		return Math.random()
			.toString(36)
			.substr(2, 9);
	};
	// Dummy package instance
	var rs = {
		id: getUniqueId(),
		packageId: packageSummary.id,
		startDate: null,
		endDate: null,
		isCustomised: false,
		totalDays: packageSummary.totalDays,
		totalKids: 0,
		totalAdults: 0,
		maxParticipant: packageSummary.maxParticipant,
		cost: 0,
		rate: 0,
		items: [],
		hotels: [],
		members: [],
	};
	// Dummy package instance items
	_.each(packageItems, item => {
		var it = {
			id: getUniqueId(),
			dayNo: item.dayNo,
			daySeq: item.daySeq,
			timePlannable: item.timePlannable || (item.attraction ? 10 : 0),
			attraction: item.attraction ? item.attraction.id : null,
		};
		rs.items.push(it);
	});
	// Dummy package instance hotels
	_.each(packageHotels, item => {
		var ho = {
			id: getUniqueId(),
			dayNo: item.dayNo,
			isOverNight: item.isOverNight || !!item.hotel,
			hotel: item.hotel ? item.hotel.id : null,
		};
		rs.hotels.push(ho);
	});
	// Dummy package instance members
	var us = {
		id: getUniqueId(),
		loginId: 'dummy',
		isOwner: true,
		memberKids: 0,
		memberAdults: 0,
	};
	rs.members.push(us);
	// Return final dummy
	return rs;
};

const findProductById = (id, products) => {
	return products.find(item => item.id === id);
};

export default {
	dummyInstance,
	initInstance,
	resizeImage,
	enhanceItem,
	findCityById,
	findAttractionById,
	findHotelById,
	findCityByAttraction,
	findCityByHotel,
	findProductById,
};
