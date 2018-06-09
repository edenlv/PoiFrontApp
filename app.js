let app = angular.module('citiesApp', ["ngRoute", 'LocalStorageModule']);

app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    console.log("app.js loading")

    var self = this;
    var serverUrl = 'http://poinodeapp.azurewebsites.net/';

    $locationProvider.hashPrefix('');


    $routeProvider.when('/', {
        templateUrl: 'components/Home/home.html',
        controller: 'homeController'
    })
        .when('/about', {
            templateUrl: 'components/About/about.html',
            controller: 'aboutController as abtCtrl'
        })
        .when('/poi', {
            templateUrl: 'components/POI/poi.html',
            controller: 'poiCtrl as poiCtrl'
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
    function($rootScope, $location, AuthService) {
        $rootScope.$on('$routeChangeStart', function(event, next, current){
            var registeredOnly = ['/reghome']
            var unregOnly = ['/', '/login', '/register'];

            if (!AuthService.loggedIn){
                if (next.$$route && registeredOnly.includes(next.$$route.originalPath)){
                    event.preventDefault();
                    $location.path('/');
                }
            } else {
                if (next.$$route && unregOnly.includes(next.$$route.originalPath)){
                    event.preventDefault();
                    $location.path('/reghome');
                }
            }
        })
    }
)







