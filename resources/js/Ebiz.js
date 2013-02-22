//create namespace
Venda.namespace("Ebiz");

Venda.Ebiz.splitEmailAdd = function (usemail) {
    var stringlist = new Array();
    while (usemail.length > 30) {
        stringlist.push(usemail.slice(0, 30));
        usemail = usemail.substr(30);
    }
    if (usemail.length) {
        stringlist.push(usemail);
    }
    document.write(stringlist.join('<br>'));
};

/**
* Split a string so it can be displayed on multiple lines so it does not break display layout - used on order confirmation and order receipt page
* @param {string} strToSplit string that needs to be split 
* @param {Integer} rowLen length of row which will hold the string
* @param {string} displayElem the html container which will display the splitted string
*/
Venda.Ebiz.splitString = function (strToSplit, rowLen, dispElem) {
    var stringlist = new Array();
    while (strToSplit.length > rowLen) {
        stringlist.push(strToSplit.slice(0, rowLen));
        strToSplit = strToSplit.substr(rowLen);
    }
    if (strToSplit.length) {
        stringlist.push(strToSplit);
    }
    if (document.getElementById(dispElem)) {
        document.getElementById(dispElem).innerHTML = stringlist.join('<br>');
    }
};

/**
* A skeleton function for validating user extened fields - needs to be amended by the build team
* @param {object} frmObj HTML form containing user extended field elements
*/
/*This function is not used, so comment for now*/

Venda.Ebiz.validateUserExtendedFields = function (frmObj) {
    if (frmObj) {
        /*if ( (frmObj.usxtexample1.checked==false) && (frmObj.usxtexample2.checked==false) && (frmObj.usxtexample3.checked==false))  {	
        alert("Please tick at least one checkbox");
        return false;
        } */
        return true;
    }
    return false;
};

/*Take the function from LIVE site*/
var popup = function (url, width, height, name) {
    if (width == null) width = 400;
    if (height == null) height = 425;
    if (name == null) name = "details";
    var props = "toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,titlebar=no,menubar=no,width=" + width + ",height=" + height;
    w = window.open(url, name, props);
    if (w) {
        w.focus();
    }
};

/* ELV payment option */
jQuery(function () {
    var cccntry = jQuery('#cccntry').html();
    if (cccntry === "de") {
        //if pay by paypal radio is selected hide other payment options
        if (jQuery("input:radio[name=ohpaytype]:checked").val() === "12") {
            jQuery("#cctoggle,#elvtoggle").css("display", "none");
        }
        //check if any ohpaytype radios are checked
        var paytypeChecked = true;
        jQuery("input:radio[name=ohpaytype]").each(function () {
            paytypeChecked = paytypeChecked && jQuery(this).is(':checked');
        });
        //if cardtype anything but elv, user has credit card payment details stored or none so disable and blank fields from elv section, enable fields in cc section, select credit card radio and make sure ohpaytype 0 is checked
        if ((jQuery("#cardtype").val() !== "directdebitsde" && jQuery("input:radio[name=ohpaytype]:checked").val() === "0") || (jQuery("#cardtype").val() !== "directdebitsde" && !paytypeChecked)) {
            jQuery("#elv #ohccnum,#elv #ohccname").val("").attr('disabled', true);
            jQuery("#cc #ohccnum,#cc #ohccname").removeAttr('disabled');
            jQuery("#elvtoggle,#pptoggle").css("display", "none");
            jQuery("#dummycreditcard").attr("checked", "checked");
            jQuery("#creditcard").attr("checked", "checked");
            jQuery("#cardtype").val(jQuery("#dummycardtype").val());
        }
        //if cardtype elv, disable and blank fields from credit card section, enable fields in elv section, select elv radio, set cardtype to elv and make sure ohpaytype 0 is checked
        if (jQuery("#cardtype").val() === "directdebitsde" && jQuery("input:radio[name=ohpaytype]:checked").val() === "0") {
            jQuery("#cc #ohccnum,#cc #ohccname").val("").attr('disabled', true);
            jQuery("#elv #ohccnum,#elv #ohccname").removeAttr('disabled');
            jQuery("#cctoggle,#pptoggle").css("display", "none");
            jQuery("#dummyelv").attr("checked", "checked");
            jQuery("#cardtype").val("directdebitsde");
            jQuery("#creditcard").attr("checked", "checked");
        }
        //if click pay by elv set cardtype to elv and make sure ohpaytype 0 is checked
        jQuery("#dummyelv").click(function () {
            jQuery("#cctoggle,#pptoggle").slideUp("fast", function () {
                jQuery("#cc #ohccnum,#cc #ohccname").attr('disabled', true);
                jQuery("#elv #ohccnum,#elv #ohccname, #sortcode").removeAttr('disabled');
                jQuery("#elvtoggle").slideDown("fast");
            });
            jQuery("#cardtype").val("directdebitsde");
            jQuery("#creditcard").attr("checked", "checked");
        });
        //if click pay by card set cardtype to match dummy carttype option
        jQuery("#dummycreditcard").click(function () {
            jQuery("#elvtoggle,#pptoggle").slideUp("fast", function () {
                jQuery("#elv #ohccnum,#elv #ohccname, #sortcode").attr('disabled', true);
                jQuery("#cc #ohccnum,#cc #ohccname").removeAttr('disabled');
                jQuery("#cctoggle").slideDown("fast");
            });
            jQuery("#cardtype").val(jQuery("#dummycardtype").val());
        });
        //if click pay by paypal
        jQuery("#formpaypal").click(function () {
            jQuery("input:radio[name=dummypaytype]").removeAttr("checked"); //uncheck other radios
            jQuery("#cctoggle,#elvtoggle").slideUp("fast", function () {
                jQuery("#pptoggle").slideDown("fast");
            });
        });
        //if click elv fields set cardtype to elv and make sure ohpaytype 0 is checked
        jQuery("#elv input").click(function () {
            jQuery("#cardtype").val("directdebitsde");
            jQuery("#creditcard").attr("checked", "checked");
            jQuery("#dummyelv").attr("checked", "checked");
        });
        //if click credit cart fields set cardtype to match dummy carttype option and make sure ohpaytype 0 is checked
        jQuery(jQuery("#cc input,#cc select").not("#dontsavecc")).click(function () {
            jQuery("#creditcard").attr("checked", "checked");
            jQuery("#dummycreditcard").attr("checked", "checked");
            jQuery("#cardtype").val(jQuery("#dummycardtype").val());
        });
    } else {
        //if pay by cc radio is selected
        if (jQuery("input:radio[name=ohpaytype]:checked").val() === "0") {
            jQuery("#pptoggle").css("display", "none");
        }
        //if pay by paypal radio is selected
        if (jQuery("input:radio[name=ohpaytype]:checked").val() === "12") {
            jQuery("#cctoggle").css("display", "none");
        }
        //animate
        jQuery("#formpaypal").click(function () {
            jQuery("#cctoggle").slideUp("fast", function () {
                jQuery("#pptoggle").slideDown("fast");
            });
        });
        jQuery("#creditcard").click(function () {
            jQuery("#pptoggle").slideUp("fast", function () {
                jQuery("#cctoggle").slideDown("fast");
            });
        });
        //if click credit cart fields check ohpaytype to 0
        jQuery(jQuery("#cc input,#cc select").not("#dontsavecc")).click(function () {
            jQuery("#creditcard").attr("checked", "checked");
        });
    }
});

