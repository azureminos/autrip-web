/* import mongoose from './mongoose';
const Schema = mongoose.Schema;

// Package Item
const scPackageItem = new Schema({
	package: { type: Schema.Types.ObjectId, ref: 'TravelPackage' },
	name: Schema.Types.String,
	description: Schema.Types.String,
	dayNo: Schema.Types.Number,
	daySeq: Schema.Types.Number,
	timePlannable: Schema.Types.Number,
	attraction: { type: Schema.Types.ObjectId, ref: 'Attraction' },
	notes: Schema.Types.String,
	additionalField: Schema.Types.String,
});

const PackageItem = mongoose.model('PackageItem', scPackageItem);

const getItemsByPackageId = packageId => {
	console.log('>>>>Model >> PackageItem.getItemsByPackageId', packageId);
	const params = { package: new mongoose.Types.ObjectId(packageId) };
	return PackageItem.find(params).populate('attraction');
};

export default {
	getItemsByPackageId,
};
*/
