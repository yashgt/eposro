function EposroController(
	$scope
	,$log
	,$http
    ,$mdSidenav
	,myCart
){         
        $scope.products = [];
        $scope.pdtsPage = 1;
        $scope.busy = false;
        $scope.breadCrumbs = [];
        
    
        $http.get("/api/categories").success( 
            function(response){
                $scope.categories = response;
            }
        );
        
        $scope.fetchCategoryProducts = function(cat_id){
            //$scope.products = [];
            $scope.pdtsPage = 1;
            $http.get("/api/products/"+cat_id).success(
                function(response){
                    console.log("Made call for page  1 of category "+cat_id);
                    for( var i = 0; i<response.length; i++){
                        $scope.products.push(response[i]);
                    }
                }
            )
        };
        
        $scope.clearProducts = function(){
            $scope.products = [];
            $scope.pdtsPage = 0;
        }
            
      $scope.loadMore = function(cat_id) {
            console.log("called loadMore() for ", cat_id );
            if ($scope.busy) return;
                $scope.busy = true;
            $http.get('/api/products/'+cat_id+'/'+$scope.pdtsPage).success(
                function(response){
                    $scope.pdtsPage++;
                    console.log("Made call for page  "+$scope.pdtsPage+" of category "+cat_id);
                    for (var i = 0; i < response.length; i++) {
                        $scope.products.push(response[i]);
                    }
                    $scope.busy = false;
                });
        }
        
        $scope.openRightMenu = function() {
            $mdSidenav('right').toggle();
        };
        
        $scope.setBreadArray = function(cat,i){
            
            if( i == 0){
                // this is called by a category
                $scope.breadCrumbs = [];
                
            }
            else{
                if( $scope.breadCrumbs.length > 1){
                    $scope.breadCrumbs.pop();
                }
            }
            $scope.breadCrumbs.push(cat);
        } ;
		
		addToCart = function(pdt){
			console.log("Adding to cart on UI");
			//TODO add the count 
			$scope.cartCount++;
			$scope.cartValue += pdt.mrp ;
		};
		
		myCart.onAddToCart(addToCart);
		
		
		
      
}
	
ProductListItemController = function($scope, MyCart){
				console.log("In cont for " , $scope.product);
				$scope.productCount = MyCart.getCount($scope.product);
				this.add = function() {
					$scope.productCount++ ;
					MyCart.addToCart($scope.product);
				}
			} ;
			
EPService = function($http){
	this.getCart = function(cb){
		$http.get('/api/cart').success(
			function(res){
				cb(res);
			}
		);
	};
	this.getProductsByCat = function(catID, page, filter, cb){
	}; 
	
};			

MyCartService = function(epsvc){
		//TODO	Fetch the current cart from the Server
		
		this.addToCart = function(pdt){
			//TODO Make a call to server to add this product to cart
			if(this.addToCartCB)
				this.addToCartCB(pdt);
		};
		this.getCount = function(pdt){
			//TODO
			return 0;
		};
		this.onAddToCart = function(cb){
			this.addToCartCB = cb;
		};
	};

(function() {
    var epapp = angular.module('epapp', [
		'ngTouch'
		,'infinite-scroll'
        ,'ngMaterial'
    ]);
    
    epapp.config(function($mdThemingProvider) {
        
        $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('blue');
    });

    epapp.directive('product',function(){
        return{
            
            restrict:'AE',
            templateUrl:'productdirective.html',
            replace: true
			,controller: ProductListItemController
			,controllerAs: "plic"
            ,scope: {
                product : '=data'
            }
        };
    });
	epapp.service('epsvc', EPService);
	epapp.service('MyCart', MyCartService);

	epapp.controller('EPController', [
	'$scope'
    ,'$log'
    ,'$http'
    ,'$mdSidenav'
	, 'MyCart'
	,  EposroController]);
})();
 