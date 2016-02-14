function EposroController(
	$scope
	,$log
	,$http
    ,$mdSidenav
	,myCart
    ,epSvc
){  
		var lastPageLoaded = {};
        var products = [];
        //$scope.subCategories = [];
        $scope.busy = false;
        $scope.breadCrumbs = [];
        $scope.nextCategory = 101;//category id of dairy tab

        epSvc.getCategories($scope,lastPageLoaded,products);
		    

      	$scope.fetchNextPage = function(catID,flag) {
      		$scope.nextCategory = catID;
      		//if( flag == 0)
      			//return;
            console.log("called fetchNextPage() for ", catID );
            if ($scope.busy) return;
                $scope.busy = true;
            
            epSvc.getProductsByCat(catID,lastPageLoaded,products,$scope);
        }

        $scope.getSubCat=function(parent){
            console.log("Getting sub_categories for " +parent);
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
		
        /*removeFromCart = function(pdt){
            console.log("Removing from cart on UI");
            $scope.cartCount--;
            $scope.cartValue -= pdt.mrp;
        };*/

		myCart.onAddToCart(addToCart);
       // myCart.onRemoveFromCart(removeFromCart);   
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
        if( $scope.productCount = 0)
            return;
        $scope.productCount--;
        //TODO define the following function
        //myCart.removeFromCart($scope.product);
    }
} ;
			
eposroService = function($http){
  
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
    this.getCategories = function($scope,lastPageLoaded,products){
       
        $http.get("/api/categories").success( 
            function(response){
                
                $scope.categories = response;
                //initialize last page loaded and products array here
                for(var i = 0; i< response.length; i++){
                	lastPageLoaded[response[i].id] = 0;
                	products[i] = {
                		catID : response[i].id,
                		pdt: []
                	};
                }
                
            }
        );
    };

    
	this.getProductsByCat = function(catID,lastPageLoaded,products,$scope){//function(catID, page, filter, cb)
        //TODO
        
        var lastPage = lastPageLoaded[catID];
        $http.get('/api/products?catID='+catID+'&lastPage='+lastPage).success(
            function(response){
            	
                lastPage++;
                lastPageLoaded[catID] = lastPage;
                console.log("Made call for page  "+lastPage+" of category "+catID);
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

                $scope.productsOfCurrentCat = products[j].pdt;
                $scope.busy = false;
            }
        );
	}; 
	
};			

myCartService = function(epSvc){
	//TODO	Fetch the current cart from the Server
		
	this.addToCart = function(pdt){
		//TODO Make a call to server to add this product to cart
		if(this.addToCartCB)
			this.addToCartCB(pdt);
	};
	this.getCount = function(pdt){
		//TODO get product count 
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
 