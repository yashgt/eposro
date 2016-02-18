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
        //$scope.subCategories = [];
        $scope.busy = false;
        $scope.breadCrumbs = [];
        $scope.nextCategory = 1;//category id of dairy tab
        $scope.cartCount = 0;

        epSvc.getCategories( function(catsResponse,pageResponse,productsResponse){
            //console.log("In callback " + catsResponse);
            $scope.lastPageLoaded = pageResponse;
            $scope.products = productsResponse;
            $scope.categories = catsResponse;
            //console.log("Last page loaded in callback =  "+$scope.lastPageLoaded[1]);
        });   

      	$scope.fetchNextPage = function(catID,flag) {
      		$scope.nextCategory = catID;
      		//if( flag == 0)
      			//return;
            //console.log("called fetchNextPage() for ", catID );
            //console.log("Last page loaded before passing = "+$scope.lastPageLoaded[catID]);
            if ($scope.busy) return;
                $scope.busy = true;
            
            //epSvc.getProductsByCat(catID,lastPageLoaded,products,$scope);

            epSvc.getProductsByCat( catID, $scope.lastPageLoaded[catID], $scope.products,
                function(productsResponse, lastPageResponse,  busyResponse){
                    $scope.productsOfCurrentCat = productsResponse;
                    $scope.lastPageLoaded[catID] = lastPageResponse;
                    $scope.busy = busyResponse;
                }
            );
        }

        $scope.getSubCat=function(parent){
            //console.log("Getting sub_categories for " +parent);
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
			//console.log("Adding to cart on UI");
			//TODO add the count 
			$scope.cartCount++;
			//$scope.cartValue += pdt.mrp ;
		};
        removeFromCart = function(pdt){
            if( $scope.cartCount <=0 ){
                $scope.cartCount = 0;
                return;
            }
            //console.log("Removing from cart on UI");
            $scope.cartCount--;
            //$scope.cartValue -= pdt.mrp;
        };

		myCart.onAddToCart(addToCart);
        myCart.onSubtractFromCart(removeFromCart);   
}

//This is the controller for product directive that handles all the logic for the directive.
//The service myCartService is dependency injected here.
ProductListItemController = function($scope, myCart){
	//console.log("In cont for " , $scope.product);
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
        //TODO define the following function
        myCart.removeFromCart($scope.product);
    }
} ;
			
eposroService = function($http){
    var cart = {};
	this.getCart = function(cb){
		$http.get('/api/cart').success(
			function(res){
				cb(res);
			}
		);
	};

    this.getSubCat=function(parent,$scope){
        $scope.subCategories = [];
        $http.get('/api/subCategories?parent='+parent).success(function(response){
            //console.log('Received in the controller :' + response[0].title);
            //console.log('Received in the controller :' + response[1].title);
            $scope.subCategories = response;
        });
    };
    this.getCategories = function(cb){
       
        $http.get("/api/categories").success( 
            function(response){
                var categories = response;
                //console.log("After success :" +categories[3].catID);
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
        //console.log("Last page  = "+lastPage);
        $http.get('/api/products?catID='+catID+'&lastPage='+lastPage).success(
            function(response){
                lastPage++;
                //console.log("Made call for page  "+lastPage+" of category "+catID);
                //find the index into the products array where products of this category are found
                for( var j=0; j<products.length; j++){
	            	if( products[j].catID == catID){	
	            		//console.log("Found " + catID +" at index "+j);
	            		break;
	            	}
                }
                
                for (var i = 0; i < response.length; i++) {
                	//console.log("Here " + products[1].pdt);
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
        //TODO post call to add cart

        if(cart[pdt.id]!=undefined){
            cart[pdt.id].count++;
            return;
        }
        cart[pdt.id]=pdt;
        cart[pdt.id].count = 0;



    }
	
};
/*
cart={
    "pid":{
    pname:
    cid:
    count:
    }
}


*/			

myCartService = function(epSvc){
	//TODO	Fetch the current cart from the Server
	
	this.addToCart = function(pdt){
		//TODO Make a call to server to add this product to cart $epsvc.addToCart
        epSvc.addToCart(pdt);

		if(this.addToCartCB)
			this.addToCartCB(pdt);
	};
    this.removeFromCart = function(pdt){
        //TODO Make a call to server to remove this product from cart $epsvc.addToCart
        if( this.removeFromCartCB)
            this.removeFromCartCB(pdt);
    }
	this.getCount = function(pdt){
		//TODO get product count 
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
 