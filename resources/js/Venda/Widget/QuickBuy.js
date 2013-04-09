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
		zIndex:1003,
		resizable: false,
		width: 'auto',
		position: [xPosition,'200'],
		close: function() { Venda.Attributes.ImageSwapReset(); }
};
jQuery("body").append('<div id="quickBuy" class="quickBuy"><div class="productContent"></div></div>');

jQuery(".quickLinkBox a,a.swatchIcon,a.lookbookBuy").live("click", function(e) {
	var dialogClass = jQuery(".quickLinkBox a").attr("class");
	var reg = new RegExp('[?&]colour=([^&]+)');
	var attColour = (jQuery(this).attr("href").match(reg)) ? jQuery(this).attr("href").match(reg)[1] : "";
	var URL = jQuery(this).attr("href").replace(attColour, escape(attColour));
	var isQuickDetails = jQuery(this).hasClass("quickBuyDetails");
	Venda.Attributes.qbColour = jQuery(this).parent().siblings(".swatchContainer").find(".sw_selected").attr("data-color");
	Venda.Attributes.attsArray = [];
	jQuery("#quickLook").dialog("destroy");
	jQuery("#quickBuy").dialog("destroy");
	jQuery("#quickBuy").dialog(dialogOpts); 
	jQuery(".productContent").html("<div class='loadingImg'></div>");
	jQuery("#quickBuy").dialog("open");
	jQuery("#quickBuy").dialog("option", "dialogClass", dialogClass); 
	jQuery("#quickBuy").dialog("option", "title", jQuery("#comp-name"+this.id).html());	
	jQuery("."+dialogClass).popupIframe();	
	jQuery(".productContent").addClass("loadingsearch");
	xPosition = (document.documentElement.clientWidth - jQuery(".productContent").width()) / 2;
	jQuery("#quickBuy").dialog("option", "position", xPosition);
	var trackingProdAddUrl = jQuery(this).attr("href").split("&");
    Venda.Widget.MinicartDetail.trackingProdAddUrl = trackingProdAddUrl[0];
	jQuery(".productContent").load(URL, function(){
		if (jQuery(this).html() === "This product is not available to view.") {
			jQuery(this).html("Bummer, this isn't available right now - check out our other amazing bits...");
		}
		if (jQuery(this).html() === "L'article ne peut pas être affiché.") {
			jQuery(this).html("Pas de bol, cet article n'est plus disponible pour le moment. Jetez un &oelig;il aux articles du m&ecirc;me genre...");
		}
		if (jQuery(this).html() === "Leider ist derzeit keine Produktansicht möglich.") {
			jQuery(this).html("Schade, das Produkt ist momentan ausverkauft - aber guck' dir unsere anderen tollen Sachen an...");
		}
		jQuery(".productContent").removeClass("loadingsearch");
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
	if(typeof(Venda.Ebiz.fixEuroSign) != "undefined"){Venda.Ebiz.fixEuroSign(".quickBuy-Details .priceField");}
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
