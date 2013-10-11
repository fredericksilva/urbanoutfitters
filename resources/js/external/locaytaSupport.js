var FSM_APP_DEFAULT_COLOUR_FACET = "ESP_Rational_Colour";
var FSM_APP_PER_LINE = 3;
var FSM_APP_PAGE_SIZE = 0;
var FSM_APP_IS_SEARCH = false;
var FSM_APP_SEARCH_WORDS = [];
var FSM_APP_HAS_ZONES = false;
var FSM_APP_PRODUCT_PAGE = /invt/g.test(document.location.pathname);
var FSM_APP_PRODUCT_LIST_PAGE = /icat/g.test(document.location.pathname) || /search/g.test(document.location.pathname);
var FSM_IS_FIRST_LOAD = true;

//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
// Initialise FSM
//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
LM.preInit(function() {
	FSM_APP_HAS_ZONES = jQuery("div[lmzone]").length > 0;
	// temp fix to swap out any search zones on icat pages
	if (/icat/g.test(document.location.pathname) || /dvenda\/shop/g.test(document.location.pathname)) {
		jQuery("div[lmzone='search']").each(function() {
			jQuery(this).attr("lmzone", "category");
		});
	}
	if (/search$/g.test(document.location.pathname)) {
		FSM_APP_IS_SEARCH = true;
		FSM_APP_DEFAULT_COLOUR_FACET = "Matrix_ESP_Rational_Colour_Size:ESP_Rational_Colour";
		try {
			var query = fsm_app_query();
			var searchInput = query["q"][0];
			FSM_APP_SEARCH_WORDS = searchInput.match(/\w+/g) || [];
		}
		catch (e) {}
	}
	// default view (3 per line or 5)
	var isSmallView = jQuery("input[data-esp-var='icxt5perline']").val() == "1";
	if (isSmallView) {
		FSM_APP_PER_LINE = 5;
	}
	// currency, assume either GBP (default) or EUR
	var currency = jQuery("#tag-sitecurrency").text();
	if (currency == "EUR" || currency == "GBP") {
		LM.Currency = currency;
	}
	// TEMP, need to use the trigger commented out above when ready
	/*
	if (window.location.hostname.indexOf(".de") != -1 || window.location.hostname.indexOf(".fr") != -1) {
		LM.Currency = "EUR";
	}
	*/
	// fixed facet prices
	var prices = [];
	prices.push([0, 9.99]);
	prices.push([10, 19.99]);
	prices.push([20, 49.99]);
	prices.push([50, 99.99]);
	prices.push([100, 199.99]);
	prices.push([200, 499.99]);
	prices.push([500, 1000]);
	LM.registerFixedFacet("sys_price", prices);
});

//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
// Fires just before the content is requested
//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
LM.load(function() {
	if (!FSM_APP_HAS_ZONES) return;
	// show loading
	fsm_app_showLoading();
	// use searchterm override (for MotionPoint)
	try {
		var query = fsm_app_query();
		if (query["q"] != null && query["q"].length > 0) {
			var searchTerm = query["q"][0];
			if (searchTerm != null && searchTerm != "") {
				LM.SearchTerm = searchTerm;
			}
		}
	}
	catch (e) {
			fsm_app_debug("LM.load > LM.SearchTerm Error: " + e.message);
	}
	// sync the facets UI to what's in hash keys
	jQuery("div.termtext").removeClass("chosen");
	var currentField = fsm_app_getCurrentField();
	var filters = fsm_app_filtersFromQuery();
	for (var field in filters) {
		var values = filters[field];
		for (var ii=0; ii<values.length; ii++) {
			var value = values[ii];
			jQuery("div.termtext[data-facet-field=\"" + field + "\"][data-facet-value=\"" + value + "\"]").addClass("chosen");
		}
	}
	jQuery("div[data-clear-field]").each(function() {
		var field = jQuery(this).attr("data-clear-field");
		if (typeof(filters[field]) == "undefined") {
			jQuery(this).css("display", "none");
		}
		else {
			jQuery(this).css("display", "block");
		}
	});
});

