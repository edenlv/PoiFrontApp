angular.module('citiesApp')
    .factory('propService', ['$location', '$http', 'waitDialog', function ($location, $http, waitDialog) {
        var oService = {
            
            aFavSet: [],
            addToFav: function(sPID){
                if (sPID) {
                    if (oService.has(sPID)){
                        oService.has(sPID).isFavorite = true;
                    }
                    else oService.aFavSet.push({PID: sPID, isFavorite: true});
                }
            },

            toggleFavBtn: function($event, card){
                var jqButton = $($event.currentTarget);

                $($event.currentTarget).toggleClass('colorYellow');

                if (jqButton.hasClass('colorYellow')) oService.addToFav(card.PID);
                else oService.delFromFav(card.PID);
            },

            delFromFav: function(sPID){
                if (sPID) {
                    if (oService.has(sPID)){
                        oService.has(sPID).isFavorite = false;
                    }
                    else oService.aFavSet.push({PID: sPID, isFavorite: false});
                }
            },

            saveFavorites: function(){
                $http.post(oService.getServiceURL() + '/reg/poi/setfavs', oService.aFavSet).then(
                    function(oResponse){
                        console.log(oResponse);
                    },
                    function (oErr){
                        console.log(oErr);
                    }
                ).finally(
                    function(){
                        oService.aFavSet = [];
                    }
                )
            },

            //returns first obj in array that complies with the expression
            has: function(sPID){
                return oService.aFavSet.find(
                    function(oPoi, idx, arr){
                        return oPoi.PID.toString() === sPID.toString();
                    }
                )
            },

            serviceUrl: 'http://poinodeapp.azurewebsites.net/',
            // serviceUrl: 'http://localhost:8080/',

            getServiceURL: function () {
                return this.serviceUrl
            },

            getXHRwaitConfig: function () {
                return {
                    eventHandlers: {
                        progress: () => waitDialog.show(),
                        readystatechange: () => waitDialog.hide()
                    }
                }
            }
        }
        window.oService = oService;
        return oService;
    }]);