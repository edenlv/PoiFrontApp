

angular.module('citiesApp')
    .service('AuthService', [ '$rootScope','$location','propService', '$http', 'waitDialog', 'localStorageService', '$timeout',
    function ($rootScope, $location, propService, $http, waitDialog, localStorageService, $timeout) {
        console.log('init AuthService')

        var that = this;
        this.Username='';
        this.loggedIn = false;
        this.token = '';
        this.serverUrl = propService.getServiceURL();

        this.setToken = function (t) {
            that.token = t
            that.addLocalStorage('token', t);
            console.log("set token complete")
        }

        this.setUsername = function(sUser){
            that.Username = sUser;
            that.addLocalStorage('user', sUser);
            console.log("set user to local storage complete");
        }

        this.getToken = () => { return that.token };
        

        this.addLocalStorage = function (key, value) {
            if (localStorageService.set(key, value)) 
                console.log("Token was added to LocalStorage successfully")
            
            else
                console.log('Failed to write token to LocalStorage');
        }
 
        // this.init = function(){
        //     return new Promise(function (resolve, reject){
        //     var tok = localStorageService.get('token');

        //     if (tok) {
        //         $http.get(that.serverUrl + '/reg/me').then(
        //             function (response){
        //                 that.login(tok, response.Username);
        //                 resolve();
        //             },
        //             function (eResponse){
        //                 that.tok = '';
        //                 reject();
                        
        //             }
        //         )
        //     }

        // });
        // }

        this.checkLogin = function(){
            var token = localStorageService.get('token');
            var user = localStorageService.get('user');
            if (token && user){
                $timeout(()=>{this.onLoginSuccess(token, user)},0);
            }
        }

        this.onLoginSuccess = function(sToken, sUser){
            that.loggedIn = true;
            that.setToken(sToken);
            that.setUsername(sUser);
            $location.path('reghome');
            $rootScope.$broadcast('login-success', { Username: sUser })
        }

        this.login = function(oLoginDetails){
            if (!oLoginDetails.Username || !oLoginDetails.Password) return false;

            waitDialog.show();

            $http.post(propService.serviceUrl + 'users/login', oLoginDetails).then(
            function(response){
                if (response.data.success && response.data.token){
                    
                    that.onLoginSuccess(response.data.token, oLoginDetails.Username);

                } else {

                    $rootScope.$broadcast('login-error', response.data);

                    console.log("error login")
                    console.log(response);
                }
                waitDialog.hide();
            },
            function(error){
                waitDialog.hide();
                $rootScope.$broadcast('login-error', error.data);
                console.log("error login")
                console.log(error);
            })
        }


    }])