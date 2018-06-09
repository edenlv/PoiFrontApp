angular.module('citiesApp')
.factory('propService', ['$http', 'localStorageService', '$location', function ($http, localStorageService, $location) {
    return {
        serviceUrl: 'http://poinodeapp.azurewebsites.net/'
    }
}]);