'use strict';
angular.module('trulo').controller('TruloController', [
  '$scope','Trulo','Mycart'
    , function ($scope, trulo,myCart) {

        $scope.lastPageLoaded = [];
        $scope.products = [];
        $scope.busy = false;
        $scope.breadCrumbs = [];
        $scope.nextCategory = 1; //category id of dairy tab
        $scope.cartCount = 0;
        
        $scope.getCategories = function () {
            
            console.log('Fetching categories in controller');
            trulo.getCategories(function (catsResponse,pageResponse,productsResponse) {
                console.log('Categories fetched successfully');
                
                $scope.categories = catsResponse;
                $scope.lastPageLoaded = pageResponse;
                $scope.products = productsResponse;
                //console.log($scope.categories[1].title);
            });
        };

        $scope.fetchNextPage = function (catID, flag) {
            $scope.nextCategory = catID;
            //if( flag == 0)
            //return;


            if ($scope.busy) return;
            $scope.busy = true;



            trulo.getProductsByCat(catID, $scope.lastPageLoaded[catID], $scope.products
                , function (productsResponse, lastPageResponse, busyResponse) {
                    $scope.productsOfCurrentCat = productsResponse;
                    $scope.lastPageLoaded[catID] = lastPageResponse;
                    $scope.busy = busyResponse;
                }
            );
        };

        $scope.getSubCat = function (parent) {

            trulo.getCategories(function (cats) {

            });
        };

        $scope.scrollTop = function () {
            $(document).scrollTop(0);
        };
        $scope.setBreadArray = function (cat, i) {

            if (i == 0) {
                // this is called by a top-level category
                $scope.breadCrumbs = [];

            }
            /*else{
                if( $scope.breadCrumbs.length > 1){
                    $scope.breadCrumbs.pop();
                }
            }*/
            $scope.breadCrumbs.push(cat);
            if ($scope.breadCrumbs.length == 3)
                $scope.hideMe = 1;
            else
                $scope.hideMe = 0;

        };
        this.addToCart = function(pdt){
			
			//TODO add the count 
			$scope.cartCount++;
			//$scope.cartValue += pdt.mrp ;
		};
        this.removeFromCart = function(pdt){
            if( $scope.cartCount <=0 ){
                $scope.cartCount = 0;
                return;
            }
            
            $scope.cartCount--;
            //$scope.cartValue -= pdt.mrp;
        };
        /*myCart.fetchCart(3,function(cart){
			$scope.cartCount = 0;
            console.log("Fetching cart for user 3");
			if( cart == null){
				$scope.cartCount = 0;
				$scope.cart = null;
				return;
			}
			for( var i=0; i<cart.products.length; i++){
				$scope.cartCount += cart.products[i].count; 
			}
            console.log("Fetched cart successfully with cartcount = "+$scope.cartCount);
			$scope.cart = cart;
		});*/
        
        myCart.onAddToCart(this.addToCart);
        myCart.onSubtractFromCart(this.removeFromCart); 
    }
]);