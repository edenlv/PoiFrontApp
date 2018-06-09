angular.module('citiesApp')
    .controller('indexController',  ['$scope', 'AuthService','localStorageModel','$location', function ($scope, AuthService, localStorageModel, $location) {
        console.log('init indexController')

        self = this;
        self.Username = AuthService.userName
        self.bLoggedIn = false;

        $scope.$on('login-success', function(event, args){
            self.bLoggedIn = true;
            self.Username = args.Username;
        });

    }]);
