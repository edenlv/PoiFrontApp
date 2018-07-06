angular.module('citiesApp')
    .service('reviewDialog', ['$rootScope', 'propService', '$http', '$mdDialog', 'waitDialog', 'AuthService', '$location',
        function ($rootScope, propService, $http, $mdDialog, waitDialog, AuthService, $location) {

            var that = this;


            that.open = function (oPoi) {


                $mdDialog.show({
                    controller: ReviewDialogController,
                    templateUrl: 'components/ReviewDialog/review_dialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    multiple: true,
                    resolve: {
                        PID: () => { return oPoi.PID }
                    }
                });

            }


            function ReviewDialogController($rootScope, $scope, $mdDialog, PID) {

                $scope.reviewText = '';

                

                $scope.stars = 0;

                $scope.cancel = function () {
                    $mdDialog.hide();
                }

                $scope.addReview = function () {
                    if (!$scope.stars && $scope.reviewText === '') $scope.cancel();
                    else {
                        waitDialog.show();

                        var fnEnd = (res) => { waitDialog.hide(); $scope.cancel(); $rootScope.$broadcast('review-added');};

                        function savereview() {
                            $http.post(propService.getServiceURL() + 'reg/poi/addreviewtext', { PID: PID, ReviewText: $scope.reviewText })
                                .then(fnEnd);
                        }


                        // if ($scope.stars) {
                            
                        // } else {
                        //     savereview();
                        // }



                        if ($scope.stars && $scope.reviewText){

                            var promise1 = $http.post(propService.getServiceURL() + 'reg/poi/addrating', { PID: PID, Rating: $scope.stars });
                            promise1.then(savereview);

                        } else if ($scope.stars){

                            $http.post(propService.getServiceURL() + 'reg/poi/addrating', { PID: PID, Rating: $scope.stars })
                                .then(fnEnd);

                        } else if ($scope.reviewText){

                            savereview();

                        }

                    }
                }

            }

        }]);


