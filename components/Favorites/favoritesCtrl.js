angular.module('citiesApp')
    .controller('favoritesCtrl',
    ['$scope', '$http', 'propService', '$mdDialog', 'poiDialog', 'AuthService', '$timeout', 'orderByFilter', 'waitDialog',
        function ($scope, $http, propService, $mdDialog, poiDialog, AuthService, $timeout, orderBy, waitDialog) {


            $scope.openPoiDialog = function (scope) {
                poiDialog.open(scope.card);
            }

            $scope.getRowOrder = function () {
                if (!$scope.favlist.length) return [];
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

                        if (oResponse.data.length) {
                            if (propService.aFavSet.length) oResponse.data = oResponse.data.concat(propService.aFavSet);

                            oResponse.data.forEach(
                                (elem, idx) => {

                                    if (!favOrders.length) elem.Order = idx + 1;
                                    else elem.Order = favOrders.indexOf(elem.PID) + 1;
                                    elem.isFavorite = true;

                                    elem.pRating = elem.Rating === 0 ? "0%" : ((elem.Rating - 1) * 100 / 4).toFixed(2) + "%";
                                }
                            );

                            
                            $scope.favlist = oResponse.data;
                            
                        }

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
                var newFavList = [];
                angular.forEach($scope.favlist, function(c){
                    if (c!==card) newFavList.push($.extend({}, c, true));
                });
                $scope.favlist = newFavList;
                $scope.filtered = $scope.newFavList;
                card.isFavorite = false
                propService.delFromFav(card);
                $timeout($scope.updateRowOrder,500);
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
                waitDialog.show();

                if (propService.aFavSet.length) {
                    propService.saveFavorites(reorder);
                } else reorder();

                function reorder() {
                    var orders = $scope.getRowOrder();
                    $http.post(propService.getServiceURL() + 'reg/poi/setfavorder', orders)
                        .then(
                        function (oResponse) {
                            if (oResponse.data.success)
                                waitDialog.hide().finally(() => {
                                    $mdDialog.show(
                                        $mdDialog.alert()
                                            .parent(angular.element(document.querySelector('body')))
                                            .clickOutsideToClose(true)
                                            .title('Successful!')
                                            .textContent('Favorites and favorites order have been saved.')
                                            .ariaLabel('Sucessful')
                                            .ok('OK')
                                    );

                                })

                        },
                        function (oErr) {
                            console.log(oErr);
                        }
                        )
                }
            }


        }]);