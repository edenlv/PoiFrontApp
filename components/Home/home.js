angular.module('citiesApp').controller('homeController',
    ['$scope', '$http', 'propService', '$mdDialog', 'poiDialog',
    function ($scope, $http, propService, $mdDialog, poiDialog) {

        $scope.onRouteSuccess = function () {
            $http.get(propService.serviceUrl + 'poi/footer').then(
                function (response) {
                    $scope.footerData = response.data;
                }
            )
        }

        $scope.$on('$routeChangeSuccess', $scope.onRouteSuccess);

        $scope.openPoiDialog = function(scope){
            poiDialog.open(scope.card);
        }

    }]);