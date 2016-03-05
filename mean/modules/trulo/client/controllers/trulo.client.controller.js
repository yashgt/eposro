'use strict';
angular.module('trulo').controller('TruloController', [
  '$scope',
  'Trulo',
  function ($scope, trulo) {
    console.log('Inside controller');
    // Controller Logic
    // ...
    $scope.getCategories = function () {
      console.log('Fetching categories in controller');
      trulo.getCategories(function (cats) {
        console.log('Categories fetched successfully');
        $scope.categories = cats;
        console.log($scope.categories[1].title);
      });
    };
  }
]);