Venda.Ebiz.CookieJar = new CookieJar({ expires: 3600 * 24 * 7, path: '/' });

/*
* This section is for Zanox Tracking
*/
var zanoxPartnerID = "";
var zanoxURL = location.href;
zanoxPartnerID = Venda.Platform.getUrlParam(zanoxURL, 'zanpid');
var cj = new CookieJar({ expires: 3600 * 24 * 7, path: '/' });
if (zanoxPartnerID != "" && zanoxPartnerID != null) {
    cj.put("ZANOX_PARTNERID", zanoxPartnerID);
}

var jq = jQuery.noConflict();
/**
* Media Code
* Validate and submit media code using ajax if not on basket for in-page display
* Update minicart figures with ajax too if not on basket
*/
Venda.Ebiz.checkVoucherForm = function (defaulttext, workflow) {
    var str = jq("#vcode").val();
    str = jQuery.trim(str);
    if (jq("#vcode_submit_shopcart").length > 0) { //if on workflow
        if (str === '' || str === defaulttext) {
            alert(jq("#tag-alert").html());
        } else {
            jq("#vcode").val(str);
            jq(".waitMsg").dialog({
                modal: true,
                autoOpen: false
            });
            jq(".waitMsg").dialog("open");
            jq(".ui-dialog-titlebar").hide();

            // instead of submit, submit in background to check for errors
            if (document.createElement) {
                var oScript = document.createElement("script");
                oScript.type = "text/javascript";

                if (workflow == 'orcf-screen') {
                    oScript.src = jq("#tag-protocol").html() + "?ex=co_wizr-vouchercodeorderconfirm&curstep=vouchercode&step=next&mode=process&curlayout=errorsorderconfirm&layout=errorsorderconfirm&vcode=" + jq("#vcode").val() + "&action=add";
                } else {
                    oScript.src = jq('#tag-protocol').html() + '?ex=co_wizr-vouchercode&curstep=vouchercode&step=next&mode=process&curlayout=errors&layout=errors&vcode=' + jq("#vcode").val() + '&action=add';
                }
                document.getElementById("ajax-error").appendChild(oScript);
            }
        }
    }
};

Venda.Ebiz.validateGiftcode = function (formName, msg) {
    if (document.forms[formName].giftcode.value == "") {
        alert(msg);
        document.forms[formName].giftcode.focus();
        return false;
    }
    Step2(document.forms[formName], "confirm", "process", "show", "giftcert", "_self", "", "", "", "");
};

/**
* To validate Qty - the accept value is only number
*
* @return {boolean} - true if only number entered
*/
Venda.Ebiz.validateQty = function () {
    var filterNumber = /(^-?[1-9](\d{1,2}(\,\d{3})*|\d*)|^0{1})$/;
    var hasQty = true;

    jQuery("#qty, .qty").each(function (index) {
        if ((parseInt(jQuery(this).val()) < 0) || (filterNumber.test(jQuery(this).val()) == false)) {
            hasQty = false;
            return false;
        }
    });
    if (!hasQty) { alert(jQuery("#tag-qtymsg").text()); return false; }

    return true;
};
/**
*  Element - Email newsletter signup / EMWBIS
*/
Venda.Ebiz.checkemail = function (str) {
    var filter = /^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,7}|\d+)$/i;
    return (filter.test(str))
};

Venda.Ebiz.validateEmail = function (mail, msg) {
    if (Venda.Ebiz.checkemail(mail.email.value)) {
        mail.submit();
    } else {
        alert(msg);
        mail.email.focus();
    }
};