(function ($) {
    $(document).ready(function () {

        // $(function () {
        //     $('[data-toggle="tooltip"]').tooltip()
        // });

        // $(function () {
        //     $('[data-toggle="popover"]').popover()
        // });

        // *** START Payeezy Payment JS logic ***

        // Payeezy Payment.JS section!!!  please see embedded comments below around what must be changed on each site !!!

        // do not need to change DomUtils
        var DomUtils = {
            getEl: function getEl(selector) {
                return window.document.querySelector(selector);
            },
            hasClass: function hasClass(el, cssClass) {
                if (el.classList) {
                    return el.classList.contains(cssClass);
                }

                return !!el.className.match(new RegExp("(\\s|^)".concat(cssClass, "(\\s|$)")));
            },
            removeClass: function removeClass(el, cssClass) {
                if (el.classList) {
                    el.classList.remove(cssClass);
                } else if (DomUtils.hasClass(el, cssClass)) {
                    var reg = new RegExp("(\\s|^)".concat(cssClass, "(\\s|$)"));
                    el.className = el.className.replace(reg, ' ');
                }
            }
        };

        // do not need to change SubmitButton - but make sure that button on HTML has the data-submit-btn and btn__loader properties
        var SubmitButton = {
            buttonElement: DomUtils.getEl('[data-submit-btn]'),
            loaderElement: DomUtils.getEl('.btn__loader'),
            enable: function enable() {
                SubmitButton.buttonElement.disabled = false;
                DomUtils.removeClass(SubmitButton.buttonElement, 'disabled-bkg');
            },
            setSubmitState: function setSubmitState() {
                SubmitButton.buttonElement.disabled = true;
                SubmitButton.loaderElement.style.display = 'inline-block';
            },
            removeSubmitState: function removeSubmitState() {
                SubmitButton.buttonElement.disabled = false;
                SubmitButton.loaderElement.style.display = 'none';
            }
        };

        // must make sure that the selector values below correspond to attributes on the inputs (card number, card cvv, card exp, card name)
        var config = {
            fields: {
                card: {
                    selector: '[data-cc-card]' // confirm this points to the corresponding field!
                },
                cvv: {
                    selector: '[data-cc-cvv]', // confirm this points to the corresponding field!
                    placeholder: 'Security Code'
                },
                exp: {
                    selector: '[data-cc-exp]' // confirm this points to the corresponding field!
                },
                name: {
                    selector: '[data-cc-name]', // confirm this points to the corresponding field!
                    placeholder: 'Card Holder Name'
                }
            },

            styles: {
                input: {
                    'font-size': '12px',
                    color: '#00a9e0',
                    'font-family': 'monospace',
                    background: 'black'
                },
                '.card': {
                    'font-family': 'monospace'
                },
                ':focus': {
                    color: '#00a9e0'
                },
                '.valid': {
                    color: '#43B02A'
                },
                '.invalid': {
                    color: '#C01324'
                },
                'input:-webkit-autofill': {
                    '-webkit-box-shadow': '0 0 0 50px white inset'
                },
                'input:focus:-webkit-autofill': {
                    '-webkit-text-fill-color': '#00a9e0',
                },
                'input.valid:-webkit-autofill': {
                    '-webkit-text-fill-color': '#43B02A',
                },
                'input.invalid:-webkit-autofill': {
                    '-webkit-text-fill-color': '#C01324',
                },
                'input::placeholder': {
                    color: '#aaa',
                },
            },

            classes: {
                empty: 'empty',
                focus: 'focus',
                invalid: 'invalid',
                valid: 'valid',
            },
        };

        // must make sure that this points to the correct location on your page!!  Here it is error-quote-CC-message
        function SetPaymentFormStatus(status) {
            //document.getElementById('error-quote-CC-message').innerHTML = status;
            $('#error-add-CC-message').text(status).removeClass("hiddenElement");
        }

        function HideClearPaymentFormStatus() {
            //document.getElementById('error-quote-CC-message').innerHTML = status;
            $('#error-add-CC-message').text("").addClass("hiddenElement");
        }

        //  callback linked in by "const hooks" code below.  This creates a server side call (which should then call MSI) to get the pre-auth token and public 64 key 
        function ValidateAndGetPreAuthToken(callback) {

            SetPaymentFormStatus('Getting Authorization Token');

            SubmitButton.setSubmitState();

            var propertyStateAbbreviation = $("#PropertyState").val();

            const data = {
                clientToken: 'PBVNJ5NesETQyAYxvyh852uc7fke',
                publicKeyBase64: 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF0c2d5dnU3NlNCV3pwcDFJVEtOZwpKK3NCd3A4RXpydGJTTkRDTmFNWjVBWEpIa3ZjUVZNMlVxeFdVTlNiQ1N0YXR4ZzRkam5SMUhlcXhDZXpUT2RzCjNETVVOcFFHTDFIRksyRTVUb2U5S3JydVJmZTZQdVdnZ3dnSUtXNkp5b095OVJ2bHFjSmJLVlZFTXpqKzhSaXQKWVR3M1AwT3Fvb05hdWJlZlByVDkyODFDR0kzMFJabWtheU5peUdkNW9yV3Ruem0xanMweFAzVzVtTmdPOWpiYgpSeStKZ05ZdzJ6Zy9hZHRxZjkwQ2kwcGRYWkZ3a2JXUGE1UVhuejMzREtKNTdNZ3V3WStoeTI4SzdMZlFmdytLCkk4VGdoc0xubWpXZnRtQnFoNTAxWFk4K2NnVUhZUTBKcTNPNzdhVTZJVlV1Z0IxSFZ3cnNla1VLUVhveTJHQ08KRXdJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0t',
              };
        
              callback(data);
              SetPaymentFormStatus('PreAuth Token: ' + data.clientToken);

            // $.ajax({
            //     type: 'POST',
            //     url: pathGetCreditCardPreAuthToken,
            //     dataType: 'json',
            //     data: {
            //         PropertyStateAbbreviation: propertyStateAbbreviation
            //     },
            //     error: function (xhr, ajaxOptions, thrownError) {
            //         //alert("Error retrieving the pre-auth token from MSI!");
            //         //alert(thrownError);
            //         //alert(xhr.status);
            //         //alert(xhr.responseText);
            //         //$("#buttonAddCCConfirm").prop("disabled", false);
            //         SubmitButton.removeSubmitState();
            //         SetPaymentFormStatus(thrownError);

            //     },
            //     success: function (data) {
            //         //alert("got data back");

            //         // error handling ...
            //         if (data.Error != null) {

            //             SubmitButton.removeSubmitState();
            //             SetPaymentFormStatus(data.Error);

            //         }
            //         else {

            //             // if successful ...
            //             //alert("past get pre auth");

            //             var clientToken = data.clientToken;
            //             var publicKey64 = data.publicKeyBase64;

            //             SetPaymentFormStatus('PreAuth Token: ' + data.clientToken);

            //             callback(data);

            //         }


            //     }
            // });

        }

        // this allows us to retrieve the required Pre Auth token prior to submitting form to the payment gateway.  "preFlowHook" is the name required from the Payeezy script (payeezy-paymentjs-client-2.0.0)
        var hooks = {
            preFlowHook: ValidateAndGetPreAuthToken
        };


        // paymentForm is used by the Payeezy script (payeezy-paymentjs-client-2.0.0)
        var onCreate = function onCreate(paymentForm) {

            var onSuccess = function onSuccess(clientToken) {

                //SetPaymentFormStatus("submit success; clientToken=\"" + clientToken + "\"");
                console.log("submit success; clientToken=\"" + clientToken + "\"");
                FetchPayeezyToken(clientToken, paymentForm).then(function (result) {
                    // Sending result to console and alert. Clients to implement handling the result.
                    // Typically results will be added to hidden form fields and submitted to server.
                    console.log('Tokenization webhook received: ' + result._payload);
                    // SetPaymentFormStatus('Success. Tokenization webhook received: ' + result._payload);

                    console.log('before postMessage');

                    window.postMessage('test', 'http://localhost:4200');
                    postMessage('test', 'http://localhost:4200');

                    window.postMessage('test', '*');
                    postMessage('test', '*');

                    window.postMessage(JSON.stringify(result._payload), '*');
                    postMessage(JSON.stringify(result._payload), '*');

                    var dataResult = JSON.stringify(result._payload);
                    var dataResultPayload = JSON.parse(result._payload);

                    var resultError = dataResultPayload.error;

                    // check for an error
                    if (resultError != false) {
                        // we have an error
                        var resultErrorReason = dataResultPayload.reason;

                        // do something
                        //$("#buttonAddCCConfirm").prop("disabled", false);
                        SubmitButton.removeSubmitState();
                        SetPaymentFormStatus(resultErrorReason);
                    }
                    else {

                        // get information that will be returned back to your server (results)
                        var billingAddressLine = $("#PayorAddressLine").val();
                        var billingCity = $("#PayorCity").val();
                        //var billingState = $("#AddCreditCard_PayorStateCode").val();
                        var billingState = $("#PayorStateCode option:selected").text();
                        var billingZipcode = $("#PayorZipCode5").val();

                        var paymentProcessorID = $("#AddCreditCard_PaymentProcessorID").val();
                        var paymentProcessorMerchantID = $("#AddCreditCard_PaymentProcessorMerchantID").val();

                        // pull down data
                        var creditCardToken = dataResultPayload.card.token;
                        var last4Digits = creditCardToken.slice(-4);

                        var cardType = dataResultPayload.card.brand;
                        var expMonth = dataResultPayload.card.exp.month;
                        var expYear = dataResultPayload.card.exp.year;

                        var cardHoldersName = dataResultPayload.card.name;
                        var paymentProfileKey = creditCardToken;

                        // *** validation check for card type
                        var cardTypeUpperCase = cardType.toUpperCase();
                        if (
                            cardTypeUpperCase != 'VISA' &&
                            cardTypeUpperCase != 'MASTERCARD' &&
                            cardTypeUpperCase != 'MASTER CARD' &&
                            cardTypeUpperCase != 'MASTER-CARD' &&
                            cardTypeUpperCase != 'AMERICANEXPRESS' &&
                            cardTypeUpperCase != 'AMERICAN EXPRESS' &&
                            cardTypeUpperCase != 'AMERICAN-EXPRESS' &&
                            cardTypeUpperCase != 'DISCOVER'
                        ) {
                            SubmitButton.removeSubmitState();
                            SetPaymentFormStatus("An invalid card type was used.  The valid card types are Visa, MasterCard, American Express, or Discover.");

                            return;
                        }

                        // ** ADD YOUR LOGIC HERE TO INCORPORATE RESPONSE ***
                        
                        $("#CardType").val(cardType);
                        $("#ExpirationMonth").val(expMonth);
                        $("#ExpirationYear").val(expYear);
                        $("#CreditCardLast4Digits").val(last4Digits);
                        $("#CreditCardToken").val(creditCardToken);

                        // *** Do something with data saved to ViewModel *** 

                        $('#loading').hide();

                    }

                    SubmitButton.removeSubmitState();

                }).catch(function (error) {
                    SetPaymentFormStatus('Error: ' + error);
                    console.log(error);

                });
            };

            var onError = function onError(error) {
                console.log("Tokenize Error: " + error);
                SetPaymentFormStatus("Tokenize Error: " + error);
                SubmitButton.removeSubmitState();
                paymentForm.reset(function () { });

            };

            var form = DomUtils.getEl('#add-cc-form'); // *** change to your form!! *** 
            form.addEventListener('submit', function (e) {

                e.preventDefault();

                // run form validation
                // $('#add-cc-form').validate(); // *** change to your form!! *** 
                var isFormValid = true; // *** change to your form!! *** 

                // only initiate Payeezy stuff if the form is valid
                if (isFormValid == true) {

                    //alert("in add cc validate submit handler");



                    // *** CLIENT: PLEASE VALIDATE THAT THE SUPPLIED ZIPCODE IS VALID FOR THE SUPPLIED STATE ***




                    HideClearPaymentFormStatus();


                    // Step 2: Make Ajax call to develop URL for payment processor
                    var paymentProcessorID = $("#AddCreditCard_PaymentProcessorID").val();
                    var paymentProcessorMerchantID = $("#AddCreditCard_PaymentProcessorMerchantID").val();

                    SubmitButton.setSubmitState();
                    paymentForm.onSubmit(onSuccess, onError);
                }
                else {
                    // form validation failed - *** this is handled below in the Jquery Validate InvalidHandler ***
                }

            });

            form.addEventListener('reset', function (e) {
                paymentForm.reset(function () { });
            });

            var ccFields = window.document.getElementsByClassName('payment-fields');
            for (let i = 0; i < ccFields.length; i++) {
                DomUtils.removeClass(ccFields[i], 'disabled');
            }
            SubmitButton.enable();
        };

        // references Payeezy script (payeezy-paymentjs-client-2.0.0.js)
        window.firstdata.createPaymentForm(config, hooks, onCreate);

        function ClearPaymentForm() {
            var form = DomUtils.getEl('#add-cc-form');
            if (form != 'Undefined') {
                form.reset();
            }
        }

        function FetchPayeezyToken(clientToken) {

            SetPaymentFormStatus('Calling Web Hook - Fetching Final Payeezy Token');
            return new Promise(function (fulfill, reject) {
                var request = new XMLHttpRequest();

                request.onload = function () {
                    if (request.status >= 200 && request.status < 300) {

                        HideClearPaymentFormStatus();
                        ClearPaymentForm();

                        fulfill({
                            "status": "success",
                            _payload: request.responseText                            
                        });
                    } else {

                        SetPaymentFormStatus("error response: " + request.responseText);
                        reject(new Error("error response: " + request.responseText));
                    }

                    request = null;
                };

                request.open('GET', "https://paymentjs.cardpaysolutions.com/tokens/".concat(clientToken), true);
                request.send();
            });
        }




        // *** END Payeezy Payment JS logic ***


        // *** new validation methods for CC name, number, exp, cvv ***
        // $.validator.addMethod("isCreditCardNameValid", function (value, element) {

        //     var validResult = true;

        //     // get the div
        //     var divCreditCardClassList = $("#cc-name").attr('class');

        //     if ($("#cc-name").hasClass("empty")) {
        //         validResult = false;
        //     }

        //     if ($("#cc-name").hasClass("invalid")) {
        //         validResult = false;
        //     }

        //     return validResult;
        // }, "Write your own message in calling function");

        // $.validator.addMethod("isCreditCardNumberValid", function (value, element) {

        //     var validResult = true;

        //     // get the div
        //     var divCreditCardClassList = $("#cc-card").attr('class');

        //     if ($("#cc-card").hasClass("empty")) {
        //         validResult = false;
        //     }

        //     if ($("#cc-card").hasClass("invalid")) {
        //         validResult = false;
        //     }

        //     return validResult;
        // }, "Write your own message in calling function");

        // $.validator.addMethod("isCreditCardExpValid", function (value, element) {

        //     var validResult = true;

        //     // get the div
        //     var divCreditCardClassList = $("#cc-exp").attr('class');

        //     if ($("#cc-exp").hasClass("empty")) {
        //         validResult = false;
        //     }

        //     if ($("#cc-exp").hasClass("invalid")) {
        //         validResult = false;
        //     }

        //     return validResult;
        // }, "Write your own message in calling function");

        // $.validator.addMethod("isCreditCardCVVValid", function (value, element) {

        //     var validResult = true;

        //     // get the div
        //     var divCreditCardClassList = $("#cc-cvv").attr('class');

        //     if ($("#cc-cvv").hasClass("empty")) {
        //         validResult = false;
        //     }

        //     if ($("#cc-cvv").hasClass("invalid")) {
        //         validResult = false;
        //     }

        //     return validResult;
        // }, "Write your own message in calling function");

        // // *** end new methods for validation ***

        // // *** JQUERY VALIDATION FOR THE FORM *** 
        // $("#add-cc-form").validate({
        //     invalidHandler: function (event, validator) {
        //         // 'this' refers to the form
        //         var errors = validator.numberOfInvalids();
        //         if (errors) {
        //             var message = errors == 1
        //                 ? 'You missed 1 field. It has been highlighted'
        //                 : 'You missed ' + errors + ' fields. They have been highlighted';
        //             //alert(message);

        //             // log it
        //             var errorList = validator.errorList;
        //             var errorListString = JSON.stringify(errorList);

        //         }
        //     },
        //     submitHandler: function (form) {

        //         HideClearPaymentFormStatus();
        //         $("#loading").show();

        //         // do nothing here intentionally.  The submit handler has to be handled via the Payeezy logic above

        //     },
        //     //debug: true,
        //     errorPlacement: function (error, element) {
        //         error.insertBefore(element);
        //     },
        //     onkeyup: false,
        //     onclick: false,
        //     ignore: [], // validate hidden fields
        //     rules: {
        //         "CCNameValidation": {
        //             isCreditCardNameValid: true
        //         },
        //         "CCCardValidation": {
        //             isCreditCardNumberValid: true
        //         },
        //         "CCExpValidation": {
        //             isCreditCardExpValid: true
        //         },
        //         "CCCVVValidation": {
        //             isCreditCardCVVValid: true
        //         },
        //         "PayorAddressLine": {
        //             required: true,
        //             minlength: 4,
        //             maxlength: 50
        //         },
        //         "PayorCity": {
        //             required: true,
        //             minlength: 3,
        //             maxlength: 50
        //         },
        //         "PayorStateCode": {
        //             required: true
        //         },
        //         "PayorZipCode5": {
        //             required: true,
        //             digits: true,
        //             minlength: 5,
        //             maxlength: 5
        //         }
        //     },
        //     messages: {
        //         "CCNameValidation": {
        //             isCreditCardNameValid: "Name on Card incomplete or invalid"
        //         },
        //         "CCCardValidation": {
        //             isCreditCardNumberValid: "Credit Card Number incomplete or invalid"
        //         },
        //         "CCExpValidation": {
        //             isCreditCardExpValid: "Credit Card Expiration Date incomplete or invalid"
        //         },
        //         "CCCVVValidation": {
        //             isCreditCardCVVValid: "Credit Card Security Code incomplete or invalid"
        //         },
        //         "PayorAddressLine": {
        //             required: "Address is required",
        //             minlength: "Address must be at least 4 characters",
        //             maxlength: "Address must be less than 50 characters"
        //         },
        //         "PayorCity": {
        //             required: "City is required",
        //             minlength: "City must be at least 3 characters",
        //             maxlength: "City must be less than 50 characters"
        //         },
        //         "PayorStateCode": {
        //             required: "State is required"
        //         },
        //         "PayorZipCode5": {
        //             required: "ZipCode is required",
        //             digits: "Zip Code must be 5 digits",
        //             minlength: "Zip Code must be 5 digits",
        //             maxlength: "Zip Code must be 5 digits"
        //         }
        //     },
        //     errorElement: "span",
        //     highlight: function (element) {
        //         if ($(element).parent().hasClass("has-feedback")) {
        //             $(element).parent().removeClass("has-success").addClass("has-error");
        //             $(element).siblings("label").addClass("hide");
        //         }
        //         else {
        //             $(element).parent().parent().removeClass("has-success").addClass("has-error");
        //             $(element).parent().siblings("label").addClass("hide");
        //         }

        //     },
        //     success: function (element) {
        //         if ($(element).parent().hasClass("has-feedback")) {
        //             $(element).parent().removeClass("has-error").addClass("has-success");
        //             $(element).siblings("label").removeClass("hide");

        //         }
        //         else {
        //             $(element).parent().parent().removeClass("has-error").addClass("has-success");
        //             $(element).parent().siblings("label").removeClass("hide");
        //         }

        //     }
        // });

    }); // End document ready


})(this.jQuery);
