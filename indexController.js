angular.module('citiesApp')
    .controller('indexController',  ['AuthService','localStorageModel','$location', function (AuthService, localStorageModel, $location) {
        console.log('init indexController')

        self = this;
        self.userName = AuthService.userName
        self.bLoggedIn = true;

    }]);
