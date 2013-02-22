//create namespace
Venda.namespace("Widget.SignupPopup");
/**
 * @class Venda.Widget.SignupPopup
 * @constructor
 */
Venda.Widget.SignupPopup = function (){};
//instantiate cookiejar, set the expiry time of the cookie
var	popupCookieClose = new CookieJar({expires: 3600 * 24 * 30, path: '/'});
Venda.Widget.SignupPopup.Close = 'closed the popup';
closedPopup = popupCookieClose.get('closedPopup');
//clicked close on popup
jQuery(".wrapper .signupPopup a.signupPopupCloseLink").live("click", function() {
	popupCookieClose.put('closedPopup', Venda.Widget.SignupPopup.Close);
	closedPopup = popupCookieClose.get('closedPopup');
});
var popupCookieSubmit = new CookieJar({expires: 3600 * 24 * 365, path: '/'});
Venda.Widget.SignupPopup.Submit = 'submitted the popup';
submittedPopup = popupCookieSubmit.get('submittedPopup');
//clicked submit on popup
function validateFields(vfm) {
	var custEmail = vfm.email.value;
	if (custEmail == '') {
    	alert(jQuery(".wrapper .signupPopup .invalidEmail").text());
        vfm.email.focus();
        return;
    }
    if ((custEmail.indexOf('@') < 0) || ((custEmail.charAt(custEmail.length - 4) != '.') && (custEmail.charAt(custEmail.length - 3) != '.'))) {
        alert(jQuery(".wrapper .signupPopup .invalidEmail").text());
        vfm.email.focus();
        return;
    }
    else {
    	popupCookieSubmit.put('submittedPopup', Venda.Widget.SignupPopup.Submit);
    	submittedPopup = popupCookieSubmit.get('submittedPopup');
        vfm.submit();
    }
}
jQuery(function() {
	if ((!closedPopup) && (!submittedPopup) && (unescape(location.href) !== "http://www.urbanoutfitters.co.uk/page/home/&log=4") && (unescape(location.href) !== "http://www.urbanoutfitters.fr/page/home/&log=4") && (unescape(location.href) !== "http://www.urbanoutfitters.de/page/home/&log=4")) {
		jQuery(".wrapper .signupPopup").css('display','block');
		jQuery(".wrapper .signupPopupOverlay").css('display','block');
	}
});
jQuery(".wrapper .signupPopup a.signupPopupCloseLink").live("click", function() {
	jQuery(".wrapper .signupPopup").css('display','none');
	jQuery(".wrapper .signupPopupOverlay").css('display','none');
});