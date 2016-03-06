'use strict';
module.exports = function (app) {
  // Routing logic   
  // ...
  var category = require('../controllers/category.server.controller');
  var product = require('../controllers/product.server.controller');
  var cart = require('../controllers/cart.server.controller');
    console.log("Inside routes");
  app.get('/api/categories', category.list);
  app.get('/api/products/', product.getProducts);
  app.post('/api/addToCart', cart.addToCart);
  app.post('/api/removeFromCart', cart.removeFromCart);
  app.post('/api/cart', cart.fetchCart);
};