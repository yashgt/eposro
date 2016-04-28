'use strict';
module.exports = function (app) {
  // Routing logic   
  // ...
  var category = require('../controllers/category.server.controller');
  var product = require('../controllers/product.server.controller');
  var cart = require('../controllers/cart.server.controller');
  var order= require('../controllers/order.server.controller'); 
  
  app.get('/api/categories', category.list);
  app.get('/api/products', product.getProducts);
  app.post('/api/addToCart', cart.addToCart);
  app.post('/api/removeProductDirectly', cart.removeProductDirectly);
  app.post('/api/removeFromCart', cart.removeFromCart);
  app.get('/api/cart', cart.fetchCart);
  app.post('/api/placeOrder',order.placeOrder);
  app.get('/api/product-detail',product.getProductDetails);
  app.get('/api/search',product.searchProduct);
};