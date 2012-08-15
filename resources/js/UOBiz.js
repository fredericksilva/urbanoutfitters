/**
* @fileoverview ebiz.js: A module used for client specific functionality
*
* This module defines a single symbol named "Venda.Ebiz"
* all ebiz utility functions are stored as properties of this namespace
* functions that are spacific this site shoudl be added to this file only.
*/

//Declare namespace for ebiz
Venda.namespace("Ebiz");

// FROM ./templates/scat/productreviews/productreviews.html
 jQuery(function(){
	Venda.Ebiz.initialDialog({createDialogList:'#writeownreview_link', closeDialogList:'#back_link', settings: ''});
	jQuery("#writeownreview_link").click(function(){ jQuery("#dialogContent").remove();	return false; });
});

// FROM ./templates/element/guidednavsearchbox/guidednavsearchbox.html
function checkFormGN() {
	var searchForm = document.formlocaytasearch;
	var hasValue = 0;
	for (i = 0; i < (searchForm.elements.length); i++) {
		if ((searchForm.elements[i].type == "select-one") && (searchForm.elements[i].options[searchForm.elements[i].selectedIndex].value != "")) {
			hasValue = 1;
		} else if ((searchForm.elements[i].type == "text") && (searchForm.elements[i].value != "")) {
			hasValue = 1;
		}
	}
	if (hasValue != 1) {
		alert(document.getElementById("site-search-validation-alert").innerHTML);
		searchForm.termtextkeywordsearch.focus();
	} else {
		searchForm.submit();
	}
}
function checkFieldGN(formName, field, defaultStr) {
	if (eval('document.' + formName + '.' + field + '.value=="' + defaultStr + '"')) {
		eval('document.' + formName + '.' + field + '.value=""');
	}
}

jQuery(function () {
	jQuery("#formlocaytasearch").on("submit", function(e) {
		e.preventDefault();
		checkFieldGN('formlocaytasearch', 'termtextkeywordsearch', document.getElementById("site-search-value").innerHTML);
		checkFormGN();
		return false;
	})
});
/**/

// FROM ./templates/widgets/styleSwitch/styleSwitch.html
jQuery(function () {
	if (typeof Venda.Widget.ViewStyle != "undefined") {
		Venda.Widget.ViewStyle.setCookieForViewStyle();
		Venda.Widget.ViewStyle.showProductPreview();
	}
});


// FROM ./templates/invt/productdetail/productdetail.html
jQuery(function () {
	Venda.Ebiz.initialDialog({
		createDialogList : '.emwbisLink, #tellafriend_link, #writereview_link, #readreview_link',
		closeDialogList : '#back_link',
		settings : {
			'width' : '500',
			'modal' : true
		}
	});
	
	var infotab = new Venda.Widget.createTab("#infotab");
	infotab.init();
	
	// FROM ./templates/includes/myaccRecommendations/myaccRecommendations.html
	// FROM ./templates/invt/vbmDetblock/vbmDetblock.html
	var bottomtab = new Venda.Widget.createTab("#bottomtab");
	bottomtab.init();
});


