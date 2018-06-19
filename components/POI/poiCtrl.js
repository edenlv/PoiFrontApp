angular.module('citiesApp')
    .controller('poiCtrl',
    ['$scope', '$http', 'propService', '$mdDialog', 'poiDialog', 'orderByFilter', 'AuthService',
        function ($scope, $http, propService, $mdDialog, poiDialog, orderBy, AuthService) {

            $scope.toggleFavBtn = propService.toggleFavBtn;

            $scope.openPoiDialog = function(scope){
                poiDialog.open(scope.card.PID);
            }

            $scope.isRegistered = function () {
                return AuthService.loggedIn;
            }

            $scope.onRouteSuccess = function () {
                $http.get(propService.serviceUrl + 'poi').then(
                    function (response) {
                        $scope.allpoi = response.data;
                    }
                )
            }

            $scope.$on('$routeChangeSuccess', $scope.onRouteSuccess);

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
                
                $scope.allpoi = orderBy($scope.allpoi, 'Rating', $scope.reverse);
            }

            $scope.filter = function(){
                $scope.nameFilter = $scope.sf_poiname;
                $scope.catFilter = $scope.selectedItem;
            }

            $scope.sf_poiname = undefined;

            

        }]);
