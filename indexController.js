angular.module('citiesApp')
    .controller('indexController', ['setHeadersToken', function (setHeadersToken) {


        self = this;

        console.log('init indexController')
        self.userName = setHeadersToken.userName

    }]);
