let app = angular.module('citiesApp', ["ngRoute", 'LocalStorageModule']);

app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    console.log("app.js loading")

    var self = this;

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
        .when('/service', {
            templateUrl: 'components/Services/service.html',
            controller: 'serviceController as srvCtrl'
        })
        .when('/reghome', {
            templateUrl: 'components/RegisteredHome/home.html',
            controller: 'regHomeController'
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










