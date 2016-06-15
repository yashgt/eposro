'use strict';
angular.module('trulo').factory('Trulo', [
  '$http'
  , function ($http) {
        return {
          
            getFacets : function(catID, level, cb){
                console.log("In service getting facets");
                $http.get('/api/facets?catID='+catID+'&level='+level).success(function(response){
                    cb(response);
                });
            }
            , getBrands : function(catID, level, cb){
                //console.log("In service getting brands");
                $http.get('/api/brands?catID='+catID+'&level='+level).success(function(response){
                    cb(response);
                });
            }
            ,searchProduct : function(pname, lastPage,cb){
                console.log("In service searching for "+pname);
                var promise = $http.get('/api/search?name='+pname+"&page="+lastPage).success(function(response){
                    //console.log("Received response for search");
                    //search.setSearchResult(response);
                    console.log("In promise..");
                    console.log(response);
                    if( lastPage != 0)
                        cb(response);
                    else
                        return response;
                });
                return promise;
            }
        
            ,getCategories: function (parent,cb) {
                //console.log("Inside service to get categories of parent = "+parent);
                $http.get('/api/categories?catID='+parent).success(function (response) {
                    var categories = response;
                    cb(categories);
                });
            }
            , getProductsByCat: function (catID, lastPage, level, products, brand, cb) {
                
                $http.get('/api/products?catID=' + catID + '&lastPage=' + lastPage +'&level=' + level+"&brand="+brand)
                    .success(function (response) {
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


            , addToCart: function (pdtID,cb) {
                var data = {
                    'pdtID': pdtID
                    , 'city': 'goa'
                };
                console.log("add:Sending data with id="+data['pdtID']);
                $http.post('/api/addToCart', data).success(function (response){
                    cb(response);
                });
            }
            , removeFromCart: function (pdtID,cb) {
                var data = {
                    'pdtID': pdtID
                    , 'city': 'goa'
                };
                //console.log("Remove:Sending data with id="+data['pdtID']);
                $http.post('/api/removeFromCart', data).success(function (response) {
                     if(response!=null){
                        cb(response)
                    }
                });
            }
            , fetchCart: function (cb) {
                $http.get('/api/cart').success(function (res) {
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
            ,placeOrder:function (params,cb) {
                //console.log("Placing order for ="+data['userID']);
                var data={
                    params:params
                };
                $http.post('/api/placeOrder',data).success(function (response) {
                    //console.log('Returned in cb in place order'+response);
                    cb('Successfully placed order');
                });
                 
            }
            ,removeProductDirectly:function(pdt,cb){
                var data={
                    'pdtID':pdt
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
            ,getRecommendations: function(cb){
               $http.get('/api/getRecommendations').success(function(recommendations){
                    cb(recommendations);
                });
            }
            ,saveAddress:function (address,cb) {

                var data={
                    'address':address
                };
                //console.log("Saving address for ="+data['adddress'].location);
                $http.post('/api/users/saveAddress', data).success(function (response) {
                    //console.log('Returned in cb in save Address'+response);
                    cb(response);
                });
                 
            }
        };
  }
]);