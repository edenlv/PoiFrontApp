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

                        //checks if the user toggled favorite in another place in the app
                        response.data.forEach(
                            (elem, idx) => {
                                var oPoi = propService.has(elem.PID)
                                if (oPoi) elem.isFavorite = oPoi.isFavorite;
                            }
                        );

                        $scope.recommendedPoi = response.data;
                    },

                    function (err) {
                        console.log(err)
                    }
                )

                $http.get(propService.getServiceURL() + 'reg/poi/lastsaved').then(
                    function (response) {

                        //checks if the user toggled favorite in another place in the app
                        response.data.forEach(
                            (elem, idx) => {
                                var oPoi = propService.has(elem.PID);
                                if (oPoi) elem.isFavorite = oPoi.isFavorite;
                                // if (!elem.isFavorite) response.data.splice(response.data.indexOf(elem), 1);
                            }
                        );

                        // response.data = response.data.filter(
                        //     (currPoi) => {
                        //         return currPoi.isFavorite;
                        //     }
                        // )

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