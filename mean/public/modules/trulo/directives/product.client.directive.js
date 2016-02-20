'use strict';

angular.module('trulo').directive('product', [
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Product directive logic 
				// ...
				
				element.text('this is the product directive');
			}
		};
	}
]);