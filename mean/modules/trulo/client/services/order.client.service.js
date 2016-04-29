'use strict';

angular.module('trulo').factory('Order', ['Trulo',
  function (trulo) {
   
    return {
      placeOrder: function (cb) {
        console.log("Inside Order service");
        var order = this;
        trulo.placeOrder(function(res){
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
