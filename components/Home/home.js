angular.module('citiesApp').controller('homeController', ['$scope','$http','propService', function($scope, $http, propService) {

    $scope.$on('$routeChangeSuccess', function(){
        $http.get(propService.serviceUrl + 'poi/footer').then(
            function(response){
                $scope.footerData = response.data;
            }
        )
    })

}]);