Venda.Ebiz.ExecuteDialogOpen = function() {

	// FROM ./templates/invt/emailinstock/emailinstock.html
	if(document.getElementById('JS-email-in-stock')) {
		jQuery("#emailmebackform").on("submit", function(e) { e.preventDefault(); return doValidate(); return false; });
		jQuery("#bisemail").keypress(function(event) {
			if (event.keyCode == "13") {
				return doValidate();
			}
		});
		
		var isPopup = document.getElementById('dialogContent');
		var attributeSku =  Venda.Ebiz.initialDialog.clickedElement.getAttribute('data-invtref') || Venda.Attributes.Get('atrsku') || document.getElementById("email-when-in-stock-invtref").innerHTML;
		var productName = document.getElementById("email-when-in-stock-invtname").innerHTML;

		if(typeof document.emailmebackform.bisemail != 'undefined'){
			if ((document.emailmebackform.bisemail.value.substring(0,1)=='<') || (document.emailmebackform.bisemail.value.substring(0,4)=='user')) {
				document.emailmebackform.bisemail.value='';
			}
		} 

		var doValidate = function(){
			if (document.emailmebackform.bisemail.value == '') {
				alert(document.getElementById("email-when-in-stock-validation").innerHTML);
				document.emailmebackform.bisemail.focus();
				return false;
			}
			var checkEmail = document.emailmebackform.bisemail.value;
			if (!Venda.Ebiz.checkemail(checkEmail)) {
				alert(document.getElementById("email-when-in-stock-validation").innerHTML);
				document.emailmebackform.bisemail.focus();
				return false;
			}

			if(attributeSku != ""){
				document.emailmebackform.invtref.value = attributeSku;
			}
			if(isPopup){ 
				document.emailmebackform.layout.value = 'noheaders';
				jQuery("#emailmebackform").submitForm("#back_link");
			} else {
				document.emailmebackform.submit();
			}
			return;
		};
	}
	// EO FROM ./templates/invt/emailinstock/emailinstock.html
	
	// FROM ./templates/invt/tellafriend/tellafriend.html 
	if(document.getElementById('JS-tell-a-friend')) {
		jQuery("#field1").textboxCount(".textMsgCount",{
			maxChar: 200,
			countStyle: 'down',
			alert: ""
		});
		jQuery(".submitTellafriend").click(function(){
				if (document.tellafriendform.fname.value == '') {
					alert(document.getElementById('tell-a-friend-validation-fname').innerHTML);
					document.tellafriendform.fname.focus();
					return false;
				}
				if (document.tellafriendform.name.value == '') {
					alert(document.getElementById('tell-a-friend-validation-name').innerHTML);
					document.tellafriendform.name.focus();
					return false;
				}
				if (document.tellafriendform.email.value == '') {
					alert(document.getElementById('tell-a-friend-validation-email-address').innerHTML);
					document.tellafriendform.email.focus();
					return false;
				}
				var checkEmail = document.tellafriendform.email.value;
					if (!Venda.Ebiz.checkemail(checkEmail)) {
					alert(document.getElementById('tell-a-friend-validation-valid-email-address').innerHTML);
					document.tellafriendform.email.focus();
					return false;
				}
				if (document.tellafriendform.field1.value == '') {
					alert(document.getElementById('tell-a-friend-validation-message').innerHTML);
					document.tellafriendform.field1.focus();
					return false;
				}
				
				if(isPopup){
					document.tellafriendform.layout.value = "noheaders";
					jQuery("#tellafriendform").submitForm("#back_link");
				}
				else { 
					document.tellafriendform.submit();
				}
		});
	}
	// EO FROM ./templates/invt/tellafriend/tellafriend.html 
	
	// FROM ./templates/invt/writereview/writereview.html
	if(document.getElementById('JS-write-a-review')) {
		jQuery(".submitWritereview").click(function(){
			if (document.writereviewform.field1.value == '') {
				alert(document.getElementById('write-a-review-validation-name').innerHTML);
				document.writereviewform.field1.focus();
				return false;
				}	
			
			if (document.writereviewform.from.value == '') {
				alert(document.getElementById('write-a-review-validation-email').innerHTML);
				document.writereviewform.from.focus();
				return false;
				}
				
			var checkEmail = document.writereviewform.from.value;
			if (!Venda.Ebiz.checkemail(checkEmail)) {
				alert(document.getElementById('write-a-review-validation-email').innerHTML);
				document.writereviewform.from.focus();
				return false;
			}

			document.writereviewform.field2.value=document.writereviewform.field2.value.replace(/-/g,"");
			document.writereviewform.field2.value=document.writereviewform.field2.value.replace(/ /g,"");

			var filterNumber = /[^\d]/;
			if (filterNumber.test(document.writereviewform.field2.value)==true) {
				alert(document.getElementById('write-a-review-validation-phone-no-letters').innerHTML);
				document.writereviewform.field2.focus();
				return false;
			}

			var filter=/^0/;
			if (filter.test(document.writereviewform.field2.value)==false) {
				alert(document.getElementById('write-a-review-validation-beggining').innerHTML);
				document.writereviewform.field2.focus();
				return false;
			}

			if (document.writereviewform.field2.value.length!=10) {
				if (document.writereviewform.field2.value.length!=11) {
					alert(document.getElementById('write-a-review-validation-digits').innerHTML);
					document.writereviewform.field2.focus();
					return false;
				}
			}
			if (document.writereviewform.field2.value.length!=11) {
				if (document.writereviewform.field2.value.length!=10) {
					alert(document.getElementById('write-a-review-validation-digits').innerHTML);
					document.writereviewform.field2.focus();
					return false;
				}
			}
			if (document.writereviewform.field2.value==''){
				alert(document.getElementById('write-a-review-validation-phone').innerHTML)
				document.writereviewform.field2.focus();
				return false;
				}
				
			if (document.writereviewform.field6.value==''){
				alert(document.getElementById('write-a-review-validation-rating').innerHTML)
				document.writereviewform.field6.focus();
				return false;
				}
				
			if (document.writereviewform.field3.value==''){
				alert(document.getElementById('write-a-review-validation-review').innerHTML)
				document.writereviewform.field3.focus();
				return false;
				}

			if(isPopup){
				document.writereviewform.layout.value = "noheaders";
				jQuery("#writereviewform").submitForm("#back_link");
			}
			else {
				document.writereviewform.submit();
			}				
		});
	}
	// EO FROM ./templates/invt/writereview/writereview.html

}

