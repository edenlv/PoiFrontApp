
angular.module('citiesApp')
    .factory('Validator', ['$http', '$location',
        function ($http, $location) {

            $.validator.addMethod("lettersonly", (value, element) => {
                return /^[a-zA-Z]+$/i.test(value);
            }, "Name must contain alphabetical letters only.");

            $.validator.addMethod("alphanumeric", (value, element) => {
                return /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(value);
            }, "Password must contain letters AND numbers.");

            $.validator.addMethod("multiselect_min2", (value, element) => {
                return angular.element(element).scope().selectedToppings.length >= 2
            }, "You must pick at least 2 categories");

            $.validator.addMethod("select_country", (value, element) => {
                return angular.element(element).scope().selectedCountry.label
            }, "You must select a country")

            console.log("init Validator factory")

            var Validator = {
                validators: {},

                initLoginForm: function (fnSubmit) {

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
                        submitHandler: fnSubmit
                    });
                },

                initRegisterForm: function (fnSubmit) {
                    // if (!this.validators['register']) {

                    //     this.validators['register'] = 
                    window.eden = $('#form_register').validate({
                        rules: {
                            username: {
                                minlength: 3,
                                maxlength: 8,
                                required: true,
                                lettersonly: true
                            },
                            password: {
                                required: true,
                                minlength: 5,
                                maxlength: 10,
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
                            question1: {
                                required: true
                            },
                            answer1: {
                                required: true
                            },
                            question2: {
                                required: true
                            },
                            answer2: {
                                required: true
                            },
                            city: {
                                required: true
                            },
                            country: {
                                required: true,
                                select_country: true
                            },
                            categories: {
                                required: true,
                                multiselect_min2: true
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
                        submitHandler: fnSubmit
                    });
                    // }
                },

                initGetQuestionForm: function(fnSubmit){
                    $('#form_forgot').validate({
                        rules: {
                            username: {
                                minlength: 1,
                                required: true
                            }
                        },
                        highlight: function (element) {
                            $(element).parent().addClass('err').removeClass('valid');
                        },
                        success: function (element) {
                            element.parent().addClass('valid');
                            element.parent().removeClass('err');
                        },
                        submitHandler: fnSubmit
                    });
                },

                initGetPasswordForm: function(fnSubmit){
                    $('#form_forgot2').validate({
                        rules: {
                            username: {
                                minlength: 1,
                                required: true
                            },
                            answer1: {
                                minlength: 1,
                                required: true
                            },
                            answer2: {
                                minlength: 1,
                                required: true
                            }
                        },
                        highlight: function (element) {
                            $(element).parent().addClass('err').removeClass('valid');
                        },
                        success: function (element) {
                            element.parent().addClass('valid');
                            element.parent().removeClass('err');
                        },
                        submitHandler: fnSubmit
                    });
                },

                resetForm: function (sId) {
                    $('#form_' + sId).get(0).reset();
                    Validator.validators[sId].resetForm();
                    $('.valid').removeClass('valid');
                }
            }

            return Validator;
        }]);