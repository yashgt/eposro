'use strict';

angular.module('users').controller('AddAddressController', ['$scope','Trulo',
  function ($scope,trulo) {
  	$scope.raw_address="India";
  	$scope.address={};
  	$scope.address.location="";
  	$scope.address.city="";
  	$scope.address.state="";
   $scope.onSubmit=function () {
   		console.log($scope.address);
   };
   
   $scope.changeStateCity=function () {
   	 console.log("In the change city and state");
   	 $scope.raw_address=$scope.address.city+", "+$scope.address.state;
   };

  }
]);