// FROM ./templates/widgets/compareItems/compareItems.html
jQuery(function () {
	if(document.getElementById("JS-compare")) {
		Venda.Widget.Compare.toCompare = function(){
			var compareList = Venda.Widget.Compare.toCompareItems();
			var itemList = '';
			var item ='';
			var k = 0; // counting how many checkboxes are checked

			if(compareList) {
				// Setup the compare items list.
				for(var i = 0; i < compareList.length; i++) {
				   item = '&compare=' + compareList[i];
				   itemList += item;
				   k++;
				}

				if (k >= 2) { // only open the compare window if more then 2 checkboxes are checked
					var strUrl = document.getElementById("JS-compare-codehttp").innerHTML + '?ex=co_disp-comp&bsref=' + document.getElementById("JS-compare-codehttp").innerHTML + '&layout=noheaders' + itemList;
					Venda.Widget.Compare.popupCompare(strUrl);
				}else{
					alert(document.getElementById("JS-compare-product-list-compare-validation").innerHTML);
				}
			}
		}

		AddtoCompare = function(productType,sku,name,image){
			var invtName = document.getElementById(name).innerHTML;
			var image =	document.getElementById(image).getElementsByTagName("img");
			var invtImage = image[0].src;

			Venda.Widget.Compare.addToCompareAndProductString(productType,sku,invtName,invtImage);
		}
		var xPosition = (document.documentElement.clientWidth - 1000) / 2; 
		Venda.Widget.Compare.setConfig({
			ebizUrl : document.getElementById("JS-compare-ebizurl").innerHTML,
			currCategory :document.getElementById("JS-compare-currCategory").innerHTML,
			alwaysdisplay:"", /* ALWAYS DISPLAY COMPARE ITEMS BOX */
			elxtCompareNumber:"6", /* MAXIMUM IS 20 */
			productExistsMessage:document.getElementById("JS-compare-product-is-already").innerHTML,
			differenceProductTypeMessage:document.getElementById("JS-compare-cannot-compare-different-type").innerHTML,
			removeItemBeforeMessage:document.getElementById("JS-compare-remove-item-before").innerHTML,
			compareTitle:document.getElementById("JS-compare-compareproduct").innerHTML,
			comparePopupSetting:{visible:false,draggable: true,modal:true,fixedcenter:false,zindex:4,x:xPosition,y:100,fade: 0.24}
		});

		//load compage items
		//addEvent(window, 'load', function() {Venda.Widget.Compare.loadCompareItems()}, false);

		
	}
});
// EO FROM ./templates/widgets/compareItems/compareItems.html










// CHECKOUT.JS
// Links to: /templates/includes/contactDetails/contactDetails.html
/**
 * Split a string so it can be displayed on multiple lines so it does not break display layout - used on order confirmation and order receipt page
 * @param {string} strToSplit string that needs to be split 
 * @param {Integer} rowLen length of row which will hold the string
 * @param {string} displayElem the html container which will display the splitted string
 */
Venda.Ebiz.splitString = function(strToSplit, rowLen, dispElem) {
	var stringlist = new Array();
	while (strToSplit.length > rowLen) {
	   stringlist.push( strToSplit.slice(0,rowLen));
	   strToSplit=strToSplit.substr(rowLen);
	}
	if (strToSplit.length) {
		stringlist.push(strToSplit);
	}
	document.getElementById(dispElem).innerHTML = stringlist.join('<br>');
};

 /**
 * A skeleton function for validating user extened fields - needs to be amended by the build team
 * @param {object} frmObj HTML form containing user extended field elements
 */
Venda.Ebiz.validateUserExtendedFields = function(frmObj) {
	if(frmObj) {
		if ( (frmObj.usxtexample1.checked==false) && (frmObj.usxtexample2.checked==false) && (frmObj.usxtexample3.checked==false))  {	
			alert("Please tick at least one checkbox");
			return false;
		}			
		return true;		
	} 
	return false;
};

//Declare namespace for bklist
Venda.namespace("Ebiz.BKList");
Venda.Ebiz.BKList.jq = jQuery; 
Venda.Ebiz.BKList.configBKList = {
		bklist: "",
		divArray: ['#sortby','.sort_results', '.searchpsel', '.pagn', '.refinelist'],
		removeDivArray:['.categorytree'],
		enableBklist: true
};
/**
* Sets the config values to each config type
* @param {string} configType this is an configuration type name
* @param {array} settings this is the value of each configuration type
*/

Venda.Ebiz.BKList.init = function(settings) {
	for (var eachProp in settings) {
		this.configBKList[eachProp] = settings[eachProp];
	}
};

