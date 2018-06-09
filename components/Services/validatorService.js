
angular.module('citiesApp')
    .factory('Validator', ['$http', 'localStorageService', '$location', 'AuthService', function ($http, localStorageService, $location, AuthService) {

        $.validator.addMethod("lettersonly", (value, element) => {
            return /^[a-zA-Z]+$/i.test(value);
        }, "Name must contain alphabetical letters only.");

        $.validator.addMethod("alphanumeric", (value, element) => {
            return /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(value);
        }, "Password must contain letters AND numbers.");

        console.log("init Validator factory")

        var Validator = {
            validators: {},

            initLoginForm: function(){
                // if (!this.validators['login']) {
                //     this.validators['login'] =
                    $('#form_login').validate({
                        rules: {
                            username: {
                                minlength: 1,
                                required: true
                            },
                            password: {
                                required: true,
                                minlength: 1
                            }
                        },
                        highlight: function (element) {
                            $(element).parent().addClass('err').removeClass('valid');
                        },
                        success: function (element) {
                            element.parent().addClass('valid');
                            element.parent().removeClass('err');
                        },
                        submitHandler: function (form) {
                            console.log("Form submitted");

                            AuthService.login({
                                Username: form.username.value,
                                Password: form.password.value
                            })

                            return false;
                        }
                    });
                // }
            },

            initRegisterForm: function () {
                // if (!this.validators['register']) {
    
                //     this.validators['register'] = 
                    $('#form_register').validate({
                        rules: {
                            username: {
                                minlength: 2,
                                required: true
                            },
                            password: {
                                required: true,
                                minlength: 8,
                                alphanumeric: true
                            },
                            email: {
                                required: true,
                                email: true
                            },
                            firstname: {
                                required: true,
                                lettersonly: true
                            },
                            lastname: {
                                required: true,
                                lettersonly: true
                            },
                            birthday: {
                                required: true
                            }
    
                        },
                        highlight: function (element) {
                            console.log("highlighting");
                            $(element).parent().addClass('err').removeClass('valid');
                        },
                        success: function (element) {
                            element.parent().addClass('valid');
                            element.parent().removeClass('err');
                        },
                        submitHandler: function (form) {
                            console.log("Form submitted");
    
                            if (Model.register(form.username.value, form.password.value)) {
                                if (Model.login(form.username.value, form.password.value))
                                    onLoginSuccess();
                            } else {
                                onRegisterError();
                            }
    
                            return false;
                        }
                    });
                // }
            },

            resetForm: function(sId){
                $('#form_' + sId).get(0).reset();
                Validator.validators[sId].resetForm();
                $('.valid').removeClass('valid');
            }
        }

        return Validator;
    }]);