//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
// Content loaded
//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
var FSM_FACET_INIT = false;
LM.complete(function() {
	if (!FSM_APP_HAS_ZONES) return;
	fsm_app_hideLoading();

	// no results ... need to change the page layout a bit
	if (jQuery("#searchResults div.noresults").length > 0) {
		jQuery("#searchResults").css("width", "950px").css("left", "-7px");
		jQuery("div.leftSidebar").css("display", "none");
	}else{
		jQuery("#searchResults").css("width", "").css("left", "");
		jQuery("div.leftSidebar").css("display", "");
	}	

	if(FSM_IS_FIRST_LOAD && /search/g.test(document.location.pathname)){
		jQuery("div.termtext[data-facet-field]").each(function() {
		if("sys_price" == jQuery(this).attr("data-facet-field") && 0 == jQuery(this).attr("data-facet-original-count")){
				jQuery(this).css("display","none");
			}
		});
	}

	FSM_IS_FIRST_LOAD = false;

 	// initialise facets + drop down
	try {
		//Venda.Search.Feature.uiSelectmenu.prototype.display();
		// Variation on Venda method
		jQuery(".sort select").selectmenu({ style:'dropdown', maxHeight: 2000, positionOptions: { collision: 'none' } });
		jQuery(".sortby").click(function(){
			jQuery(".sort select").selectmenu({ style:'dropdown', maxHeight: 2000, positionOptions: { collision: 'none' } });
		});
		jQuery(".accordion_slice").each( function() {
			jQuery(this).find(".viewScroll .collatedresult").css('height','auto');
			var collateHeight = jQuery(this).find(".viewScroll .collatedresult").height();
			var collateHeight2 = 1;
			jQuery(this).find(".termtext:visible").each(function() {
				collateHeight2 += jQuery(this).height() + 3;
			});
			var facetLength = jQuery(this).find(".termtext:visible").length;
			if (facetLength > 10) {
				jQuery(this).find(".viewScroll .collatedresult").css('height','207px');
				jQuery(this).find(".scrollerTrack").show();
			}
			else {
				jQuery(this).find(".viewScroll .collatedresult").css('height', collateHeight2);
				jQuery(this).find(".scrollerTrack").hide();
			}
		})
		//jQuery('.viewScroll').tinyscrollbar();
		if (!FSM_FACET_INIT) {
			jQuery('.collatedresult').alternateScroll({ 'vertical-bar-class': 'styled-v-bar', 'hide-bars': false });		// post Venda code to deal with hidden facets
			FSM_FACET_INIT = true;
		}
	}
	catch (e) {
		fsm_app_debug("LM.complete::ERROR (try 1): " + e.message);
	}
	// initialise colour swatches
	try {
		Venda.Search.Feature.swatches.prototype.display();
	}
	catch (e) {
		fsm_app_debug("LM.complete::ERROR (swatches): " + e.message);
	}
	// paging
	try {
		jQuery("a.updatesearch[data-count]").each(function() {
			var count = parseInt(jQuery(this).attr("data-count"));
			jQuery("span", this).css("display", "none");
			if (LM.getHash().indexOf(LM.QueryPrefix + "hitsperpage") != -1) {
				jQuery("span[data-ref='fsm_view_by_page']", this).css("display", "inline");
			}
			else if (count > 119) {
				jQuery("span[data-ref='fsm_view_100']", this).css("display", "inline");
			}
			else {
				jQuery("span[data-ref='fsm_view_all']", this).css("display", "inline");
			}
		});
	}
	catch (e) {
		fsm_app_debug("LM.complete::ERROR (paging): " + e.message);
	}
	// currency
	try {
		jQuery('.price').pennies('convert',{to: jQuery('.price').pennies('get')});
	}
	catch (e) {
		fsm_app_debug("LM.complete::ERROR (price): " + e.message);
	}
	// tidy special offer text
	jQuery("#searchResults p.list-promo").each(function() {
		try {
			var html = jQuery(this).html();
			if (window.location.hostname.indexOf(".fr") != -1) {
				html = html.replace(/\u00A3\d+\//gi, "");
			}
			else if (window.location.hostname.indexOf(".de") != -1) {
				html = html.replace(/\d+ £ \/ /gi, "");
			}
			else {
				html = html.replace(/\/€\d+/gi, "");
			}
			jQuery(this).html(html);
		}
		catch (e) {
			fsm_app_debug("LM.complete::ERROR (special offer tidy): " + e.message);
		}
	});
	// apply dynamic colours
	fsm_app_setDynamicColours();
	// make sure the correct swatches are marked as on
	fsm_app_setSwatchClasses();
	// per line
	fsm_app_setPerLineView(FSM_APP_PER_LINE);
 });

//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
// Add to basket tracking
//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
if(FSM_APP_PRODUCT_PAGE || FSM_APP_PRODUCT_LIST_PAGE) {
	if(FSM_APP_PRODUCT_LIST_PAGE){
		jQuery(document).on("click", ".quickBuyDetails", function (){
			var sku =jQuery(this).attr('id');
			if(sku != null && sku != ""){
				LM.Sku = sku ;
				LM.sendTracking(1,null,this);
				LM.Sku = null;
			}
		});
	}
	jQuery(document).on("click", ".addproduct", function (){
		//Their validation code
		var uID = jQuery(this).closest('.oneProduct').attr('id');
		uID = uID.substr(11);
		var isValid = Venda.Widget.MinicartDetail.Validate(uID);

		if(isValid ){
			//track add to basket
			var sku =jQuery("input[name='invt']").val();
			var qty = jQuery("#oneProduct_" + uID + " .qty").val();
			if(sku != null && sku != "" && qty != null && qty > 0){
				LM.addBasketItem({ "sku": sku, "qty": qty });
			}
		}
	});
}

 
//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
// Facets JSON loaded
//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
 LM.syncFacets(function(args) {
	fsm_app_syncFacets(args);
});

//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
// Colour swatch functions
//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
function fsm_app_setColourSwatch(element) {
	var $container = jQuery(element).parent();
	var $element = jQuery(element);
	var baseHref = jQuery("#" + $element.data("prodid") + " a[data-base-href]").attr("href");
	var $mainImg = jQuery("#" + $element.data("prodid") + " img[data-hook='fsm_app_image']");
	var $quickLink = jQuery("#" + $element.data("prodid") + " a[data-hook='fsm_app_quick']");
	var setimage = $element.data("setimage");
	var smallImgSrc = jQuery("img", $element).attr("data-small-src");
	var rationalColour = jQuery("img", $element).attr("data-colour-rational");
	//var newhref1 = $mainImg.data("href") + "&colour=" + $element.attr("title");
	//var newhref2 = $quickLink.data("href") + "&colour=" + $element.attr("title");
	var newhref1 = baseHref + "&colour=" + $element.data("color");
	var newhref2 = baseHref + "&amp;temp=quickBuyDetails-reDesign&amp;layout=noheaders&amp;colour=" + $element.data("color");

	jQuery("a", $container).removeClass("sw_selected");
	$element.addClass("sw_selected");
	$mainImg.attr("src", setimage).attr("data-medium-colour-src", setimage).attr("data-small-colour-src", smallImgSrc);
	$mainImg.parent().attr("href", newhref1);
	$quickLink.attr("href", newhref2);
	$mainImg.attr("data-dynamic-rational-colour", rationalColour);
	//fsm_app_repaint();
}

//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
// Try and match colour filters/search terms with colour
// product images
//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
function fsm_app_setDynamicColours() {
	var lookup = fsm_app_filtersFromQuery();
	var colours = lookup[FSM_APP_DEFAULT_COLOUR_FACET];
	try {
		// sort the colours into correct (clicked) order
		var tempColours = [];
		jQuery("div.termtext[data-facet-field='" + FSM_APP_DEFAULT_COLOUR_FACET + "'].chosen").sort(function(a, b) {
			var clickOrder1 = parseInt(jQuery(a).attr("data-click-order") || "0");
			var clickOrder2 = parseInt(jQuery(b).attr("data-click-order") || "0");
			return clickOrder2 < clickOrder1;
		}).each(function() {
			var	colour = jQuery(this).attr("data-facet-value");
			tempColours.push(colour);
		});
		fsm_app_debug("fsm_app_setDynamicColours: Sorted colours: " + tempColours);
		colours = tempColours;
	}
	catch (e) {
	}
	// mark any colours found against the products
	jQuery("img[data-hook='fsm_app_image']").each(function() {
		var mediumSrc = null;
		var smallSrc = null;
		var matchedColour = null;
		var matchedRationalColour = null;
		if (FSM_APP_SEARCH_WORDS.length > 0) {
			// if search page then attempt to match search term colour
			try {
				jQuery("img[data-colour-rational]", jQuery(this).parent().parent()).each(function() {
					var rational = jQuery(this).attr("data-colour-rational");
					var colour = jQuery(this).attr("data-colour");
					var rationalSmallSrc = jQuery(this).attr("data-small-src");
					var rationalMediumSrc = jQuery(this).attr("data-medium-src");
					for (var ii=0; ii<FSM_APP_SEARCH_WORDS.length; ii++) {
						var searchWord = FSM_APP_SEARCH_WORDS[ii];
						if (rational != null && rational != "" && rational.toLowerCase() == searchWord.toLowerCase()) {
							if (rationalSmallSrc != null && rationalSmallSrc != "") {
								smallSrc = rationalSmallSrc;
								matchedRationalColour = rational;
								matchedColour = colour;
							}
							if (rationalMediumSrc != null && rationalMediumSrc != "") {
								mediumSrc = rationalMediumSrc;
								matchedRationalColour = rational;
								matchedColour = colour;
							}
						}
					}
				});
			}
			catch (e) {
				fsm_app_debug("fsm_app_setDynamicColours: Error extracting colour search image match: " + e.message);
			}
		}
		if (colours != null && colours.length > 0) {
			// try and get image that matches colour of last selected colour filter
			try {
				for (var ii=0; ii<colours.length; ii++) {
					jQuery("img[data-colour-rational]", jQuery(this).parent().parent()).each(function() {
						var rational = jQuery(this).attr("data-colour-rational");
						var colour = jQuery(this).attr("data-colour");
						var rationalSmallSrc = jQuery(this).attr("data-small-src");
						var rationalMediumSrc = jQuery(this).attr("data-medium-src");
						if (rational != null && rational != "" && rational.toLowerCase() == colours[ii].toLowerCase()) {
							if (rationalSmallSrc != null && rationalSmallSrc != "") {
								smallSrc = rationalSmallSrc;
								matchedRationalColour = rational;
								matchedColour = colour;
							}
							if (rationalMediumSrc != null && rationalMediumSrc != "") {
								mediumSrc = rationalMediumSrc;
								matchedRationalColour = rational;
								matchedColour = colour;
							}
						}
					});
				}
			}
			catch (e) {
				fsm_app_debug("fsm_app_setDynamicColours: Error extracting colour filter image match: " + e.message);
			}
		}
		if (smallSrc != null && smallSrc != "") {
			jQuery(this).attr("data-small-colour-src", smallSrc);
		}
		if (mediumSrc != null && mediumSrc != "") {
			jQuery(this).attr("data-medium-colour-src", mediumSrc);
		}
		if (matchedRationalColour != null && matchedRationalColour != "") {
			jQuery(this).attr("data-dynamic-rational-colour", matchedRationalColour);
		}
		if (matchedRationalColour != null && matchedRationalColour != "") {
			try {
				jQuery("img[data-colour-rational='" + matchedRationalColour.toLowerCase() + "']", jQuery(this).parent().parent()).click();
			}
			catch (e) {
				fsm_app_debug("fsm_app_setDynamicColours: Error setting matchedRationalColour: " + e.message);
			}
		}
	});
}

//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
// Make sure the swatches that match the dynamically selected
// colours are shown as selected
//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
function fsm_app_setSwatchClasses() {
	try {
		jQuery("img[data-hook='fsm_app_image']").each(function() {
			var $product = jQuery(this).parent().parent();
			var imgUrl = jQuery(this).data("medium-colour-src");
			if (imgUrl == null || imgUrl == "") imgUrl = jQuery(this).data("medium-src");
			jQuery("img.swatch", $product).each(function() {
				var medSwatchUrl = jQuery(this).data("medium-src");
				//if (medSwatchUrl == imgUrl) jQuery(this).parent().parent().addClass("sw_selected");
				if (medSwatchUrl == imgUrl) jQuery(this).parent().parent().click();
			});
		});
	}
	catch (e) {
		fsm_app_debug("fsm_app_initSwatchDefaults::ERROR: " + e.message);
	}
}

//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
// Layout functions
//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
function fsm_app_setPerLineView(perLine) {
	FSM_APP_PER_LINE = perLine;
	if (perLine == 5) {
		var dim = [142, 213];
		jQuery(".threePerLine").css("display", "block");
		jQuery(".fivePerLine").css("display", "none");
		jQuery("ul.prodsGrid li").css("width", "19.5%").addClass('fivePerline').each(function() {
			var swatchCount = jQuery(".swatchContainer", this).children().length;
			if (swatchCount > 0) {
				jQuery(".swatchIcon", this).css("display", "inline");
			}
		});
		jQuery("img[data-hook='fsm_app_image']").attr("width", dim[0]).attr("height", dim[1]).each(function() {
			// load small image, fall back to medium if no small image
			var smallSrc = jQuery(this).attr("data-small-src");
			var dynSmallSrc = jQuery(this).attr("data-small-colour-src");
			if (dynSmallSrc != null && dynSmallSrc != "") smallSrc = dynSmallSrc;
			var mediumSrc = jQuery(this).attr("data-medium-src");
			if (smallSrc != "") {
				jQuery(this).attr("src", smallSrc);
			}
			else if (mediumSrc != "") {
				jQuery(this).attr("src", mediumSrc);
			}
		});
		jQuery(".swatchContainer").css("display", "none");
		jQuery(".quickLinkBox").removeClass("qb-large").addClass("qb-small");
		jQuery(".roundels").css("display", "none");
	}
	else if (perLine == 3) {
		var dim = [244, 366];
		jQuery(".threePerLine").css("display", "none");
		jQuery(".fivePerLine").css("display", "block");
		jQuery("ul.prodsGrid li").css("width", "33%").removeClass('fivePerline');
		jQuery("img[data-hook='fsm_app_image']").attr("width", dim[0]).attr("height", dim[1]).each(function() {
			var mediumSrc = jQuery(this).attr("data-medium-src");
			var dynMediumSrc = jQuery(this).attr("data-medium-colour-src");
			if (dynMediumSrc != null && dynMediumSrc != "") mediumSrc = dynMediumSrc;
			if (mediumSrc != "") {
				jQuery(this).attr("src", mediumSrc);
			}
		});
		jQuery(".swatchContainer").css("display", "block");
		jQuery(".swatchIcon").css("display", "none");
		jQuery(".quickLinkBox").removeClass("qb-small").addClass("qb-large");
		jQuery(".roundels").css("display", "block");
	}
	fsm_app_repaint();
}

//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
// Filters
//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
function fsm_app_clearAllFilters() {
	jQuery("#clear_accordion_slice").css("display", "none");
	jQuery("div.termtext[data-facet-field]").removeClass("chosen").attr("data-click-order", 0);
	LM.clearFilters();
}

function fsm_app_clearFilters(field) {
	jQuery("div.clear" + field).css("display", "none");
	jQuery("div.termtext[data-facet-field=\"" + field + "\"]").removeClass("chosen").attr("data-click-order", 0);
	fsm_app_applyFilters();
}

function fsm_app_toggleFilter(obj) {
	var $parent = jQuery(obj).parent();
	var field = $parent.attr("data-facet-field");
	if ($parent.hasClass("chosen")) {
		$parent.removeClass("chosen").attr("data-click-order", 0);
	}
	else {
		if (FSM_APP_IS_SEARCH && field == "sys_price") {
			// search only allows 1 price filter at a time
			jQuery("div.termtext[data-facet-field='sys_price']").removeClass("chosen");
		}
		var maxClickOrder = 0;
		jQuery("div.termtext", $parent.parent()).each(function() {
			try {
				var clickOrder = parseInt(jQuery(this).attr("data-click-order") || "0");
				if (clickOrder > maxClickOrder) maxClickOrder = clickOrder;
			}
			catch (e) {}
		});
		$parent.addClass("chosen").attr("data-click-order", maxClickOrder+1);
	}
	jQuery("div[data-clear-field=\"" + field + "\"]").css("display", "block");
	fsm_app_animateToTop();
	fsm_app_applyFilters(field);
}

function fsm_app_applyFilters(currentField) {
	var filters = {};
	jQuery("div[data-facet-field].chosen").each(function() {
		var field = jQuery(this).attr("data-facet-field");
		var value = jQuery(this).attr("data-facet-value");
		if (field && value) {
			if (!filters[field]) filters[field] = [];
			filters[field].push(value);
		}
	});
	LM.setFilters(filters, currentField);
}

//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
// Facet functions
//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
function fsm_app_toggleFacet(field) {
	var $facet = jQuery("div[data-fsm-facet-accordion='" + field + "']");
	var $items = jQuery("div[data-fsm-facet-results='" + field + "']", $facet);
	var $icon = jQuery("span[data-fsm-facet-icon='" + field + "']", $facet);
	var visible = $items.is(":visible");
	if (visible) {
		$icon.removeClass("iconMinus").addClass("iconPlus");
		$items.slideUp();
	}
	else {
		$icon.removeClass("iconPlus").addClass("iconMinus");
		$items.slideDown();
	}
}

function fsm_app_syncFacets(args) {
	var currentField = fsm_app_getCurrentField();
	var facets = args["facetData"];
	var filterFields = fsm_app_getFilterFields();
	// disable all facets (except current field)
	jQuery("div.termtext[data-facet-field]").each(function() {
		var field = jQuery(this).attr("data-facet-field");
		if (facets[field + (field == "sys_price" && FSM_APP_IS_SEARCH ? "_" + LM.Currency : "")] && field != currentField && !jQuery(this).hasClass("chosen")) {
			//if (field != currentField) {
				jQuery(this).attr("data-facet-enabled", "0").css("display", "none");
				//jQuery("a", this).attr("style", "color: #bbb; cursor: default");
				jQuery("span.count", this).text("(0)");
			//}
		}
	});
	// re-enable facets 
	for (var field in facets) {
		if (field != currentField + (field == "sys_price_" + LM.Currency ? "_" + LM.Currency : "")) {
			var options = facets[field];
			var fieldName = (field == "sys_price_" + LM.Currency ? "sys_price" : field);
			var hasChecked = jQuery("div.termtext[data-facet-field='" + fieldName + "'].chosen").length > 0;
			jQuery("div[data-fsm-facet-accordion='" + fieldName + "']").css("display", hasChecked || options.length > 0 ? "" : "none");
			for (var ii = 0; ii < options.length; ii++) {
				var option = options[ii];
				var count = 0;
				var value = null;
				if (option.length == 2) {
					count = option[0];
					value = option[1];
				}
				else if (option.length == 3) {
					count = option[0];
					value = option[1] + ":" + option[2];
				}
				if (value != null && count > 0) {
					jQuery("div.termtext[data-facet-field=\"" + fieldName + "\"][data-facet-value=\"" + value + "\"]")
					.attr("data-facet-enabled", "1")
					.css("display", "")
					.removeClass("disabled")
					.removeAttr("style").each(function() {
						//jQuery("a", this).removeAttr("style");
						jQuery("span.count", this).text("(" + count + ")");
					});
					
				}
			}
		}
	}
	// final tidy .. always enable all facets if only 1 filter field applied
	if (filterFields.length == 1) {
		jQuery("div[data-fsm-facet-accordion='" + filterFields[0] + "']").css("display", "");
		jQuery("div[data-fsm-facet-accordion='" + filterFields[0] + "'] div.termtext")
			.attr("data-facet-enabled", "1")
			.css("display", "")
			.removeClass("disabled")
			.removeAttr("style")
			.each(function() {
				//jQuery("a", this).removeAttr("style");
				/* commented out below as it was returning undefined count */
				//jQuery("span.count", this).text("(" + jQuery(this).data("facet-original-count") + ")");
				
			});
	}
}

//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
// Paging, sorting and page size functions
//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
function fsm_app_setPage(pageNo) {
	fsm_app_animateToTop();
	LM.setPage(pageNo);
}

function fsm_app_togglePageSize() {
	if (FSM_APP_PAGE_SIZE == 0) {
		FSM_APP_PAGE_SIZE = 120;
		fsm_app_animateToTop();
		LM.setPageView(FSM_APP_PAGE_SIZE);
	}
	else {
		FSM_APP_PAGE_SIZE = 0;
		var hash = LM.getHash([LM.QueryPrefix + "hitsperpage", LM.QueryPrefix + "viewall", LM.QueryPrefix + "pg"]);
		LM.CurrentHash = "#" + hash;
		window.location.hash = hash;
		LM.getData();
	}
}

function fsm_app_sort(select) {
	try {
		var option = jQuery(select).find(":selected").get(0);
		fsm_app_debug("SORT: " + option);
		var sortField = jQuery(option).attr("data-esp-sort") || "";
		var sortOrder = jQuery(option).attr("data-esp-order") || "";
		if (sortField == "" || sortOrder == "") {
			LM.clearFilters();
		}
		else {
			LM.setSortField(sortField, sortOrder);
		}
	}
	catch (e) {
		fsm_app_debug("Sort error: " + e.message);
	}
}

//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
// Misc functions
//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
function fsm_app_filtersFromQuery() {
	var hashKeys = LM.getHashKeyValues();
	var filters = {};
	for (var ii=0; ii<hashKeys.length; ii++) {
		var keyValuePair = hashKeys[ii].split("=");
		if (keyValuePair.length == 2) {
			var key = keyValuePair[0];
			var value = decodeURIComponent(keyValuePair[1]);
			if (key.substring(0, 11) == "esp_filter_") {
				var field = decodeURIComponent(key.substring(11));
				if (filters[field] == null) filters[field] = [];
				filters[field].push(value);
			}
		}
	}
	return filters;
}

function fsm_app_query() {
	var query = {};
	try {
		var queryPairs = window.location.search.substring(1).split("&");
		for (var ii=0; ii<queryPairs.length; ii++) {
			var keyValuePair = queryPairs[ii].split("=");
			if (keyValuePair.length == 2) {
				var field = decodeURIComponent(keyValuePair[0]);
				var value = decodeURIComponent(keyValuePair[1].replace(/\+/g, '%20'));
				if (field != "") {
					if (query[field] == null) query[field] = [];
					query[field].push(value);
				}
			}
		}
	}
	catch (e) {}
	return query;
}

function fsm_app_refresh() {
}

function fsm_app_showLoading() {
	jQuery("#loadingsearch").removeClass("hide");
}

function fsm_app_hideLoading() {
	jQuery("#loadingsearch").addClass("hide");
}

function fsm_app_animateToTop() {
	// only scroll to top if low down in the page
	var currentTop = jQuery("body").scrollTop();
	if (currentTop > 385) {
		jQuery("html,body").animate({ scrollTop: 365 }, 300);
	}
}

function fsm_app_debug(message) {
	try {
		console.log(message);
	}
	catch (e) {}
}

function fsm_app_repaint() {
	try {
		var element = document.getElementById("searchResults");
		element.style.display = "none";
		element.offsetHeight;
		element.style.display = "block";
	}
	catch (e) {
		fsm_app_debug("fsm_app_repaint::error: " + e.message);
	}
}

function fsm_app_getCurrentField() {
	var hashKeyValues = LM.getHashKeyValues();
	for (var i = 0; i < hashKeyValues.length; i++) {
		if (hashKeyValues[i].indexOf(LM.QueryPrefix + "cf=") == 0) {
			return decodeURIComponent(hashKeyValues[i].split("=")[1]);
		}
	}
	return null;
}

function fsm_app_getFilterFields() {
	var filters = [];
	var lookup = {};
	var hashKeyValues = LM.getHashKeyValues();
	var filterKeyBase = LM.QueryPrefix + "filter_";
	try {
		for (var ii = 0; ii < hashKeyValues.length; ii++) {
			if (hashKeyValues[ii].indexOf(filterKeyBase) == 0) {
				var field = hashKeyValues[ii].split("=")[0].substring(filterKeyBase.length);
				if (!lookup[field]) {
					lookup[field] = true;
					filters.push(field);
				}
			}
		}
	}
	catch (e) { }
	return filters;
}