Venda.Ebiz.BKList.getUrl = function(){
	var curUrl = document.location.href; 
	if(curUrl.indexOf("&amp;") != -1){
		 curUrl = curUrl.replace(/&amp;/gi,'&');		
	}
	return Venda.Platform.getUrlParam(curUrl, "bklist");
}

Venda.Ebiz.BKList.ChangeLink = function(){
var divArray = Venda.Ebiz.BKList.configBKList.divArray;  
var removeDivArray = Venda.Ebiz.BKList.configBKList.removeDivArray;  
var bklist = Venda.Ebiz.BKList.configBKList.bklist || Venda.Ebiz.BKList.getUrl() || "";
var strBklist = "&bklist";
	if (bklist != "") {
		var addBklist =  strBklist + "=" + bklist;
		for (var i = 0; i < divArray.length; i++) {

			if(Venda.Ebiz.BKList.jq(divArray[i]+ " a").attr("href")){
				Venda.Ebiz.BKList.jq(divArray[i]+ " a").attr("href", function() {		
					return Venda.Ebiz.BKList.jq(this).attr("href") + addBklist; 			
				});	
			}
			
			if(Venda.Ebiz.BKList.jq(divArray[i] + " option").attr("value")){
				Venda.Ebiz.BKList.jq(divArray[i] + " option").attr("value", function() {	
					return Venda.Ebiz.BKList.jq(this).attr("value") + addBklist; 
				});				
			}
		}	
		
		for (var i = 0; i < removeDivArray.length; i++) {
			Venda.Ebiz.BKList.jq(removeDivArray[i]+" a").attr("href", function() {
				var currentLink = Venda.Ebiz.BKList.jq(this).attr("href");
				var newLink = currentLink;
				if (newLink.length > 2) {
					if (currentLink.indexOf("&bklist=") != -1) {
						newLink = currentLink.substring(0, currentLink.indexOf("&bklist="));
					}
					if (newLink.indexOf("&view=") != -1) {
						newLink = newLink.substring(0, newLink.indexOf("&view="));
					}
				}
				return newLink;
			});
		}
		if(Venda.Ebiz.BKList.jq("#tag-pageSearchurlFull")){
			var newUrl = Venda.Ebiz.BKList.jq("#tag-pageSearchurlFull").text()+ addBklist ;
			Venda.Ebiz.BKList.jq("#tag-pageSearchurlFull").text(newUrl);
		}
		if(Venda.Ebiz.BKList.jq("#tag-pageSearchurl")){
			var newUrl = Venda.Ebiz.BKList.jq("#tag-pageSearchurl").text()+ addBklist ;
			Venda.Ebiz.BKList.jq("#tag-pageSearchurl").text(newUrl);
		}		
		if(Venda.Ebiz.BKList.jq("#tag-pageIcaturl")){
			var newUrl = Venda.Ebiz.BKList.jq("#tag-pageIcaturl").text()+ addBklist ;
			Venda.Ebiz.BKList.jq("#tag-pageIcaturl").text(newUrl);
		}			
	}
}


/**
 * A pagination style 4, that is press "Enter" on key borad to redirect to search page
 */
Venda.Ebiz.changePage =function(page,curpage,ptotal,pitem){
	var pageurl = "";
	var param1 = "";
	var pageAlert = document.getElementById("tag-pageAlert").innerHTML;
	var pageurlSearch = document.getElementById("tag-pageSearchurl").innerHTML;
	if(pageurlSearch != ""){
		pageurl = document.getElementById("tag-pageSearchurlFull").innerHTML;
		param1 = "&setpagenum=";
	}else {
		pageurl = document.getElementById("tag-pageIcaturl").innerHTML;
		param1 = "&curpage=";
	}
	var validnum=/(^-?[1-9](\d{1,2}(\,\d{3})*|\d*)|^0{1})$/;
	pagenum = parseInt(page.value);
	ptotalnum = parseInt(ptotal);
	if(validnum.test(page.value) && page.value > 0){
		if(page.value == curpage){
			page.value = curpage;
		}else if((pagenum <= ptotalnum) && (page.value != curpage)){
			pageurl = pageurl + param1 + page.value + '&' + pitem;
			window.location = pageurl;			
		}else{
			alert(pageAlert);
			page.value = curpage;
		}
	}else{
		alert(pageAlert);
		page.value = curpage;
	    return false;		
	}

};

Venda.Ebiz.CookieJar = new CookieJar({expires: 3600 * 24 * 7, path: '/'});	

jQuery.fn.popupIframe = function(){
	if(jQuery.browser.msie && jQuery.browser.version < "7.0") {
		var src   = 'javascript:false;';
		html = '<iframe class="popupIframe" src="'+src+'" style="-moz-opacity: .10;filter: alpha(opacity=1);height:expression(this.parentNode.offsetHeight+\'px\');width:expression(this.parentNode.offsetWidth+\'px\');'+'"></iframe>';
		if (jQuery(this).find('.popupIframe').length == 0 ){
			this.prepend(html);
		}
	 }
};

