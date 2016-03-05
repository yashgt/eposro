'use strict';
angular.module('trulo').factory('Mycart', [
  'Trulo'  //List of registered service names to be injected. This is necessary to make code minification-safe
,
  function (Trulo) {
    //This is NOT a constructor. It is a Factory function. It GENERATES an object and RETURNs it.
    // Mycart service logic
    // ...
    //TODO
    var cnt = 0;
    var val = 0;
    //fetch the value and count from server using the Trulo service
    // Public API
    //A Service is just an object which provides and receives data
    return {
      //The Object is CONSTRUCTed here
      value: val,
      count: cnt,
      addToCart: function () {
        //TODO increase the count. Send the added product to the server
        return true;
      },
      removeFromCart: function () {
      }  //Add more
    };
  }
]);