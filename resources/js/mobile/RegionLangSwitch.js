/**
 * @fileoverview Venda.Widget.RegionLangSwitch
 *
 * @author Arunee Keyourawong (May) <mayk@venda.com>
 * @edited Issawararat Chumchinda <bowc@venda.com> (to support mobile specific event)
 */
Venda.namespace("Widget.RegionLangSwitch");
var sURL = unescape(location.href);	
var RLSwitchEnable = "0"; //Disable the region selection landing lightbox by default. '1' for anable
var setRegionLang = "1"; //site has the language and region for changing, set '1' by default. set '0' if there is one option (region or language)
Venda.Widget.RegionLangSwitch.isSearch = "";
Venda.Widget.RegionLangSwitch.currRegion = "";
Venda.Widget.RegionLangSwitch.currLang = "";
Venda.Widget.RegionLangSwitch.ebizURL = "";
Venda.Widget.RegionLangSwitch.workflow = "";

jQuery(function(){
	var currRegion = Venda.Widget.RegionLangSwitch.currRegion;
	var currLang = Venda.Widget.RegionLangSwitch.currLang;
	var menuStatus;

	jQuery("#regionLangSwitch").click(function(){
		menuStatus = true;
		jQuery("body").toggleClass("bgColourChanged");
		jQuery("#mobile").toggleClass("ui-disabled");
		jQuery("#flagContent").toggle("fast");
		return false;
	});

	jQuery("#flagContent .region a").click(function() {
		jQuery("body").toggleClass("bgColourChanged");
		jQuery("#mobile").toggleClass("ui-disabled");
		jQuery("#flagContent").toggle("slow");
		Venda.Widget.RegionLangSwitch.doURL("setlocn",this,currRegion);
		return false;
	});

	// Closing RegionLangSwitch by two events
	jQuery("body:not(#flagContent)").click(function(e){
		if (menuStatus){
			menuStatus = false;
			jQuery("body").toggleClass("bgColourChanged");
			jQuery("#mobile").toggleClass("ui-disabled");
			jQuery("#flagContent").toggle("slow");
		}
	});
});

Venda.Widget.RegionLangSwitch.doURL = function(setType,selectedObj,currSelected){
	// please note: the function below copied from desktop site to make sure that it works at a same way
	var redirectURL = '';
	var region = jQuery(selectedObj).attr("id");
	var fullURL = unescape(window.location.href);
	var baseURL = location.protocol + "//" + location.host;

	if (baseURL.substring(baseURL.length-2, baseURL.length-1) == "/") {
		baseURL = baseURL.substring(0, baseURL.length-2);
	}

	// only for LIVE site because parameter setlocn doesn't on short URL (e.g. www.sitename.com&setlocn=xxx)
	if ((baseURL == fullURL) || ((baseURL + "/") == fullURL) || Venda.Widget.RegionLangSwitch.workflow != "") {
		redirectURL = baseURL.replace("https","http") + "/page/home&setlocn=" + region + "&log=4";				
	} else {
		// clean log parameter + prevent error when switch currency after add to basket
		var logValue = Venda.Platform.getUrlParam(fullURL, "log");
		if (logValue == 4) {
			fullURL = fullURL.replace("&log=4","");
		} else if (logValue == 22) {
			fullURL = fullURL.replace("&log=22","");
			fullURL = fullURL.replace("&mode=add","");
		} else if ((logValue == "") && (fullURL.indexOf("&log=") != -1)) {
			fullURL = fullURL.replace("&log=","");
		}
		var setlocnValue = Venda.Platform.getUrlParam(fullURL, "setlocn");
		if (setlocnValue != "") {
			redirectURL = fullURL.replace("=" + setlocnValue, "=" + region) + "&log=4";
		} else if ((setlocnValue == "") && (fullURL.indexOf("&setlocn=") != -1)) { 
			redirectURL = fullURL.replace("&setlocn=", "&setlocn=" + region) + "&log=4";
		} else if ((setlocnValue == "") && (fullURL.indexOf("&setlocn=") == -1)) {
			redirectURL = fullURL + "&setlocn=" + region + "&log=4";
		}
	}
	if (redirectURL != "") { window.location.href = redirectURL; }
};