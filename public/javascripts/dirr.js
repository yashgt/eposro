function EposroController(
	$scope
	,$log
	,$http
) {

    $scope.products = [];
	$scope.pdtsPage = 0;
	$scope.busy = false;
        
	$http.get("/api/categories").success( 
		function(response){
			$scope.cats = response;
            console.log(response);
           
        }
    );
    
    $scope.loadMore = function() {
        if ($scope.busy) return;
            $scope.busy = true;
		$http.get('/api/products/'+$scope.pdtsPage).success(
			function(response){
				$scope.pdtsPage++;
                
				for (var i = 0; i < response.length; i++) {
					$scope.products.push(response[i]);
				}
                $scope.busy = false;
			});
	}    
}
	
	
	
(function() {
    var epapp = angular.module('epapp', [
		'ngTouch'
		,'infinite-scroll'
    ]);
	
	epapp.service('MyCart', function(){
		this.addToCart = function(pdt){
		}
	});
	
	epapp.controller('EPController', [
	'$scope'
	, '$log'
	, '$http'
	,  EposroController]);
    
   
        epapp.directive('product',function(){
        return{
            
            restrict:'AE',
            //template:'  <div class="thumbnail">      <img src="goadairy.jpg" alt="no pic">     <div class="caption">        <h3>Info</h3><p>...</p>        <p><a href="#" class="btn btn-primary" role="button" ng-click="count = count + 1" ng-init="count=0">+</a> {{ count }} <a href="#" class="btn btn-default" role="button" ng-click="count = count - 1">-</a></p></div></div></div></div>',
			scope : { //These are properties exposed to the calling HTML
				data : '='				
				,onAdd : '&'
				,onSub : '&'
			}
			,controller : [ '$scope', 'MyCart', function($scope, myCart){
				console.log("In cont");
				$scope.cnt = 0;
				$scope.add = function() {
					$scope.cnt++ ;
					myCart.addToCart($scope.data);
				}
			} ]
            ,templateUrl:'javascripts/dir/temp.html'
			,replace: true
        };
    });
	
})();
 

