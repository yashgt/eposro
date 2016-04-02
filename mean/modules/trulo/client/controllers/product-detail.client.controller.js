'use strict';

angular.module('trulo').controller('ProductDetailController', ['$scope', '$stateParams','Trulo','Mycart',
  function ($scope,$stateParams,trulo,myCart) {
      $scope._id = $stateParams._id;
      console.log("Received details req for "+$stateParams._id);
      //$scope.productCount = myCart.getCount($scope.product);;
      
      trulo.getProductById($scope._id, function(productResponse){
          $scope.product = productResponse;
          $scope.productCount = myCart.getCount($scope.product);
          $scope.quantity = $scope.productCount;
      });
      $scope.add = function(){
        $scope.productCount++;
      }
      
      $scope.subtract = function () {
        if ($scope.productCount <= 0) {
            $scope.productCount = 0;
                return;
        }
        $scope.productCount--;
      }
      $scope.addToCart = function(){
          if( $scope.quantity< $scope.productCount){
              console.log("Add to cart");
              for(var i=0; i<$scope.productCount-$scope.quantity; i++){
                myCart.addToCart($scope.product);
              }
              $scope.quantity = $scope.productCount;
          }
          else if($scope.quantity> $scope.productCount){
              console.log("Remove from cart");
              for(var i=0; i<$scope.quantity-$scope.productCount ; i++){
                myCart.removeFromCart($scope.product);
              }
              $scope.quantity = $scope.productCount;
          }
      }  
  }
]);
