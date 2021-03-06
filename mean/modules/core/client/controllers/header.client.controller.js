'use strict';
//cart.count value = total amount
angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', 'Mycart', 'Order', 'Trulo'
  
            , function ($scope, $state, Authentication, Menus, myCart, order, trulo) {
                // Expose view variables
                $scope.$state = $state;
                $scope.authentication = Authentication;
                // Get the topbar menu
                $scope.menu = Menus.getMenu('topbar');

                
                // Toggle the menu items
                $scope.isCollapsed = false;
                $scope.toggleCollapsibleMenu = function () {
                    $scope.isCollapsed = !$scope.isCollapsed;
                };

                // Collapsing the menu after navigation
                $scope.$on('$stateChangeSuccess', function () {
                    $scope.isCollapsed = false;
                });
                this.addToCart = function (pdt) {
                    //console.log("Add to cart");
                    $scope.cartCount++;
                    //$scope.cartValue += pdt.mrp ;
                };
                this.removeFromCart = function (pdt) {
                    //console.log("Remove to cart");
                    if ($scope.cartCount <= 0) {
                        $scope.cartCount = 0;
                        return;
                    }

                    $scope.cartCount--;
                    //$scope.cartValue -= pdt.mrp;
                };
                this.fetchCart = function () {
                    myCart.fetchCart(function (cart) {
                        console.log("Fetch Cart");
                        $scope.cartCount = 0;
                        $scope.cartValue = 0;
                        if (cart != null) {
                            for (var i = 0; i < cart.products.length; i++) {
                                $scope.cartCount += cart.products[i].count;
                                $scope.cartValue += parseInt(cart.products[i].price) * $scope.cartCount;
                            }
                        }
                        console.log("Fetched cart successfully with cartcount = " + $scope.cartCount + " & value=" + $scope.cartValue);
                    });
                }
                if( $scope.cartCount == undefined)
                    this.fetchCart();
                $scope.searchProduct = function (searchQuery) {
                    console.log("Searching product "+searchQuery);
                    if( searchQuery == null )
                        return;
            
                    $state.go('search',{query:searchQuery},{reload:true});
                }

                myCart.onAddToCart(this.addToCart);
                myCart.onSubtractFromCart(this.removeFromCart);
                myCart.onRemoveDirectly(this.fetchCart);
                order.onOrderPlacement(this.fetchCart);
                //for collapse search button
                $scope.isCollapsed = true;
                
        }
]);