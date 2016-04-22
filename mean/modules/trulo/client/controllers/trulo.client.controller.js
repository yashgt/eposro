'use strict';
angular.module('trulo').controller('TruloController', [
  '$scope', 'Trulo', 'Mycart','Order','$mdToast'
    
    , function ($scope, trulo, myCart, order,$mdToast) {
        /*
            $scope.categories : All the top level categories
            $scope.subCategories : All the subCategories of current tab
            $scope.childCategories : All the next-level categories of current category
        */

        $scope.map = {};
        $scope.noMoreData = 0;
        var products = {};
        var lastPageLoaded = {};
        $scope.busy = false;
        $scope.nextCategory = 1; //category id of dairy tab
        $scope.cartCount = 0;
        $scope.delivery = 0;
        $scope.quantity = 0;
        $scope.count = $scope.quantity;
        $scope.isCollapsed = false;
        $scope.order_mode = 1;
        var products = [];
        
        var getIndexOfTitle = function (x, array) {
            for (var i = 0; i < array.length; i++) {
                if (x == array[i].title)
                    return i;
            }
            return -1;
        }
        var getIndexOfId = function (x, array) {

            for (var i = 0; i < array.length; i++) {
                if (x == array[i].catID)
                    return i;
            }
            return -1;
        }

        var getParent = function (catID) {
            var i = getIndexOfId(catID, $scope.categories);
            if (i != -1)
                return $scope.categories[i].parentCatId;

            i = getIndexOfId(catID, $scope.subCategories);
            if (i != -1)
                return $scope.subCategories[i].parentCatId;
        }
        var getCategoryTitle = function (catID) {
            var i = getIndexOfId(catID, $scope.categories);
            if (i != -1)
                return $scope.categories[i].title;

            i = getIndexOfId(catID, $scope.subCategories);
            if (i != -1)
                return $scope.subCategories[i].title;
        }

        var popBread = function (catID) {
            //TODO display products by applying filters
            //console.log("Popping " + catID);
            var cat = getCategoryTitle(catID);
            //console.log("Popping " + cat);
            var i = getIndexOfTitle(cat, $scope.breadCrumbs);
            //var i = $scope.breadCrumbs.indexOf(cat);
            $scope.breadCrumbs.splice(i, $scope.breadCrumbs.length - i);
        }
        var breadExists = function (catID) {
            var i = getIndexOfId(catID, $scope.breadCrumbs);
            if (i == -1)
                return 0;
            else
                return 1;
        }
        $scope.showProducts = function (catID) {
            //make a SOLR query to fetch products of this catID
            console.log("Show products of " + catID);

            $scope.activateHomeTab = 0;
            
            if (($scope.breadCrumbs != undefined) && breadExists(catID)) {
                popBread(catID);
                $scope.hideMe = 0;
                $scope.getSubCat(catID);
            }
            $scope.fetchNextPage(catID, 0);
            setBreadArray(catID,0);
        }

        var getCategories = function () {
            //console.log('Fetching categories in controller');
            trulo.getCategories(0, function (catsResponse) {
                $scope.categories = catsResponse;
                //console.log(catsResponse[3].title);
                for(var i = 0; i < $scope.categories.length; i++){
                    products[catsResponse[i].catID] = [];
                    lastPageLoaded[catsResponse[i].catID] = 0;
                }
            });
        };

        if ($scope.categories == undefined) {
            getCategories();
        }

        $scope.fetchNextPage = function (catID, flag) {
            $scope.nextCategory = catID;
            //console.log("Inside fetchNextPage");
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
            //if (products == undefined || products['catID'])
            trulo.getProductsByCat(catID, lastPageLoaded[catID], products
                , function (productsResponse, lastPageResponse, busyResponse) {
                    if( productsResponse == null){
                        console.log("No more data folks in controller");
                        $scope.noMoreData = true;
                        return;
                    }
                    console.log("Received resp of length "+productsResponse.length);
                    $scope.products = productsResponse;
                    lastPageLoaded[catID] = lastPageResponse;
                    $scope.productsOfCurrentCat = $scope.products[catID];
                    $scope.busy = busyResponse;
                }
            );
        };

        var isSubSetOf = function (array1, array2) {
            for (var i = 0; i < array1.length; i++) {
                if (getIndexOfId(array1[i].catID, array2) != -1)
                    return 1;
            }
            return 0;
        }
        $scope.getSubCat = function (parent) {
            if (getParent(parent) == 0)
                $scope.subCategories = [];

            //console.log("Fetching subcategories of parent = " + parent);
            trulo.getCategories(parent, function (catsResponse, pageResponse, productsResponse) {
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

        $scope.scrollTop = function () {
            $(document).scrollTop(0);
        };

        var setBreadArray = function (catID) {
            var parentCatId = getParent(catID);
            var cat = getCategoryTitle(catID);
            //console.log("Found parent as : "+parentCatId);
            //console.log("Setting breadcrumb for "+cat);
            if ($scope.breadCrumbs == undefined || parentCatId == 0) {
                $scope.breadCrumbs = [];
            }
            $scope.breadCrumbs.push({
                title: cat
                , catID: catID
            });
        };

        $scope.showHomeTab = function () {
            $scope.activateHomeTab = 1;
        }
        $scope.fetchCart = function () {
            myCart.fetchCart(3, function (cartResponse) {
                if( cartResponse != null){
                    $scope.cart = cartResponse;
                    $scope.emptyCart = 0;
                }
                else{
                    $scope.emptyCart = 1;
                    console.log("Cartresponse recvd");
                    $scope.cart = [];
                }
                //console.log($scope.cart.products);
            });
        }


        $scope.updateCart = function (count) {
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
        var openToast = function($event) {
            $mdToast.show($mdToast.simple().textContent('Your order has been successfully placed'));
                // Could also do $mdToast.showSimple('Hello');
        };
        $scope.placeOrder = function() {
            
            console.log($scope.cart);
            if ($scope.cart == null || $scope.cart == undefined) {
                return;
            } else if ($scope.cart.length == 0) {
                return;
            } else {
                $scope.cart.order_mode = $scope.order_mode;
                order.placeOrder(3, function(orderResponse) {
                    myCart.fetchCart(3, function(cartResponse) {
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
            //openToast();
            
            //order.placeOrder(3,$scope.cart,function(orderResponse){});
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
                console.log(res);
                myCart.fetchCart(3, function(cartResponse) {
                    
                    if (cartResponse != null) {
                        $scope.cart = cartResponse;
                        $scope.emptyCart = 0;
                    } else {
                        console.log("Cartresponse recvd");
                        $scope.cart = [];
                        $scope.emptyCart = 1;
                    }
                });

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
                myCart.fetchCart(3, function(cartResponse) {
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
                myCart.fetchCart(3, function(cartResponse) {
                    if (cartResponse != null) {
                        $scope.cart = cartResponse;
                        
                    } else {
                        console.log("Cartresponse recvd");
                        $scope.cart = [];
                    }
                });
            });
        }


    }
]);