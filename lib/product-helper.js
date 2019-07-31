const _ = require('lodash');

const findProductById = (id, products) => {
	return products.find(item => item.id === id);
};

export default {
	findProductById,
};
