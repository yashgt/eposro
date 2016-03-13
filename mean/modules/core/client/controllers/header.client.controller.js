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
      
        myCart.fetchCart(3,function(cart){
			$scope.cartCount = 0;
            $scope.cartValue = 0;
            console.log("Fetching cart for user 3");
			if( cart == null){
				$scope.cartCount = 0;
				$scope.cart = null;
				return;
			}
			for( var i=0; i<cart.products.length; i++){
				$scope.cartCount += cart.products[i].count; 
			}
            $scope.cartValue = cart.estimated_cost;
            console.log("Fetched cart successfully with cartcount = "+$scope.cartCount+" & value="+$scope.cartValue);
		});
  }
]);