var jq = jQuery.noConflict();
/**
* Media Code
* Validate and submit media code using ajax if not on basket for in-page display
* Update minicart figures with ajax too if not on basket
*/
Venda.Ebiz.checkVoucherForm = function(defaulttext, workflow) {
	var str = jq("#vcode").val();
	str = jQuery.trim(str);
	if(jq("#vcode_submit_shopcart").length > 0){ //if on workflow
		if(str === '' || str === defaulttext) {
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
				
				if(workflow == 'orcf-screen'){
					oScript.src = jq("#tag-protocol").html()+"?ex=co_wizr-vouchercodeorderconfirm&curstep=vouchercode&step=next&mode=process&curlayout=errorsorderconfirm&layout=errorsorderconfirm&vcode="+jq("#vcode").val()+"&action=add";
				} else {
					oScript.src = jq('#tag-protocol').html()+'?ex=co_wizr-vouchercode&curstep=vouchercode&step=next&mode=process&curlayout=errors&layout=errors&vcode='+jq("#vcode").val()+'&action=add';
				}
				document.getElementById("ajax-error").appendChild(oScript);
			}
		}
	}
};

Venda.Ebiz.attributesValue ="";
Venda.Ebiz.attributeEMWBIS = function(uid){
 var product = getProduct(uid)
 var attributesValue= product.chosenAttributeString();
 Venda.Ebiz.attributesValue = product.attributeValues[attributesValue].data["atrsku"]; 
};

/**
* simple popup
*/
Venda.Ebiz.doProtocal = function(url){
	var protocal= document.location.protocol;
	if(url.indexOf("http:")==0 && protocal=="https:") {
		url=url.replace("http:","https:");
	}
	return url;
};

Venda.Ebiz.initialDialog = function(dialogList){
	var param = {
			createDialogList:'',
			closeDialogList:'',
			settings:''
		}
	var options = jQuery.extend(param, dialogList);
	var popupWidth = '500';
	var popupHeight = 'auto';
	var popupClass = '';
	var anchorName = '';
	jQuery(options.createDialogList).click(function(){
		Venda.Ebiz.initialDialog.clickedElement = this;
		if(jQuery(this).attr("rel")){
			var attrRel = jQuery(this).attr("rel").split(",");
			 popupWidth = attrRel[0]|| '500';
			 popupHeight = attrRel[1] || 'auto';
			 popupClass = attrRel[2];
			 anchorName = attrRel[3];
		}
		jQuery(this).createDialog('dialogContent',{ 'width': popupWidth, 'height': popupHeight}, options.closeDialogList, popupClass, anchorName);
		return false;
	});
};

Venda.Ebiz.dialogObject = '';
jQuery.fn.createDialog = function(selector, settings, closePopupId, dialogClassName , anchorName){
	dialogClassName = dialogClassName+"Dialog";
	var dialogOpts = {autoOpen: false, closeOnEscape:true,resizable: false, width: 'auto', modal: true,dialogClass:dialogClassName, close: function() {dialogObj.dialog( "destroy" ); dialogObj.remove(); }}
	var H=jQuery(window).height();	
	divObj = jQuery("<div>").attr("id",selector).appendTo("body");
	dialogObj = jQuery(divObj);/* popup object */
	dialogObj.dialog(dialogOpts);
	dialogObj.addClass("loadingImg");
	jQuery(".ui-dialog-titlebar").hide();
	for( var iSetting in settings){
            dialogObj.dialog("option", iSetting, settings[iSetting]);
    };
	jQuery(".ui-dialog").popupIframe();
	dialogObj.dialog("open");
	
	if (dialogObj.dialog("isOpen")===true) {
		// FROM ./templates/pcat/helpNavigation/helpNavigation.html
		jQuery("#helpNavigation a").live('click', function() {
			Venda.Ebiz.doPopUpContent(this); 
			return false;
		});
	};
	
	var url = Venda.Ebiz.doProtocal(jQuery(this).attr("href"));
	dialogObj.load( url+"&layout=noheaders",function(){
		var setHeight = H - dialogObj.height();
		dialogObj.dialog("option","position", setHeight);		
		Venda.Ebiz.closeDialog(closePopupId);
		dialogObj.removeClass("loadingImg");
		jQuery(".ui-dialog-titlebar").show();
		if(anchorName){
			jQuery(".toggleContent > h3."+anchorName).trigger('click');
		}
	});
	Venda.Ebiz.dialogObject = dialogObj;
	jQuery('.ui-widget-overlay').live('click',function() {
		dialogObj.dialog("close");
	});	
	return false;
};

