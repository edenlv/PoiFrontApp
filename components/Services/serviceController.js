

angular.module('citiesApp')
    .service('AuthService', [ '$rootScope', '$http','localStorageService','$location','propService' , function ($rootScope, $http, localStorageService, $location,propService) {
        console.log('init AuthService')
        var that = this;
        this.Username='';
        this.loggedIn = false;
        this.token = '';
        this.serverUrl = 'http://localhost:8080/';

        this.setToken = function (t) {
            that.token = t
            $http.defaults.headers.common[ 'x-access-token' ] = t
            that.addLocalStorage('token', t);
            console.log("set token complete")

        }

        this.addLocalStorage = function (key, value) {
            if (localStorageService.set(key, value)) 
                console.log("Token was added to LocalStorage successfully")
            
            else
                console.log('Failed to write token to LocalStorage');
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


        this.login = function(oLoginDetails){
            if (!oLoginDetails.Username || !oLoginDetails.Password) return false;

            $http.post(propService.serviceUrl + 'users/login', oLoginDetails).then(
            function(response){
                if (response.data.success && response.data.token){
                that.loggedIn = true;
                that.setToken(response.data.token);
                $location.path('reghome');

                $rootScope.$broadcast('login-success', { Username: oLoginDetails.Username })

                } else {
                    //do something - modal dialog with error...
                    console.log("error login")
                    console.log(response);
                }
            },
            function(error){

                //do something - modal dialog with error...
                console.log("error login")
                console.log(error);
            })
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
