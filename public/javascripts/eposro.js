function EposroController(
	$scope
	,$log
	,$http
) {
	//$scope.mycart = { count: 20 };
 
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
	
	epapp.controller('EPController', [
	'$scope'
	, '$log'
	, '$http'
	,  EposroController]);
    
	
})();
 