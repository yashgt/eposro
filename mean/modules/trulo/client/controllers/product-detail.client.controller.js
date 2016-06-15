'use strict';

angular.module('trulo').controller('ProductDetailController', ['$scope', '$stateParams','Trulo','Mycart',
  function ($scope,$stateParams,trulo,myCart) {
      $scope._id = $stateParams._id;
      //console.log("Received details req for "+$stateParams._id);
      //$scope.productCount = myCart.getCount($scope.product);;
      
      trulo.getProductById($scope._id, function(productResponse){
          $scope.product = productResponse;
          //console.log("Showing "+$scope.product.img.front);
          console.log($scope.product);
          $scope.productCount = myCart.getCount($scope.product);
          $scope.quantity = $scope.productCount;
      });
      $scope.add = function(){
        $scope.productCount++;
          myCart.addToCart($scope.product,function(res){
              //console.log("Added to cart");
          });
      }
      
      $scope.subtract = function () {
        if ($scope.productCount <= 0) {
            $scope.productCount = 0;
                return;
        }
        $scope.productCount--;
        myCart.removeFromCart($scope.product,function(res){
            //console.log("Removed from cart");
        });
      }
  }
]);
