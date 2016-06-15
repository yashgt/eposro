'use strict';
angular.module('trulo').controller('TruloController', [
    '$scope', 'Trulo', 'Mycart', 'Order', '$uibModal', '$mdSidenav'

    ,
    function($scope, trulo, myCart, order, $uibModal, $mdSidenav) {
        /*
            $scope.categories : All the top level categories
            $scope.subCategories : All the subCategories of current tab
            $scope.childCategories : All the next-level categories of current category
        */

        $scope.map = {};
        //$scope.noMoreData = 0;
        var products = {};
        var lastPageLoaded = {};
        $scope.busy = false;
        $scope.nextCategory = 1;
        $scope.cartCount = 0;
        $scope.delivery = 0;
        $scope.quantity = 0;
        $scope.count = $scope.quantity;
        $scope.isCollapsed = false;
        $scope.order_mode = 1;
        $scope.currentBrand = null;
        $scope.currentCategory = null;
        $scope.selectedBrands = '*';
        var products = [];

        //fetch recommendation products using the following function
        trulo.getRecommendations(function(response){
            console.log("Calling recc from trulo.contr");
            $scope.recommendations = response;            
        });
        
        var getIndexOfTitle = function(x, array) {
            for (var i = 0; i < array.length; i++) {
                if (x == array[i].title)
                    return i;
            }
            return -1;
        }
        var getIndexOfId = function(x, array) {

            for (var i = 0; i < array.length; i++) {
                if (x == array[i].catID)
                    return i;
            }
            return -1;
        }

        var getParent = function(catID) {
            var i = getIndexOfId(catID, $scope.categories);
            if (i != -1)
                return $scope.categories[i].parentCatId;

            i = getIndexOfId(catID, $scope.subCategories);
            if (i != -1)
                return $scope.subCategories[i].parentCatId;
        }
        var getCategoryTitle = function(catID) {
            var i = getIndexOfId(catID, $scope.categories);
            if (i != -1)
                return $scope.categories[i].title;

            i = getIndexOfId(catID, $scope.subCategories);
            if (i != -1)
                return $scope.subCategories[i].title;
        }

        var popBread = function(catID) {
            //TODO display products by applying filters
            //console.log("Popping " + catID);
            var cat = getCategoryTitle(catID);
            //console.log("Popping " + cat);
            var i = getIndexOfTitle(cat, $scope.breadCrumbs);
            //var i = $scope.breadCrumbs.indexOf(cat);
            $scope.breadCrumbs.splice(i, $scope.breadCrumbs.length - i);
        }
        var breadExists = function(catID) {
            var i = getIndexOfId(catID, $scope.breadCrumbs);
            if (i == -1)
                return 0;
            else
                return 1;
        }

        var findCategoryLevel = function(catID, level = -1) {
            //console.log("Finding level of catID = "+catID);
            if (catID == 0) {
                //console.log("Returning level = "+level);
                return level;
            }

            var parentCatID = getParent(catID);
            level = findCategoryLevel(parentCatID, ++level);
            return level;
        }
        var getBrands = function(catID) {
            console.log("Getting brands for " + catID);
            var catlevel = findCategoryLevel(catID);
            trulo.getBrands(catID, catlevel, function(res) {
                $scope.brands = res;
            });
        }
        var getFacets = function(catID) {
            var catlevel = findCategoryLevel(catID);
            trulo.getFacets(catID, catlevel, function(res) {
                $scope.facets = res;
            });
        }

        $scope.brandFilterEvent = function(brand){
            if( $scope.selectedBrands.indexOf(brand) == -1){
                console.log("Adding brand to array");
                $scope.showProducts($scope.currentCategory,brand);
            }
                
            else{
                //unchecking a checkbox is as good as deleting this brand chip
                $scope.deleteChip(brand);
            } 
                
        }
        $scope.deleteChip = function(brand) {
            var brandIndex = $scope.selectedBrands.indexOf(brand);

            if (brandIndex != -1) {
                $scope.selectedBrands.splice(brandIndex, 1);
                $scope.removeBrandFilter();
            }
        }
        $scope.removeBrandFilter = function() {

            //remove the products of the removed chip
            $scope.activateHomeTab = 0;
            lastPageLoaded[$scope.currentCategory] = 0;
            products[$scope.currentCategory] = [];
            $scope.noMoreData = false;
            console.log($scope.selectedBrands);
            if ($scope.selectedBrands.length == 0)
                $scope.selectedBrands = '*';
            $scope.fetchNextPage($scope.currentCategory, $scope.selectedBrands);


            //uncheck the removed brand from the filter list

            //$scope.removedChip = chip;

            //when brand unchecked from filter list remove the products of that brand
        }
        $scope.filterByBrand = function(catID, brand) {
            console.log("Show products of " + catID + " and brand=" + brand);
            lastPageLoaded[catID] = 0;
            products[catID] = [];
            $scope.noMoreData = false;

        }
        $scope.showProducts = function(catID, brand = '*') {

            //console.log("Brand = "+brand);
            $scope.currentCategory = catID; //used to pass to this function during filtering based on brands
            $scope.currentBrand = brand;
            if (brand != '*') {
                if ($scope.selectedBrands == '*')
                    $scope.selectedBrands = [];
                $scope.selectedBrands.push(brand);
            } //console.log("Show products of " + catID);

            $scope.activateHomeTab = 0;
            lastPageLoaded[catID] = 0;
            products[catID] = [];
            $scope.noMoreData = false;

            if (brand == '*')
                getBrands(catID);
            if (findCategoryLevel(catID) == 1) {
                console.log("Getting facet attr");
                getFacets(catID);
            }

            if (($scope.breadCrumbs != undefined) && breadExists(catID)) {
                popBread(catID);
                $scope.hideMe = 0;
                $scope.getSubCat(catID);
            }
            if (brand == '*')
                $scope.fetchNextPage(catID, brand);
            else
                $scope.fetchNextPage(catID, $scope.selectedBrands);
            setBreadArray(catID, 0);
        }

        var getCategories = function() {

            //console.log('Fetching categories in controller');
            trulo.getCategories(0, function(catsResponse) {
                $scope.categories = catsResponse;
                //console.log(catsResponse[3].title);
                for (var i = 0; i < $scope.categories.length; i++) {
                    products[catsResponse[i].catID] = [];
                    lastPageLoaded[catsResponse[i].catID] = 0;
                }
            });
        };

        if ($scope.categories == undefined) {
            getCategories();
        }

        $scope.fetchNextPage = function(catID, brand = '*') {
            $scope.nextCategory = catID;
            /*
                var products = {
                    '101' : [
                        {
                            pid: 200,
                            pname: "Hangyo Mango Kulfi"
                        },
                        {
                            pid: 201,
                            pname: "SriKrishna Curd"
                        },
                        {
                            pid: 202,
                            pname: "Amul Milk Powder"
                        }
                    ],
                    '102' : [
                        {
                            pid: 900,
                            pname: "Layz Potato Chips"
                        }
                    ]
              }
            */

            if ($scope.busy) return;
            $scope.busy = true;

            var catlevel = findCategoryLevel(catID);
            trulo.getProductsByCat(catID, lastPageLoaded[catID], catlevel, products, brand, function(productsResponse, lastPageResponse, busyResponse) {
                if (productsResponse == null) {
                    console.log("No more data folks in controller");
                    $scope.noMoreData = true;
                    return;
                }
                //console.log("Received resp of length "+productsResponse.length);
                $scope.products = productsResponse;
                lastPageLoaded[catID] = lastPageResponse;
                $scope.productsOfCurrentCat = $scope.products[catID];
                $scope.busy = busyResponse;
            });
        };

        var isSubSetOf = function(array1, array2) {
            for (var i = 0; i < array1.length; i++) {
                if (getIndexOfId(array1[i].catID, array2) != -1)
                    return 1;
            }
            return 0;
        }
        $scope.getSubCat = function(parent) {
            if (getParent(parent) == 0)
                $scope.subCategories = [];

            //console.log("Fetching subcategories of parent = " + parent);
            trulo.getCategories(parent, function(catsResponse, pageResponse, productsResponse) {
                //console.log('Sub Categories fetched successfully');

                if (catsResponse.length == 0)
                    $scope.hideMe = 1;
                else
                    $scope.hideMe = 0;
                //console.log(catsResponse);
                $scope.childCategories = catsResponse;
                if (!isSubSetOf(catsResponse, $scope.subCategories))
                    $scope.subCategories = $scope.subCategories.concat(catsResponse);
            });

        };

        $scope.scrollTop = function() {
            $(document).scrollTop(0);
        };

        var setBreadArray = function(catID) {
            var parentCatId = getParent(catID);
            var cat = getCategoryTitle(catID);
            //console.log("Found parent as : "+parentCatId);
            //console.log("Setting breadcrumb for "+cat);
            if ($scope.breadCrumbs == undefined || parentCatId == 0) {
                $scope.breadCrumbs = [];
            }
            $scope.breadCrumbs.push({
                title: cat,
                catID: catID
            });
        };

        $scope.showHomeTab = function() {
            $scope.activateHomeTab = 1;
        }
        $scope.fetchCart = function() {
            myCart.fetchCart(function(cartResponse) {
                if (cartResponse != null) {
                    $scope.cart = cartResponse;
                    $scope.emptyCart = 0;
                } else {
                    $scope.emptyCart = 1;
                    console.log("Cartresponse recvd");
                    $scope.cart = [];
                }
                //console.log($scope.cart.products);
            });
        }


        $scope.updateCart = function(count) {
            //console.log("In updateCart, count = "+count);
            if (count == null)
                return;
            if (count < $scope.quantity) {
                myCart.removeFromCart();
                //console.log("Call remove from cart");
            } else if (count > $scope.quantity) {
                myCart.addToCart();
                //console.log("Call add to cart");
            }
            $scope.quantity = count;
        }

        //cart related functions

       $scope.placeOrder = function() {
            if ($scope.cart == null || $scope.cart == undefined) {
                return;
            } else if ($scope.cart.length == 0) {
                return;
            } else {
                if($scope.order_mode==0){
                    var params={
                        order_mode:0,
                        max_walk_distance:$scope.max_walk_distance
                    };
                }
                else{
                    var params={
                        order_mode:1
                    }
                }
                order.placeOrder(params,function(orderResponse) {
                    console.log('hello Nihal');
                    myCart.fetchCart(function(cartResponse) {
                        if (cartResponse != null) {
                            console.log("Not Null response");
                            $scope.cart = cartResponse;
                            $scope.emptyCart = 0;
                        } else {
                            console.log("Cartresponse recvd");
                            $scope.cart = [];
                            $scope.emptyCart = 1;
                        }
                    });
                    console.log(orderResponse);
                    return;
                });   
            }   
        }

        $scope.addProd = function(pdt) {
            //console.log(pdt);
            var product = {};
            product._id = pdt.pid;
            product.name = pdt.name;
            product.price = pdt.price;
            product.count = pdt.count;
            //console.log(product);
            myCart.addToCart(product, function(res) {
                if (res === false) {
                    console.log(res+ "Hello");

                } else {
                    myCart.fetchCart(function(cartResponse) {

                        if (cartResponse != null) {
                            $scope.cart = cartResponse;
                            $scope.emptyCart = 0;
                        } else {
                            console.log("Cartresponse recvd");
                            $scope.cart = [];
                            $scope.emptyCart = 1;
                        }
                    });
                }

            });
        }
        $scope.subtractProd = function(pdt) {
            var product = {};
            product._id = pdt.pid;
            product.name = pdt.name;
            product.price = pdt.price;
            product.count = pdt.count;
            myCart.removeFromCart(product, function(res) {
                console.log(res);
                myCart.fetchCart(function(cartResponse) {
                    if (cartResponse != null) {
                        $scope.cart = cartResponse;
                        console.log("Cartresponse recvd");
                    } else {
                        $scope.cart = [];
                        console.log("Cartresponse recvd");
                    }
                });
            });
        }
        $scope.removeProductDirectly = function(pdt) {
            var product = {};
            product._id = pdt.pid;
            product.name = pdt.name;
            product.price = pdt.price;
            product.count = pdt.count;

            myCart.removeProductDirectly(product, function(res) {
                myCart.fetchCart(function(cartResponse) {
                    if (cartResponse != null) {
                        $scope.cart = cartResponse;

                    } else {
                        console.log("Cartresponse recvd");
                        $scope.cart = [];
                    }
                });
            });
        }

        $scope.animationsEnabled = true;

        $scope.open = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'order-confirm.html',
                size: size,
                controller: 'ConfirmOrderController',
                scope: $scope
            });


        };

        $scope.toggleAnimation = function() {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };

        //open the sidenav
        $scope.openLeftMenu = function() {

            $mdSidenav('left').toggle();

        };
        $scope.close = function() {
            $mdSidenav('left').close();
        };

        //For accordion
        $scope.oneAtATime = true;
    }
]);