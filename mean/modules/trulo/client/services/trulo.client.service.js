'use strict';
angular.module('trulo').factory('Trulo', [
  '$http'
  , function ($http) {
        return {
            //generalize this for getting sub-categories as well
            getCategories: function (parent,cb) {
                console.log("Inside service to get categories of parent = "+parent);
                $http.get('/api/categories?catID='+parent).success(function (response) {
                    var categories = response;
                    var lastPageLoaded = [];
                    var products = [];
                    //initialize last page loaded and products array here
                    for (var i = 0; i < response.length; i++) {
                        lastPageLoaded[response[i].catID] = 0;
                        products[i] = {
                            catID: response[i].catID
                            , pdt: []
                        };
                    }
                    cb(categories, lastPageLoaded, products);
                });
            }
            , getProductsByCat: function (catID, lastPage, products, cb) {
                console.log("sending catID=" + catID);
                console.log(products[1].pdt);
                $http.get('/api/products?catID=' + catID + '&lastPage=' + lastPage).success(function (response) {
                    lastPage++;
                    //find the index into the products array where products of this category are found
                    for (var j = 0; j < products.length; j++) {
                        if (products[j].catID === catID) {
                            break;
                        }
                    }
                    for (var i = 0; i < response.length; i++) {
                        products[j].pdt.push(response[i]);
                    }
                    var productsOfCurrentCat = products[j].pdt;
                    var busy = false;
                    cb(productsOfCurrentCat, lastPage, busy); //$scope.productsOfCurrentCat = products[j].pdt;
                    //$scope.busy = false;
                });
            }


            , addToCart: function (pdtID,cb) {
                var data = {
                    'pdtID': pdtID
                    , 'userID': 3
                    , 'city': 'goa'
                };
                console.log("add:Sending data with id="+data['pdtID']);
                $http.post('/api/addToCart', data).success(function (response){
                    if(response!=null){
                        cb(response)
                    }
                });
            }
            , removeFromCart: function (pdtID,cb) {
                var data = {
                    'pdtID': pdtID
                    , 'userID': 3
                    , 'city': 'goa'
                };
                console.log("Remove:Sending data with id="+data['pdtID']);
                $http.post('/api/removeFromCart', data).success(function (response) {
                     if(response!=null){
                        cb(response)
                    }
                });
            }
            , fetchCart: function (userID, cb) {
                var data = {
                    'userID': userID
                };
                $http.post('/api/cart', data).success(function (res) {
                    console.log("Response received in trulo service as "+res);
                    //console.log('In epsvc cart:' + res.products[0].count);
                    if (res == 'null') {
                        console.log('Sending res null in epsvc');
                        cb(null);
                    } 
                    else {
                        console.log('Sending some res in epsvc as '+res);
                        cb(res);
                    }
                });
            }
            , getProductById: function(id, cb){
                $http.get('/api/product-detail?id='+id).success(function(product){
                    cb(product);
                });
            }
            ,placeOrder:function (uid,cb) {
                var data={
                    'userID':uid
                };
                console.log("Placing order for ="+data['userID']);
                $http.post('/api/placeOrder', data).success(function (response) {
                    console.log('Returned in cb in place order'+response);
                    cb('Successfully placed order');
                });
                 
            }
            ,removeProductDirectly:function(pdt,cb){
                var data={
                    'pdtID':pdt
                    ,'userID':3
                    ,'city':'goa'
                };
                console.log("Remove Product:Sending data with id="+data['pdtID']);
                $http.post('/api/removeProductDirectly', data).success(function (response) {
                    console.log('Returned in cb');
                     if(response!=null){
                        cb(response)
                    }
                });
            }
        };
  }
]);