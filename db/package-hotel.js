import mongoose from './mongoose';
const Schema = mongoose.Schema;

// Package Hotel
const scPackageHotel = new mongoose.Schema({
	package: { type: Schema.Types.ObjectId, ref: 'TravelPackage' },
	name: Schema.Types.String,
	description: Schema.Types.String,
	dayNo: Schema.Types.Number,
	isOvernight: Schema.Types.Boolean,
	timePlannable: Schema.Types.Number,
	hotel: { type: Schema.Types.ObjectId, ref: 'Hotel' },
	notes: Schema.Types.String,
	additionalField: Schema.Types.String,
});

const PackageHotel = mongoose.model('PackageHotel', scPackageHotel);

const getHotelsByPackageId = packageId => {
	console.log('>>>>Model >> PackageHotel.getHotelsByPackageId', packageId);
	const params = { package: new mongoose.Types.ObjectId(packageId) };
	return PackageHotel.find(params);
};

export default {
	getHotelsByPackageId,
};
