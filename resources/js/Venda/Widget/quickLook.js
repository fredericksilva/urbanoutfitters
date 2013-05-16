//create QuickBuy namespace
Venda.namespace('Widget.QuickLook');

/**
 * A Quick Look
 */
jQuery(function() {

var dialogOptions = {
        title: " ",
        modal: true,
        autoOpen: false,
		closeOnEscape:true,
		draggable: true,
		zIndex:1003,
		resizable: false,
		width: '200',
		minHeight: '130'
};
jQuery("body").append('<div id="quickLook" class="quickLook"><div class="productInfo"></div></div>');

jQuery("a.lookbookQuick").live("mouseenter", function(e) {
	var bottom = jQuery(this),
		bottomPosition = bottom.position();
	var dialogClass = jQuery(this).attr("class");
	var URL = jQuery(this).attr("href");
	clearTimeout(timeOut);
	jQuery("#quickLook, #quickBuy").dialog("destroy");
	jQuery("#quickLook").dialog(dialogOptions); 
	jQuery("#quickLook").dialog("open");
	jQuery(".quickLook-Details").hide();
	jQuery(".productInfo").html("<div class='loadingImg'></div>");
	jQuery(".ui-widget-overlay").remove();
	jQuery("#quickLook").dialog("option", "dialogClass", dialogClass); 
	if ((bottomPosition.left > 740) && (bottomPosition.top < 451)) {
		jQuery("#quickLook").dialog("option", "position", { my: "right top", at: "right bottom", of: bottom } );
	}
	if ((bottomPosition.left > 740) && (bottomPosition.top > 450)) {
		jQuery("#quickLook").dialog("option", "position", { my: "right bottom", at: "right top", of: bottom } );
	}
	if ((bottomPosition.left < 741) && (bottomPosition.top > 450)) {
		jQuery("#quickLook").dialog("option", "position", { my: "left bottom", at: "left top", of: bottom } );
	}
	else if ((bottomPosition.left < 741) && (bottomPosition.top < 451)) {
		jQuery("#quickLook").dialog("option", "position", { my: "left top", at: "left bottom", of: bottom } );
	}
	jQuery(".productInfo").load(URL, function(){
		if (jQuery(this).html() === "This product is not available to view.") {
			jQuery(this).html("Bummer, this isn't available right now - check out our other amazing bits...");
		}
		if (jQuery(this).html() === "L'article ne peut pas être affiché.") {
			jQuery(this).html("Pas de bol, cet article n'est plus disponible pour le moment. Jetez un &oelig;il aux articles du m&ecirc;me genre...");
		}
		if (jQuery(this).html() === "Leider ist derzeit keine Produktansicht möglich.") {
			jQuery(this).html("Schade, das Produkt ist momentan ausverkauft - aber guck' dir unsere anderen tollen Sachen an...");
		}
		jQuery(".quickLook-Details").show();
	});
	return false;
}).live("mouseleave", function() {
	timingOut();
});
var timeOut;
function timingOut() {
	timeOut = setTimeout(function() {
		jQuery("#quickLook").dialog("destroy");
    }, 250);
}
function stopTimingOut() {
	clearTimeout(timeOut);
}
jQuery("#quickLook").mouseleave(function(){
	timingOut();
}).mouseenter(function(){
   	stopTimingOut();
});

});