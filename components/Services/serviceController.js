

angular.module('citiesApp')
    .service('AuthService',[ '$http','localStorageService','$location' , function ($http, localStorageService, $location) {
        console.log('init AuthService')
        var that = this;
        this.Username='';
        this.loggedIn = false;
        this.token = '';
        this.serverUrl = 'http://localhost:8080/';

        this.setToken = function (t) {
            that.token = t
            $http.defaults.headers.common[ 'x-access-token' ] = t
            // $httpProvider.defaults.headers.post[ 'x-access-token' ] = token
            console.log("set")

        }

        this.addLocalStorage = function (key, value) {
            var dataVal = localStorageService.get(key);
            console.log(dataVal)
            if (!dataVal)
            if (localStorageService.set(key, value)) {
                console.log("data added")
            }
            else
                console.log('failed to add the data');
        }



        this.getLocalStorage= function (key)
        {
           return  localStorageService.get(key)
        }

        this.updateLocalStorage = function (key,value)
        {
            localStorageService.remove(key);
            localStorageService.set(key,value);
        }
 
        this.init = function(){
            return new Promise(function (resolve, reject){
            var tok = that.getLocalStorage('token');

            if (tok) {
                $http.get(that.serverUrl + '/reg/me').then(
                    function (response){
                        that.login(tok, response.Username);
                        resolve();
                    },
                    function (eResponse){
                        that.tok = '';
                        reject();
                        
                    }
                )
            }

        });
        }


        this.login = function(sToken, sUsername){
            if (!sToken || !sUsername) return false;

            that.Username = sUsername;
            that.setToken(sToken);
        }


    }])

    
    // .controller('serviceController', ['$location', '$http', 'setHeadersToken','localStorageModel', function ($location, $http, setHeadersToken,localStorageModel) {
    //     console.log('init servicecontrolle controller()')

    //     self = this;

    //     self.directToPOI = function () {
    //         $location.path('/poi')
    //     }

    //     let serverUrl = 'http://localhost:8080/'

    //     let user = {
    //         userName: "Shir",
    //         password: "abcd",
    //         isAdmin: true
    //     }


    //     self.signUp = function () {
    //         // register user
    //         $http.post(serverUrl + "Users/", user)
    //             .then(function (response) {
    //                 //First function handles success
    //                 self.signUp.content = response.data;
    //             }, function (response) {
    //                 //Second function handles error
    //                 self.signUp.content = "Something went wrong";
    //             });
    //     }

    //     self.login = function () {
    //         // register user
    //         $http.post(serverUrl + "Users/login", user)
    //             .then(function (response) {
    //                 //First function handles success
    //                 self.login.content = response.data.token;
    //                 setHeadersToken.set(self.login.content)


    //             }, function (response) {
    //                 //Second function handles error
    //                 self.login.content = "Something went wrong";
    //             });
    //     }

    //     self.reg = function () {
    //         // register user
    //         $http.post(serverUrl + "reg/", user)
    //             .then(function (response) {
    //                 //First function handles success
    //                 self.reg.content = response.data;

    //             }, function (response) {
    //                 self.reg.content = response.data
    //                 //Second function handles error
    //                 // self.reg.content = "Something went wrong";
    //             });
    //     }

    //     self.addTokenToLocalStorage = function () {
    //         localStorageModel.addLocalStorage('token', self.login.content)
    //     }



    // }]);
