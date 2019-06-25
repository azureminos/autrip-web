import mongoose from './mongoose';
const Schema = mongoose.Schema;

// Travel Package
const scTravelPackage = new Schema({
	name: Schema.Types.String,
	description: Schema.Types.String,
	finePrint: Schema.Types.String,
	notes: Schema.Types.String,
	departureDate: Schema.Types.String,
	effectiveTo: Schema.Types.Date,
	effectiveFrom: Schema.Types.Date,
	isExtention: Schema.Types.Boolean,
	isCustomisable: Schema.Types.Boolean,
	isPromoted: Schema.Types.Boolean,
	state: Schema.Types.String,
	maxParticipant: Schema.Types.Number,
	totalDays: Schema.Types.Number,
	retailPrice: Schema.Types.Number,
	additionalField: Schema.Types.String,
	image: Schema.Types.Object,
	titleImage: Schema.Types.Object,
	carouselImages: [Schema.Types.Object],
	packageRates: { type: [Schema.Types.ObjectId], ref: 'PackageRate' },
	flightRates: { type: [Schema.Types.ObjectId], ref: 'FlightRate' },
});

scTravelPackage.virtual('startingRate').get(function () {
	return 500;
});

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

const TravelPackage = mongoose.model('TravelPackage', scTravelPackage);

const getAllPackages = () => {
	return TravelPackage.find();
};

const getFilteredPackages = filter => {
	return TravelPackage.find(filter);
};

const getPackageById = id => {
	return TravelPackage.findById(id);
};

export default {
	getPackageById,
	getAllPackages,
	getFilteredPackages,
	getItemsByPackageId,
};
