angular.module('citiesApp')
    .service('poiDialog', ['$rootScope', 'propService', '$http', '$mdDialog', 'waitDialog', 'AuthService', '$location',
        function ($rootScope, propService, $http, $mdDialog, waitDialog, AuthService, $location) {

            var that = this;


            that.open = function (oPoi) {

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

                            return $http.get(propService.getServiceURL() + 'poi/' + oPoi.PID, { ignore: true }).then(
                                function (oResponse) {

                                    oResponse.data.Rating = oResponse.data.Rating === 0 ? "0%" : (oResponse.data.Rating - 1) * 100 / 4 + "%";
                                    if (oPoi.Order) oResponse.data.Order = oPoi.Order;
                                    oResponse.data.isFavorite = oPoi.isFavorite;
                                    console.log(oResponse.data);
                                    return $.extend(oPoi, oResponse.data, false);
                                },
                                function (oErr) {

                                    console.log("error loading pid " + oPoi.PID);
                                }
                            )
                        },

                        poiReviews: function ($http) {

                            return $http.get(propService.getServiceURL() + 'poi/' + oPoi.PID + '/lastreviews', { ignore: true }).then(
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



            function DialogController($scope, $mdDialog, poiData, poiReviews, waitDialog, propService, $location) {

                console.log('controller')

                $scope.toggleFavBtn = propService.toggleFavBtn;

                $scope.isRegistered = function () {
                    return AuthService.loggedIn;
                }

                $scope.isFavView = $location.path().includes('favorites');

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


