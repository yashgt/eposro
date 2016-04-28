'use strict';

angular.module('trulo').controller('SearchController', ['$scope','Trulo','$stateParams','products',
  function ($scope,trulo,$stateParams,products) {
      
      $scope.products = products.data;
      
      console.log("After return from resolve,");
      console.log(products.data);
      
      if( $scope.products == null || $scope.products.length ==0){
          $scope.noResult = 1;
          return;
      }
      else
          $scope.noResult = 0;
      
      var searchString = $stateParams.query;
      var lastPage = 1;
      $scope.searchProduct = function () {
            if( searchString == null )
                return;
          
          console.log("Searching for "+searchString+" page = "+lastPage);
          trulo.searchProduct(searchString, lastPage, function(response){
              lastPage++;
              if( response == null || response.length == 0){
                  console.log("no more data  = 1");
                  $scope.noMoreData = 1;
                  return;
              }
              else
                  $scope.noMoreData = 0;

              console.log("In controller received productData as ");
              console.log(response);
              for(var i = 0; i < response.length; i++){
                  $scope.products.push(response[i]);
              }
          });
          
        }

  }
]);
