'use strict';

//Setting up route
angular.module('trulo')
    
    .config(['$stateProvider', '$urlRouterProvider',

  function ($stateProvider, $urlRouterProvider) {
            // Trulo state routing
        $stateProvider
            .state('browse', {
                    url: '/'
                    , templateUrl: 'modules/trulo/client/views/browse.client.view.html'
                })
           
            .state('search', {
                url: '/search?query'
                , templateUrl: 'modules/trulo/client/views/search.client.view.html'
                , controller: 'SearchController'
                , resolve: {
                    products : function($stateParams,Trulo){
                        //console.log("In resolve query:"+$stateParams.query);
                        var pro = Trulo.searchProduct($stateParams.query,0); 
                        //console.log("pro = ");
                        //console.log(pro);
                        return pro;
                    }
                }
            })

            .state('merchant', {
                url: '/merchant'
                , templateUrl: 'modules/trulo/client/views/browse.client.view.html'
            })

            .state('products', {
                url: '/product/:_id'
                , controller: "ProductDetailController"
                , templateUrl: 'modules/trulo/client/views/consumer-product.html'
            })

            .state('profile', {
                url: '/profile'
                , templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
            })

            .state('cart', {
                    url: '/cart'
                    , templateUrl: 'modules/trulo/client/views/cart.html'
                })
                .state('orders', {
                    url: '/orders'
                    , templateUrl: 'modules/trulo/client/views/orders.html'
                })

            .state('myshop', {
                url: '/myshop'
                , templateUrl: 'modules/trulo/client/views/myshop.html'
            });
  }
]);