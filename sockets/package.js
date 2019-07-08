import _ from 'lodash';
import async from 'async';
import MongoDB from '../db/schema';
import helper from '../lib/object-parser';

const getPackageDetails = ({
	request: { id, isCustomisable },
	sendStatus,
	socket,
}) => {
	console.log('>>>>server received event[push:package:get]', {
		id,
		isCustomisable,
	});
	if (isCustomisable) {
		// async calls
		async.parallel(
			{
				packageSummary: callback => {
					MongoDB.getPackageById(id).exec(function (err, item) {
						// console.log('>>>>server async calls for event[push:package:get]', item);
						return callback(null, helper.parseTravelPackage(item));
					});
				},
				packageItems: callback => {
					MongoDB.getItemsByPackageId(id).exec(function (err, items) {
						console.log('>>>>Event[push:package:get].packageItems', items);
						return callback(null, helper.parsePackageItem(items));
					});
				},
				packageHotels: callback => {
					MongoDB.getHotels({ package: id }).exec(function (err, items) {
						return callback(null, helper.parsePackageHotel(items));
					});
				},
				/*packageRates: callback => {
					MongoDB.getPackageById(id)
						.populate('packageRates')
						.exec(function (err, item) {
							const sortedRates = (item.packageRates || []).sort(function (
								a,
								b
							) {
								return b.priority - a.priority;
							});
							return callback(null, sortedRates);
						});
				},
				carRates: callback => {
					MongoDB.getPackageById(id)
						.populate('carRates')
						.exec(function (err, item) {
							const sortedRates = (item.carRates || []).sort(function (a, b) {
								return b.priority - a.priority;
							});
							return callback(null, sortedRates);
						});
				},
				flightRates: callback => {
					MongoDB.getPackageById(id)
						.populate('flightRates')
						.exec(function (err, item) {
							const sortedRates = (item.flightRates || []).sort(function (a, b) {
								return b.priority - a.priority;
							});
							return callback(null, sortedRates);
						});
				},
				cities: callback => {
					MongoDB.getItems({ package: id })
						.populate('attraction')
						.exec(function (err, items) {
							const cities = _.map(items, item => {
								return item.attraction ? item.attraction.city : null;
							});
							// console.log('>>>>getPackageDetails.cityAttractions : cities', cities);
							return City.getCities({ _id: { $in: cities } })
								.populate('attractions hotels')
								.exec(function (err, items) {
									// console.log('>>>>getPackageDetails.cityAttractions : result', items);
									return callback(null, helper.parseCity(items, 'all'));
								});
						});
				},*/
			},
			function (err, results) {
				// console.log('>>>>server final callback for event[push:package:get]', results);
				socket.emit('product:get', results);
			}
		);
	} else {
		// async calls
		async.parallel(
			{
				packageSummary: callback => {
					MongoDB.getPackageById(id).exec(function (err, item) {
						// console.log('>>>>server async calls for event[push:package:get]', item);
						return callback(null, helper.parseTravelPackage(item));
					});
				},
				packageItems: callback => {
					MongoDB.getItemsByPackageId(id).exec(function (err, items) {
						// console.log('>>>>Event[push:package:get].packageItems', items);
						return callback(null, helper.parsePackageItem(items));
					});
				},
				packageHotels: callback => {
					MongoDB.getHotelsByPackageId(id).exec(function (err, items) {
						// console.log('>>>>Event[push:package:get].packageHotels', items);
						async.parallel(
							{
								dayHotels: callback => {
									return callback(null, items);
								},
								hotels: callback => {
									const hotelIds = _.map(items, item => {
										return item.hotel;
									});
									// console.log('>>>>Event[push:package:get].getRoomsByHotels Input', hotelIds);
									MongoDB.getHotelsByIds(hotelIds).exec(function (err, items) {
										// console.log('>>>>Event[push:package:get].getRoomsByHotels Output',	items);
										return callback(null, items);
									});
								},
								rooms: callback => {
									const hotelIds = _.map(items, item => {
										return item.hotel;
									});
									// console.log('>>>>Event[push:package:get].getRoomsByHotels Input', hotelIds);
									MongoDB.getRoomsByHotels(hotelIds).exec(function (err, items) {
										// console.log('>>>>Event[push:package:get].getRoomsByHotels Output', items);
										return callback(null, items);
									});
								},
							},
							function (err, results) {
								// console.log('>>>>server final callback for event[push:package:get]', results);
								return callback(null, results);
							}
						);
					});
				},
			},
			function (err, results) {
				// console.log('>>>>server final callback for event[push:package:get]', results);
				socket.emit('product:get', results);
			}
		);
	}
};

const checkoutPackage = ({ request, sendStatus, socket }) => {
	console.log('>>>>server received event[push:package:checkout]', request);
};

const getRatesByPackage = ({
	request: { id, isCustomisable },
	sendStatus,
	socket,
}) => {
	console.log('>>>>server received event[push:rate:getByProduct]', {
		id,
		isCustomisable,
	});
	if (isCustomisable) {
		// async calls
		async.parallel(
			{
				packageRates: callback => {
					MongoDB.getPackageRatesByPackageId(id).exec(function (err, item) {
						console.log('>>>>Event[push:rate:getByProduct].packageRates', item);
						const sortedRates = (item.packageRates || []).sort(function (a, b) {
							return b.priority - a.priority;
						});
						return callback(null, sortedRates);
					});
				},
				flightRates: callback => {
					MongoDB.getFlightRatesByPackageId(id).exec(function (err, item) {
						console.log('>>>>Event[push:rate:getByProduct].flightRates', item);
						const sortedRates = (item.flightRates || []).sort(function (a, b) {
							return b.priority - a.priority;
						});
						return callback(null, sortedRates);
					});
				},
				carRates: callback => {
					MongoDB.getPackageById(id)
						.populate('carRates')
						.exec(function (err, item) {
							const sortedRates = (item.carRates || []).sort(function (a, b) {
								return b.priority - a.priority;
							});
							return callback(null, sortedRates);
						});
				},
				/*cities: callback => {
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
			function (err, results) {
				// console.log('>>>>server final callback for event[push:rate:getByProduct]', results);
				socket.emit('rate:getByProduct', results);
			}
		);
	} else {
		// async calls
		async.parallel(
			{
				packageRates: callback => {
					MongoDB.getPackageRatesByPackageId(id).exec(function (err, items) {
						console.log(
							'>>>>Event[push:rate:getByProduct].packageRates',
							items
						);
						const sortedRates = (items || []).sort(function (a, b) {
							return b.priority - a.priority;
						});
						return callback(null, sortedRates);
					});
				},
				flightRates: callback => {
					MongoDB.getFlightRatesByPackageId(id).exec(function (err, items) {
						console.log('>>>>Event[push:rate:getByProduct].flightRates', items);
						const sortedRates = (items || []).sort(function (a, b) {
							return b.priority - a.priority;
						});
						return callback(null, sortedRates);
					});
				},
			},
			function (err, results) {
				// console.log('>>>>server final callback for event[push:rate:getByProduct]', results);
				socket.emit('rate:getByProduct', results);
			}
		);
	}
};

const getFilteredPackages = ({ request, sendStatus, socket }) => {
	// console.log('>>>>server received event[push:package:filter]', request);
	MongoDB.getFilteredPackages(request).exec((err, items) => {
		// console.log('>>>>Result of event[push:package:filter]', items);
		socket.emit('product:refreshAll', {
			packages: helper.parseTravelPackage(items),
		});
	});
};

export default {
	getFilteredPackages,
	getPackageDetails,
	getRatesByPackage,
	checkoutPackage,
};
