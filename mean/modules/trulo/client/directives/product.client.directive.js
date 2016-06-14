'use strict';

angular.module('trulo').directive('product', ['Mycart','$mdDialog','$mdMedia',
    function(myCart,$mdDialog,$mdMedia) {
        return {
            templateUrl: 'modules/trulo/client/views/productdirective.html',
            restrict: 'E',
            scope: {
                product: '=data'
            },
            controller: function($scope) {


                $scope.productCount = myCart.getCount($scope.product);
                $scope.quantity = $scope.productCount;
                //console.log("Pro count = "+$scope.productCount);

                $scope.quantity = $scope.productCount;
                $scope.add = function(ev) {
                    myCart.addToCart($scope.product, function(res) {
                        if (res == false) {
                                $scope.showAlert(ev);

                        } else {
                            console.log('hello');
                            $scope.productCount++;
                        }

                    });
                    //console.log("Sending product id = "+$scope.product.id);
                }
                $scope.showAlert = function(ev) {
                    // Appending dialog to document.body to cover sidenav in docs app
                    // Modal dialogs should fully cover application
                    // to prevent interaction outside of dialog
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Sorry...')
                        .textContent('You Are Not Logged in, Please Log In')
                        .ariaLabel('Info window')
                        .ok('Okay!')
                        .targetEvent(ev)
                    );
                };
                $scope.subtract = function(ev) {
                    if ($scope.productCount <= 0) {
                        $scope.productCount = 0;
                        return;
                    }
                    $scope.productCount--;
                    myCart.removeFromCart($scope.product, function(res) {

                    });
                }
                /*$scope.addToCart = function(){
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
                } */

            }
        };
    }
]);