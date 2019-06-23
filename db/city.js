import mongoose from './mongoose';
const Schema = mongoose.Schema;

// City
const scCity = new mongoose.Schema({
	name: Schema.Types.String,
});

const City = mongoose.model('cities', scCity);

const getCities = params => {
	return City.find(params);
};

export default {
	getCities,
};
