angular.module('citiesApp').controller('regHomeController', ['$scope', 'AuthService', function ($scope, AuthService) {

    $scope.$on('$routeChangeSuccess', function () {
        if (AuthService.loggedIn) {
            console.log("IM LOGGED IN!!")
            console.log(AuthService.token)
        } else {
            console.log("IM NOT LOGGED IN")
        }
    })


}]);