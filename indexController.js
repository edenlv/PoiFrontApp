angular.module('citiesApp')
    .controller('indexController',
    ['$scope', 'AuthService', '$location', 'propService', '$http',
        function ($scope, AuthService, $location, propService, $http) {
            var self = this;

            $scope.onRouteSuccess = function () {

            }

            $scope.$on('$routeChangeSuccess', $scope.onRouteSuccess);

            $scope.$on('fav-counter-update', function(event, oData){
                propService.favCount = oData.Count;
                self.favCount = propService.favCount;
            });

            
            self.Username = AuthService.userName
            self.bLoggedIn = false;

            $scope.logout = function(){
                AuthService.logout();
            }

            $scope.isRegistered = function () {
                return AuthService.loggedIn;
            }

            $scope.saveFavToDB = propService.saveFavorites;

            $scope.$on('login-success', function (event, args) {
                self.bLoggedIn = true;
                self.Username = args.Username;

                $http.get(propService.getServiceURL() + 'reg/poi/favlist/count').then(
                    function (oResponse) {
                        propService.favCount = oResponse.data.Count;
                        self.favCount = oResponse.data.Count;
                    }, function (oErr) {
                        console.log(oErr);
                    }
                )

            });

            $scope.$on('logout', function(event, args){
                self.bLoggedIn = false;
                self.Username = '';
                self.favCount = '';
            });

        }]);
