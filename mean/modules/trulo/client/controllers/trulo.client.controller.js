'use strict';
angular.module('trulo').controller('TruloController', [
  '$scope'
  , 'Trulo'
    , function ($scope, trulo) {

        $scope.lastPageLoaded = [];
        $scope.products = [];
        $scope.busy = false;
        $scope.breadCrumbs = [];
        $scope.nextCategory = 1; //category id of dairy tab
        // Controller Logic
        // ...
        $scope.getCategories = function () {
            
            console.log('Fetching categories in controller');
            trulo.getCategories(function (catsResponse,pageResponse,productsResponse) {
                console.log('Categories fetched successfully');
                
                $scope.categories = catsResponse;
                $scope.lastPageLoaded = pageResponse;
                $scope.products = productsResponse;
                //console.log($scope.categories[1].title);
            });
        };

        $scope.fetchNextPage = function (catID, flag) {
            $scope.nextCategory = catID;
            //if( flag == 0)
            //return;


            if ($scope.busy) return;
            $scope.busy = true;



            trulo.getProductsByCat(catID, $scope.lastPageLoaded[catID], $scope.products
                , function (productsResponse, lastPageResponse, busyResponse) {
                    $scope.productsOfCurrentCat = productsResponse;
                    $scope.lastPageLoaded[catID] = lastPageResponse;
                    $scope.busy = busyResponse;
                }
            );
        }

        $scope.getSubCat = function (parent) {

            trulo.getCategories(function (cats) {

            });
        }

        $scope.scrollTop = function () {
            $(document).scrollTop(0);
        }
        $scope.setBreadArray = function (cat, i) {

            if (i == 0) {
                // this is called by a top-level category
                $scope.breadCrumbs = [];

            }
            /*else{
                if( $scope.breadCrumbs.length > 1){
                    $scope.breadCrumbs.pop();
                }
            }*/
            $scope.breadCrumbs.push(cat);
            if ($scope.breadCrumbs.length == 3)
                $scope.hideMe = 1;
            else
                $scope.hideMe = 0;

        };
    }
]);