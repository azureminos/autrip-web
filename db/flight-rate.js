import mongoose from './mongoose';
const Schema = mongoose.Schema;

// Flight Rate
const scFlightRate = new mongoose.Schema({
	package: { type: Schema.Types.ObjectId, ref: 'FlightRate' },
	name: Schema.Types.String,
	description: Schema.Types.String,
	priority: Schema.Types.Number,
	rate: Schema.Types.Number,
	rangeFrom: Schema.Types.Date,
	rangeTo: Schema.Types.Date,
	airline: Schema.Types.String,
	type: Schema.Types.String,
	additionalField: Schema.Types.String,
	notes: Schema.Types.String,
});

const FlightRate = mongoose.model('FlightRate', scFlightRate);

const getFlightRatesByPackageId = packageId => {
	console.log('>>>>Model >> FlightRate.getFlightRatesByPackageId', packageId);
	const params = { package: new mongoose.Types.ObjectId(packageId) };
	return FlightRate.find(params);
};

export default {
	getFlightRatesByPackageId,
};
