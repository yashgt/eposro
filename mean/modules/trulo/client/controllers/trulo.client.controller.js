'use strict';

angular.module('trulo').controller('TruloController', ['$scope', 'Trulo',
  function ($scope, trulo) {
	$scope.categories = [1,2,3];
    // Controller Logic
    // ...
	$scope.getCategories = function(){
		trulo.getCategories(function(cats){
			$scope.categories = cats;
		});
	};
  }
]);
