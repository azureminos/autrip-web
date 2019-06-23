/* import mongoose from './mongoose';
const Schema = mongoose.Schema;

// Attraction
const scAttraction = new Schema({
	name: Schema.Types.String,
	description: Schema.Types.String,
	city: { type: Schema.Types.ObjectId, ref: 'City' },
	image: Schema.Types.Object,
	cost: Schema.Types.Number,
	rate: Schema.Types.Number,
	timeTraffic: Schema.Types.Number,
	timeVisit: Schema.Types.Number,
	nearByAttractions: { type: [Schema.Types.ObjectId], ref: 'Attraction' },
	notes: Schema.Types.String,
	additionalField: Schema.Types.String,
});

const Attraction = mongoose.model('Attraction', scAttraction);

 const getItemsByPackageId = packageId => {
	console.log('>>>>Model >> PackageItem.getItems', packageId);
	const params = { package: new mongoose.Types.ObjectId(packageId) };
	return null;
};

export default {
	getItemsByPackageId,
};*/
