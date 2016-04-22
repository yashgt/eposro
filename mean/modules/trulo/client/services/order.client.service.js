'use strict';

angular.module('trulo').factory('Order', ['Trulo',
  function (trulo) {
    // Order service logic
    // ...

    // Public API
    return {
      placeOrder: function (uid,cb) {
        console.log("Inside Order service"+uid);
        var order = this;
        trulo.placeOrder(uid,function(res){
            if (order.placeOrderCB)
                order.placeOrderCB();    
        });
        
      }
      , onOrderPlacement: function (cb) {
          console.log("In on order placement");
          this.placeOrderCB = cb;
      }
    };
  }
]);
