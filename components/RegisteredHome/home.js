angular.module('citiesApp').controller('regHomeController', ['$scope', 'AuthService', '$http', 'propService', function ($scope, AuthService, $http, propService) {

    $scope.$on('$routeChangeSuccess', function () {
        if (AuthService.loggedIn) {
            console.log("IM LOGGED IN!!")
            console.log(AuthService.token)
        } else {
            console.log("IM NOT LOGGED IN")
        }

        $http.get(propService.serviceUrl + 'reg/poi/recommended').then(
            function (response) {
                $scope.recommendedPoi = response.data;
            },

            function (err) {
                console.log(err)
            }
        )

        $http.get(propService.serviceUrl + 'reg/poi/lastsaved').then(
            function (response) {
                $scope.lastsavedPoi = response.data;
            }
        )


    })

    $scope.openPoiDialog = function (scope) {
        poiDialog.open(scope.card.PID);
    }




}]);