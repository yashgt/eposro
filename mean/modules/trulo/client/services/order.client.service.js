'use strict';

angular.module('trulo').factory('Order', ['Trulo',
  function (trulo) {
    // Order service logic
    // ...

    // Public API
    return {
      placeOrder: function (uid,cb) {
        console.log("Inside Order service"+uid);
        trulo.placeOrder(uid,function(orderResponse){
          cb(orderResponse);
        });
      }
    };
  }
]);
