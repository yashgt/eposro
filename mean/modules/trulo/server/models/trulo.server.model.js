'use strict';
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var dbConn;
MongoClient.connect('mongodb://localhost:40000/eposro', function (err, db) {
  if (!err) {
    dbConn = db;
    console.log('Connected Successfully');
  } else {
    console.log(err);
  }
});
///functions for populating the products from excel sheet
exports.saveProduct = function (product, cb) {
  var pcollection = dbConn.collection('products');
  var idcollection = dbConn.collection('IDs');
  if (product._id === undefined)
    //read id from database
    {
      var query = {};
      var sort = [];
      var operator = { $inc: { 'last_pdt_id': 1 } };
      var options = { new: true };
      idcollection.findAndModify(query, sort, operator, options, function (err, doc) {
        if (!err) {
          var id = doc.last_pdt_id;
          product._id = id;
          insert_product_internal(pcollection, product, cb);
        } else {
          console.log(err);
        }
      });
    }
  else
    //directly insert the product
    {
      insert_product_internal(pcollection, product, cb);
    }
};
function insert_product_internal(collection, product, cb) {
  collection.insert(product, function (err, result) {
    if (!err) {
      cb(null, result);
    } else {
      console.log(err);
    }
  });
}
exports.findCategoryId = function (cat, cb) {
  var category = dbConn.collection('category');
  category.find({ 'name': cat }).toArray(function (err, result) {
    if (!err) {
      var cids = [];
      for (var i = 0; i < result.length; i++) {
        cids.push(result[i]._id);
      }
      cb(null, cids);
    } else {
      console.log(err);
    }
  });
};
exports.findCityId = function (city, cb) {
  var cities = dbConn.collection('cities');
  cities.findOne({ 'city': city.toLowerCase() }, function (err, result) {
    if (!err) {
      cb(null, result._id);
    } else {
      console.log(err);
    }
  });
};
exports.getLastPdtId = function (cb) {
  var IDs = dbConn.collection('IDs');
  IDs.findOne(function (err, res) {
    if (!err) {
      cb(null, res.last_pdt_id);
    } else {
      console.log(err);
    }
  });
};
exports.getProductVars = function (pname, brand, cb) {
  var pcollection = dbConn.collection('products');
  pcollection.find({
    'pname': pname,
    'brand': brand
  }).toArray(function (err, result) {
    if (!err) {
      //build a pseudo product
      var vars = [];
      for (var i = 0; i < result.length; i++) {
        var product = {};
        product.vid = result[i]._id;
        product.vname = result[i].pname;
        product.facets = result[i].facets;
        vars.push(product);
      }
      cb(null, vars);
    } else {
      console.log(err);
    }
  });
};
exports.getRelatedPdts = function (last_pdt_id, cb) {
  var pcollection = dbConn.collection('products');
  //generate random 2 products
  var rand = Math.floor(Math.random() * last_pdt_id), srand;
  var relPdts = [];
  pcollection.findOne({ _id: rand }, function (err, result) {
    if (!err) {
      if (result !== null) {
        var pdt = {};
        pdt.id = result._id;
        pdt.pname = result.pname;
        pdt.img = result.img;
        relPdts.push(pdt);
      }
      srand = Math.floor(Math.random() * last_pdt_id);
      pcollection.findOne({ _id: srand }, function (err, result) {
        if (!err) {
          if (result !== null) {
            pdt = {};
            pdt.id = result._id;
            pdt.pname = result.pname;
            pdt.img = result.img;
            relPdts.push(pdt);
          }
          cb(null, relPdts);
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
};
exports.writeLastPdtId = function (last_id, cb) {
  var IDs = dbConn.collection('IDs');
  IDs.findOne(function (err, res) {
    if (!err) {
      IDs.update({ _id: res._id }, { $set: { 'last_pdt_id': last_id } }, function (err, res) {
        if (!err) {
          cb(null, res);
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
};
exports.getCategories = function (id, cb) {
  var category = dbConn.collection('category');
  category.find({ parent_id: parseInt(id) }).toArray(function (err, res) {
    if (!err) {
      var cats = [];
      for (var i = 0; i < res.length; i++) {
        cats.push({
          catID: res[i]._id,
          title: res[i].name
        });
      }
      cb(cats);
    }
  });
};
exports.checkForProduct = function (gtin, cb) {
  var products = dbConn.collection('products');
  products.find({ 'gtin': gtin }).toArray(function (err, res) {
    if (!err) {
      if (res.length === 0) {
        cb(null, 0);
      } else {
        cb(null, 1);
      }
    } else {
      console.log(err);
    }
  });
};
exports.updateProdVars = function (vars, product, cb) {
  var products = dbConn.collection('products');
  var variant = {};
  variant.vid = product._id;
  variant.vname = product.pname;
  variant.facets = product.facets;
  var count = 0;
  if (JSON.stringify(vars) !== '[]') {
    for (var i = 0; i < vars.length; i++) {
      products.update({ _id: vars[i].vid }, { $push: { 'vars': variant } }, function (err, res) {
        if (!err) {
          console.log('Variant ' + i);
          count++;
          if (count === vars.length) {
            cb(null, 1);
          } else {
            console.log(err);
          }
        }
      });
    }
  } else {
    cb(null, 0);
  }
};
/////functions related to cart///
exports.addToCart = function (userId, pid, current_city, cb) {
  var cart = {};
  var users = dbConn.collection('users');
  var products = dbConn.collection('products');
  var cities = dbConn.collection('cities');
  async.waterfall([
    //functions to be executed in order
    function (callback) {
      //find the user with the user id
      var users = dbConn.collection('users');
      users.findOne({
        _id: userId,
        cart: { $exists: true }
      }, function (err, res) {
        if (!err) {
          callback(null, res);
        }
      });
    },
    function (user, callback) {
      if (user !== undefined) {
        //cart field exits
        var flag = 0, price = 0;
        user.cart.products.forEach(function (product) {
          if (product.pid === pid) {
            flag = 1;
            price = product.price;
            return;
          }
        });
        callback(null, flag, price);
      } else {
        //create the cart subdocument and add product
        cart.products = [];
        cart.estimated_cost = 0;
        users.update({ _id: userId }, { $set: { 'cart': cart } }, function (err, res) {
          if (!err) {
            callback(null, 0, null);
            return;
          } else {
            console.log(err);
          }
        });
      }
    },
    function (flag, price) {
      if (flag === 1) {
        users.update({
          _id: userId,
          'cart.products.pid': pid
        }, {
          $inc: {
            'cart.products.$.count': 1,
            'cart.estimated_cost': parseInt(price)
          }
        }, function (err, res) {
          if (!err) {
            cb('product Incremented');
            return;
          } else {
            console.log(err);
            return;
          }
        });
      } else {
        //create product
        var prod = {};
        prod.pid = pid;
        cities.findOne({ city: current_city }, function (err, res) {
          if (!err) {
            var city_id = res._id;
            products.findOne({
              _id: pid,
              'price.mrp.city': city_id
            }, {
              'price.mrp.$': 1,
              'pname': 1
            }, function (err, res) {
              if (!err) {
                if (res !== null) {
                  prod.name = res.pname;
                  prod.price = res.price.mrp[0].mrp;
                  //add this product to the database now
                  prod.count = 1;
                  users.update({ _id: userId }, {
                    $push: { 'cart.products': prod },
                    $inc: { 'cart.estimated_cost': parseInt(prod.price) }
                  }, function (err, res) {
                    if (!err) {
                      cb('Product Added successfully');
                      return;
                    } else {
                      console.log(err);
                      return;
                    }
                  });
                } else {
                  cb('No Product Exists');
                  return;
                }
              }
            });
          }
        });
      }
    }
  ], function (err, res) {
    if (!err) {
      console.log('All the functions executed properly');
    }
  });
};
exports.removeFromCart = function (userId, pid, cb) {
  //decrement count of the product from cart
  var users = dbConn.collection('users');
  var products = dbConn.collection('products');
  users.findOne({
    _id: userId,
    'cart.products.pid': pid
  }, { 'cart.products': 1 }, function (err, res) {
    if (!err) {
      //search the products with given pid
      if (res === null) {
        cb('Product does not exist in cart');
        return;
      }
      var price, count, total_prod = res.cart.products.length;
      for (var i = 0; i < total_prod; i++) {
        if (res.cart.products[i].pid === pid) {
          price = res.cart.products[i].price;
          count = res.cart.products[i].count;
          break;
        }
      }
      if (count !== 1) {
        users.update({
          _id: userId,
          'cart.products.pid': pid
        }, {
          $inc: {
            'cart.estimated_cost': -parseInt(price),
            'cart.products.$.count': -1
          }
        }, function (err, res) {
          if (!err) {
            cb('Product Count decremented');
            return;
          } else {
            console.log(err);
            return;
          }
        });
      } else {
        users.update({ _id: userId }, {
          $pull: { 'cart.products': { 'pid': pid } },
          $inc: { 'cart.estimated_cost': -parseInt(price) }
        }, function (err, res) {
          if (!err) {
            if (total_prod === 1) {
              users.update({ _id: userId }, { $unset: { cart: true } }, function (err, res) {
                if (!err) {
                  cb('cart removed from user ' + userId);
                  return;
                } else {
                  console.log(err);
                }
              });
            } else {
              cb('product removed from cart');
              return;
            }
          } else {
            console.log(err);
          }
        });
      }
    }
  });
};
exports.checkOut = function (userId, cb) {
  //read the last order id used from IDs collection
  var IDs = dbConn.collection('IDs');
  var orders = dbConn.collection('orders');
  var users = dbConn.collection('users');
  async.waterfall([
    function (callback) {
      IDs.findOne({}, function (err, res) {
        if (!err) {
          callback(null, res.last_order_id);
          return;
        } else {
          console.log(err);
          return;
        }
      });
    },
    function (last_order_id, callback) {
      if (last_order_id !== null) {
        users.findOne({ _id: userId }, function (err, res) {
          if (!err) {
            callback(null, last_order_id, res);
            return;
          }
        });
      }
    },
    function (last_order_id, user, callback) {
      //create order
      if (user !== null) {
        var order = {};
        order._id = ++last_order_id;
        order.ordered_by = userId;
        order.vendors_serving = [];
        order.selected_vendors = [];
        order.items = user.cart.products;
        order.estimated_cost = user.cart.estimated_cost;
        order.processing_status = 0;
        if (user.cart.order_mode !== undefined) {
          order.order_mode = user.cart.order_mode;
        } else {
          order.order_mode = user.default_delivery_preference;
        }
        //write this to order collection
        orders.insert(order, function (err, res) {
          if (!err) {
            //update last order_id
            IDs.update({}, { $set: { 'last_order_id': last_order_id } }, function (err, res) {
              if (!err) {
                //update the user collection to contain that order id
                callback(null, order._id);
                return;
              }
            });
          }
        });
      }
    },
    function (current_order, callback) {
      if (current_order !== null) {
        users.update({ _id: userId }, {
          $push: { orderIDs: current_order },
          $unset: { cart: true }
        }, function (err, res) {
          if (!err) {
            cb('Successfully added the order ' + current_order);
            return;
          } else {
            console.log(err);
            return;
          }
        });
      }
    }
  ], function (err, result) {
    if (!err) {
      console.log('All functions are executed');
      return;
    }
  });
};
exports.fetchCart = function (userId, cb) {
  var users = dbConn.collection('users');
  users.findOne({ _id: userId }, function (err, res) {
    if (!err) {
      if (res.cart !== undefined) {
        cb(res.cart);
        return;
      } else {
        console.log(res);
        cb(null);
        return;
      }
    } else {
      console.log(err);
    }
  });
};
////////////functions for finding best vendor////
exports.getUnProcessedOrders = function (cb) {
  //finds all the orders that are yet to be processed
  var orders = dbConn.collection('orders');
  orders.find({ processing_status: 0 }).toArray(function (err, res) {
    if (!err) {
      cb(null, res);
    } else {
      console.log(err);
    }
  });
};
exports.findCustomerById = function (cid, cb) {
  var users = dbConn.collection('users');
  users.findOne({ _id: cid }, function (err, res) {
    if (!err) {
      cb(null, res);
    } else {
      console.log(err);
    }
  });
};
exports.getPickUpVendors = function (loc, items, maxdist, cb) {
  var vendors = dbConn.collection('vendors');
  vendors.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: loc
        },
        distanceField: 'distance',
        maxDistance: maxdist,
        spherical: true
      }
    },
    { $match: { 'products.pid': { $all: items } } },
    { $sort: { distance: 1 } }
  ], function (err, res) {
    if (!err) {
      cb(null, res);
    } else {
      console.log(err);
    }
  });
};
exports.getHomeDelVen = function (loc, items, cb) {
  var vendors = dbConn.collection('vendors');
  vendors.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: loc
        },
        distanceField: 'distance',
        maxDistance: 3000,
        query: { delivery_mode: 1 },
        spherical: true
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        products: 1,
        delivery_mode: 1,
        address: 1,
        id: 1,
        distance: 1,
        'cmpval': {
          $cmp: [
            '$distance',
            '$serving_radius'
          ]
        }
      }
    },
    {
      $match: {
        $and: [
          { 'products.pid': { $all: items } },
          { 'cmpval': -1 }
        ]
      }
    },
    { $sort: { distance: 1 } }
  ], function (err, res) {
    if (!err) {
      cb(null, res);
    } else {
      console.log(err);
    }
  });
};