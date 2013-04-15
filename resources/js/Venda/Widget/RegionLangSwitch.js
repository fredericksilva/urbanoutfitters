/**
 * @fileoverview Venda.Widget.RegionLangSwitch
 *
 * @author Arunee Keyourawong (May) <mayk@venda.com>
 * @author Matt Wyatt <mwyatt@anthropologie.com>
 * A little bit of a mess, this is in need of a reworking
 */
Venda.namespace("Widget.RegionLangSwitch");
var sURL = unescape(location.href);	
Venda.Widget.RegionLangSwitch.workflow = "";
Venda.Widget.RegionLangSwitch.currRegion = "";
Venda.Widget.RegionLangSwitch.currLang = "";
Venda.Widget.RegionLangSwitch.ebizURL = "";
Venda.Widget.RegionLangSwitch.isSearch = "";
  
jQuery(function(){
  jQuery(".switcher-content").hide().css({"opacity":"1","filter": "alpha(opacity=100)"});
  if (Venda.Widget.RegionLangSwitch.ebizURL == "http://urbanoutfitters5.uat.venda.com" || Venda.Widget.RegionLangSwitch.ebizURL == "http://www.urbanoutfitters.fr/sdurbanoutfitters5/sduat/dvenda" || Venda.Widget.RegionLangSwitch.ebizURL == "http://www.urbanoutfitters.de/sdurbanoutfitters5/sduat/dvenda") {
    currLang = {
  	"http://urbanoutfitters5.uat.venda.com" : "uk",
  	"http://www.urbanoutfitters.fr/sdurbanoutfitters5/sduat/dvenda" : "fr",
  	"http://www.urbanoutfitters.de/sdurbanoutfitters5/sduat/dvenda" : "de"
  	}    
  }
  else if (Venda.Widget.RegionLangSwitch.ebizURL == "http://urbanoutfitters.uat.venda.com" || Venda.Widget.RegionLangSwitch.ebizURL == "http://www.urbanoutfitters.fr/sdurbanoutfitters/sduat/dvenda" || Venda.Widget.RegionLangSwitch.ebizURL == "http://www.urbanoutfitters.de/sdurbanoutfitters/sduat/dvenda"){
  	currLang = {
  	"http://urbanoutfitters.uat.venda.com" : "uk",
  	"http://www.urbanoutfitters.fr/sdurbanoutfitters/sduat/dvenda" : "fr",
  	"http://www.urbanoutfitters.de/sdurbanoutfitters/sduat/dvenda" : "de"
  	}
  } else {
  	currLang = {
  	"http://www.urbanoutfitters.co.uk" : "uk",
  	"http://www.urbanoutfitters.fr" : "fr",
  	"http://www.urbanoutfitters.de" : "de"
  	}
  }
  if (currLang[Venda.Widget.RegionLangSwitch.ebizURL] == "de" || currLang[Venda.Widget.RegionLangSwitch.ebizURL] == "fr"){
    jQuery("#region-content").hide();
  } else {
    jQuery("#region-content").show();
  }
	currRegion = Venda.Widget.RegionLangSwitch.currRegion;
	if(Venda.Widget.RegionLangSwitch.currRegion != "" && Venda.Widget.RegionLangSwitch.ebizURL != ""){
		jQuery("#language-sel #language").attr('class', currLang[Venda.Widget.RegionLangSwitch.ebizURL]);
		jQuery("#language-sel #language").find(".lang-copy").text(currLang[Venda.Widget.RegionLangSwitch.ebizURL]);
		jQuery(".region #" + currRegion + ", .lang #" + currLang[Venda.Widget.RegionLangSwitch.ebizURL]).parent().hide();
	}
	Venda.Widget.RegionLangSwitch.conversionSwitch();
	jQuery(".switcher-sel > a").click(function(){ 
		jQuery(this).next(".switcher-content").slideDown("fast"); 
		jQuery(".location-text").hide();
		return false;
	});
	jQuery(".regionLangSwitcher .region .curr-cont a").click(function() {	
    if(jQuery(this).hasClass("resetcurrency")){
      jQuery('.price, #updateTotal, .pounds, .baskettotals .totalprice, .subtotal div, .orscTotalFig').pennies('reset');
    };
		Venda.Widget.RegionLangSwitch.doURL("setlocn",this,currRegion);
		Venda.Widget.RegionLangSwitch.conversionSwitch();
		jQuery(".switcher-content").slideUp("fast"); 
		return false;
	});
	jQuery(".regionLangSwitcher .lang a").click(function() {	
		Venda.Widget.RegionLangSwitch.doURL("setlang",this,currLang);
		return false;
	});
	jQuery(".switcher-sel").mouseleave(function() {
		jQuery(".switcher-content").slideUp("fast"); 
		return false;
	});	
});

