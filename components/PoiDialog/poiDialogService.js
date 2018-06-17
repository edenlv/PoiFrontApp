angular.module('citiesApp')
.service('poiDialog', ['$rootScope','propService', '$http', '$mdDialog', 'waitDialog', 'AuthService',
function ($rootScope, propService, $http, $mdDialog, waitDialog, AuthService) {

    var that = this;

    that.open = function(sPID){

        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'components/PoiDialog/poi_dialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose:true,
            multiple: true,
            resolve: {
                poiData: function($http){
                    waitDialog.show();

                    return $http.get(propService.getServiceURL() + 'poi/' + sPID, {ignore: true}).then(
                    function(oResponse){
                        waitDialog.hide();
                        console.log(oResponse.data);
                        return oResponse.data;
                    },
                    function(oErr){
                        waitDialog.hide();
                        console.log("error loading pid "+ sPID);
                    }
                )
                }
            }
          });

    }

    that.isRegistered = function(){
        return AuthService.loggedIn;
    }



    function DialogController($scope, $mdDialog, poiData) {

        $scope.currPoi = poiData;

        $scope.hide = function() {
          $mdDialog.hide();
        };
    
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
      }




}]);


