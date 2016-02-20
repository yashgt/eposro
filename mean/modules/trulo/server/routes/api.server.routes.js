'use strict';

module.exports = function(app) {
  // Routing logic   
  // ...
  	var category = require('../controllers/category.server.controller');
	var product = require('../controllers/product.server.controller');
	
	app.get('/api/categories', category.list);
	app.get('/api/products/:category_id', product.list);
};
