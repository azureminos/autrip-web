const _ = require('lodash');

const vars = {
	/* ==== Status ==== */
	statusCustomise: 'Customising',
	statusUnpaid: 'Unpaid',
	statusDepositPaid: 'DepositPaid',
	statusFullyPaid: 'FullyPaid',
	statusInProgress: 'InProgress',
	statusCompleted: 'Completed',
	statusArchived: 'Archived',
	/* ==== Day Format ==== */
	dateHour: 8,
	dateMinute: 0,
	/* ==== Deposit ==== */
	rateDeposit: 500,
	/* ==== Payment Type ==== */
	payTypeCreditCard: 'CreditCard',
	payTypePaypal: 'Paypal',
};

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

const forceDate = dt => {
	if (dt && dt instanceof Date) {
		dt.setHours(vars.dateHour);
		dt.setMinutes(vars.dateMinute);
		dt.setSeconds(0);
		dt.setMilliseconds(0);
	}
	return dt;
};

const getInstance = ({ extra, product }) => {
	var rs = {
		status: extra.status,
		packageId: product.id,
		startDate: extra.startDate,
		endDate: extra.endDate,
		isCustomised: !!extra.isCustomised,
		rate: extra.rate || 0,
		createdBy: extra.createdBy,
		createdAt: extra.createdAt,
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
	const { dayHotels } = product.hotels;

	rs.hotels = _.map(dayHotels, item => {
		return {
			dayNo: item.dayNo,
			isOverNight: item.isOverNight || !!item.hotel,
			hotel: item.hotel ? item.hotel.id : null,
		};
	});
	// Package instance members
	rs.members = extra.members;
	// Set create / update date
	if (extra.createdBy) rs.createdBy = extra.createdBy;
	if (extra.createdAt) rs.createdAt = extra.createdAt;
	if (extra.updatedBy) rs.updatedBy = extra.updatedBy;
	if (extra.updatedAt) rs.updatedAt = extra.updatedAt;
	// Return final instance
	return rs;
};

const findProductById = (id, products) => {
	return products.find(item => item.id === id);
};

export default {
	vars,
	getInstance,
	resizeImage,
	enhanceItem,
	findCityById,
	findAttractionById,
	findHotelById,
	findCityByAttraction,
	findCityByHotel,
	findProductById,
	forceDate,
};
