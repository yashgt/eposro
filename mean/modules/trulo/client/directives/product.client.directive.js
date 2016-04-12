'use strict';

angular.module('trulo').directive('product', ['Mycart',
  function (myCart) {
        return {
            templateUrl: 'modules/trulo/client/views/productdirective.html'
            , restrict: 'E'
            , scope: {
                product: '=data'
            }
            ,controller: function ($scope) {
                $scope.productCount = myCart.getCount($scope.product);
                $scope.quantity = $scope.productCount;
                console.log("Pro count = "+$scope.productCount);
                
                $scope.quantity = $scope.productCount;
                $scope.add = function(){
                    $scope.productCount++;
                    //console.log("Sending product id = "+$scope.product.id);
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
                        //console.log("Add to cart");
                        for(var i=0; i<$scope.productCount-$scope.quantity; i++){
                            myCart.addToCart($scope.product);
                        }
                        $scope.quantity = $scope.productCount;
                    }
                    else if($scope.quantity> $scope.productCount){
                        //console.log("Remove from cart");
                        for(var i=0; i<$scope.quantity-$scope.productCount ; i++){
                            myCart.removeFromCart($scope.product);
                        }
                        $scope.quantity = $scope.productCount;
                    }
                }  
               
            }
        };
  }
]);