Venda.Ebiz.doPopUpContent = function(Obj){
	var url = jQuery(Obj).attr("href");
	url = Venda.Ebiz.doProtocal(url);
	Venda.Ebiz.dialogObject.load(url);
};

Venda.Ebiz.closeDialog = function(closePopupId) {
	jQuery(closePopupId).click(function(){
		dialogObj.dialog("close");
		return false;
	});
};

jQuery.fn.submitForm = function(closePopupId){
	var obj = jQuery(this); 
	obj.submit(function() {
		var URL = obj.attr('action'); /* get target*/
		var params = obj.find("input, select, textarea").serialize(); /* get the value from all input type*/
		jQuery.ajax({
			type: "POST", 
			url: URL, 
			dataType: "html", 
            data: params,
			cache: false, /* do not cache*/
			error: function() {
				dialogObj.html('Error!');
			},
			success: function(data) { 
				dialogObj.html(data);				
				Venda.Ebiz.closeDialog(closePopupId);
			}
		});
		return false; 
	});
};
/**
* Expand contents
*/
Venda.Ebiz.expandContent = function() {
	var txtShow = (jQuery("#txtShow").length!=0) ? jQuery("#txtShow").html() : "";
	var txtHide = (jQuery("#txtHide").length!=0) ? jQuery("#txtHide").html() : "";
	
	jQuery(".toggleContent > div").hide();
	jQuery(".toggleContent > h3").each(function(){ jQuery(this).attr("title",txtShow) });
	jQuery(".toggleContent > h3").click(function() {
		jQuery(this).toggleClass("selected");
		if(jQuery(this).is(".selected")) {
			jQuery(this).attr("title",txtHide);
		} else {
			jQuery(this).attr("title",txtShow);
		}
		jQuery(this).next().slideToggle("fast");
	});
};

Venda.Ebiz.findPopUps = function() {
var popups = document.getElementsByTagName("a");
for (i=0;i<popups.length;i++) {
	if (popups[i].rel.indexOf("popup")!=-1) {
		// attach popup behaviour
		popups[i].onclick = Venda.Ebiz.doPopUp;
		}
	}
};
Venda.Ebiz.doPopUp = function(e) {
	//set defaults - if nothing in rel attrib, these will be used
	var type = "standard";
	var strWidth = "780";
	var strHeight = "580";
	//look for parameters
	attribs = this.rel.split(" ");
	if (attribs[1]!=null) {type = attribs[1];}
	if (attribs[2]!=null) {strWidth = attribs[2];}
	if (attribs[3]!=null) {strHeight = attribs[3];}
	e.stopPropagation();
	e.preventDefault();
	type = type.toLowerCase();
	if (type == "fullscreen"){
		strWidth = screen.availWidth;
		strHeight = screen.availHeight;
	}
	var tools="";
	if (type == "standard") { 
		tools = "resizable,toolbar=yes,location=yes,scrollbars=yes,menubar=yes,width="+strWidth+",height="+strHeight+",top=0,left=0";
	}
	if (type == "console" || type == "fullscreen") {
		tools = "resizable,toolbar=no,location=no,scrollbars=yes,width="+strWidth+",height="+strHeight+",left=0,top=0";
	}
	newWindow = window.open(this.href, 'newWin', tools);
	newWindow.focus();
};

/**
* Remove any special characterSet
* @param {string} str - string with any special characters
* @return {string} str - string WITHOUT any special characters
*/
Venda.Ebiz.clearText = function(str){
	var iChars = /\$|,|@|#|~|`|\%|\*|\^|\&|\(|\)|\+|\=|\/|\[|\-|\_|\]|\[|\}|\{|\;|\:|\'|\"|\<|\>|\?|\||\\|\!|\$|\./g;
	return str.replace(iChars, "");
};

/**
* To validate Qty - the accept value is only number
*
* @return {boolean} - true if only number entered
*/
Venda.Ebiz.validateQty = function(){ 
	var filterNumber = /(^-?[1-9](\d{1,2}(\,\d{3})*|\d*)|^0{1})$/;
	var hasQty = true;

	jQuery("#qty, .qty").each(function (index) {
		if((parseInt(jQuery(this).val()) < 0) || (filterNumber.test(jQuery(this).val())==false)){
			hasQty = false;
			return false;
		}
	});
	if(!hasQty){ alert(jQuery("#tag-qtymsg").text()); return false;	}
	
	return true;
};

