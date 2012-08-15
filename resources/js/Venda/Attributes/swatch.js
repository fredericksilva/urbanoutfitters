/**
* @fileoverview Venda.Attributes
 * Venda's Attributes functionality incorporates a standardized way of interfacing Attribute Products with the front-end as to make
 * the modification and creation of selection methods easier.
 *
 * This is the swatch interface used to display select swatches for each attribute
 *
 * The files below will be included dynamicly when required:
 * @requires js/Venda/Attributes/attributeAsset-Swatch.js
 *
 * @author Alby Barber <abarber@venda.com>
 * @author Donatas Cereska <DonatasCereska@venda.com>
*/

Venda.Attributes.Swatch = function () {
	
	jQuery(".oneProduct").each(function(index) {
		var uID = this.id.substr(11);
		Venda.Attributes.productArr[index] = new Venda.Attributes.GenerateOptionsJSON(index, uID);
		if(jQuery("#oneProduct_" + uID + " #attributeInputs").length) {
			jQuery("#oneProduct_" + uID + " #attributeInputs").addClass("type_swatch");
			for (var t = 1; t <= Venda.Attributes.HowManyAtts(uID); t++) { Venda.Attributes.generateSwatch('att' + t, uID); }
			Venda.Attributes.PresetAtt(index, uID);
/* 			jQuery('#oneProduct_' + uID + ' #pricerange').text(Venda.Attributes.GetPriceRange(uID));
			jQuery('#oneProduct_' + uID + ' #price').text(Venda.Attributes.GetPriceRange(uID)); 
			Venda.Attributes.updateAttributes(uID); */
		}
		Venda.Attributes.swatchImage('att1', uID);
	});
	
	// This is getting all the assets that can be loaded after the Onload	
	var url = jQuery("#tag-ebizurl").text() + '/content/ebiz/' + jQuery("#tag-ebizref").text() + '/resources/js/Venda/Attributes/attributeAsset-Swatch.js';
	jQuery.getScript(url, function(Status){ if (!Status){console.log('Whoops! attributeAsset-Swatch.js did not load');} else {
	//All loaded
			
 		//ColourSwatch selection
		var singleuID = jQuery(".oneProduct").attr("id").substr(11);
		var urlParam = location.href.split("=")[1];
		if((jQuery(".oneProduct").length === 1) && (urlParam != "")) {
			for(var i = 0; i < Venda.Attributes.storeImgsArr.length; i++) {
				if(Venda.Attributes.storeImgsArr[i].param == urlParam) {
					Venda.Attributes.SwatchBehaviour('att1', urlParam, singleuID);
				}
			}
		}
		
	//All loaded
	}
	});
	
}();

// Events
jQuery('.attributeSwatch').live('click', function() {
	var uID = this.id.substr(16);
	var attName 	= this.getAttribute('data-attName');
	var attValue 	= this.getAttribute('data-attValue');
	Venda.Attributes.SwatchBehaviour(attName, attValue, uID);
});

Venda.Attributes.SwatchBehaviour = function(attName, attValue, uID) {
	Venda.Attributes.setSelectedJSON(attName,attValue, uID);
	Venda.Attributes.updateAttributes(uID);
	for (var t = 1; t <= Venda.Attributes.HowManyAtts(uID); t++) { Venda.Attributes.UpdateSwatch('att' + t, uID); }
	// setSelectedClass is used to add a class to the swatch .selected
	Venda.Attributes.setSelectedClass(uID);
	Venda.Attributes.swatchImage('att1',uID);
}