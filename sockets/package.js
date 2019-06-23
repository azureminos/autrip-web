import _ from 'lodash';
import async from 'async';
import TravelPackage from '../db/travel-package';
import PackageItem from '../db/package-item';
import PackageHotel from '../db/package-hotel';
import City from '../db/city';
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
					TravelPackage.getPackageById(id).exec(function (err, item) {
						// console.log('>>>>server async calls for event[push:package:get]', item);
						return callback(null, helper.parseTravelPackage(item));
					});
				},
				packageItems: callback => {
					PackageItem.getItems({ package: id }).exec(function (err, items) {
						console.log('>>>>Event[push:package:get].packageItems', items);
						return callback(null, helper.parsePackageItem(items));
					});
				},
				packageHotels: callback => {
					PackageHotel.getHotels({ package: id }).exec(function (err, items) {
						return callback(null, helper.parsePackageHotel(items));
					});
				},
				/*packageRates: callback => {
					TravelPackage.getPackageById(id)
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
					TravelPackage.getPackageById(id)
						.populate('carRates')
						.exec(function (err, item) {
							const sortedRates = (item.carRates || []).sort(function (a, b) {
								return b.priority - a.priority;
							});
							return callback(null, sortedRates);
						});
				},
				flightRates: callback => {
					TravelPackage.getPackageById(id)
						.populate('flightRates')
						.exec(function (err, item) {
							const sortedRates = (item.flightRates || []).sort(function (a, b) {
								return b.priority - a.priority;
							});
							return callback(null, sortedRates);
						});
				},
				cities: callback => {
					PackageItem.getItems({ package: id })
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
				socket.emit('package:get', results);
			}
		);
	} else {
		// async calls
		async.parallel(
			{
				packageSummary: callback => {
					TravelPackage.getPackageById(id).exec(function (err, item) {
						// console.log('>>>>server async calls for event[push:package:get]', item);
						return callback(null, helper.parseTravelPackage(item));
					});
				},
				packageItems: callback => {
					TravelPackage.getItemsByPackageId(id).exec(function (err, items) {
						console.log('>>>>Event[push:package:get].packageItems', items);
						return callback(null, helper.parsePackageItem(items));
					});
				},
				/*packageRates: callback => {
					TravelPackage.getPackageById(id)
						// .populate('packageRates')
						.exec(function (err, item) {
							console.log('>>>>Event[push:package:get].packageRates', item);
							const sortedRates = (item.packageRates || []).sort(function (
								a,
								b
							) {
								return b.priority - a.priority;
							});
							return callback(null, sortedRates);
						});
				},
				flightRates: callback => {
					TravelPackage.getPackageById(id)
						.populate('flightRates')
						.exec(function (err, item) {
							console.log('>>>>Event[push:package:get].flightRates', item);
							const sortedRates = (item.flightRates || []).sort(function (a, b) {
								return b.priority - a.priority;
							});
							return callback(null, sortedRates);
						});
				},*/
			},
			function (err, results) {
				// console.log('>>>>server final callback for event[push:package:get]', results);
				socket.emit('package:get', results);
			}
		);
	}
};

const getFilteredPackages = ({ request, sendStatus, socket }) => {
	// console.log('>>>>server received event[push:package:filter]', request);
	TravelPackage.getFilteredPackages(request).exec((err, items) => {
		// console.log('>>>>Result of event[push:package:filter]', items);
		socket.emit('package:refreshAll', {
			packages: helper.parseTravelPackage(items),
		});
	});
};

export default { getFilteredPackages, getPackageDetails };