Venda.Ebiz.validateGiftcode = function(formName, msg) {
	if (document.forms[formName].giftcode.value == ""){
		alert(msg);
		document.forms[formName].giftcode.focus();
		return false;
	}
	 Step2(document.forms[formName],"confirm","process","show","giftcert","_self","","","","");
};
/**
*  limit text input - used in gift wrap screen
*/
Venda.Ebiz.maxLength = function(fieldObj,countFieldName,maxChars,event){
        var key = event.which;
        //all keys including return.
        if(key >= 33 || key == 13) {
            var length = fieldObj.value.length;
			countFieldName.value = maxChars - length;    
			if(length >= maxChars) {
                 event.preventDefault();
				alert('Please limit the text ' + maxChars+ ' characters.');	
            }
        }
};
/**
*  store locator validation
*/
Venda.Ebiz.checkPostcode = function(formObj,fieldObj,textMsg) {
	var formObj = "document." + formObj;
	var formObjField = formObj + "." + fieldObj + ".value";
	formObjField = eval(formObjField);
	if ((formObjField == textMsg) || (formObjField == "")) {
		alert("Please enter the full postcode.");
		return false;
	}
	else {
		formObj = eval(formObj)
		formObj.submit();
	}
};
/**
*  Element - Email newsletter signup / EMWBIS
*/
Venda.Ebiz.checkemail = function(str) {
	var filter =/^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,7}|\d+)$/i;
	return (filter.test(str))
};

Venda.Ebiz.validateEmail = function(mail,msg) {
	if (Venda.Ebiz.checkemail(mail.email.value)) {
		mail.submit();
	} else {
		alert(msg);
		mail.email.focus();
	}
};
	
/**
*  This function keeps the nav open when using the Category Navigation (Navigation Settings) element.
*  This function is moved from 'sitewide.js', so avoid the error 
*/
function openNav(openicat,openicat2){
	if (typeof activateNav != 'undefined'){
		// default toggle if turnonToggle does not exist
		if (typeof turnonToggle === 'undefined') { var turnonToggle = 1; }
		// show first level subcategories
		if (openicat != "") {
			if (turnonToggle == 1) {
				showOrHide(1,openicat);
			}
			// show second level subcategories
			if (openicat2 != "") {
				if (turnonToggle == 1) {
					showOrHide(1,openicat2);
				}
			}
		}
	}
};
/**
*  addEvent script from http://www.accessify.com/features/tutorials/the-perfect-popup/
*  This function is moved from 'sitewide.js', so avoid the error. 
*/
function addEvent(elm, evType, fn, useCapture){if(elm.addEventListener){elm.addEventListener(evType, fn, useCapture);return true;}else if (elm.attachEvent){var r = elm.attachEvent('on' + evType, fn);return r;}else{elm['on' + evType] = fn;}};

