'use strict';

angular.module('users').directive('location', [

    function() {
        return {
            templateUrl: 'modules/users/client/views/settings/location-directive.client.view.html',
            restrict: 'E',
            scope: {
                address: '=address'
            },
            link: function postLink(scope, element, attrs) {
                scope.geoFlag = false;
                scope.location = {
                    latitude: 27,
                    longitude: 58
                }
                scope.map = {
                    center: scope.location,
                    zoom: 6,
                    options: {
                        streetViewControl: false,
                        scrollwheel: false,
                    }
                };
                scope.marker = {
                    key: 1,
                    position: scope.location,
                    decimals: 4
                };

                scope.windowOptions = {
                    visible: false,
                    title: "This is your current Location"
                };

                //methods
                scope.onGeoLoc = function() {
                    return scope.geoFlag;
                };

                scope.onClick = function() {
                    scope.windowOptions.visible = !scope.windowOptions.visible;
                };


                //detecting users current location using geolocation api

                if (navigator.geolocation) {

                    navigator.geolocation.getCurrentPosition(function(position) {
                        scope.geoFlag = true;
                        console.log(scope.geoFlag);
                        scope.location.latitude = position.coords.latitude
                        scope.location.longitude = position.coords.longitude;
                        scope.address.location = scope.location;

                        //map
                        scope.map.center = scope.location;
                        scope.map.zoom = 19;
                        scope.map.options.draggable = false;

                        //marker
                        scope.marker.position = scope.location;
                        scope.marker.key = 2;
                        scope.marker.options = {
                            draggable: true
                        };

                        scope.marker.events = {
                            dragend: function(marker, eventName, args) {
                                console.log('marker dragend' + scope.address);
                                scope.location.latitude = marker.getPosition().lat();
                                scope.location.longitude = marker.getPosition().lng();
                                scope.address.location = scope.location;
                            }
                        };

                        scope.$apply()
                        //console.log(scope.map);
                    });
                } else {
                    scope.geoFlag = false;
                    console.log("Geolocation cannot be found");
                }

                /////////////////////end of geolocation////////////////////////////

                scope.$watchGroup(["address.city","address.state","address.taluka"], function(newVal, oldVal) {
                    if (scope.geoFlag == false) {
                        var geocoder = new google.maps.Geocoder();
                        var current_address = scope.address.taluka + " " + scope.address.city + " " + scope.address.state + " India";
                        //console.log(current_address);
                        geocoder.geocode({
                            "address": current_address
                        }, function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                                scope.location.latitude = results[0].geometry.location.lat();
                                scope.location.longitude = results[0].geometry.location.lng();
                                //console.log(scope.location);
                                scope.map.center = scope.location;
                                scope.map.zoom = 15;
                                scope.map.options.draggable = true;

                                //marker
                                scope.marker.position = scope.location;
                                scope.marker.key = 1;
                                scope.marker.options = {
                                    draggable: true
                                };
                                scope.marker.events = {
                                    dragend: function(marker, eventName, args) {
                                        //console.log('marker dragend' + scope.address);
                                        scope.location.latitude = marker.getPosition().lat();
                                        scope.location.longitude = marker.getPosition().lng();
                                        scope.address.location = scope.location;
                                    }
                                };
                                //console.log(scope.marker);
                                scope.$apply()
                            } else {
                                console.log(status);
                            }
                        });
                    }
                }, true);
            }
        };
    }
]);