'use strict';

angular.module('trulo').directive('errSrc', [
  function () {
    return {
      
      link: function postLink(scope, element, attrs) {
        element.bind('error', function() {
            if (attrs.src != attrs.errSrc) {
              attrs.$set('src', attrs.errSrc);
            }
        });
      }
    };
  }
]);
