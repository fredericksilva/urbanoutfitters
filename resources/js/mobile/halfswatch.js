/**
* @fileoverview Venda.Attributes
 * Venda's Attributes functionality incorporates a standardized way of interfacing Attribute Products with the front-end as to make
 * the modification and creation of selection methods easier.
 *
 * This is the halfswatch interface used to display a swatch for the first attribute and select dropdown boxes for each additional attribute
 *
 * The files below will be included dynamicly when required:
 * @requires js/Venda/Attributes/attributeAsset-Dropdown.js
 * @requires js/Venda/Attributes/attributeAsset-Swatch.js
 *
 * @author Alby Barber <abarber@venda.com>
 * @author Donatas Cereska <DonatasCereska@venda.com>
 * @author Matt Wyatt <mwyatt@anthropologie.com>
*/

Venda.Attributes.HalfSwatch = function () {

	jQuery(".oneProduct").each(function(index) {
		var uID = this.id.substr(11);
		Venda.Attributes.productArr[index] = new Venda.Attributes.GenerateOptionsJSON(index, uID);
		if(jQuery("#oneProduct_" + uID + " #attributeInputs").length) {
			jQuery("#oneProduct_" + uID + " #attributeInputs").addClass("type_halfswatch");
			Venda.Attributes.generateSwatch('att1', uID);
			Venda.Attributes.generateDropDowns('att2', uID);
/*			Venda.Attributes.generateDropDowns('att3', uID);
			Venda.Attributes.generateDropDowns('att4', uID);
			Venda.Attributes.PresetAtt(index, uID);
 			jQuery('#oneProduct_' + uID + ' #pricerange').text(Venda.Attributes.GetPriceRange(uID));
			jQuery('#oneProduct_' + uID + ' #price').text(Venda.Attributes.GetPriceRange(uID));
			Venda.Attributes.updateAttributes(uID); */
		}
		Venda.Attributes.swatchImage('att1',uID);
	});

	// This is getting all the assets that can be loaded after the Onload
	var url1 = jQuery("#tag-ebizurl").text() + '/content/ebiz/' + jQuery("#tag-ebizref").text() + '/resources/js/mobile/attributeAsset-Swatch.js';
	jQuery.getScript(url1, function(Status){
		if (!Status) {
			console.warn('Whoops! attributeAsset-Swatch.js did not load');
		} else {
			var url2 = jQuery("#tag-entmediaadd").text() + '/content/ebiz/' + jQuery("#tag-ebizref").text() + '/resources/js/mobile/attributeAsset-Dropdown.js';
			jQuery.getScript(url2, function(Status) {
				if (!Status) {
					console.warn('Whoops! attributeAsset-Dropdown.js did not load');
				} else {
					//All loaded
					//ColourSwatch selection
					var singleuID = jQuery(".oneProduct").attr("id").substr(11);
					//selecting at the 1st colour swatch when a page loaded
					var reg = new RegExp('[?&]colour=([^?&]+)');
					var urlParam = (location.href.match(reg)) ? location.href.match(reg)[1] : jQuery('#swatchList_att1 li:first').attr('data-attvalue');
					if((jQuery(".oneProduct").length === 1) && (urlParam != "")) {
						for(var i = 0; i < Venda.Attributes.storeImgsArr.length; i++) {
							if(Venda.Attributes.storeImgsArr[i].param == urlParam) {
								Venda.Attributes.HalfswatchBehaviour('att1', decodeURI(urlParam), singleuID);
							}
						}
					}
				//All loaded
				}
			});
		}
	});

/* 	var uID = jQuery('.oneProduct').attr('id').substr(11);
	Venda.Attributes.updateAttributes(uID); */

}();

// Events
// pre-select the 1st att
jQuery("html.ui-mobile").live('pageinit',function(event){
	var att = (typeof jQuery('#swatchList_att1 li:first').data('attvalue')!="undefined")
			? jQuery('#swatchList_att1 li:first').data('attvalue')
			: "";
	Venda.Attributes.ImageSwap(att);
});

// Events
jQuery('.attributeSwatch').live('click', function() {
	var uID = this.id.substr(16);
	var attName 	= this.getAttribute('data-attName');
	var attValue 	= this.getAttribute('data-attValue');
	Venda.Attributes.HalfswatchBehaviour(attName, attValue, uID);
});


jQuery("select[name*='att']").live("change",function() {
	var uID = this.id.substr(5);
	var attName 	= this.name;
	var attValue 	= this.value;
	Venda.Attributes.HalfswatchBehaviour(attName, attValue, uID);
});

Venda.Attributes.HalfswatchBehaviour = function(attName, attValue, uID) {
	Venda.Attributes.setSelectedJSON(attName,attValue, uID);
	Venda.Attributes.SetAtt3(uID);
	Venda.Attributes.updateAttributes(uID);
	Venda.Attributes.UpdateSwatch('att1', uID);
	Venda.Attributes.UpdateDD('att2', uID);
	Venda.Attributes.UpdateDD('att3', uID);
	Venda.Attributes.UpdateDD('att4', uID);
	Venda.Attributes.setSelectedClass(uID);
	Venda.Attributes.swatchImage('att1',uID);
};

Venda.Attributes.SetAtt3 = function (auID) {
  var updatedAtt3 = "";
  for(var i = 0; i < Venda.Attributes.attsArray.length; i++) {
    if(Venda.Attributes.attsArray[i].att1 == Venda.Attributes.productArr[0].attSet.att1.selected){
      updatedAtt3 = Venda.Attributes.attsArray[i].att3;
      break;
    }
  } 
  Venda.Attributes.productArr[0].attSet.att3.selected = updatedAtt3;
  Venda.Attributes.productArr[0].attSet.att3.selectedValue = updatedAtt3;
};