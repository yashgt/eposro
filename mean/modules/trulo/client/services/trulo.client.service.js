'use strict';
angular.module('trulo').factory('Trulo', [
  '$http'
  , function ($http) {
        return {
            
            searchProduct : function(pname, cb){
                $http.get('/api/search?name='+pname).success(function(response){
                    console.log("Received response for search");
                    console.log(response);
                    cb(response);
                });
            }
        
            ,getCategories: function (parent,cb) {
                //console.log("Inside service to get categories of parent = "+parent);
                $http.get('/api/categories?catID='+parent).success(function (response) {
                    var categories = response;
                    cb(categories);
                });
            }
            , getProductsByCat: function (catID, lastPage, products, cb) {
                //console.log("Fetching prod for catID=" + catID + ", page = "+lastPage);
                //var productsOfCurrentCat = [];
                $http.get('/api/products?catID=' + catID + '&lastPage=' + lastPage).success(function (response) {
                    lastPage++;
                    //var productsOfCurrentCat = [];
                    if( response.length == 0){
                        console.log("No more data folks!");
                        cb(null, lastPage, busy);
                    }
                    for (var i = 0; i < response.length; i++) {
                        products[catID].push(response[i]);
                        //productsOfCurrentCat.push(response[i]);
                    }
                    //var productsOfCurrentCat = products[catID];
                    var busy = false;
                    cb(products, lastPage, busy); 
                    //$scope.busy = false;
                });
            }


            , addToCart: function (pdtID) {
                var data = {
                    'pdtID': pdtID
                    , 'userID': 3
                    , 'city': 'goa'
                };
                //console.log("add:Sending data with id="+data['pdtID']);
                $http.post('/api/addToCart', data).success(function (response){
                    if(response!=null){
                        //cb(response);
                    }
                });
            }
            , removeFromCart: function (pdtID) {
                var data = {
                    'pdtID': pdtID
                    , 'userID': 3
                    , 'city': 'goa'
                };
                //console.log("Remove:Sending data with id="+data['pdtID']);
                $http.post('/api/removeFromCart', data).success(function (response) {
                     if(response!=null){
                        //cb(response)
                    }
                });
            }
            , fetchCart: function (userID, cb) {
                var data = {
                    'userID': userID
                };
                $http.get('/api/cart?userID=3').success(function (res) {
                    //console.log("Response received in trulo service as "+res);
                    //console.log('In epsvc cart:' + res.products[0].count);
                    if (res == 'null') {
                        //console.log('Sending res null in epsvc');
                        cb(null);
                    } 
                    else {
                        //console.log('Sending some res in epsvc as '+res);
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
                //console.log("Placing order for ="+data['userID']);
                $http.post('/api/placeOrder', data).success(function (response) {
                    //console.log('Returned in cb in place order'+response);
                    cb('Successfully placed order');
                });
                 
            }
            ,removeProductDirectly:function(pdt,cb){
                var data={
                    'pdtID':pdt
                    ,'userID':3
                    ,'city':'goa'
                };
                //console.log("Remove Product:Sending data with id="+data['pdtID']);
                $http.post('/api/removeProductDirectly', data).success(function (response) {
                    //console.log('Returned in cb');
                     if(response!=null){
                        cb(response)
                    }
                });
            }
            ,saveAddress:function (uid,cb) {
                var data={
                    'userID':uid
                };
                //console.log("Saving address for ="+data['userID']);
                $http.post('/api/saveAddress', data).success(function (response) {
                    //console.log('Returned in cb in save Address'+response);
                    cb('Successfully saved Address');
                });
                 
            }
        };
  }
]);