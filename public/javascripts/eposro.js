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
	
function CatsController(
    $scope
    ,$log
    ,$http
){
    $scope.categories = [
        {title:"Dairy",content:"Fetch all dairy products from the database"},
        {title:"Staple",content:"Fetch all staple diet products from the database"},
        {title:"Bakery",content:"Fetch all bakery products from the database"},
        {title:"Beverages",content:"Fetch all beverages from the database"},
        {title:"Hygiene",content:"Fetch all hygiene products from the database"},
        {title:"Baby Care",content:"Fetch all baby care products from the database"},
        {title:"Eatables",content:"Fetch all eatables from the database"},
        {title:"Home Utility",content:"Fetch all home utility products from the database"},
        {title:"Eggs",content:"Fetch all egg products from the database"}
    ]
    
}	
	
(function() {
    var epapp = angular.module('epapp', [
		'ngTouch'
		,'infinite-scroll'
        ,'ngMaterial'
    ]);
	epapp.controller('CatsController',[
        '$scope'
        ,'$log'
        ,'$http'
        ,CatsController]);
    
	epapp.controller('EPController', [
	'$scope'
	, '$log'
	, '$http'
	,  EposroController]);
    
	
})();
 