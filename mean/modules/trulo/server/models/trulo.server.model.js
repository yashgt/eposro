'use strict';
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var dbConn;
MongoClient.connect('mongodb://localhost:40000/eposro', function(err, db) {
    if (!err) {
        dbConn = db;
        console.log('Connected Successfully');
    } else {
        console.log(err);
    }
});
///functions for populating the products from excel sheet
exports.saveProduct = function(product, cb) {
    var pcollection = dbConn.collection('products');
    var idcollection = dbConn.collection('IDs');
    if (product._id === undefined)
    //read id from database
    {
        var query = {};
        var sort = [];
        var operator = {
            $inc: {
                'last_pdt_id': 1
            }
        };
        var options = {
            new: true
        };
        idcollection.findAndModify(query, sort, operator, options, function(err, doc) {
            if (!err) {
                var id = doc.last_pdt_id;
                product._id = id;
                insert_product_internal(pcollection, product, cb);
            } else {
                console.log(err);
            }
        });
    } else
    //directly insert the product
    {
        insert_product_internal(pcollection, product, cb);
    }
};

function insert_product_internal(collection, product, cb) {
    collection.insert(product, function(err, result) {
        if (!err) {
            cb(null, "Product Added to Database");
        } else {
            console.log(err);
        }
    });
}
exports.findCategoryId = function(cat, cb) {
    var category = dbConn.collection('category');
    category.find({
        'name': cat
    }).sort({
        _id: 1
    }).toArray(function(err, result) {
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
exports.findCityId = function(city, cb) {
    var cities = dbConn.collection('cities');
    cities.findOne({
        'city': city.toLowerCase()
    }, function(err, result) {
        if (!err) {
            cb(null, result._id);
        } else {
            console.log(err);
        }
    });
};
exports.getLastPdtId = function(cb) {
    var IDs = dbConn.collection('IDs');
    IDs.findOne(function(err, res) {
        if (!err) {
            cb(null, res.last_pdt_id);
        } else {
            console.log(err);
        }
    });
};
exports.getProductVars = function(pname, brand, cb) {
    var pcollection = dbConn.collection('products');
    pcollection.find({
        'pname': pname,
        'brand': brand
    }).toArray(function(err, result) {
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
exports.getRelatedPdts = function(last_pdt_id, cb) {
    var pcollection = dbConn.collection('products');
    //generate random 2 products
    var rand = Math.floor(Math.random() * last_pdt_id),
        srand;
    var relPdts = [];
    pcollection.findOne({
        _id: rand
    }, function(err, result) {
        if (!err) {
            if (result !== null) {
                var pdt = {};
                pdt.id = result._id;
                pdt.pname = result.pname;
                pdt.img = result.img;
                relPdts.push(pdt);
            }
            srand = Math.floor(Math.random() * last_pdt_id);
            pcollection.findOne({
                _id: srand
            }, function(err, result) {
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
exports.writeLastPdtId = function(last_id, cb) {
    var IDs = dbConn.collection('IDs');
    IDs.findOne(function(err, res) {
        if (!err) {
            IDs.update({
                _id: res._id
            }, {
                $set: {
                    'last_pdt_id': last_id
                }
            }, function(err, res) {
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
exports.getCategories = function(id, cb) {
    var category = dbConn.collection('category');
    category.find({
        parent_id: parseInt(id)
    }).sort({
        _id: 1
    }).toArray(function(err, res) {
        if (!err) {
            var cats = [];
            for (var i = 0; i < res.length; i++) {
                cats.push({
                    catID: res[i]._id,
                    title: res[i].name,
                    parentCatId: res[i].parent_id
                });
                //console.log(cats);
            }
            cb(cats);
        }
    });
};
exports.checkForProduct = function(gtin, cb) {
    var products = dbConn.collection('products');
    products.find({
        'gtin': gtin
    }).toArray(function(err, res) {
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
exports.updateProdVars = function(vars, product, cb) {
    var products = dbConn.collection('products');
    var variant = {};
    variant.vid = product._id;
    variant.vname = product.pname;
    variant.facets = product.facets;
    var count = 0;
    if (JSON.stringify(vars) !== '[]') {
        for (var i = 0; i < vars.length; i++) {
            products.update({
                _id: vars[i].vid
            }, {
                $push: {
                    'vars': variant
                }
            }, function(err, res) {
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

exports.setProductFlag = function(pid,cb){
    var gs1data= dbConn.collection("gs1data");
    gs1data.update({_id:pid},{$set:{flag:true}},function(err,res){
        if(!err){
            cb(null,res);
        }
        else{
            console.log(err);
        }
    });
}
/////////////////////importing gs1 data///////////

exports.addCatToDb = function(cat,cb){
    var category = dbConn.collection("category");
    category.insert(cat,function(err,res){
        if(!err){
            cb(null,"Added to Db "+cat._id);
        }
        else{
            cb(err,null);
        }
    });

};

exports.checkIfExists = function (cname,cb) {
    var category= dbConn.collection("category");
    category.find({"name":cname}).toArray(function(err,res){
        if(!err){
            if(res.length==0){
                cb(null,false);
            }
            else{
                cb(null,true);
            }
        }
    });   
};
exports.getCatsNotAdded =function(cb){
    var gs1cats= dbConn.collection("gs1cats");
    gs1cats.find({$or:[{flag:{$exists:false}},{flag:false}]}).toArray(function(err,res){
        if(!err){
            cb(null,res);
        }
        else{
            cb(err,null);
        }
    });
};

exports.getUniqueCatId=function(cb){
    var IDs = dbConn.collection("IDs");
    var query = {},
        sort = [];
    var options = {
        new: true,
        upsert: true
    };
    var update = {
        $inc: {
            last_cat_id: 1
        }
    };

    IDs.findAndModify(query,sort,update,options,function (err,res) {
         if(!err){
            cb(null,res.value.last_cat_id);
            return;
         }
         console.log(err);
    });
};
exports.setGS1CatFlag=function(cid,cb){
    var gs1cats=dbConn.collection("gs1cats");
    gs1cats.update({id:cid},{$set:{flag:true}},function(err,res){
        if(!err){
            cb(null,"Flag value set");
        }
        else{
            console.log(err);
        }
    });
};

exports.subcatsNotAdded=function(cb){
    var gs1subcats= dbConn.collection("gs1subcats");
    gs1subcats.find({$or:[{flag:{$exists:false}},{flag:false}]}).toArray(function(err,res){
        if(!err){
            cb(null,res);
        }
        else{
            cb(err,null);
        }
    });

};

exports.setGS1SubCatFlag=function (cid,cb) {
    var gs1subcats=dbConn.collection("gs1subcats");
    gs1subcats.update({id:cid},{$set:{flag:true}},function(err,res){
        if(!err){
            cb(null,"Flag value set");
        }
        else{
            console.log(err);
        }
    });    
};

exports.getCompaniesNotAdded =function(cb){
    var gs1companies = dbConn.collection('gs1companies');
    gs1companies.find({$or:[{flag:{$exists:false}},{flag:false}]}).toArray(function(err,res){
        if(!err){
            cb(null,res);
        }
        else{
            console.log(err);
        }
    });
};

exports.checkIfExitsCompany = function (company,cb) {
    var companies= dbConn.collection("companies");
    companies.find({name:company.name,gcp:company.gcp}).toArray(function(err,res){
        if(!err){
            if(res.length==0){
                cb(null,false);
            }
            else{
                cb(null,true);
            }
        }
        else
        console.log(err);
    });
};

exports.getUniqueCompanyId = function(cb){
    var IDs= dbConn.collection("IDs");
    var query = {},
        sort = [];
    var options = {
        new: true,
        upsert: true
    };
    var update = {
        $inc: {
            last_company_id: 1
        }
    };

    IDs.findAndModify(query,sort,update,options,function (err,res) {
         if(!err){
            cb(null,res.value.last_company_id);
            return;
         }
         console.log(err);
    });
};

exports.setCompanyFlag = function(compid,cb){
    var gs1companies = dbConn.collection('gs1companies');
    gs1companies.update({_id:compid},{$set:{flag:true}},function(err,res){
        if(!err){
            cb(null,res);
        }
        else{
            console.log(err);
        }
    });
};

exports.addCompanyToDb = function(company,cb){
    var companies = dbConn.collection("companies");
    companies.insert(company,function(err,res){
        if(!err){
            cb(null,"Company Added with id "+company._id);
        }
        else{
            console.log(err);
        }
    })
};

exports.getCompanyId = function(gcp,cname,cb){
    var companies = dbConn.collection("companies");
    companies.find({$or:[{gcp:gcp},{name:cname}]}).toArray(function(err,res){
        if(!err){
            cb(null,res[0]._id);
        }
        else{
            console.log(err);
        }
    });
}; 

exports.getProductsNotAdded = function(cb){
    var gs1data = dbConn.collection("gs1data");
    gs1data.find({flag:{$exists:false}}).toArray(function(err,res){
        if(!err){
            console.log(res.length);
            cb(null,res);
            return;
        }
        else{
            console.log(err);
        }
    });
};

exports.getUniquePdtId = function(cb){
    var IDs = dbConn.collection("IDs");
    var query = {},
        sort = [];
    var options = {
        new: true,
        upsert: true
    };
    var update = {
        $inc: {
            last_pdt_id: 1
        }
    };

    IDs.findAndModify(query,sort,update,options,function (err,res) {
         if(!err){
            cb(null,res.value.last_pdt_id);
            return;
         }
         console.log(err);
    });

};


/////functions related to cart///
exports.addToCart = function(userId, pid, current_city, cb) {
    console.log("Inside server model");
    var cart = {};
    var users = dbConn.collection('users');
    var products = dbConn.collection('products');
    var cities = dbConn.collection('cities');
    async.waterfall([
        //functions to be executed in order
        function(callback) {
            //find the user with the user id
            var users = dbConn.collection('users');
            users.findOne({
                _id: userId,
                cart: {
                    $exists: true
                }
            }, function(err, res) {
                if (!err) {
                    callback(null, res);
                }
            });
        }

        ,
        function(user, callback) {
            if (user != undefined) {
                //cart field exits
                var flag = 0,
                    price = 0;
                user.cart.products.forEach(function(product) {
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
                users.update({
                    _id: userId
                }, {
                    $set: {
                        'cart': cart
                    }
                }, function(err, res) {
                    if (!err) {
                        callback(null, 0, null);
                        return;
                    } else {
                        console.log(err);
                    }
                });
            }
        }

        ,
        function(flag, price) {
            if (flag === 1) {
                users.update({
                    _id: userId,
                    'cart.products.pid': pid
                }, {
                    $inc: {
                        'cart.products.$.count': 1,
                        'cart.estimated_cost': parseInt(price)
                    }
                }, function(err, res) {
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
                cities.findOne({
                    city: current_city
                }, function(err, res) {
                    if (!err) {
                        var city_id = res._id;
                        products.findOne({
                            _id: pid,
                            'price.mrp.city': city_id
                        }, {
                            'price.mrp.$': 1,
                            'pname': 1
                        }, function(err, res) {
                            if (!err) {
                                if (res !== null) {
                                    prod.name = res.pname;
                                    prod.price = res.price.mrp[0].mrp;
                                    //add this product to the database now
                                    prod.count = 1;
                                    users.update({
                                        _id: userId
                                    }, {
                                        $push: {
                                            'cart.products': prod
                                        },
                                        $inc: {
                                            'cart.estimated_cost': parseInt(prod.price)
                                        }
                                    }, function(err, res) {
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
    ], function(err, res) {
        if (!err) {
            console.log('All the functions executed properly');
        }
    });
};
exports.removeFromCart = function(userId, pid, cb) {
    //decrement count of the product from cart
    var users = dbConn.collection('users');
    var products = dbConn.collection('products');
    users.findOne({
        _id: userId,
        'cart.products.pid': pid
    }, {
        'cart.products': 1
    }, function(err, res) {
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
                }, function(err, res) {
                    if (!err) {
                        cb('Product Count decremented');
                        return;
                    } else {
                        console.log(err);
                        return;
                    }
                });
            } else {
                users.update({
                    _id: userId
                }, {
                    $pull: {
                        'cart.products': {
                            'pid': pid
                        }
                    },
                    $inc: {
                        'cart.estimated_cost': -parseInt(price)
                    }
                }, function(err, res) {
                    if (!err) {
                        if (total_prod === 1) {
                            users.update({
                                _id: userId
                            }, {
                                $unset: {
                                    cart: true
                                }
                            }, function(err, res) {
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
exports.checkOut = function(userId, params, cb) {
    //read the last order id used from IDs collection
    var IDs = dbConn.collection('IDs');
    var orders = dbConn.collection('orders');
    var users = dbConn.collection('users');
    async.waterfall([

        function(callback) {
            IDs.findOne({}, function(err, res) {
                if (!err) {
                    callback(null, res.last_order_id);
                    return;
                } else {
                    console.log(err);
                    return;
                }
            });
        }

        ,
        function(last_order_id, callback) {
            if (last_order_id !== null) {
                users.findOne({
                    _id: userId
                }, function(err, res) {
                    if (!err) {
                        callback(null, last_order_id, res);
                        return;
                    } else {
                        console.log(err);
                        return;
                    }
                });
            }
        }

        ,
        function(last_order_id, user, callback) {
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
                order.order_mode = params.order_mode;
                if (order.order_mode == 0) {
                    order.max_walk_distance = params.max_walk_distance;
                }
                var current_date = new Date();
                //get month, year and day and concatenate
                var day = '' + current_date.getDate();
                var month = '' + (current_date.getMonth() + 1);
                var year = current_date.getFullYear();
                if (day.length < 2) {
                    day = "0" + day;
                }
                if (month.length < 2) {
                    month = "0" + month;
                }
                current_date = year + "-" + month + "-" + day;
                order.order_date= current_date;

                //write this to order collection
                orders.insert(order, function(err, res) {
                    if (!err) {
                        //update last order_id
                        IDs.update({}, {
                            $set: {
                                'last_order_id': last_order_id
                            }
                        }, function(err, res) {
                            if (!err) {
                                //update the user collection to contain that order id
                                callback(null, order._id);
                                return;
                            } else {
                                console.log(err);
                                return;
                            }
                        });
                    }
                });
            }
        }

        ,
        function(current_order, callback) {
            if (current_order !== null) {
                users.update({
                    _id: userId
                }, {
                    $push: {
                        orderIDs: current_order
                    },
                    $unset: {
                        cart: true
                    }
                }, function(err, res) {
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
    ], function(err, result) {
        if (!err) {
            console.log('All functions are executed');
            return;
        }
    });
};
exports.fetchCart = function(userId, cb) {
    console.log("FInding cart for user " + userId);
    var users = dbConn.collection('users');
    users.findOne({
        _id: parseInt(userId)
    }, function(err, res) {
        if (!err) {
            console.log(res);
            console.log(res.cart + " " + userId);
            if (res.cart != undefined && res.cart.products.length != 0) {
                console.log("Sending cart for user " + userId + " where count = " + res.cart.products[0].count);
                cb(res.cart);
                return;
            } else {
                console.log("Sending null Cart ");
                cb(null);
                return;
            }
        } else {
            console.log(err);
        }
    });
};
exports.removeProductDirectly = function(userId, pid, cb) {
    var users = dbConn.collection("users");
    users.findOne({
            _id: userId,
            "cart.products.pid": pid
        }, {
            "cart.products": 1
        },
        function(err, res) {
            if (!err) {
                if (res == null) {
                    cb("Such Product Does not exist");
                    return;
                } else {
                    var price, count, total_prod = res.cart.products.length;
                    for (var i = 0; i < total_prod; i++) {
                        if (res.cart.products[i].pid === pid) {
                            price = res.cart.products[i].price;
                            count = res.cart.products[i].count;
                            break;
                        }
                    }
                    users.update({
                            _id: userId,
                            "cart.products.pid": pid
                        }, {
                            $inc: {
                                'cart.estimated_cost': -count * parseInt(price)
                            },
                            $pull: {
                                "cart.products": {
                                    "pid": pid
                                }
                            }
                        },
                        function(err, res) {
                            if (!err) {
                                cb("Product Removed From CArt");
                                return;
                            } else {
                                console.log(err);
                            }
                        }
                    );

                }
            }
        });
}
////////////functions for finding best vendor////
exports.getUnProcessedOrders = function(cb) {
    //finds all the orders that are yet to be processed
    var orders = dbConn.collection('orders');
    orders.find({
        processing_status: 0
    }).toArray(function(err, res) {
        if (!err) {
            cb(null, res);
        } else {
            console.log(err);
        }
    });
};
exports.findCustomerById = function(cid, cb) {
    var users = dbConn.collection('users');
    users.findOne({
        _id: cid
    }, function(err, res) {
        if (!err) {
            cb(null, res);
        } else {
            console.log(err);
        }
    });
};
exports.getPickUpVendors = function(loc, items, maxdist, cb) {
    var vendors = dbConn.collection('vendors');
    vendors.aggregate([{
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: loc
                },
                distanceField: 'distance',
                maxDistance: maxdist,
                spherical: true
            }
        }

        , {
            $match: {
                'products.pid': {
                    $all: items
                }
            }
        }

        , {
            $sort: {
                distance: 1
            }
        }
    ], function(err, res) {
        if (!err) {
            cb(null, res);
        } else {
            console.log(err);
        }
    });
};
exports.getHomeDelVen = function(loc, items, cb) {
    var vendors = dbConn.collection('vendors');
    vendors.aggregate([{
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: loc
                },
                distanceField: 'distance',
                maxDistance: 3000,
                query: {
                    delivery_mode: 1
                },
                spherical: true
            }
        }

        , {
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
                        '$distance'

                        , '$serving_radius'
                    ]
                }
            }
        }

        , {
            $match: {
                $and: [{
                        'products.pid': {
                            $all: items
                        }
                    }

                    , {
                        'cmpval': -1
                    }
                ]
            }
        }

        , {
            $sort: {
                distance: 1
            }
        }
    ], function(err, res) {
        if (!err) {
            cb(null, res);
        } else {
            console.log(err);
        }
    });
};

exports.getProductDetails = function(pid, cb) {
    var products = dbConn.collection("products");
    products.findOne({
        _id: pid
    }, function(err, res) {
        if (!err) {
            cb(res);
            return;
        } else
            console.log(err);
    });
};

////functions for recommendation engine
exports.computeRFM = function(current_date, compare_date, cb) {
    var orders = dbConn.collection("orders");
    var rfm = dbConn.collection("rfm");
    console.log(current_date + "  " + compare_date)
    orders.aggregate([{
        $match: {
            "order_date": {
                $gte: compare_date,
                $lte: current_date
            }
        }
    }, {
        $project: {
            "user_id": "$ordered_by",
            "estimated_cost": 1,
            "order_date": 1
        }
    }, {
        $group: {
            _id: "$user_id",
            "recent_date": {
                $max: "$order_date"
            },
            "frequency": {
                $sum: 1
            },
            "monetary": {
                $sum: "$estimated_cost"
            }
        }
    }, {
        $sort: {
            "_id": 1
        }
    }]).toArray(function(err, res) {
        if (!err) {
            //go through each entry and normalize the R F and M
            //find maximum values of frequency and money
            var max_monetary = res[0].monetary;
            var max_frequency = res[0].frequency;
            var max_recency = 30;

            for (var i = 0; i < res.length; i++) {
                if (max_monetary < res[i].monetary) {
                    max_monetary = res[i].monetary;
                }
                if (max_frequency < res[i].frequency) {
                    max_frequency = res[i].frequency;
                }
            }

            //convert recent_date to recency by subtracting it from current_date 
            var normalized_r, normalized_f, normalized_m;
            for (var i = 0; i < res.length; i++) {

                //get the difference between the dates
                var recent_date = res[i].recent_date.split('-');
                var rdate = new Date(recent_date[0], recent_date[1] - 1, recent_date[2]);
                recent_date = current_date.split('-');
                var cdate = new Date(recent_date[0], recent_date[1] - 1, recent_date[2]);
                var time_diff = Math.abs(cdate.getTime() - rdate.getTime());
                var recency = Math.floor(time_diff / (1000 * 24 * 3600));

                //normalize each value
                normalized_f = ((res[i].frequency) / (max_frequency)) * (4) + 1; //normalize from 1-5
                normalized_f = Math.round(normalized_f);

                normalized_m = ((res[i].monetary) / (max_monetary)) * (4) + 1;
                normalized_m = Math.round(normalized_m);

                normalized_r = 6 - Math.round(((recency / max_recency) * 4 + 1)); // takes value from 1-5

                //construct an object to represent the r f and m score
                var rfm_score = {};
                rfm_score._id = res[i]._id;
                rfm_score.recency = normalized_r;
                rfm_score.frequency = normalized_f;
                rfm_score.monetary = normalized_m;

                //write this object to RFM collection
                rfm.update({
                    _id: rfm_score._id
                }, rfm_score, {
                    upsert: true
                }, function(err, result) {
                    if (!err) {
                        console.log("RFM for user computed ");
                    }
                });

            }

        } else {
            console.log(err);
        }
    });
};

////user related function
exports.getUniqueUserId = function(cb) {
    var IDs = dbConn.collection("IDs");
    var query = {},
        sort = [];
    var options = {
        new: true,
        upsert: true
    };
    var update = {
        $inc: {
            last_user_id: 1
        }
    }

    IDs.findAndModify(query, sort, update, options, function(err, doc) {
        if (!err) {
            //console.log(doc.value.last_user_id);
            cb(doc.value.last_user_id);
            return;
        } else {
            console.log(err);
        }
    });
}

exports.decrementUserId = function(cb) {
    var IDs = dbConn.collection("IDs");
    var query = {},
        sort = [];
    var options = {
        new: true,
        upsert: true
    };
    var update = {
        $inc: {
            last_user_id: -1
        }
    }

    IDs.findAndModify(query, sort, update, options, function(err, doc) {
        if (!err) {
            //console.log(doc.value.last_user_id +" Hello Nihal");
            cb()
            return;
        } else {
            console.log(err);
        }
    });
};

///////vendor function
exports.addToInStock = function(vid,pid,city,cb){
    var vendors=dbConn.collection("vendors");
    var cities= dbConn.collection("cities");
    var products = dbConn.collection("products");

    var product={};
    product.pid=pid;

    cities.findOne({"city":city},function(err,res){
        if(!err){
            if(res!=null){
                var city_id = res._id;
                products.findOne({_id:pid,"price.mrp.city":city_id},{"price.mrp.$":1},function(err,res){
                    if(!err){
                        product.myPrice=res.price.mrp[0].mrp;
                        vendors.update({_id:vid},{$push:{"products":product}},{upsert:true},function(err,res){
                            if(!err){
                                cb("Product Added to Vendor Collection");
                            }
                            else{
                                console.log(err);
                            }
                        });
                    }
                });
            }
            else{
                console.log('price from default');
                products.findOne({_id:pid},function(err,res){
                    if(!err){
                        product.myPrice=res.price.default_mrp;
                        vendors.update({_id:vid},{$push:{"products":product}},{upsert:true},function(err,res){
                            if(!err){
                                cb("Product Added to Vendor Collection");
                            }
                            else{
                                console.log(err);
                            }
                        });
                    }
                });
            }
        }
        else{
            console.log(err);
        }
    });
};

exports.removeFromStock = function(vid,pid,cb){
    var vendors= dbConn.collection("vendors");
    vendors.findOne({_id:vid,"products.pid":pid},function(err,res){
        if(!err){
            if(res==null || res==undefined){
                cb("The product is not in stock");
                return;
            }
            else{
                //find the index at which the product exist
                var flag=false;
                var count=res.products.length;
                for(var i=0;i<count;i++){
                    if(res.products[i].pid==pid){
                        flag=true;
                        break;
                    }
                }
                if(flag){
                    vendors.update({_id:vid},{$pull:{"products":{"pid":pid}}},function(err,res){
                        if(!err){
                            cb("Products Removed From cart");
                            return;
                        }
                        else{
                            console.log(err);
                        }
                    });
                }
            }
        }
        else{
            console.log(err);
        }
    });

};
exports.getInStockProducts = function (vid,cb) {
    var vendors= dbConn.collection("vendors");
    vendors.findOne({_id:vid},{"products.pid":1},function(err,res){
        if(!err){
            var products=[];
            if(res==undefined){
                cb(products);
            }
            else{
                for(var i=0;i<res["products"].length;i++){
                products.push(res["products"][i].pid);
                }           
                cb(products.sort(function(a, b){return a-b}));
            }
        }
    }); 
}

/////////////////////////////////
exports.saveAddress = function(userID,address,cb){
    var users = dbConn.collection("users");
    users.update({_id:userID},{$set:{"address":address}},function(err,res){
        if(!err){
            cb(true);
            return;
        }
        else{
            console.log(err);
            cb(false);
            return;
        }
    });
};
/////////////////////////////////////////
exports.getClusterRecommendations=function(cb){
    var recommendations = dbConn.collection("recommendations");
    recommendations.findOne({},{_id:0,cluster0:1},function(err,res){
        if(!err){
            cb(res.cluster0);
        }
        else{
            console.log(err);
        }
    });    
}

/////////////////////////////////////////
exports.getUserRecommendations = function (cb) {
    var recommendations = dbConn.collection("recommendations");
    recommendations.findOne({},{_id:0,user:1},function(err,res){
        if(!err){
            cb(res.user);
        }
        else{
            console.log(err);
        }
    });   
}