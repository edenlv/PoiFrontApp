angular.module('citiesApp')
    .controller('favoritesCtrl',
    ['$scope', '$http', 'propService', '$mdDialog', 'poiDialog', 'AuthService', '$timeout', 'orderByFilter',
        function ($scope, $http, propService, $mdDialog, poiDialog, AuthService, $timeout, orderBy) {


            $scope.openPoiDialog = function (scope) {
                poiDialog.open(scope.card);
            }

            $scope.getRowOrder = function () {

                $scope.favlist.sort((a, b) => {
                    return a.Order - b.Order
                });

                var orders = [];
                $scope.favlist.forEach(
                    (elem, idx) => {
                        orders.push(elem.PID);
                    }
                )
                return orders;
            }

            window.gsd = $scope.getRowOrder;

            $scope.onRouteSuccess = function () {
                $http.get(propService.getServiceURL() + 'reg/poi/favlist').then(
                    function (oResponse) {
                        var favOrders = propService.getFavOrders();

                        oResponse.data.forEach(
                            (elem, idx) => {

                                if (!favOrders.length) elem.Order = idx + 1;
                                else elem.Order = favOrders.indexOf(elem.PID) + 1;
                                elem.isFavorite = true;
                            }
                        );
                        $scope.favlist = oResponse.data;
                        console.log($scope.favlist);

                        if (!favOrders.length) propService.setFavOrders($scope.getRowOrder());

                    }, function (oErr) {
                        console.log('Error while getting favorites list');
                        console.log(oErr);
                    }
                )
            }

            $scope.$on('$routeChangeSuccess', $scope.onRouteSuccess);

            $scope.updateRowOrder = function () {
                $timeout(
                    () => {
                        $('#favtable tbody').children().each(
                            (index, elem) => {
                                angular.element(elem).scope().card.Order = index + 1;

                            })
                    }, 0);
            }

            $scope.deleteFavRow = function (card) {
                $scope.favlist.splice($scope.favlist.indexOf(card), 1);
                card.isFavorite = false;
                propService.delFromFav(card);
                $scope.updateRowOrder();
            }

            $("#favtable tbody").sortable({
                update: $scope.updateRowOrder
            });

            $("#favtable tbody").disableSelection();


            $scope.aCategories = [
                'Brewery',
                'Culture',
                'Entertainment',
                'Restaurant'
            ]



            $scope.selectedItem = undefined;
            $scope.reverse = true;

            $scope.getSelectedText = function () {
                if ($scope.selectedItem !== undefined) {
                    return $scope.selectedItem;
                } else {
                    return "Category";
                }
            };
            $scope.sorted = false;
            var that = this;

            $scope.sortByRating = function ($event) {
                $($event.currentTarget).find('svg').toggleClass('ng-hide');
                $scope.sorted = true;
                $scope.reverse = !$scope.reverse;

                $scope.favlist = orderBy($scope.favlist, 'Rating', $scope.reverse);
            }

            $scope.filter = function () {
                $scope.nameFilter = $scope.sf_poiname;
                $scope.catFilter = $scope.catFilter === 'All Categories' ? '' : $scope.selectedItem;
            }

            $scope.sf_poiname = undefined;

            $scope.saveOrder = function () {
                var orders = $scope.getRowOrder();
                $http.post(propService.getServiceURL() + '/reg/poi/setfavorder', orders)
                    .then(
                    function (oResponse) {
                        console.log(oResponse.data);

                    },
                    function (oErr) {
                        console.log(oErr);
                    }
                    )
            }


        }]);