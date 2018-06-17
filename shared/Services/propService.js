angular.module('citiesApp')
    .factory('propService', ['$location', 'waitDialog', function ($location, waitDialog) {
        return {
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
    }]);