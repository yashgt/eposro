'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', 'Mycart'
  , function ($scope, $state, Authentication, Menus, myCart) {
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
        this.addToCart = function(pdt){			
			$scope.cartCount++;
			$scope.cartValue += pdt.mrp ;
		};
        this.removeFromCart = function(pdt){
            if( $scope.cartCount <=0 ){
                $scope.cartCount = 0;
                return;
            }
            
            $scope.cartCount--;
            $scope.cartValue -= pdt.mrp;
        };
        myCart.fetchCart(3,function(cart){
			$scope.cartCount = 0;
            $scope.cartValue = 0;
            if( cart != null){
                for( var i=0; i<cart.products.length; i++){
                    $scope.cartCount += cart.products[i].count;
                    $scope.cartValue += parseInt(cart.products[i].price);
                }
            }
            
            console.log("Fetched cart successfully with cartcount = "+$scope.cartCount+" & value="+$scope.cartValue);
		});
        myCart.onAddToCart(this.addToCart);
        myCart.onSubtractFromCart(this.removeFromCart);   
  }
]);