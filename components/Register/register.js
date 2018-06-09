angular.module('citiesApp').controller('registerCtrl', ['$scope','$http','Validator', function($scope, $http, jValidator) {
    
        $scope.$on('$routeChangeSuccess', function(){
            jValidator.initRegisterForm();
        })

    
    }]);