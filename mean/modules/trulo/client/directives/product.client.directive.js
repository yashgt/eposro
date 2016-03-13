'use strict';

angular.module('trulo').directive('product', ['Mycart',
  function (myCart) {
        return {
            templateUrl: 'modules/trulo/client/views/productdirective.html'
            , restrict: 'E'
            , scope: {
                product: '=data'
            }
            ,link: function postLink(scope, element, attrs) {
                scope.productCount = 0;
                scope.add = function(){
                    scope.productCount++;
                    console.log("Sending product id = "+scope.product.id);
                    myCart.addToCart(scope.product);
                }
                scope.subtract = function () {
                    if (scope.productCount <= 0) {
                        scope.productCount = 0;
                            return;
                    }
                    scope.productCount--;
                    myCart.removeFromCart(scope.product);
                }
            }
        };
  }
]);