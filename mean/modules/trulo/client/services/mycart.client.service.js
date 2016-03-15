'use strict';
angular.module('trulo').factory('Mycart', [
  'Trulo' //List of registered service names to be injected. This is necessary to make code minification-safe


    
    , function (trulo) {
        var cnt = 0;
        var val = 0;
        var cart;
        //fetch the value and count from server using the Trulo service
        return {

            value: 20
            , count: 0
            , fetchCart: function (userId, cb) {
                console.log("In mycart service,Fetching cart");
                trulo.fetchCart(userId, function (cartResponse) {
                    cart = cartResponse;
                    cb(cart);
                });
            }
            , addToCart: function (pdt) {
                console.log("Add:In mycart service received id=" + pdt.id);
                trulo.addToCart(pdt.id);
                if (this.addToCartCB)
                    this.addToCartCB(pdt);
            }
            , removeFromCart: function (pdt) {
                console.log("Remove:In mycart service received id=" + pdt.id);
                trulo.removeFromCart(pdt.id);
                if (this.removeFromCartCB)
                    this.removeFromCartCB(pdt);
            }
            , getCount: function (pdt) {
                if (cart == null) {
                    return 0;
                }
                for (var i = 0; i < cart.products.length; i++) {
                    if (cart.products[i].pid == pdt.id){
                        return cart.products[i].count;
                    }
                }
                return 0;
            }
            , getValue: function (pdt) {
                if (cart == null) {
                    return 0;
                }
                for (var i = 0; i < cart.products.length; i++) {
                    if (cart.products[i].pid == pdt.id){
                        return cart.products[i].price;
                    }
                }
                return 0;
            }
            , onAddToCart: function (cb) {
                this.addToCartCB = cb;
            }
            , onSubtractFromCart: function (cb) {
                this.removeFromCartCB = cb;
            }
        };
  }
]);