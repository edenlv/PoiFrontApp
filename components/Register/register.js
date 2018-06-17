angular.module('citiesApp').controller('registerCtrl',
    ['$scope', '$http', 'Validator', 'propService', '$mdDialog', '$location',
        function ($scope, $http, jValidator, propService, $mdDialog, $location) {

            $scope.aCountries = [];
            $scope.selectedCountry = '';

            $scope.onSubmitForm = function (form) {
                console.log("Form submitted");

                var oData = {
                    Username: form.username.value,
                    Password: form.password.value,
                    FirstName: form.firstname.value,
                    LastName: form.lastname.value,
                    City: form.city.value,
                    Country: form.country.selectedOptions[0].innerHTML,
                    Email: form.email.value,
                    Category: form.categories.selectedOptions[0].value.split(','),
                    Question: form.question1.value,
                    Answer: form.answer1.value,
                    Question2: form.question2.value,
                    Answer2: form.answer2.value
                }

                function err(oResponse){

                    $mdDialog.show(
                        $mdDialog.alert()
                          .parent(angular.element(document.querySelector('body')))
                          .clickOutsideToClose(true)
                          .title('Error while registering!')
                          .textContent(oResponse.data.message.message)
                          .ariaLabel('Registration ERROR')
                          .ok('OK')
                      );

                      
                }



                $http.post(propService.getServiceURL() + 'users', oData, propService.getXHRwaitConfig()).then(
                    function(oResponse){
                        
                        if (oResponse.data.success){
                            
                            $mdDialog.show(
                                $mdDialog.alert()
                                  .parent(angular.element(document.querySelector('body')))
                                  .clickOutsideToClose(true)
                                  .title('Registration Successful!')
                                  .textContent(oResponse.data.message)
                                  .ariaLabel('Registration Sucessful')
                                  .ok('OK')
                              ).then(
                                () => $location.path('/login')
                              );

                        } else err(oResponse);
                    },
                    function(oError){
                        err(oError);
                    }
                )

                

                return false;
            }

            $scope.onRouteSuccess = function () {
                jValidator.initRegisterForm($scope.onSubmitForm);

                $http.get('resources/countries.xml').then(
                    function(oResult){
                        var oData = $($.parseXML(oResult.data));
                        $(oData).find('Name').each(
                            (idx, elem) => {
                                 $scope.aCountries.push({label: elem.innerHTML, index: idx});
                                }
                            )
                        $scope.aCountries.sort();

                    },
                    function(err){
                        console.log(err);
                    }
                )

            }

            $scope.onChangeCountry = function(){
                console.log("changed")
            }

            $scope.$on('$routeChangeSuccess', $scope.onRouteSuccess)

            $scope.aCategories = [
                { name: 'Entertainment' },
                { name: 'Restaurant' },
                { name: 'Brewery' },
                { name: 'Culture' }
            ]




        }]);