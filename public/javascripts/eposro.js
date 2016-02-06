function EposroController(
	$scope
	,$log
	,$http
    ,$mdSidenav
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
            //console.log("called loadMore()");
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
        }
        
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
        }       
}
	


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
            replace: true,
            scope: {
                product : '=pro'
            }
        };
    });

	epapp.controller('EPController', [
	'$scope'
    ,'$log'
    ,'$http'
    ,'$mdSidenav'
	,  EposroController]);
})();
 