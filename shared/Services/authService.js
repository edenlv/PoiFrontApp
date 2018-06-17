

angular.module('citiesApp')
    .service('AuthService', [ '$rootScope','$location','propService', '$http', 'waitDialog', 'localStorageService',
    function ($rootScope, $location, propService, $http, waitDialog, localStorageService) {
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


        this.login = function(oLoginDetails){
            if (!oLoginDetails.Username || !oLoginDetails.Password) return false;

            waitDialog.show();

            $http.post(propService.serviceUrl + 'users/login', oLoginDetails).then(
            function(response){
                if (response.data.success && response.data.token){
                    that.loggedIn = true;
                    that.setToken(response.data.token);
                    $location.path('reghome');

                    $rootScope.$broadcast('login-success', { Username: oLoginDetails.Username })


                } else {

                    $rootScope.$broadcast('login-error', response.data);

                    //do something - modal dialog with error...
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