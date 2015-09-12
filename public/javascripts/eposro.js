function EposroController(
	$scope
	,$log
	,$http
) {
	$scope.mycart = { count: 20 };
   /*$scope.images = [1, 2, 3, 4, 5, 6, 7, 8,9,10];

  $scope.loadMore = function() {
    var last = $scope.images[$scope.images.length - 1];
    for(var i = 1; i <= 10; i++) {
      $scope.images.push(last + i);
    }
  };*/
       
    $scope.products = [];
	$scope.pdtsPage = 0;
	
	$http.get("/api/categories").success( 
		function(response){
			/*$scope.cats = response;
            console.log(response);*/
            
            $scope.data=response;
            $scope.data1 = [$scope.data[0],$scope.data[1]];
            for(var i=2;i<=19;i++){
                $scope.data1.push($scope.data[i]);
            }
            
            
            
        });
    $scope.loadMore = function() {
		$http.get('/api/products?page='+$scope.pdtsPage).success(
			function(response){
				$scope.pdtsPage++;
				for (var i = 0; i < response.data.length; i++) {
					$scope.products.push(response.data[i]);
				}
			});
			
			/*
                var last = $scope.data1.length-1;
                for(var j=1;j<=20;j++){
                    $scope.data1.push($scope.data[last+j]);
                }
				*/
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
 