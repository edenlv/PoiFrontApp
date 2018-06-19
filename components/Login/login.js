angular.module('citiesApp').controller('loginCtrl',
    ['$scope', '$http', 'Validator', '$mdDialog', 'waitDialog', 'AuthService', '$location',
        function ($scope, $http, jValidator, $mdDialog, waitDialog, AuthService, $location) {

            $scope.$on('$routeChangeSuccess', function () {
                jValidator.initLoginForm($scope.submitLoginForm);
            })

            $scope.$on('login-error', function (event, oArgs) {
                $scope.showAlert(event);
            })

            $scope.showAlert = function (ev) {
                
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

            $scope.goToForgotPW = function () {
                $location.path('/forgotpw');
            }


        }]);