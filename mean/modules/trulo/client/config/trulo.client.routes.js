'use strict';

//Setting up route
angular.module('trulo').config(['$stateProvider', '$urlRouterProvider',

  function($stateProvider,$urlRouterProvider) {
    // Trulo state routing
    $stateProvider
      .state('browse', {
        url: '/',
        templateUrl: 'modules/trulo/client/views/browse.client.view.html'
		

      });
  }
]);
