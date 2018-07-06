angular.module('citiesApp')
    .factory('propService', ['$location', '$http', 'waitDialog', '$route', '$rootScope', '$mdDialog', function ($location, $http, waitDialog, $route, $rootScope, $mdDialog) {
        var oService = {

            aFavSet: [],

            addToFav: function (oPoi) {
                if (oPoi) {
                    if (oService.has(oPoi.PID)) {
                        oService.has(oPoi.PID).isFavorite = true;
                    }
                    else {
                        oService.aFavSet.push(oPoi);
                    }

                    $rootScope.$broadcast('fav-counter-update', { Count: oService.favCount + 1 });
                }
            },

            toggleFavBtn: function ($event, card) {
                var jqButton = $($event.currentTarget);
                card.isFavorite = !card.isFavorite;
                $($event.currentTarget).toggleClass('colorYellow');
                if (oService.has(card.PID)) {
                    oService.remove(card.PID);
                    var newCount = card.isFavorite ? oService.favCount + 1 : oService.favCount - 1;
                    $rootScope.$broadcast('fav-counter-update', { Count: newCount });
                } else {
                    if (jqButton.hasClass('colorYellow')) oService.addToFav(card);
                    else oService.delFromFav(card);
                }
            },

            delFromFav: function (oPoi) {
                if (oPoi) {
                    if (oService.has(oPoi.PID)) {
                        oService.has(oPoi.PID).isFavorite = false;
                    }
                    else {
                        oService.aFavSet.push(oPoi);
                    }

                    $rootScope.$broadcast('fav-counter-update', { Count: oService.favCount - 1 });
                }
            },

            remove: function (sPID) {
                oService.aFavSet.splice(oService.aFavSet.indexOf(oService.has(sPID)), 1);
            },

            getRecentFavs: function () {
                var result = [];

                oService.aFavSet.reverse().forEach(
                    (elem, idx) => {
                        if (result.length < 2 && elem.isFavorite) result.push(elem);
                    }
                );

                oService.aFavSet.reverse();
                return result;
            },

            saveFavorites: function () {
                console.log($location);
                if (oService.aFavSet.length === 0) return;
                waitDialog.show()
                return $http.post(oService.getServiceURL() + '/reg/poi/setfavs', oService.aFavSet).then(
                    function (oResponse) {
                        if (oResponse.data.success)
                            waitDialog.hide().finally(() => {
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .parent(angular.element(document.querySelector('body')))
                                        .clickOutsideToClose(true)
                                        .title('Successful!')
                                        .textContent(oResponse.data.message)
                                        .ariaLabel('Sucessful')
                                        .ok('OK')
                                );

                            })

                        console.log(oResponse);

                    },
                    function (oErr) {
                        console.log(oErr);
                    }
                ).finally(
                    function () {
                        oService.aFavSet = [];
                        $route.reload();
                    }
                    )
            },

            getFavOrders: function () {
                return oService.orders ? oService.orders : [];
            },

            setFavOrders: function (aOrder) {
                oService.orders = $.extend({}, aOrder, true);
            },

            //returns first obj in array that complies with the expression
            has: function (sPID) {
                return oService.aFavSet.find(
                    function (oPoi, idx, arr) {
                        return oPoi.PID.toString() === sPID.toString();
                    }
                )
            },

            serviceUrl: 'https://poinodeapp.azurewebsites.net/',
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