'use strict';

angular.module('trulo').controller('ProductDetailController', ['$scope', '$stateParams','Trulo','Mycart',
  function ($scope,$stateParams,trulo,myCart) {
      $scope._id = $stateParams._id;
      console.log("Received details req for "+$stateParams._id);
      $scope.quantity = 0;
      
      trulo.getProductById($scope._id, function(productResponse){
          $scope.product = productResponse;
          $scope.quantity = myCart.getCount($scope.product);
          $scope.count = $scope.quantity;
          console.log("Product received is "+$scope.product.name);
      });
      /*$scope.add = function(){
          $scope.quantity++;
          myCart.addToCart($scope.product);
      }
      $scope.remove = function(){
          if( $scope.quantity <=0)
              return;
          $scope.quantity--;
          myCart.removeFromCart($scope.product);
      }
      $scope.addToCart = function(){
          //TODO add product to cart
          myCart.addToCart();
      };*/
      
      $scope.updateCart = function(count){
        console.log("In updateCart, count = "+count);
        if( count == null)
            return;
        if( count < $scope.quantity){
            myCart.removeFromCart($scope.product);
            console.log("Call remove from cart");
        }  
        else if( count > $scope.quantity){
            myCart.addToCart($scope.product);
            console.log("Call add to cart");
        }
        $scope.quantity = count;
      }
  }
]);
