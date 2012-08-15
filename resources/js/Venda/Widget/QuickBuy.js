/**
 * @fileoverview Venda.Widget.QuickBuy
 *
 * @author Arunee Keyourawong (May) <mayk@venda.com>
 */

//create QuickBuy namespace
Venda.namespace('Widget.QuickBuy');

/**
 * A Quick Buy
 */
jQuery(function() {
var xPosition = (document.documentElement.clientWidth - 500) / 2;

jQuery(".prods .image").live({
	mouseenter :function(){
		jQuery(this).find(".quickLinkBox").css({"visibility":"visible"});
	},
	mouseleave:function(){
		jQuery(this).find(".quickLinkBox").css({"visibility":"hidden"});
	}
});

var dialogOpts = {
        title: " ",
        modal: true,
        autoOpen: false,
		closeOnEscape:true,
		draggable: true,
		zIndex:1,
		resizable: false,
		width: 'auto',
		position: [xPosition,'200'],
		close: function() { Venda.Attributes.ImageSwapReset(); }
};
jQuery("body").append('<div id="quickBuy" class="quickBuy"><div class="productContent"></div></div>');

jQuery(".quickLinkBox a").live("click", function(e) {
	var dialogClass = jQuery(this).attr("class");
	/* variable are for sending a selected colour to quickBuy dialog */
	var reg = new RegExp('[?&]colour=([^&]+)');
	var attColour = (jQuery(this).attr("href").match(reg)) ? jQuery(this).attr("href").match(reg)[1] : "";
	var URL = jQuery(this).attr("href").replace(attColour, escape(attColour));
	var isQuickDetails = jQuery(this).hasClass("quickBuyDetails");
	
	jQuery("#quickBuy").dialog(dialogOpts); 
	jQuery(".productContent").html(" ");
	jQuery("#quickBuy").dialog("open");
	jQuery("#quickBuy").dialog("option", "dialogClass", dialogClass); 
	jQuery("#quickBuy").dialog("option", "title", jQuery("#comp-name"+this.id).html());	
	jQuery("."+dialogClass).popupIframe();	
	jQuery(".productContent").addClass("loadingImg");
	xPosition = (document.documentElement.clientWidth - jQuery(".productContent").width()) / 2;
	jQuery("#quickBuy").dialog("option", "position", xPosition);
	var trackingProdAddUrl = jQuery(this).attr("href").split("&");
    Venda.Widget.MinicartDetail.trackingProdAddUrl = trackingProdAddUrl[0];
	jQuery(".productContent").load(URL, function(){
		jQuery(".productContent").removeClass("loadingImg");
		jQuery(".productContent").show();		
		if(isQuickDetails){
			//Venda.ProductDetail.changeSet(attColour);
		} else {
			jQuery(".productContent select[name=att1] option[value='"+attColour+"']").attr("selected", "selected");
		}
		Venda.Widget.QuickBuy.actionAftetShowPopup();	
		jQuery("#quickBuy").css("width", jQuery('.productContent').innerWidth()); 
		jQuery("#quickBuy").css("min-height", jQuery('.productdetail_rhs').innerHeight());
	});
	return false;
});

Venda.Widget.QuickBuy.doSelectStyle = '';
Venda.Widget.QuickBuy.actionAftetShowPopup = function(){
		// only do this if the option is ticked to show popup without reload
		jQuery(function () {	Venda.Widget.MinicartDetail.GatherAdds();	});
	if(Venda.Widget.QuickBuy.doSelectStyle == "1");
	// Close popup when click 'add to basket'
	jQuery(".submit").click( function() {
		var selectObj = jQuery(".productContent select").size();
		if(selectObj == 1){
			if (jQuery("[name=att1]").val() !="") {
				jQuery("#quickBuy").dialog("close");
			}
		}else{
			if ( (jQuery("[name=att1]").val() !="") && (jQuery("[name=att2]").val() !="" )) {
				jQuery("#quickBuy").dialog("close");
			}
		}
	});
};

/**
 * To show quickBuy/View functionality from a flash module
 * @param {string} 	invtref - A product ref which need to add to your basket
 * @param {string} 	invtname -  A product name that will be used for a title dialog
 * @param {string} 	template - 2 values can be "quickBuyFast" and "quickBuyDetails"
 * added by bowc@venda.com
 */
Venda.Widget.QuickBuy.addParam = function(invtref, invtname, template){
	var dialogClass = template;
	var url = jQuery("#ebizurl").html()+"/invt/"+invtref+"&temp="+template+"&layout=noheaders";

	jQuery("#quickBuy").dialog(dialogOpts);
	jQuery(".productContent").html(" ");
	jQuery("#quickBuy").dialog("open");
	jQuery("#quickBuy").dialog("option", "dialogClass", dialogClass);
	jQuery("#quickBuy").dialog("option", "title", invtname);

	jQuery("."+dialogClass).popupIframe();
	jQuery(".productContent").addClass("loadingImg");
	jQuery(".productContent").load(url, function(){
		jQuery(".productContent").removeClass("loadingImg");
		xPosition = (document.documentElement.clientWidth - jQuery(".productContent").width()) / 2;
		jQuery("#quickBuy").dialog("option", "position", xPosition);
		jQuery(".productContent").show();
		Venda.Widget.QuickBuy.actionAftetShowPopup();
	});
	return false;
};
});