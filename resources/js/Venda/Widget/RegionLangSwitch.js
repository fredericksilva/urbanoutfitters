/**
 * @fileoverview Venda.Widget.RegionLangSwitch
 *
 * @author Arunee Keyourawong (May) <mayk@venda.com>
 */
Venda.namespace("Widget.RegionLangSwitch");
var sURL = unescape(location.href);	
var RLSwitchEnable = "0"; //Disable the region selection landing lightbox by default. '1' for anable
var setRegionLang = "1"; //site has the language and region for changing, set '1' by default. set '0' if there is one option (region or language)
Venda.Widget.RegionLangSwitch.workflow = "";
Venda.Widget.RegionLangSwitch.currRegion = "";
Venda.Widget.RegionLangSwitch.currLang = "";
Venda.Widget.RegionLangSwitch.ebizURL = "";
jQuery(function(){
	currRegion = Venda.Widget.RegionLangSwitch.currRegion;
	currLang = Venda.Widget.RegionLangSwitch.currLang;
	jQuery("#flag").click(function(){ 
		jQuery("#flagContent").toggle("fast"); 
		return false;
	});
	jQuery("#flagContent .region a").click(function() {	
		Venda.Widget.RegionLangSwitch.doURL("setlocn",this,currRegion);
		return false;
	});
	jQuery("#flagContent .lang a").click(function() {	
		Venda.Widget.RegionLangSwitch.doURL("setlang",this,currLang);
		return false;
	});
	jQuery("#flagContent").mouseleave(function() {
		jQuery("#flagContent").hide(); 
		return false;
	});	
	if(RLSwitchEnable == "1"){ // Open the region selection landing lightbox for first time
		if((!Venda.Ebiz.CookieJar.get("lang")) && (!Venda.Ebiz.CookieJar.get("locn"))){ 
			Venda.Widget.RegionLangSwitch.createDialog('/page/landingswitcher');
		}
	}
	jQuery(".chRegion").click(function(){
		Venda.Widget.RegionLangSwitch.createDialog(this.href);	
		return false;
	});
});

Venda.Widget.RegionLangSwitch.doURL = function(setType,selectedObj,currSelected){
var redirectURL = sURL;
var rep = "/"+currSelected+"/";
var newRep = "/"+jQuery(selectedObj).attr("id")+"/"; 

	if((sURL.indexOf(rep) < 0) && (Venda.Widget.RegionLangSwitch.workflow != 'locayta') ){
		if(setRegionLang == "1"){
			sURL = Venda.Widget.RegionLangSwitch.ebizURL +"/"+currLang+"/"+currRegion+"/"+"page/home";
			sURL = sURL.replace(rep, newRep);
			redirectURL = sURL;	
		}
		else {
			redirectURL = Venda.Widget.RegionLangSwitch.ebizURL + newRep +"page/home";
		}	
	}
	else if((sURL.indexOf(rep) < 0) && (Venda.Widget.RegionLangSwitch.workflow == 'locayta')){
			var setTypeValue = jQuery(selectedObj).attr("id");
			if(sURL.indexOf(setType) > -1) {
				repStr = setType+"="+ currSelected;
				newRepStr = setType+"="+ setTypeValue;
				redirectURL = sURL.replace(repStr, newRepStr); 
			}else{
				redirectURL = sURL+"&"+setType+"="+setTypeValue;
			}
	}
	else {
		sURL = sURL.replace(rep, newRep);
		redirectURL = sURL;
	};
	window.location.href = redirectURL;
};

Venda.Widget.RegionLangSwitch.createDialog =  function(pageURL){
	jQuery("body").append('<div id="regionLangLanding"><div id="regionLangContent"></div></div>');
	var dialogObj = jQuery("#regionLangLanding");
	var dialogOpts = {autoOpen: false, dialogClass: 'regionView', height:'auto', width:550, closeOnEscape:false,resizable: false, modal: true,close: function() {dialogObj.addClass("hide");}}
	dialogObj.dialog(dialogOpts);

	jQuery("#regionLangContent").load(pageURL, function(){
		jQuery(".ui-dialog").popupIframe();
		dialogObj.dialog("open");		
	});
		jQuery(".regionLangSwitchContent a").live("click",function() {Venda.Widget.RegionLangSwitch.changeRegionLang(this);	}); 
	if(RLSwitchEnable == "1"){/* this section need for hiding the 'close' button when you visit the site first time.*/
		if((!Venda.Ebiz.CookieJar.get("lang")) && (!Venda.Ebiz.CookieJar.get("locn"))){
			jQuery(".ui-dialog-titlebar").hide();
		}	
	}
};

Venda.Widget.RegionLangSwitch.changeRegionLang = function(selectedObj){
splitText = jQuery(selectedObj).attr("rel").split(" ");
chLang = splitText[0];
chRegion = splitText[1];
var redirectURL = sURL;
var rep =  currLang+"/"+currRegion;
var newRep =  chLang+"/"+chRegion;

	if(sURL.indexOf(rep) > -1){
		sURL = sURL.replace(rep, newRep);
		redirectURL = sURL;			
	}
	else if((sURL.indexOf(rep) < 0) && (Venda.Widget.RegionLangSwitch.workflow == 'locayta')){
		if((sURL.indexOf("setlang") > -1) || (sURL.indexOf("setlocn") > -1) ) { 
			repStr = "setlang="+ currLang +"&"+ "setlocn="+ currRegion;
			newRepStr = "setlang="+ chLang +"&"+ "setlocn="+chRegion;
			sURL = sURL.replace(repStr, newRepStr);
			redirectURL = sURL; 
		}else{
			redirectURL = sURL+"&setlang="+chLang+"&setlocn="+chRegion;
		}
	}
	else{ 
		var str = '';
		if(chLang != ""){str = str + "/"+chLang; }
		if(chRegion != ""){str = str + "/"+ chRegion; }
		redirectURL = Venda.Widget.RegionLangSwitch.ebizURL +str+"/page/home";
	}
	window.location.href = redirectURL;
 };