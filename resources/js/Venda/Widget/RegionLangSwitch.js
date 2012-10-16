/**
 * @fileoverview Venda.Widget.RegionLangSwitch
 *
 * @author Arunee Keyourawong (May) <mayk@venda.com>
 * @author Matt Wyatt <mwyatt@anthropologie.com>
 */
Venda.namespace("Widget.RegionLangSwitch");
var sURL = unescape(location.href);	
Venda.Widget.RegionLangSwitch.workflow = "";
Venda.Widget.RegionLangSwitch.currRegion = "";
Venda.Widget.RegionLangSwitch.currLang = "";
Venda.Widget.RegionLangSwitch.ebizURL = "";
Venda.Widget.RegionLangSwitch.isSearch = "";
  
jQuery(function(){
	currRegion = Venda.Widget.RegionLangSwitch.currRegion;		
	currLang = {
  	"http://urbanoutfitters.uat.venda.com" : "en",
  	"http://www.urbanoutfitters.fr/sdurbanoutfitters/sduat/dvenda" : "fr",
  	"http://www.urbanoutfitters.de/sdurbanoutfitters/sduat/dvenda" : "de"
	}
	jQuery("#language-sel #language").attr('class', currLang[Venda.Widget.RegionLangSwitch.ebizURL]).find(".lang-copy").text(currLang[Venda.Widget.RegionLangSwitch.ebizURL]);
	jQuery(".region #" + currRegion + ", .lang #" + currLang[Venda.Widget.RegionLangSwitch.ebizURL]).hide();
	jQuery(".switcher-sel > a").click(function(){ 
		jQuery(this).next(".switcher-content").slideDown("fast"); 
		jQuery(this).find(".switcher-down").css("background-position", "-12px -32px");
		return false;
	});
	jQuery(".regionLangSwitcher .region a").click(function() {	
		Venda.Widget.RegionLangSwitch.doURL("setlocn",this,currRegion);
		return false;
	});
	jQuery(".regionLangSwitcher .lang a").click(function() {	
		Venda.Widget.RegionLangSwitch.doURL("setlang",this,currLang);
		return false;
	});
	jQuery(".switcher-sel").mouseleave(function() {
		jQuery(".switcher-content").slideUp("fast"); 
		jQuery(this).find(".switcher-down").css("background-position", "-1px -32px");
		return false;
	});	
});

Venda.Widget.RegionLangSwitch.doURL = function(setType,selectedObj,currSelected){

var redirectURL = "",
    removeThese = [Venda.Widget.RegionLangSwitch.ebizURL, "&setlocn=eur", "&setlocn=restofworld"],
    currentLoc = sURL,
    changeValue = jQuery(selectedObj).attr("id"),
    langOptions = {
      "en" : "http://urbanoutfitters.uat.venda.com",
      "de" : "http://www.urbanoutfitters.de/sdurbanoutfitters/sduat/dvenda",
      "fr" : "http://www.urbanoutfitters.fr/sdurbanoutfitters/sduat/dvenda"
    }
    
  for(var i=0; i<removeThese.length; i++) {
    currentLoc = currentLoc.replace(removeThese[i], "")
  }  
  if (setType == "setlocn"){
    if(Venda.Widget.RegionLangSwitch.ebizURL != sURL) {
      redirectURL = Venda.Widget.RegionLangSwitch.ebizURL + currentLoc + "&setlocn=" + changeValue
    } else {
      redirectURL = Venda.Widget.RegionLangSwitch.ebizURL + "page/home" + "&setlocn=" + changeValue
    }
  } else {
      redirectURL = (langOptions[changeValue] ? langOptions[changeValue] : langOptions.en) + currentLoc
  }
	window.location.href = redirectURL;
	return false;
};