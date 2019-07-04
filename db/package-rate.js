import mongoose from './mongoose';
const Schema = mongoose.Schema;

// Package Rate
const scPackageRate = new mongoose.Schema({
	package: { type: Schema.Types.ObjectId, ref: 'TravelPackage' },
	name: Schema.Types.String,
	description: Schema.Types.String,
	priority: Schema.Types.String,
	rangeFrom: Schema.Types.Date,
	rangeTo: Schema.Types.Date,
	rate: Schema.Types.Number,
	minParticipant: Schema.Types.Number,
	maxParticipant: Schema.Types.Number,
	premiumFee: Schema.Types.Number,
	notes: Schema.Types.String,
	additionalField: Schema.Types.String,
});

const PackageRate = mongoose.model('PackageRate', scPackageRate);

const getPackageRatesByPackageId = packageId => {
	console.log('>>>>Model >> PackageRate.getPackageRatesByPackageId', packageId);
	const params = { package: new mongoose.Types.ObjectId(packageId) };
	return PackageRate.find(params);
};

export default {
	getPackageRatesByPackageId,
};
