'use strict';

angular.module('users').directive('location', [

    function() {
        return {
            templateUrl: 'modules/users/client/views/settings/location-directive.client.view.html',
            restrict: 'E',
            scope: {
                address: '=address',
                current_location: '=location'
            },
            link: function postLink(scope, element, attrs) {
                var geoFlag = false;
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
                    return geoFlag;
                };

                scope.onClick = function() {
                    scope.windowOptions.visible = !scope.windowOptions.visible;
                };


                //detecting users current location using geolocation api

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        scope.location.latitude = position.coords.latitude
                        scope.location.longitude = position.coords.longitude;
                        scope.current_location = scope.location;

                        geoFlag = true;
                        //map
                        scope.map.center = scope.location;
                        scope.map.zoom = 19;
                        scope.map.options.draggable = false;

                        //marker
                        scope.marker.position = scope.location;
                        scope.marker.key = 2;
                        scope.marker.options = {
                            draggable: false
                        };

                        scope.$apply()
                        //console.log(scope.map);
                    });
                } else {
                    geoFlag = false;
                    console.log("Geolocation cannot be found");
                }

                /////////////////////end of geolocation////////////////////////////

                scope.$watch("scope.address", function(oldVal, newVal) {
                    console.log(scope.address + " Changed");
                    if (geoFlag == false) {
                        var geocoder = new google.maps.Geocoder();
                        geocoder.geocode({
                            "address": scope.address
                        }, function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                                scope.location.latitude = results[0].geometry.location.lat();
                                scope.location.longitude = results[0].geometry.location.lng();
                                console.log(scope.location);
                                scope.map.center = scope.location;
                                scope.map.zoom = 6;
                                scope.map.options.draggable = true;

                                //marker
                                scope.marker.position = scope.location;
                                scope.marker.key = 1;
                                scope.marker.options = {
                                    draggable: true
                                };
                                scope.marker.events = {
                                    dragend: function(marker, eventName, args) {
                                        console.log('marker dragend' + scope.address);
                                        scope.location.latitude = marker.getPosition().lat();
                                        scope.location.longitude = marker.getPosition().lng();
                                        scope.current_location = scope.location;
                                    }
                                };
                                console.log(scope.marker);
                                scope.$apply()
                            } else {
                                console.log(status);
                            }
                        });
                    }
                });
            }
        };
    }
]);