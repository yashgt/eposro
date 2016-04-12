'use strict';
angular.module('trulo').controller('TruloController', [
  '$scope','Trulo','Mycart'
    , function ($scope, trulo,myCart) {
        $scope.map = {};
        $scope.lastPageLoaded = [];
        $scope.products = [];
        $scope.busy = false;
        $scope.breadCrumbs = [];
        $scope.nextCategory = 1; //category id of dairy tab
        $scope.cartCount = 0;
        $scope.delivery = 0;
        $scope.quantity = 0;
        $scope.count = $scope.quantity;
        $scope.isCollapsed = false;
        
        $scope.showProducts = function(catID){
            //make a SOLR query to fetch products of this catID
            setBreadArray(catID);
        }
        
        var getCategories = function () {
            
            console.log('Fetching categories in controller');
            trulo.getCategories(0,function (catsResponse,pageResponse,productsResponse) {
                console.log('Categories fetched successfully');
                $scope.categories = catsResponse;
                console.log($scope.categories);
                $scope.lastPageLoaded = pageResponse;
                $scope.products = productsResponse;
                //console.log($scope.categories[1].title);
            });
        };

        if( $scope.categories == undefined){
            getCategories();
        }
        
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
            console.log("Fetching subcategories of parent = "+parent);
            trulo.getCategories(parent,function (catsResponse,pageResponse,productsResponse) {
                console.log('Sub Categories fetched successfully');
            
                if( catsResponse.length == 0)
                    $scope.hideMe = 1;
                else
                    $scope.hideMe = 0;
                $scope.subCategories = catsResponse;
                if( $scope.subCategories.length!=0)
                    console.log($scope.subCategories[1].title);
                //$scope.lastPageLoaded = pageResponse;
                //$scope.products = productsResponse;

            });
         
        };

        $scope.scrollTop = function () {
            $(document).scrollTop(0);
        };
        
        var getCategoryTitle = function(catID){
            for(var i =0 ; i< $scope.categories.length; i++){
                if( $scope.categories[i].catID == catID)
                    return $scope.categories[i].title;
            }
        }
        var setBreadArray = function (catID) {
            var cat = getCategoryTitle(catID);
            $scope.breadCrumbs.push(cat);
        };
        
        $scope.popBread = function(cat){
            //TODO display products by applying filters
            var i = 0;
            while( i < $scope.breadCrumbs.length ){
                if( $scope.breadCrumbs[i] == cat ){
                    break;
                }
                i++;
            }
            $scope.breadCrumbs.splice(i+1,$scope.breadCrumbs.length-1);
            this.getSubCat(cat.catID);
        }
        
        $scope.fetchCart = function(){
            myCart.fetchCart(3,function(cartResponse){
                $scope.cart = cartResponse;
                console.log($scope.cart.products);
            });
        }
        
        
        $scope.updateCart = function(count){
            //console.log("In updateCart, count = "+count);
            if( count == null)
                return;
            if( count < $scope.quantity){
                myCart.removeFromCart();
                //console.log("Call remove from cart");
            }  
            else if( count > $scope.quantity){
                myCart.addToCart();
                //console.log("Call add to cart");
            }
            $scope.quantity = count;
        }
     
         
        $scope.init = function (q) {
            $scope.q = q;

            //here we issue the actual query using jQuery
            $.ajax({
                url: "http://localhost:9393/solr/eposro/select?q=*%3A*&wt=json&indent=true&qt=amul",
                data: {
                    "q": $scope.q,
                    "wt": "json",
                    "rows":3
                },
                traditional: true,
                cache: true,
                async: true,
                dataType: 'jsonp',
                success: function (data) {
                    //and when we get the query back we 
                    //stick the results in the scope
                    $scope.$apply(function () {
                        $scope.results = data.response.docs;
                    });
                },
                jsonp: 'json.wrf'
            });
        }
    }
]);