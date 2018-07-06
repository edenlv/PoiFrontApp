let app = angular.module('citiesApp', ["ngRoute", 'LocalStorageModule', 'ngMaterial', 'ngMessages']);

app.config(['$locationProvider', '$routeProvider', '$httpProvider',
    function ($locationProvider, $routeProvider, $httpProvider) {
        console.log("app.js loading")

        var self = this;
        var serverUrl = 'http://poinodeapp.azurewebsites.net/';

        $locationProvider.hashPrefix('');

        $httpProvider.interceptors.push('httpRequestInterceptor');
        $httpProvider.interceptors.push('httpTokenInterceptor');

        $routeProvider.when('/', {
            templateUrl: 'components/Home/home.html',
            controller: 'homeController'
        })
            .when('/about', {
                templateUrl: 'components/About/about.html',
                controller: 'aboutController'
            })
            .when('/poi', {
                templateUrl: 'components/POI/poi.html',
                controller: 'poiCtrl'
            })
            .when('/reghome', {
                templateUrl: 'components/RegisteredHome/home.html',
                controller: 'regHomeController'
            })
            .when('/login', {
                templateUrl: 'components/Login/login.html',
                controller: 'loginCtrl'
            })
            .when('/register', {
                templateUrl: 'components/Register/register.html',
                controller: 'registerCtrl'
            })
            .when('/forgotpw', {
                templateUrl: 'components/ForgotPW/forgotPW.html',
                controller: 'forgotpwCtrl'
            })
            .when('/favorites', {
                templateUrl: 'components/Favorites/favorites.html',
                controller: 'favoritesCtrl'
            })
            .otherwise({ redirectTo: '/' });
    }]);

// app.run(
//     function($rootScope, AuthService) {
//         $rootScope.$on('$routeChangeStart',
//             function(event, next, current) {
//                 console.log("running");
//                 AuthService.init().then(
//                     function(){ console.log("User authentication successful") }
//                 ).catch(function(){$location.path('/'); console.log("User auth failed!!")});
//             }
//     )}
// )

app.run(
    function ($rootScope, $location, AuthService, localStorageService) {
        AuthService.checkLogin();

        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            var registeredOnly = ['/reghome', '/favorites']
            var unregOnly = ['/', '/login', '/register'];

            if (!AuthService.loggedIn) {
                if (next.$$route && registeredOnly.includes(next.$$route.originalPath)) {
                    event.preventDefault();
                    $location.path('/');
                }
            } else {
                if (next.$$route && unregOnly.includes(next.$$route.originalPath)) {
                    event.preventDefault();
                    $location.path('/reghome');
                }
            }
        })

        
    }
)



app.factory('httpRequestInterceptor', ['$injector', function ($injector) {
    var fnHide = function (req) {
        // if (req.config && !req.config.ignore) $injector.get('waitDialog').hide();
        return req;
    }

    return {
        request: function (config) {
            config.headers['x-access-token'] = $injector.get('AuthService').getToken();
            // if (config.config && !config.config.ignore && config.url.includes('http://azurewebsites.net') && !$injector.get('$http').pendingRequests.length)
            //     $injector.get('waitDialog').show();
            return config;
        },
        requestError: fnHide,
        response: fnHide,
        responseError: fnHide

    };
}]);

app.factory('httpTokenInterceptor', ['$injector', function($injector){


    return {
        response: function(req){
             if (req.config.url.includes('azurewebsites')) console.log(req);
            return req;
        },
        responseError: function(req){
            if (req.config.url.includes($injector.get('propService').getServiceURL())) {
                if (req.status != 200 && req.data.message.includes('token')){
                    $injector.get('AuthService').logout();
                    if ($injector.get('$location').path() !== '/'){
                        $injector.get('$location').path('/');
                    }
                }
            }
            return req;
        }
    }
}]);