Venda.Widget.RegionLangSwitch.doURL = function(setType,selectedObj,currSelected){

var redirectURL = "",
    removeThese = [Venda.Widget.RegionLangSwitch.ebizURL, Venda.Widget.RegionLangSwitch.ebizURL.replace("http://","https://"), "&setlocn=eur", "&setlocn=restofworld", "http://", new RegExp("bin\/venda.*", "i"), new RegExp("^\/*", "i")],
    currentLoc = sURL,
    changeValue = jQuery(selectedObj).attr("id")
  if (Venda.Widget.RegionLangSwitch.ebizURL == "http://urbanoutfitters5.uat.venda.com" || Venda.Widget.RegionLangSwitch.ebizURL == "http://www.urbanoutfitters.fr/sdurbanoutfitters5/sduat/dvenda" || Venda.Widget.RegionLangSwitch.ebizURL == "http://www.urbanoutfitters.de/sdurbanoutfitters5/sduat/dvenda") {
    var langOptions = {
      "uk" : "http://urbanoutfitters5.uat.venda.com",
      "de" : "http://www.urbanoutfitters.de/sdurbanoutfitters5/sduat/dvenda",
      "fr" : "http://www.urbanoutfitters.fr/sdurbanoutfitters5/sduat/dvenda",
      "us" : "http://us.urbanoutfitters.com"
    } 
  }
  else if (Venda.Widget.RegionLangSwitch.ebizURL == "http://urbanoutfitters.uat.venda.com" || Venda.Widget.RegionLangSwitch.ebizURL == "http://www.urbanoutfitters.fr/sdurbanoutfitters/sduat/dvenda" || Venda.Widget.RegionLangSwitch.ebizURL == "http://www.urbanoutfitters.de/sdurbanoutfitters/sduat/dvenda"){
    var langOptions = {
      "uk" : "http://urbanoutfitters.uat.venda.com",
      "de" : "http://www.urbanoutfitters.de/sdurbanoutfitters/sduat/dvenda",
      "fr" : "http://www.urbanoutfitters.fr/sdurbanoutfitters/sduat/dvenda",
      "us" : "http://us.urbanoutfitters.com"
    }
  } else {
    var langOptions = {
      "uk" : "http://www.urbanoutfitters.co.uk",
      "de" : "http://www.urbanoutfitters.de",
      "fr" : "http://www.urbanoutfitters.fr",
      "us" : "http://us.urbanoutfitters.com"
    }
  }
  for(var i=0; i<removeThese.length; i++) {
    currentLoc = currentLoc.replace(removeThese[i], "")
  }  
	currentLoc = currentLoc.replace(/^\/*/i, "");
  if (setType == "setlocn"){
    if((Venda.Widget.RegionLangSwitch.ebizURL + "/") != sURL && currentLoc != "" && !(/^search\?/ig).test(currentLoc)) {
      redirectURL = Venda.Widget.RegionLangSwitch.ebizURL + "/" + currentLoc + "&setlocn=" + changeValue
    } else {
      redirectURL = Venda.Widget.RegionLangSwitch.ebizURL + "/page/home" + "&setlocn=" + changeValue
    }
  } else { 
      if (changeValue != "us") {
        redirectURL = (langOptions[changeValue] ? langOptions[changeValue] : langOptions.en) + "/" + currentLoc
      } else {
        redirectURL = (langOptions[changeValue] ? langOptions[changeValue] : langOptions.en)
      }
  }
	window.location.href = redirectURL;
	return false;
};

Venda.Widget.RegionLangSwitch.conversionSwitch = function(){
  var convertCurr = Venda.Ebiz.CookieJar.get("setCurrency"),
      actualCurr = Venda.Widget.RegionLangSwitch.currRegion,
      currencycode = { 
						'EUR' : "\u20AC",
						'GBP' : "\u00A3",
						'USD' : "\u0024",
						'AUD' : "\u0024",
						'HKD' : "\u0024",
						'NZD' : "\u0024",
						'SGD' : "\u0024",
						'DKK' : "kr",
						'SEK' : "kr",
						'NOK' : "kr"
					};
  if (convertCurr !== null && convertCurr !== "GBP" && convertCurr !== "EUR"){
    jQuery(".region .curr-conv").show();
    jQuery("#region-content #currency .curr-copy").html(currencycode[convertCurr] + " " + convertCurr);
    jQuery(".region ." + convertCurr).parent().hide();
    jQuery(".region ." + actualCurr).parent().show();
  }
}
