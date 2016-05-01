'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var logInFlag = false;
    var auth = {
      user: $window.user
      ,setFlag: function(){
      	logInFlag = true;
       }
      ,unSetFlag: function(){
      	logInFlag=false;
      }
    };
    auth.login=false;
    return auth;
  }
]);
