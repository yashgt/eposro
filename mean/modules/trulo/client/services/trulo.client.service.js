'use strict';

angular.module('trulo').factory('Trulo', [
  function () {
    // Trulo service logic
    // ...

    // Public API
    return {
      someMethod: function () {
        return true;
      }
	  ,getCategories: function(cb){
		//TODO get from /api/categories
	  }
    };
  }
]);
