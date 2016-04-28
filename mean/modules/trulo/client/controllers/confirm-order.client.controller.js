'use strict';

angular.module('trulo').controller('ConfirmOrderController', ['$scope','$uibModalInstance',
   function ($scope,$uibModalInstance) {
       $scope.ok = function () {
           $uibModalInstance.close();
       };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        console.log($scope.cart);                                                        
  }
]);
