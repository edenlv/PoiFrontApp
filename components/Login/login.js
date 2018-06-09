angular.module('citiesApp').controller('loginCtrl', ['$scope','$http','Validator', function($scope, $http, jValidator) {
    
        $scope.$on('$routeChangeSuccess', function(){
            jValidator.initLoginForm();
        })

    
    }]);