jQuery(function() {

	// find the link that has 'doDialog' class to do the popup
	Venda.Ebiz.initialDialog({createDialogList:'.doDialog', closeDialogList:'#back_link', settings: ''});
	Venda.Ebiz.findPopUps();
	
	// Gift certificate - input on order summary
	jQuery("#giftcode").keypress(function(event) {
		if (event.which == "13") {
			jQuery("#applyCode").trigger("click");
			return false;
		}
	});
	//Bklist
	if(Venda.Ebiz.BKList.configBKList.enableBklist){
		Venda.Ebiz.BKList.ChangeLink();
	}
	
	/**
	* Media Code
	* Hide noscript comment
	* Add listeners to media code form elements
	*/	
	jq(".nonjs").css("display","none");
	
	/**
	* Display Social book marks box when mouse hover
	*/
	jQuery("#socialBookMarks").hover(
	function() {
		jQuery("#SBcontent").css({"left":"-1px"});
		},
		function() {
		jQuery("#SBcontent").css({"left":"-9999px"});
		}
	);
	
	/**
	* Popup Download Link Page
	*/	
	jQuery(".downloadLink").click(function(){
		jQuery(this).createDialog('download', {'dialogClass':'download','width':'540px'}, '');
		return false;
	});	
	
	
	jQuery.fn.textboxCount = function(obj, options) {
	var t_settings = {
			maxChar: 80,
			countStyle: 'down', /* up, down*/
			countNegative:  false,
			alert: ""
		}	
	var settings = jQuery.extend(t_settings, options);
	var t_obj = jQuery(this);

	function addClassCharNumber(){	
	jQuery(obj).removeClass("c_green c_red");
		if(t_objLength <= options.maxChar ) {
			jQuery(obj).addClass("c_green");
		}else{
			jQuery(obj).addClass("c_red");
		}	
	}	
	
	function showCharNumber(){	
		t_objLength = t_obj.val().length;	
		if(options.countStyle == 'up'){
			jQuery(obj).html(t_objLength+"/"+ options.maxChar );
		}
		else if(options.countStyle == 'down'){
			jQuery(obj).html(options.maxChar - t_objLength );					
		}
		addClassCharNumber(t_objLength);
	}
	
	function doAlertMsg(event){
		var key = event.which;		
		if(key >= 33 ) {
			if(t_obj.val().length >= options.maxChar ) {
				event.preventDefault();						
				alert(options.alert);	
			}
		}
	}	
	
	charLength =0;
	function doCount(event){
	t_objLength = t_obj.val().length;	
		
		if((t_objLength <= options.maxChar ) || (options.countNegative)) {
				if(options.countStyle == 'up'){
					charLength = t_objLength;
					jQuery(obj).html(charLength+"/"+ options.maxChar  );
				}
				else if(options.countStyle == 'down'){
					charLength = options.maxChar - t_objLength ; 		
					jQuery(obj).html(charLength);					
				}
		}
		else{
			var scrollPos = t_obj.scrollTop();
			t_obj.val( t_obj.val().substring(0, options.maxChar));
			t_obj.scrollTop(scrollPos);
			
		}
		addClassCharNumber(t_objLength);
		
		if(options.alert != ""){
			doAlertMsg(event);
		}
	}

	showCharNumber();
	jQuery(this).bind('keydown keyup keypress mousedown', doCount);
	
    jQuery(this).bind('paste',function(e) {
	// check if right button is clicked
		setTimeout(function() {
		   doCount();
		   showCharNumber();
		}, 5);
	});	
	}
	
	//view itemperpage/ sort by  dropdown changed a duplicate id
	if (jQuery("div.pagnBtm")){
		if (jQuery("div.pagnBtm .pagnPerpage label")){
			//view itemperpage
			jQuery("div.pagnBtm .pagnPerpage label").attr('for','perpagedpdBT');
			jQuery("div.pagnBtm .pagnPerpage select").attr({
				id: 'perpagedpdBT',
				name: 'perpagedpdBT'
			});
			//sort by
			jQuery("div.pagnBtm .sort label").attr('for','sortbyBT');
			jQuery("div.pagnBtm .sort select").attr({
				id: 'sortbyBT',
				name: 'sortbyBT'
			});
		}
	}
	
	/* Start: loading social button */
	Venda.Ebiz.loadFBLikeButton = function() {
		window.fbAsyncInit = function() {
			FB.init({
				appId: jQuery('#tag-fbAppId').html(),
				status: true,
				cookie: true,
				xfbml: true
			});
		};
		
		var oScript = document.createElement('script');
		oScript.type = 'text/javascript';
		oScript.async = true;
		oScript.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
		document.getElementById('fb-root').appendChild(oScript);
	};
	
	Venda.Ebiz.loadTweetButton = function() {
		var oScript = document.createElement('script');
		oScript.type = 'text/javascript';
		oScript.async = true;
		oScript.src = document.location.protocol + '//platform.twitter.com/widgets.js';
		document.getElementById('socialButtons').appendChild(oScript);
	};
	
	Venda.Ebiz.loadGooglePlusButton = function() {
		var oScript = document.createElement('script');
		oScript.type = 'text/javascript';
		oScript.async = true;
		oScript.src = 'https://apis.google.com/js/plusone.js';
		document.getElementById('socialButtons').appendChild(oScript);
	};
	
	if (jQuery('#socialButtons').length === 1) {
		jQuery(".mainHeader").next().addClass("socialHack");
		Venda.Ebiz.loadTweetButton();
		Venda.Ebiz.loadFBLikeButton();
		Venda.Ebiz.loadGooglePlusButton();
	}
	/* End: loading social button */
});

/**
* simple color swatch on productlist/searchresult
* @requires jQuery v1.7.1 or greater
* @param {object} - configutation
*   - contentID: search content ID
*   - selectFirstColor: set to true to enable preselect first color swatch
*/
Venda.namespace("Ebiz.colorSwatch");
Venda.Ebiz.colorSwatch = function(conf){
    var defaults = {
        contentID: '#content-search',
        selectFirstColor: true
    };
    this.conf=jQuery.extend(defaults, conf);
};

Venda.Ebiz.colorSwatch.prototype = {
    init: function(){
            jQuery(this.conf.contentID).on("click", ".swatchContainer a", function(){

        	var $this = jQuery(this);

        	var mainImg 	 = $this.data("setimage"),
				mainImgObj 	 = jQuery("#"+ $this.data("prodid") ),
            	prodLink 	 = mainImgObj.find("a:first").data("prodLink");

            if(mainImg == ""){
                mainImg = mainImgObj.find("a:first").data("defaultImage");
            }

            mainImgObj.find('img:first')
            	.attr("src", mainImg)
            	.end()
            	.find("a:first")
            	.attr("href", this.href || "");

            $this.parent("").find("a").removeClass("sw_selected");
            $this.addClass("sw_selected");

            return false;

        });
        if(this.conf.selectFirstColor){
            jQuery('.swatchContainer div').find(" > a:first").click();
        }
    }
};
