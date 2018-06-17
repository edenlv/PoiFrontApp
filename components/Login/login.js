angular.module('citiesApp').controller('loginCtrl',
    ['$scope','$http','Validator', '$mdDialog', 'waitDialog', 'AuthService' , function($scope, $http, jValidator, $mdDialog, waitDialog, AuthService) {
    
        $scope.$on('$routeChangeSuccess', function(){
            jValidator.initLoginForm($scope.submitLoginForm);
        })

        $scope.$on('login-error', function(event, oArgs){
            $scope.showAlert(event);
        })

        // $scope.$on('login-start', function(event, oArgs){
        //     waitDialog.show();
        // })

        // $scope.$on('login-end', function(event, oArgs){
        //     waitDialog.hide();
        // })

        $scope.showAlert = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('body')))
                .clickOutsideToClose(true)
                .title('Error while logging in!')
                .textContent('Username and/or password are incorrect. Please try again.')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent(ev)
            );
          };

          $scope.submitLoginForm = function (form) {
            console.log("Form submitted");
            
            AuthService.login({
                Username: form.username.value,
                Password: form.password.value
            })

            return false;
        }

    
    }]);