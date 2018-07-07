angular.module('citiesApp')
    .service('AuthService', [ '$rootScope','$location','propService', '$http', 'waitDialog', 'localStorageService', '$timeout', '$route',
    function ($rootScope, $location, propService, $http, waitDialog, localStorageService, $timeout, $route) {
        console.log('init AuthService')

        var that = this;
        window.auths = this;
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

        this.logout = function(){
            localStorageService.remove('user');
            localStorageService.remove('token');
            that.Username = '';
            that.loggedIn = false;
            that.token = '';
            $rootScope.$broadcast('logout');
            $location.path('/');
        }

        this.checkLogin = function(){
            var token = localStorageService.get('token');
            var user = localStorageService.get('user');
            if (token && user){
                that.loggedIn = true;
                that.setToken(token);
                that.setUsername(user);
                $timeout(()=>{this.onLoginSuccess(token, user)},0);
            }
        }

        this.onLoginSuccess = function(sToken, sUser){
            that.loggedIn = true;
            that.setToken(sToken);
            that.setUsername(sUser);
            if ($location.path()==='/login') $location.path('/reghome');
            else $route.reload();
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