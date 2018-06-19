angular.module('citiesApp').controller('forgotpwCtrl',
    ['$scope', '$http', 'Validator', '$mdDialog', 'waitDialog', 'AuthService', 'propService',
        function ($scope, $http, jValidator, $mdDialog, waitDialog, AuthService, propService) {

            $scope.firstStage = true;
            $scope.sPassword = '';

            $scope.$on('$routeChangeSuccess', function(){
                jValidator.initGetQuestionForm($scope.submitForm1);
                jValidator.initGetPasswordForm($scope.submitForm2);
            })

            $scope.submitForm1 = function(form){
                waitDialog.show();
                $http.post(propService.getServiceURL() + '/users/getPWRestoreQuestion', {Username: form.username.value}).then(
                    function(oResponse){
                        if (oResponse.data.Question && oResponse.data.Question2){
                        $scope.uname = form.username.value;
                        $scope.aQuestions = [oResponse.data.Question, oResponse.data.Question2];
                        $scope.firstStage = false;
                        } else {
                            $scope.showAlertWrongUsername();
                        }
                        waitDialog.hide();
                    },
                    function(oErr){
                        $scope.showAlertWrongUsername();
                    }
                )
            }

            $scope.submitForm2 = function(form){
                waitDialog.show();
                $http.post(propService.getServiceURL() + '/users/getPassword', {
                    Username: $scope.uname,
                    Answer: form.answer1.value,
                    Answer2: form.answer2.value
                }).then(
                    function(oResponse){
                        console.log(oResponse);
                        if (oResponse.data.Password) $scope.sPassword = oResponse.data.Password;
                        else $scope.showAlertWrongAnswers();
                        waitDialog.hide();
                    },
                    function(oErr){
                        waitDialog.hide();
                        $scope.showAlertWrongAnswers();
                    }
                )
            }

            $scope.showAlertWrongUsername = function () {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('body')))
                        .clickOutsideToClose(true)
                        .title('Error while getting restore questions!')
                        .textContent('There is no such user. Please try again.')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                );
            };


            $scope.showAlertWrongAnswers = function () {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('body')))
                        .clickOutsideToClose(true)
                        .title('Error while getting password!')
                        .textContent('One of the answers are incorrect. Please try again.')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                );
            };
            
        }]);