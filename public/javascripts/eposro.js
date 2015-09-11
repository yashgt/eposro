function EposroController(
	$scope
	,$log
	,$http
) {
	$scope.mycart = { count: 20 };
   $scope.images = [1, 2, 3, 4, 5, 6, 7, 8,9,10];

  $scope.loadMore = function() {
    var last = $scope.images[$scope.images.length - 1];
    for(var i = 1; i <= 10; i++) {
      $scope.images.push(last + i);
    }
  };
        
	$http.get("/api/categories").success( 
		function(response){
			$scope.cats = response;
            console.log(response);
            
            //$scope.data=response;
            
            /*for(var i=1;i<=10;i++){
                $scope.data1.push($scope.data[j]);
            }
            
            $scope.loadMore = function() {
                var last = $scope.data1.length-1;
                for(var j=1;j<=10;j++){
                    $scope.data1.push($scope.data[last+j]);
                }
                
            }*/
            console.log(response);
        }
        );
            
        
        
    
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
 