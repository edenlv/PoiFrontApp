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
                        oResponse.data.Rating = oResponse.data.Rating === 0 ? "0%" : (oResponse.data.Rating-1)*100/4 + "%";
                        console.log(oResponse.data);
                        return oResponse.data;
                    },
                    function(oErr){
                        waitDialog.hide();
                        console.log("error loading pid "+ sPID);
                    }
                )
                },

                poiReviews: function($http){
                    waitDialog.show();

                    return $http.get(propService.getServiceURL() + 'poi/' + sPID + '/lastreviews', {ignore: true}).then(
                        function(oResponse){
                            waitDialog.hide();
                            console.log(oResponse.data);
                            $(oResponse.data).each(
                                (idx, elem) => {
                                    elem.DateFormatted = moment(new Date(elem.Date)).format("Do MMMM YYYY")
                                }
                            )
                            return oResponse.data;
                        },
                        function(oErr){
                            waitDialog.hide();
                            console.log("error loading pid reviews"); console.log(oErr);
                            
                        }
                    )
                }
            }
          });

    }



    function DialogController($scope, $mdDialog, poiData, poiReviews) {

        $scope.isRegistered = function(){
            return AuthService.loggedIn;
        }

        $scope.poiReviews = poiReviews;

        $scope.currPoi = poiData;

        $scope.hide = function() {
          $mdDialog.hide();
        };
    
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
      }




}]);


