'use strict';

//Setting up route
angular.module('trulo')
    
    .config(['$stateProvider', '$urlRouterProvider',

  function ($stateProvider, $urlRouterProvider) {
        /*$breadcrumbProvider.setOptions({
            prefixStateName: 'Browse',
            template: 'bootstrap2'
        });*/    
        // Trulo state routing
        $stateProvider
            .state('browse', {
                    url: '/'
                    , templateUrl: 'modules/trulo/client/views/browse.client.view.html'
                    , ncyBreadcrumb: {
                        label: 'Browse' // angular-breadcrumb's configuration
                    }
                })  
           
            .state('search', {
                url: '/search?query'
                , templateUrl: 'modules/trulo/client/views/search.client.view.html'
                , controller: 'SearchController'
                , resolve: {
                    products : function($stateParams,Trulo){
                        var pro = Trulo.searchProduct($stateParams.query,0); 
                        return pro;
                    }
                }
                ,ncyBreadcrumb: {
                    label:  '{{searchString}}'// angular-breadcrumb's configuration
                    ,parent: 'browse'
                }
            })

            .state('merchant', {
                url: '/merchant'
                , templateUrl: 'modules/trulo/client/views/browse.client.view.html'
                , ncyBreadcrumb: {
                    label: 'Merchant' // angular-breadcrumb's configuration
                }
            })

            .state('products', {
                url: '/product/:_id'
                , controller: "ProductDetailController"
                , templateUrl: 'modules/trulo/client/views/consumer-product.html'
                , ncyBreadcrumb: {
                    label: '{{product.pname}}' // angular-breadcrumb's configuration
                    ,parent: 'browse'
                } 
            })

            .state('profile', {
                url: '/profile'
                , templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
                , ncyBreadcrumb: {
                    label: 'Profile' // angular-breadcrumb's configuration
                }
            })

            .state('cart', {
                url: '/cart'
                , templateUrl: 'modules/trulo/client/views/cart.html'
                , ncyBreadcrumb: {
                    label: 'Cart' // angular-breadcrumb's configuration
                    ,parent: 'browse'
                }    
            })
            .state('orders', {
                    url: '/orders'
                    , templateUrl: 'modules/trulo/client/views/orders.html'
                    , ncyBreadcrumb: {
                        label: 'Orders' // angular-breadcrumb's configuration
                        ,parent: 'browse' 
                    }
            })

            .state('myshop', {
                url: '/myshop'
                , templateUrl: 'modules/trulo/client/views/myshop.html'
                , ncyBreadcrumb: {
                    label: 'My shop' // angular-breadcrumb's configuration
                }
            });
  }
]);