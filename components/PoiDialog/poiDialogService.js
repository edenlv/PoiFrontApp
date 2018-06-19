angular.module('citiesApp')
    .service('poiDialog', ['$rootScope', 'propService', '$http', '$mdDialog', 'waitDialog', 'AuthService',
        function ($rootScope, propService, $http, $mdDialog, waitDialog, AuthService) {

            var that = this;


            that.open = function (sPID) {

                waitDialog.show();

                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'components/PoiDialog/poi_dialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    multiple: true,
                    onComplete: waitDialog.hide,
                    resolve: {
                        poiData: function ($http) {

                            return $http.get(propService.getServiceURL() + 'poi/' + sPID, { ignore: true }).then(
                                function (oResponse) {

                                    oResponse.data.Rating = oResponse.data.Rating === 0 ? "0%" : (oResponse.data.Rating - 1) * 100 / 4 + "%";
                                    console.log(oResponse.data);
                                    return oResponse.data;
                                },
                                function (oErr) {

                                    console.log("error loading pid " + sPID);
                                }
                            )
                        },

                        poiReviews: function ($http) {

                            return $http.get(propService.getServiceURL() + 'poi/' + sPID + '/lastreviews', { ignore: true }).then(
                                function (oResponse) {

                                    console.log(oResponse.data);
                                    $(oResponse.data).each(
                                        (idx, elem) => {
                                            elem.DateFormatted = moment(new Date(elem.Date)).format("Do MMMM YYYY")
                                        }
                                    )
                                    return oResponse.data;
                                },
                                function (oErr) {

                                    console.log("error loading pid reviews"); console.log(oErr);

                                }
                            )
                        }
                    }
                });

            }



            function DialogController($scope, $mdDialog, poiData, poiReviews, waitDialog, propService) {

                console.log('controller')

                $scope.toggleFavBtn = propService.toggleFavBtn;

                $scope.isRegistered = function () {
                    return AuthService.loggedIn;
                }

                $scope.poiReviews = poiReviews;

                $scope.card = poiData;

                $scope.hide = function () {
                    $mdDialog.hide();
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            }

            function ReviewDialogController($scope, $mdDialog, propService){

                $scope.reviewText = '';

                $scope.stars = 0;

            }




        }]);


