angular.module('citiesApp')
    .controller('indexController',  ['$scope', 'AuthService','$location', function ($scope, AuthService, $location) {
        console.log('init indexController')

        self = this;
        self.Username = AuthService.userName
        self.bLoggedIn = false;

        $scope.isRegistered = function() {
            return AuthService.loggedIn;
        }

        $scope.$on('login-success', function(event, args){
            self.bLoggedIn = true;
            self.Username = args.Username;
        });

    }]);
