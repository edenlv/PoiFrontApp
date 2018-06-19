angular.module('citiesApp')
    .controller('indexController', 
    ['$scope', 'AuthService','$location', 'propService',
    function ($scope, AuthService, $location, propService) {
        console.log('init indexController')

        self = this;
        self.Username = AuthService.userName
        self.bLoggedIn = false;

        $scope.isRegistered = function() {
            return AuthService.loggedIn;
        }

        $scope.saveFavToDB = propService.saveFavorites;

        $scope.$on('login-success', function(event, args){
            self.bLoggedIn = true;
            self.Username = args.Username;
        });

    }]);
