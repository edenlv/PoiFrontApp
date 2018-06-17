app.factory('waitDialog', ['$mdDialog', function ($mdDialog) {
    var oService = {
        show: () => {

                if ($('#myDialog').css('visibility') === 'hidden') {
                    var pDialog = $mdDialog.show({
                        contentElement: '#myDialog',
                        parent: angular.element(document.body),
                        multiple: true,
                        clickOutsideToClose: false,
                        onComplete: function(scope, element){
                            console.log("oncomplete");
                        }
                    });

                    pDialog.then( () => console.log('closing wait dialog') , () => { console.log('rejecting dialog promise')});
                    oService.setDialog(pDialog);
                    // if (pDialog) pDialog.then(() => {}).catch(()=>{});
                }

        },

        hide: () => {

                if ($('#myDialog').css('visibility') !== 'hidden')
                    var pDialog = $mdDialog.hide([oService.getDialog()]);
                //     // if (pDialog) pDialog.then(() => {}).catch(()=>{});


        },

        setDialog: (dialog) => oService._dialog = dialog,
        getDialog: () => { return oService._dialog; }
    }

    return oService;
}])