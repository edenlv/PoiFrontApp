let app = angular.module('citiesApp', ["ngRoute", 'LocalStorageModule', 'ngMaterial', 'ngMessages']);

app.config(['$locationProvider', '$routeProvider', '$httpProvider',
    function ($locationProvider, $routeProvider, $httpProvider) {
        console.log("app.js loading")

        var self = this;
        var serverUrl = 'http://poinodeapp.azurewebsites.net/';

        $locationProvider.hashPrefix('');

        $httpProvider.interceptors.push('httpRequestInterceptor');

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

        AuthService.checkLogin();
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






