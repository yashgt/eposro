'use strict';

angular.module('trulo').controller('CartController', ['$scope','Trulo','Mycart',
  function ($scope,trulo,myCart) {
      console.log("In CartController");
      $scope.cart = myCart.fetchCart(3,function(cartResponse){
          $scope.cart = cartResponse;
          console.log($scope.cart.products);
      })
  }
]);
