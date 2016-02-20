'use strict';

//Setting up route
angular.module('trulo').config(['$stateProvider',
	function($stateProvider) {
		// Trulo state routing
		$stateProvider.
		state('browse', {
			url: '/',
			templateUrl: 'modules/trulo/views/browse.client.view.html'
		});
	}
]);