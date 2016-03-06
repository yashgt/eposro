'use strict';

//Setting up route
angular.module('trulo').config(['$stateProvider', '$urlRouterProvider',

  function($stateProvider,$urlRouterProvider) {
    // Trulo state routing
    $stateProvider
      .state('browse', {
        url: '/',
        templateUrl: 'modules/trulo/client/views/browse.client.view.html'
      })
      
      .state('search',{
          url:'/search',
          templateUrl:'modules/trulo/client/views/search.client.view.html'
      })
      
      .state('merchant',{
          url:'/merchant',
          templateUrl:'modules/trulo/client/views/browse.client.view.html'
      })
      
      .state('products',{
          url:'/product',
          templateUrl:'modules/trulo/client/views/consumer-product.html'
      })
      
      .state('profile',{
          url:'/profile',
          templateUrl:'modules/trulo/client/views/profile.html'
      })
      
      .state('cart',{
          url:'/cart',
          templateUrl:'modules/trulo/client/views/cart.html'
      })
      .state('orders',{
          url:'/orders',
          templateUrl:'modules/trulo/client/views/orders.html'
      })
      
      .state('myshop',{
          url:'/myshop',
          templateUrl:'modules/trulo/client/views/myshop.html'
      });
  }
]);
