'use strict';

angular.module('trulo').factory('Order', ['Trulo',
  function (trulo) {
   
    return {
      placeOrder: function (params,cb) {
        console.log("Inside Order service");
        var order = this;
        trulo.placeOrder(params,function(res){
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
