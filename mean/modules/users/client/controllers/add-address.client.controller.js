'use strict';

angular.module('users').controller('AddAddressController', ['$scope','Trulo','$mdDialog','$mdMedia',
  function ($scope,trulo,$mdDialog,$mdMedia) {
  	$scope.address={};
  	$scope.address.location=[0,0];
  	$scope.address.city="";
    $scope.address.taluka="";
  	$scope.address.state="";

     $scope.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Hello User')
        .textContent('Your address has been saved you can now go and buy our products')
        .ariaLabel('Info window')
        .ok('Okay!')
        .targetEvent(ev)
    );
    };
   
   $scope.onSubmit=function (ev) {
   		console.log($scope.address);
      trulo.saveAddress($scope.address,function(res){
        if(res){
          $scope.showAlert(ev);
        }
      });
   };
  }
]);
