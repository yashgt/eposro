function EposroController(
	$scope
	,$log
	,$http
    ,$mdSidenav
	,myCart
    ,epSvc
){  
		$scope.lastPageLoaded = [];
        $scope.products = [];
        $scope.busy = false;
        $scope.breadCrumbs = [];
        $scope.nextCategory = 1;//category id of dairy tab

        epSvc.getCategories( function(catsResponse,pageResponse,productsResponse){
            
            $scope.lastPageLoaded = pageResponse;
            $scope.products = productsResponse;
            $scope.categories = catsResponse;
            
        });   

      	$scope.fetchNextPage = function(catID,flag) {
      		$scope.nextCategory = catID;
      		//if( flag == 0)
      			//return;
            
            
            if ($scope.busy) return;
                $scope.busy = true;
            
            

            epSvc.getProductsByCat( catID, $scope.lastPageLoaded[catID], $scope.products,
                function(productsResponse, lastPageResponse,  busyResponse){
                    $scope.productsOfCurrentCat = productsResponse;
                    $scope.lastPageLoaded[catID] = lastPageResponse;
                    $scope.busy = busyResponse;
                }
            );
        }

        $scope.getSubCat=function(parent){
            
            epSvc.getSubCat(parent,$scope);
        }
        
        $scope.scrollTop = function(){
       		$(document).scrollTop(0);
        }
        $scope.setBreadArray = function(cat,i){
            
            if( i == 0){
                // this is called by a top-level category
                $scope.breadCrumbs = [];
                
            }
            /*else{
                if( $scope.breadCrumbs.length > 1){
                    $scope.breadCrumbs.pop();
                }
            }*/
            $scope.breadCrumbs.push(cat);
            if( $scope.breadCrumbs.length == 3)
                $scope.hideMe = 1;
            else
                $scope.hideMe = 0;
            
        } ;
		
		addToCart = function(pdt){
			
			//TODO add the count 
			$scope.cartCount++;
			//$scope.cartValue += pdt.mrp ;
		};
        removeFromCart = function(pdt){
            if( $scope.cartCount <=0 ){
                $scope.cartCount = 0;
                return;
            }
            
            $scope.cartCount--;
            //$scope.cartValue -= pdt.mrp;
        };
		
		myCart.fetchCart(1,function(cart){
			$scope.cartCount = 0;
			if( cart == null){
				$scope.cartCount = 0;
				$scope.cart = null;
				return;
			}
			for( var i=0; i<cart.products.length; i++){
				$scope.cartCount += cart.products[i].count; 
			}
			$scope.cart = cart;
		});//obtain userID & fetch to this function
		myCart.onAddToCart(addToCart);
        myCart.onSubtractFromCart(removeFromCart);   
}

//This is the controller for product directive that handles all the logic for the directive.
//The service myCartService is dependency injected here.
ProductListItemController = function($scope, myCart){
	$scope.productCount = myCart.getCount($scope.product);
	
    this.add = function() {
		$scope.productCount++ ;
		myCart.addToCart($scope.product);// called this so that changes are saved to the DB
	}
    this.subtract = function(){
        if( $scope.productCount <= 0){
            $scope.productCount = 0;
			
            return;
        }
        $scope.productCount--;
        myCart.removeFromCart($scope.product);
    }
} ;
			
eposroService = function($http){
    //var cart = {};
	
	this.fetchCart = function(userID,cb){
		var data = {
			'userID' : userID
		};
		$http.post('/api/cart',data).success(
			function(res){
				console.log("In epsvc cart:"+res);
				if( res == null){
					console.log("Sending res null in epsvc");
					cb(null);
				}
				else{
					console.log("Sending some res in epsvc");
					cb(res);
				}
			}
		);
	};

    this.getSubCat=function(parent,$scope){
        $scope.subCategories = [];
        $http.get('/api/subCategories?parent='+parent).success(function(response){
            $scope.subCategories = response;
        });
    };
    this.getCategories = function(cb){
       
        $http.get("/api/categories").success( 
            function(response){
                var categories = response;
                
                var lastPageLoaded = [];
                var products = [];
                //initialize last page loaded and products array here
                for(var i = 0; i< response.length; i++){
                	lastPageLoaded[response[i].catID] = 0;
                	products[i] = {
                		catID : response[i].catID,
                		pdt: []
                	};
                }
                cb(categories,lastPageLoaded,products);
            }
        );
    };
   
	this.getProductsByCat = function(catID,lastPage, products, cb){//function(catID, page, filter, cb)
        //TODO
        
        $http.get('/api/products?catID='+catID+'&lastPage='+lastPage).success(
            function(response){
                lastPage++;
                
                //find the index into the products array where products of this category are found
                for( var j=0; j<products.length; j++){
	            	if( products[j].catID == catID){	
	            		
	            		break;
	            	}
                }
                
                for (var i = 0; i < response.length; i++) {
                	
                    (products[j].pdt).push(response[i]);
                }
                var productsOfCurrentCat = products[j].pdt;
                var busy = false;
                cb(productsOfCurrentCat,lastPage,busy);
                //$scope.productsOfCurrentCat = products[j].pdt;
                //$scope.busy = false;
            }
        );
	}; 

    this.addToCart = function(pdt){
        
		var data = {
			'pdtID' : pdt
			, 'userID': 1
			, 'city': 'goa'
         };
		$http.post('/api/addToCart', data).success(function(response){
			
        });
    }
	
	this.removeFromCart = function(pdt){
		var data = {
			'pdtID' : pdt
			, 'userID': 1
			, 'city': 'goa'
         };
		$http.post('/api/removeFromCart', data).success(function(response){
			console.log("Returned in cb");
        });
	}
	
};
		

myCartService = function(epSvc){
	var cart;
	this.fetchCart = function(userID,cb){
		epSvc.fetchCart(userID, function(cartResponse){
			cart = cartResponse;
			cb(cartResponse);
		});	
	};
	this.addToCart = function(pdt){
        epSvc.addToCart(pdt.id);

		if(this.addToCartCB)
			this.addToCartCB(pdt);
	};
    this.removeFromCart = function(pdt){
		epSvc.removeFromCart(pdt.id);
        if( this.removeFromCartCB)
            this.removeFromCartCB(pdt);
    }
	this.getCount = function(pdt){
		//TODO get product count 
		//console.log("Inside getCount, where...");
		//console.log(pdt);
		if( cart == null){
			return 0;
		}
		for(var i=0;i<cart.products.length; i++){
			if( cart.products[i].pid == pdt.id)
				return cart.products[i].count;
		}
		return 0;
	};
	this.onAddToCart = function(cb){
		this.addToCartCB = cb;
	};
    this.onSubtractFromCart = function(cb){
        this.removeFromCartCB = cb;
    }
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
        .accentPalette('orange');
    });

    epapp.directive('product',function(){
        return{
            restrict:'AE',
            templateUrl:'productdirective.html',
            replace: false
			,controller: ProductListItemController
			,controllerAs: "plic"
            ,scope: {
                product : '=data'
            }
        };
    });

	epapp.service('epSvc', eposroService);
	epapp.service('myCart', myCartService);

	epapp.controller('EPController', [
	'$scope'
    ,'$log'
    ,'$http'
    ,'$mdSidenav'
	,'myCart'
    ,'epSvc'
	,  EposroController]);
})();
 