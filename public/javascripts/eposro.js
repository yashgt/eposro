function EposroController(
	$scope
	,$log
	,$http
) {
	$scope.mycart = { count: 0 };
	
	$http.get("/api/categories").success( 
		function(response){
			$scope.cats = response;
			console.log(response);
		});
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
