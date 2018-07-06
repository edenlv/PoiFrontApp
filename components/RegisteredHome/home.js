angular.module('citiesApp').controller('regHomeController',
    ['$scope', 'AuthService', '$http', 'propService', 'poiDialog',
        function ($scope, AuthService, $http, propService, poiDialog) {

            $scope.toggleFav = propService.toggleFavBtn;

            $scope.$on('$routeChangeSuccess', function () {
                if (AuthService.loggedIn) {
                    console.log("IM LOGGED IN!!")
                    console.log(AuthService.token)
                } else {
                    console.log("IM NOT LOGGED IN")
                }

                $http.get(propService.getServiceURL() + 'reg/poi/recommended').then(
                    function (response) {

                        $scope.loaded = true;

                        //checks if the user toggled favorite in another place in the app
                        if (response.data.length){
                            response.data.forEach(
                                (elem, idx) => {
                                    var oPoi = propService.has(elem.PID)
                                    if (oPoi) elem.isFavorite = oPoi.isFavorite;

                                    elem.Rating = elem.Rating === 0 ? "0%" : ((elem.Rating - 1) * 100 / 4).toFixed(2) + "%";
                                }
                            );
                            $scope.recommendedPoi = response.data;
                        }

                        
                    },

                    function (err) {
                        // console.log(err)
                    }
                )

                $http.get(propService.getServiceURL() + 'reg/poi/lastsaved').then(
                    function (response) {

                        
                        if (response.data.length){
                        response.data.forEach(
                            (elem, idx) => {
                                //checks if the user toggled favorite in another place in the app
                                var oPoi = propService.has(elem.PID);
                                if (oPoi) elem.isFavorite = oPoi.isFavorite;
                                // if (!elem.isFavorite) response.data.splice(response.data.indexOf(elem), 1);

                                elem.Rating = elem.Rating === 0 ? "0%" : ((elem.Rating - 1) * 100 / 4).toFixed(2) + "%";
                            }
                        );
                    }

                        var recents = propService.getRecentFavs();
                        if (recents.length) {
                            recents.forEach(() => response.data.shift());
                            response.data = recents.concat(response.data);
                        }

                        $scope.lastsavedPoi = response.data;
                    }
                )


            })

            $scope.openPoiDialog = function (scope) {
                poiDialog.open(scope.card);
            }




        }]);