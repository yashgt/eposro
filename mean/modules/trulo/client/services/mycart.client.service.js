'use strict';
angular.module('trulo').factory('Mycart', [
  'Trulo' //List of registered service names to be injected. This is necessary to make code minification-safe

  
    , function (trulo) {
        var cnt = 0;
        var val = 0;
        //fetch the value and count from server using the Trulo service
        
        // Public API
        //A Service is just an object which provides and receives data
        return {
            
            value: 20
            , count: function (){
                trulo.fetchCart(100, function(res){
                    var x = res;
                    return x;
                });
            }
            
            , addToCart: function(pdt){
                console.log("In mycart service received id="+pdt.id);
                trulo.addToCart(pdt.id);
            }
            , removeFromCart: function(pdt){
                trulo.removeFromCart(pdt.id);
            }
        };
  }
]);