/**
* @fileoverview Venda.Attributes
 * Venda's Attributes functionality incorporates a standardized way of interfacing Attribute Products with the front-end as to make
 * the modification and creation of selection methods easier.
 *
 * The files below will be included dynamicly when required:
 * @requires js/Venda/Attributes/attributeAsset-Dropdown.js
 * @requires js/Venda/Attributes/attributeAsset-Swatch.js
 * @requires js/Venda/Attributes/dropdown.js
 * @requires js/Venda/Attributes/grid.js
 * @requires js/Venda/Attributes/halfswatch.js
 * @requires js/Venda/Attributes/multiAdd2.js
 * @requires js/Venda/Attributes/swatch.js
 *
 * @author Alby Barber <abarber@venda.com>
 * @author Donatas Cereska <DonatasCereska@venda.com>
 * @author Matthew Wyatt <mwyatt@anthropologie.com>
*/

Venda.namespace('Attributes');
Venda.Attributes = function () {};

/**
* Declares global vars
*/
Venda.Attributes.dataObj = {"atronhand": "","stockstatus": "","stockstatus": "","atrreleaseyr": "","atrmsrp": "","atrsku": "","atrwas": "","atrsell": "","atrsuplsku": "","atrreleasemn": "","atretayr": "","atrreleasedy": "","atretady": "","atretamn": "","atrpublish": "","atrcost": "", "invtuuid": ""};
Venda.Attributes.firstObj 		= 	[];
Venda.Attributes.attsArray 		= 	[];
Venda.Attributes.SwatchURL 		= 	[];
Venda.Attributes.productArr 	= 	[];
Venda.Attributes.statusResults = {};
/**
* Runs when the page is ready
* Sets the page up and loads in the set interface type e.g. swatch if there is no type set it will default to dropdown.
*/
jQuery(function() {
	Venda.Attributes.Initialize();
});

Venda.Attributes.Initialize = function() {
	Venda.Attributes.statusResults.instock = jQuery("#attributes-stockIn").text();
  Venda.Attributes.statusResults.preorder = jQuery("#attributes-preorder").text();
  Venda.Attributes.statusResults.lowstock = jQuery("#attributes-stockLow").text();
  Venda.Attributes.statusResults.outofstock = jQuery("#attributes-stockOut").text();
  Venda.Attributes.statusResults.backorder = jQuery("#attributes-backorder").text();
  Venda.Attributes.statusResults.stockna = jQuery("#attributes-stockNA").text();
  Venda.Attributes.UpdateDD = function (attName, uID) {
  	for(var i = 0; i < Venda.Attributes.productArr.length; i++) {
  		if (Venda.Attributes.productArr[i].attSet.id == uID) {
  			var options = '<option value="">' + jQuery('#attributes-optionDefault').text() + Venda.Attributes.productArr[0].attSet[attName].name + '</option>';
  			var att1 = Venda.Attributes.productArr[i].attSet.att1.selected,
  				att2 = Venda.Attributes.productArr[i].attSet.att2.selected,
  				att3 = Venda.Attributes.productArr[i].attSet.att3.selected,
  				att4 = Venda.Attributes.productArr[i].attSet.att4.selected;	
  					
  			for (var t = 0; t < Venda.Attributes.productArr[i].attSet[attName].options.length; t++) {
  				
  				var attOption 	= Venda.Attributes.productArr[i].attSet[attName].options[t]
  					
  				if (attName == 'att1'){
  					var stockstatus = Venda.Attributes.GetAll(Venda.Attributes.productArr[i].attSet.att1.options[t], att2, att3, att4, 'stockstatus', uID);
  				}
  				if (attName == 'att2'){
  					var stockstatus = Venda.Attributes.GetAll(att1, Venda.Attributes.productArr[i].attSet.att2.options[t], att3, att4, 'stockstatus', uID);
  				}			
  				if (attName == 'att3'){
  					var stockstatus = Venda.Attributes.GetAll(att1, att2, Venda.Attributes.productArr[i].attSet.att3.options[t], att4, 'stockstatus', uID);
  				}
  				if (attName == 'att4'){
  					var stockstatus = Venda.Attributes.GetAll(att1, att2, att3, Venda.Attributes.productArr[i].attSet.att4.options[t], 'stockstatus', uID);
  				}
  				
  				options += '<option data-attText="' + Venda.Attributes.productArr[i].attSet[attName].options[t] + '" value="'+ Venda.Attributes.productArr[i].attSet[attName].optionValues[t] +'">' + Venda.Attributes.productArr[i].attSet[attName].options[t] + '</option>';
  				
  				if(attName == 'att1'){
    				options += '<option data-attText="' + Venda.Attributes.productArr[i].attSet[attName].options[t] + '" value="'+ Venda.Attributes.productArr[i].attSet[attName].optionValues[t] +'">' + Venda.Attributes.productArr[i].attSet[attName].transValues[t] + '</option>';
  				}
  			}
  			
  			jQuery("select[id='"+ attName +"_" + uID + "']").html(options).val(Venda.Attributes.productArr[i].attSet[attName].selectedValue);
  		}
  	}
  };
  
  Venda.Attributes.DropdownBehaviour = function(attName, attValue, uID) {
  	Venda.Attributes.setSelectedJSON(attName,attValue, uID);
  	Venda.Attributes.updateAttributes(uID, attValue, attName);
  	Venda.Attributes.UpdateDD('att2', uID);
  }

  Venda.Attributes.DropDown = function () {
  	
  	jQuery(".oneProduct").each(function(index) {
  		var uID = this.id.substr(11);
  		Venda.Attributes.productArr[index] = new Venda.Attributes.GenerateOptionsJSON(index, uID);
  		if(jQuery("#oneProduct_" + uID + " #attributeInputs").length) {
  			jQuery("#oneProduct_" + uID + " #attributeInputs").addClass("type_dropdown");
  			for (var t = 1; t <= Venda.Attributes.HowManyAtts(uID); t++) {	Venda.Attributes.generateDropDowns('att' + t, uID); }
  			Venda.Attributes.PresetAtt(index, uID);
  /* 			jQuery('#oneProduct_' + uID + ' #pricerange').text(Venda.Attributes.GetPriceRange(uID));
  			jQuery('#oneProduct_' + uID + ' #price').text(Venda.Attributes.GetPriceRange(uID)); 
  			Venda.Attributes.updateAttributes(uID); */
  		}
  	});
  			
   		//ColourSwatch selection
  		var singleuID = jQuery(".oneProduct").attr("id").substr(11);
  		var urlParam = Venda.Attributes.storeImgsArr[0].param;
  		if(RegExp('[?&]colour=([^&]*)').exec(window.location.href)){
          urlParam = decodeURIComponent(RegExp('[?&]colour=([^&]*)').exec(window.location.href)[1].replace(/\+/g, ' '));
      } 
      if(Venda.Attributes.qbColour) {
          urlParam = Venda.Attributes.qbColour;
      }
  		if((jQuery(".oneProduct").length === 1) && (urlParam != "")) {
  			for(var i = 0; i < Venda.Attributes.storeImgsArr.length; i++) {
  				if(Venda.Attributes.storeImgsArr[i].param == urlParam) {
  				  var adjustAtt3 = ""
  					document.getElementById('addproductform').elements["att1"].value = urlParam;
    			   for(var i = 0; i < Venda.Attributes.attsArray.length; i++) {
        	     if(Venda.Attributes.attsArray[i].att1 == urlParam && document.getElementById('addproductform').elements["att3"]){
          	     adjustAtt3 = document.getElementById('addproductform').elements["att3"].value = Venda.Attributes.attsArray[i].att3
        	     } 
        	   }
        	  Venda.Attributes.setSelectedJSON('att3', adjustAtt3, singleuID);
  					Venda.Attributes.DropdownBehaviour('att1', urlParam, singleuID);
  				}
  			}
  		}
  	jQuery(".attributeInputs select").selectmenu({ style:'dropdown', maxHeight: 2000, positionOptions: { collision: 'none' } });
  	
  };

	if(Venda.Attributes.attsArray.length > 0) {
	  Venda.Attributes.ImageMediaAssignment();
	  Venda.Attributes.initViewLargeImagePopup();
		Venda.Attributes.Declare();

		var hiddenInputs  = '<input type="hidden" value="" id="hiddenInput_att1"><input type="hidden" value="" id="hiddenInput_att2"><input type="hidden" value="" id="hiddenInput_att3"><input type="hidden" value="" id="hiddenInput_att4">';
		jQuery('#addproductform').append(hiddenInputs);
		
		var attributesUI = jQuery(".attributesForm").text();
		switch(attributesUI) {
			case "dropdown":
			case "halfswatch":
			case "swatch":
			case "grid":
			case "multiAdd1":
			case "multiAdd2":
			break;
			default:
			attributesUI = 'dropdown';
		}


		if(jQuery("#OutOfStockThreshold").text() > Venda.Attributes.Settings.lowStockThreshold) alert("Error: OutOfStockThreshold is higher than lowStockThreshold");
		Venda.Attributes.DropDown();
	};
		
	jQuery('.oneProduct').css({"background":"none"});
	jQuery('.oneProductContent').fadeIn('slow');
  
  // Events
  jQuery("select").change(function() {
  	var uID = this.id.substr(5),
  		attName = this.name,
  		attValue = this.value,
  		attText = jQuery('#' + attName + '_' + uID +' option:selected').attr('data-attText');
  		
  		if(attName == "att1"){
  		  var adjustAtt3 = ""
         for(var i = 0; i < Venda.Attributes.attsArray.length; i++) {
           if(Venda.Attributes.attsArray[i].att1 == attValue && document.getElementById('addproductform').elements["att3"]){
      	     adjustAtt3 = document.getElementById('addproductform').elements["att3"].value = Venda.Attributes.attsArray[i].att3
           } 
         }	
         	Venda.Attributes.setSelectedJSON('att3', adjustAtt3, uID);
  		} 
  
  	Venda.Attributes.DropdownBehaviour(attName, attText, uID);
  	if (jQuery('#tag-currencycode') && (typeof jQuery().pennies !== 'undefined')){
			jQuery('.atributesPrice #price, .atributesPrice #atrwas').pennies('convert',{to:jQuery(this).pennies('get'),from: jQuery('#tag-currencycode').html()})
		}
  });
  
  jQuery('.qtyChange').click(function(){
      var currentQty = parseInt(jQuery('#qtybox #qty').val(), 10),
          qtyButton = jQuery(this).attr('id')
      if(qtyButton == "qtyUp"){
          jQuery('#qtybox #qty').val(currentQty += 1)
      } else {
          if (currentQty > 1) {
              jQuery('#qtybox #qty').val(currentQty -= 1)    
          }
      }
  });
  
  jQuery('.socialButtons li').hover(
    function () {
      jQuery(this).find('.social-button').css('z-index','1001').show();
    },
    function () {
      jQuery(this).find('.social-button').hide();
    }
  );
  
	jQuery(".buy-box input[type='submit']").on('click', function(){
		if (jQuery(".buy-box input[type='submit']").hasClass("activeBuyButton") === false) {
			alert(jQuery("#productstatus").text());
		}
	});

	if(jQuery('.quickBuy-Details').length >= 1) { 
  	if (jQuery('#tag-currencycode') && (typeof jQuery().pennies !== 'undefined')){
			jQuery('.atributesPrice #price, .atributesPrice #atrwas').pennies('convert',{to:jQuery(this).pennies('get'),from: jQuery('#tag-currencycode').html()})
		}  	
	}

}

/**
* Sets default values for attributes, these values can be changed base
* on your needs
*/
Venda.Attributes.Declare = function() {
	var lowStock,
		gender = jQuery("#attributes-gender").text();
	switch(gender) {
		case 'w': lowStock = 10;
		break;
		case 'm': lowStock = 3;
		break;
		case 'h': lowStock = 5;
		default: lowStock = 10;
	}
	Venda.Attributes.Settings = {
		lowStockThreshold:			lowStock,
		emailWhenOutOfStock:		false,
		sourceFromAPI:				false,
		priceRangeFormat:			"range",  // "range" = from - to; "from" = from only; "to" = to only;
		preOrderParent:				false,
		gridSwap:					false,
		useSelectedArrow:			true,
		useToolTip:					true
	};
};


// Merges two objects into one and stores data within an array
Venda.Attributes.StoreJSON = function(attrObj, attrValObj, attrTrans) {
	for(var prop in attrObj) { if(attrObj[prop] == null) attrObj[prop] = ""; }
	for(var prop in attrValObj) { if(attrValObj[prop] == null) attrValObj[prop] = ""; }
	var newAttrObj = jQuery.extend({}, attrObj);
	Venda.Attributes.firstObj.push(newAttrObj);
	Venda.Attributes.attsJSON = jQuery.extend(attrObj, attrValObj, attrTrans);
	Venda.Attributes.attsArray.push(Venda.Attributes.attsJSON);
};

// Merges two objects into one and stores data within an array
Venda.Attributes.insertUI = function(content) {
	jQuery('#attributeInputs').html(content);
};


// Sets the attributes and returns the values for them in an object literal format
Venda.Attributes.Set = function(att1, att2, att3, att4, uID) {
	
	var att1 = att1 || "";	var att2 = att2 || "";	var att3 = att3 || "";	var att4 = att4 || "";
	   
	   for(var i = 0; i < Venda.Attributes.attsArray.length; i++) {
	     if(Venda.Attributes.attsArray[i].att1 == att1 && Venda.Attributes.attsArray[i].att2 == att2){
  	     att3 = Venda.Attributes.attsArray[i].att3
  	     att4 = Venda.Attributes.attsArray[i].att4
	     } 
	   }
	   
  	if (Venda.Attributes.IsAllSelected(att1, att2, att3, att4, uID)) {
		var index = Venda.Attributes.SearchObj(att1, att2, att3, att4, uID);
 		if(typeof index != "undefined") {
			Venda.Attributes.dataObj = {
				"atronhand": Venda.Attributes.attsArray[index].atronhand,
				"stockstatus": Venda.Attributes.StockStatus(Venda.Attributes.attsArray[index].atronhand,index),
				"atrreleaseyr": Venda.Attributes.attsArray[index].atrreleaseyr,
				"atrmsrp": Venda.Attributes.attsArray[index].atrmsrp,
				"atrsku": Venda.Attributes.attsArray[index].atrsku,
				"atrwas": Venda.Attributes.attsArray[index].atrwas,
				"atrsell": Venda.Attributes.attsArray[index].atrsell,
				"atrsuplsku": Venda.Attributes.attsArray[index].atrsuplsku,
				"atrreleasemn": Venda.Attributes.attsArray[index].atrreleasemn,
				"atretayr": Venda.Attributes.attsArray[index].atretayr,
				"atrreleasedy": Venda.Attributes.attsArray[index].atrreleasedy,
				"atretady": Venda.Attributes.attsArray[index].atretady,
				"atretamn": Venda.Attributes.attsArray[index].atretamn,
				"atrpublish": Venda.Attributes.attsArray[index].atrpublish,
				"atrcost": Venda.Attributes.attsArray[index].atrcost
			};
			
			if(jQuery('.attributesForm').attr('id') != 'productdetailMulti') {
				if(document.getElementById("addproductform").itemlist) {
					jQuery("#oneProduct_" + uID + " [name=itemlist]").val(Venda.Attributes.dataObj.atrsku);
				}
			}
		
		} else {
			for(var p in Venda.Attributes.dataObj) { Venda.Attributes.dataObj[p] = "  "; };
			Venda.Attributes.dataObj.stockstatus = "Not Available";
		}
	} else {
	
		for(var p in Venda.Attributes.dataObj) { Venda.Attributes.dataObj[p] = "  "; };
		Venda.Attributes.dataObj.stockstatus = "";
		
		if(jQuery('.attributesForm').attr('id') != 'productdetailMulti') {
			if(document.getElementById("addproductform").itemlist) {
				jQuery("#oneProduct_" + uID + " [name=itemlist]").val('');
			}
		}
			
	}

	Venda.Attributes.drawOutputs(index, uID);
};


// Sets the attributes and returns the values for them in an object literal format
Venda.Attributes.Get = function(what) {
	return Venda.Attributes.dataObj[what];
};

// Compares current number of selections to an existing ones and returns true if number matches
Venda.Attributes.IsAllSelected = function(att1, att2, att3, att4, uID) {
	var att1 = att1 || "";	var att2 = att2 || "";	var att3 = att3 || "";	var att4 = att4 || "";
	var howManySelected = 0;
	if(att1 != "") howManySelected+=1; 
	if(att2 != "") howManySelected+=1; 
	if(att3 != "") howManySelected+=1;	
	if(att4 != "") howManySelected+=1;
	if(howManySelected == Venda.Attributes.HowManyAtts(uID)) return true;
};

// Returns the number of attributes used from JSON data
Venda.Attributes.HowManyAtts = function(uID) {
	for(var i = 0; i < Venda.Attributes.productArr.length; i++) {
		if (Venda.Attributes.productArr[i].attSet.id == uID) {
			var howManyAtts = 0;
			if((Venda.Attributes.productArr[i].attSet.att1.options.length >= 1) && (Venda.Attributes.productArr[i].attSet.att1.options[0] != "")) howManyAtts+=1;	
			if((Venda.Attributes.productArr[i].attSet.att2.options.length >= 1) && (Venda.Attributes.productArr[i].attSet.att2.options[0] != "")) howManyAtts+=1;	
			if((Venda.Attributes.productArr[i].attSet.att3.options.length >= 1) && (Venda.Attributes.productArr[i].attSet.att3.options[0] != "")) howManyAtts+=1;	
			if((Venda.Attributes.productArr[i].attSet.att4.options.length >= 1) && (Venda.Attributes.productArr[i].attSet.att4.options[0] != "")) howManyAtts+=1;
			return howManyAtts;
		}
	}
};

// Checks for stock value and returns the availability status
Venda.Attributes.StockStatus = function(stockAmount,theIndex) {
	
	var HasEtaDate = Venda.Attributes.HasEtaDate(theIndex); 
	var HasReleaseDate = Venda.Attributes.HasReleaseDate(theIndex);
	
	if(stockAmount > Venda.Attributes.Settings.lowStockThreshold && !HasReleaseDate) return Venda.Attributes.statusResults.instock;
	if(stockAmount > Venda.Attributes.Settings.lowStockThreshold && HasReleaseDate) return Venda.Attributes.statusResults.preorder;
 	if(stockAmount <= Venda.Attributes.Settings.lowStockThreshold && stockAmount > jQuery("#OutOfStockThreshold").text()) return Venda.Attributes.statusResults.lowstock;
	if(stockAmount <= jQuery("#OutOfStockThreshold").text() && (jQuery("#DoNotBackorder").text() == 1) || (jQuery("#DoNotBackorder").text() != 1 && !HasEtaDate) ) return Venda.Attributes.statusResults.outofstock;
	if(stockAmount <= jQuery("#OutOfStockThreshold").text() && (jQuery("#DoNotBackorder").text() != 1 && HasEtaDate)) return Venda.Attributes.statusResults.backorder;

};

// Search for a given value combination within array of objects, returns true if combination matches
Venda.Attributes.SearchObj = function(att1, att2, att3, att4, uID) {
	for(var i=0; i<Venda.Attributes.attsArray.length; i++)
		if (Venda.Attributes.attsArray[i].att1 == att1 && Venda.Attributes.attsArray[i].att2 == att2)
			if(Venda.Attributes.attsArray[i].att3 == att3 && Venda.Attributes.attsArray[i].att4 == att4)
				if(Venda.Attributes.attsArray[i].invtuuid == uID)
					return i;
};

// This function will return a stock status message for all stock with only one specified parameter
Venda.Attributes.GetAll = function(att1, att2, att3, att4, what, uID) {
	var att1 = att1 || "";	var att2 = att2 || "";	var att3 = att3 || "";	var att4 = att4 || "";
	switch(what) {
		case "stockstatus":
			var initOnce = true;
			for(var i=0; i<Venda.Attributes.attsArray.length; i++) {
				var compareObj = {att1: att1, att3: att3, att2: att2, att4: att4, invtuuid: uID};
				var newfirstObj = jQuery.extend({}, Venda.Attributes.firstObj[i]);
				newfirstObj.invtuuid = uID;
 				if(att1 == "") { delete compareObj.att1; delete newfirstObj.att1; }
				if(att2 == "") { delete compareObj.att2; delete newfirstObj.att2; }
				if(att3 == "") { delete compareObj.att3; delete newfirstObj.att3; }
				if(att4 == "") { delete compareObj.att4; delete newfirstObj.att4; }
				if(compareObject(compareObj, newfirstObj)) { if(initOnce) { var totalStock = 0; initOnce = false; }; totalStock += Venda.Attributes.attsArray[i].atronhand; var theIndex = i;}
			};
			if(typeof totalStock != "undefined"){
				return Venda.Attributes.StockStatus(totalStock,theIndex);
			}
			else	return Venda.Attributes.statusResults.stockna;
		break;
	}
};

var compareObject = function(o1, o2){
	for(var p in o1){if(o1[p] !== o2[p]){return false;}}
	for(var p in o2){if(o1[p] !== o2[p]){return false;}}
	return true;
};

Venda.Attributes.GetPriceRange = function(uID) {
		var currsym = jQuery('#tag-currsym').text(),
			priceRangeArr = [];
		for(var i=0; i<Venda.Attributes.attsArray.length; i++) {
			if(Venda.Attributes.attsArray[i].invtuuid == uID) {
				priceRangeArr.push(Venda.Attributes.attsArray[i].atrsell);
			}
		}
		if(Venda.Attributes.Settings.priceRangeFormat == "from") return currsym + Math.min.apply(Math, priceRangeArr);
		if(Venda.Attributes.Settings.priceRangeFormat == "to") return currsym + Math.max.apply(Math, priceRangeArr);
		if((Venda.Attributes.Settings.priceRangeFormat == "range") && (Math.min.apply(Math, priceRangeArr)) != (Math.max.apply(Math, priceRangeArr))) {
			return currsym + Math.min.apply(Math, priceRangeArr) + " - " + currsym + Math.max.apply(Math, priceRangeArr);
		}
		else {
			return currsym + Venda.Attributes.attsArray[0].atrsell;
		}
};

Venda.Attributes.GetCustomData = function(att1, att2, att3, att4, what) {
	var att1 = att1 || "";	var att2 = att2 || "";	var att3 = att3 || "";	var att4 = att4 || "";

	if (Venda.Attributes.IsAllSelected(att1, att2, att3, att4)) {
		var index = Venda.Attributes.SearchObj(att1, att2, att3, att4);
		if(typeof index != "undefined") {
	
			switch(what) {
				case "savemsrp":
					if(Venda.Attributes.attsArray[index].atrmsrp != "") {
						return Venda.Attributes.attsArray[index].atrmsrp - Venda.Attributes.attsArray[index].atrsell;
					} else { return " "; }
				break;
				
				case "savewas":
					if(Venda.Attributes.attsArray[index].atrwas != "") {
						return Venda.Attributes.attsArray[index].atrwas - Venda.Attributes.attsArray[index].atrsell;
					} else { return " "; }
				break;
				
				case "etadate":
					if(Venda.Attributes.HasEtaDate(index)) {
						return Venda.Attributes.attsArray[index].atretady + "/" + Venda.Attributes.attsArray[index].atretamn + "/" + Venda.Attributes.attsArray[index].atretayr;
					} else { return " "; }
				break;
				
				case "releasedate":
					if(Venda.Attributes.HasReleaseDate(index)) {
						return Venda.Attributes.attsArray[index].atrreleasedy + "/" + Venda.Attributes.attsArray[index].atrreleasemn + "/" + Venda.Attributes.attsArray[index].atrreleaseyr;
					} else { return " "; }
				break;
				
				case "nofweta":
 					if(Venda.Attributes.HasEtaDate(index)) {
						return Venda.Attributes.TimeTillRelease(Venda.Attributes.attsArray[index].atretady, "0" + parseInt(Venda.Attributes.attsArray[index].atretamn - 1), Venda.Attributes.attsArray[index].atretayr, "weeks"); 
					} else { return " "; }
				break;
				
				case "nofwrelease":
 					if(Venda.Attributes.HasReleaseDate(index)) {
						return Venda.Attributes.TimeTillRelease(Venda.Attributes.attsArray[index].atrreleasedy, "0" + parseInt(Venda.Attributes.attsArray[index].atrreleasemn - 1), Venda.Attributes.attsArray[index].atrreleaseyr, "weeks");
					} else { return ""; }
				break;
				
				case "savepercentmsrp":
					if(Venda.Attributes.attsArray[index].atrmsrp != "") {
						return Math.round(100 - (Venda.Attributes.attsArray[index].atrsell / (Venda.Attributes.attsArray[index].atrmsrp / 100)));
					} else { return " "; }
				break;
				
				case "savepercentwas":
					if(Venda.Attributes.attsArray[index].atrwas != "") {
						return Math.round(100 - (Venda.Attributes.attsArray[index].atrsell / (Venda.Attributes.attsArray[index].atrwas / 100)));
					} else { return " "; }
				break;
			};
	
		} else { return " "; };
	} else { return " "; };
	
};

Venda.Attributes.HasEtaDate = function(index) {
	if(Venda.Attributes.attsArray[index].atretayr != "")
		if(Venda.Attributes.attsArray[index].atretamn != "")
			if(Venda.Attributes.attsArray[index].atretady != "")
				if(Venda.Attributes.TimeTillRelease(Venda.Attributes.attsArray[index].atretady, "0" + parseInt(Venda.Attributes.attsArray[index].atretamn - 1), Venda.Attributes.attsArray[index].atretayr, "exact") >= 0)
					return true;
};

Venda.Attributes.HasReleaseDate = function(index) {
	Venda.Attributes.ReleaseDateParent(index);
	if(Venda.Attributes.attsArray[index].atrreleaseyr != "")
		if(Venda.Attributes.attsArray[index].atrreleasemn != "")
			if(Venda.Attributes.attsArray[index].atrreleasedy != "")
				if(Venda.Attributes.TimeTillRelease(Venda.Attributes.attsArray[index].atrreleasedy, "0" + parseInt(Venda.Attributes.attsArray[index].atrreleasemn - 1), Venda.Attributes.attsArray[index].atrreleaseyr, "exact") >= 0)
					return true;
};

Venda.Attributes.TimeTillRelease = function(dd, mm, yy, what) {
	var oneWeek = 24*60*60*1000*7;
	var firstDate = new Date();
	var secondDate = new Date(yy, mm, dd);
	switch(what) {
		case "weeks":
			var exactTime = (secondDate.getTime() - firstDate.getTime())/(oneWeek);
			if(exactTime>=0) {
				var timeLeft = Math.round((secondDate.getTime() - firstDate.getTime())/(oneWeek));
				if(timeLeft == 0) timeLeft = 1;
			} else { timeLeft = ""; }
		break;
		case "exact":
			var timeLeft = (secondDate.getTime() - firstDate.getTime())/(oneWeek);
		break;
	}
	return timeLeft; 
}

Venda.Attributes.ReleaseDateParent = function(index) {
	var parentDate = jQuery('#invtrelease').text();
	if(Venda.Attributes.Settings.preOrderParent && parentDate !== ""){
		var parentDateArr = parentDate.split("-");
		if(Venda.Attributes.TimeTillRelease(parentDateArr[2], "0" + parseInt(parentDateArr[1] - 1), parentDateArr[0], "exact") >= 0) {
			Venda.Attributes.attsArray[index].atrreleasedy = parentDateArr[2];
			Venda.Attributes.attsArray[index].atrreleasemn = parentDateArr[1];
			Venda.Attributes.attsArray[index].atrreleaseyr = parentDateArr[0];
		}
	}
};


/**
* Shows or hides the correct input buttons and feedback based on attribute selection 'stockstatus'
* @param{string} index this is the current array index of the instance of attribute display
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.drawOutputs = function(index, uID) {

	// Cache jQuery selector and values
	var addproductID 	 = jQuery('#oneProduct_' + uID + ' #addproductbox'),
		EmwbisID		 = jQuery('#oneProduct_' + uID + ' #emwbis_link'),
		stockFeedbackBox = jQuery('#oneProduct_' + uID + ' .stockFeedbackBox'),
		addToBasketLinks = jQuery('#oneProduct_' + uID + ' .buy-box .addproduct, #oneProduct_' + uID + ' .buynow'),
		emwbisType		 = jQuery("#emwbisType").text(),
		stockstatus	 	 = Venda.Attributes.Get('stockstatus'),
		stockFeedback	 = stockstatus;

	// Reset the UI.
	EmwbisID.addClass("Re-paint-out");
	stockFeedbackBox.removeClass("In_stock_box Out_of_stock_box");
	addToBasketLinks.css({"cursor":"pointer"}).addClass('activeBuyButton');
	
	switch(stockstatus) {
	
		case Venda.Attributes.statusResults.instock:
			stockFeedbackBox.addClass("In_stock_box");
			stockFeedbackBox.removeClass("lowStock");
			addproductID.addClass("Re-paint");
	
		break;
		
		case Venda.Attributes.statusResults.lowstock:
			stockFeedbackBox.addClass("In_stock_box");
			stockFeedbackBox.addClass("lowStock");
			addproductID.addClass("Re-paint");
			
			var stockFeedback = stockstatus + jQuery('#attributes-only').text() + Venda.Attributes.Get('atronhand') + jQuery('#attributes-left').text();
			
		break;
		
		case Venda.Attributes.statusResults.preorder:
			stockFeedbackBox.addClass("In_stock_box Pre-order_box");
			stockFeedbackBox.removeClass("lowStock");
			addproductID.addClass("Re-paint");
			addproductID.val("Pre-order");
			
			var stockFeedback = jQuery('#attributes-preorder').text() + Venda.Attributes.attsArray[index].atrreleasedy + "/" + Venda.Attributes.attsArray[index].atrreleasemn + "/" + Venda.Attributes.attsArray[index].atrreleaseyr; 
			
		break;
	
		case Venda.Attributes.statusResults.outofstock:
			
			stockFeedbackBox.addClass("Out_of_stock_box");
			stockFeedbackBox.removeClass("lowStock");
			
				if (emwbisType == 'none'){
					addproductID.addClass("Re-paint-out");
					EmwbisID.addClass("Re-paint");
				}
				else{
					if (emwbisType == 'etarelease' && Venda.Attributes.HasReleaseDate(index) && Venda.Attributes.HasEtaDate(index)){
						addproductID.addClass("Re-paint-out");
						EmwbisID.addClass("Re-paint");
					}
					if (emwbisType == 'eta' && Venda.Attributes.HasEtaDate(index)){
						addproductID.addClass("Re-paint-out");
						EmwbisID.addClass("Re-paint");
					}
					if (emwbisType == 'release' && Venda.Attributes.HasReleaseDate(index)){
						addproductID.addClass("Re-paint-out");
						EmwbisID.addClass("Re-paint");
					}
					else{
						addproductID.addClass("Re-paint");
						addToBasketLinks.css({"cursor":"default"}).removeClass('activeBuyButton');
					}
				}
		break;
		
		case Venda.Attributes.statusResults.backorder:
		
			stockFeedbackBox.addClass("In_stock_box Backorder_box");
			stockFeedbackBox.removeClass("lowStock");
			addproductID.addClass("Re-paint");
			addproductID.val("Backorder");
			
			var stockFeedback = jQuery('#attributes-backorder').text() + Venda.Attributes.attsArray[index].atretady + "/" + Venda.Attributes.attsArray[index].atretamn + "/" + Venda.Attributes.attsArray[index].atretayr;
		
		break;
		
		
		default:
			// Not Available
			addproductID.addClass("Re-paint");
			addToBasketLinks.css({"cursor":"default"}).removeClass('activeBuyButton');
	}

	jQuery('#oneProduct_' + uID + ' .attrFeedback  #stockstatus').hide().text(stockFeedback).addClass("Re-paint");
};


// case insensitive, digits to number interpolation
Venda.Attributes.NatSort = function(as, bs){
    var a, b, a1, b1, i= 0, L, rx=  /(\d+)|(\D+)/g, rd=  /\d/;
    if(isFinite(as) && isFinite(bs)) return as - bs;
    a= String(as).toLowerCase();
    b= String(bs).toLowerCase();
    if(a=== b) return 0;
    if(!(rd.test(a) && rd.test(b))) return a> b? 1: -1;
    a= a.match(rx);
    b= b.match(rx);
    L= a.length> b.length? b.length: a.length;
    while(i < L){
        a1= a[i];
        b1= b[i++];
        if(a1!== b1){
            if(isFinite(a1) && isFinite(b1)){
                if(a1.charAt(0)=== "0") a1= "." + a1;
                if(b1.charAt(0)=== "0") b1= "." + b1;
                return a1 - b1;
            }
            else return a1> b1? 1: -1;
        }
    }
    return a.length - b.length;
}


/**
* This is an object that is built up and used for each instance of attribute display and stores the values of
* the attributes and there current states.
* @param{string} index this is the current array index of the instance of attribute display
* @param{string} uID this is the unique ID for attribute display in the DOM
* @return the value of newattributes, this is done for each instance
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.GenerateOptionsJSON = function (index, uID) {

	var attributes = {
		attSet: {
			att1:	{
				name:	'',
				options:	[],
				optionValues:	[],
				transValues: [],
				selected:	'',
				selectedValue:	'',
				imageRef:	'' 
			},
			att2:	{
				name:	'',
				options:	[],
				optionValues:	[],
				selected:	'',
				selectedValue:	'',
				imageRef:	''
			},
			att3:	{
				name:	'',
				options:	[],
				optionValues:	[],
				selected:	'',
				selectedValue:	'',
				imageRef:	''
			},
			att4:	{
				name:	'',
				options:	[],
				optionValues:	[],
				selected:	'',
				selectedValue:	'',
				imageRef:	''
			}, 
			id: ''
		}
	};
	
	var newattributes = jQuery.extend({}, attributes);
		
	newattributes.attSet.att1.name = jQuery('#oneProduct_' + uID + ' #attributeNames .att1').text();
	newattributes.attSet.att2.name = jQuery('#oneProduct_' + uID + ' #attributeNames .att2').text();
	newattributes.attSet.att3.name = jQuery('#oneProduct_' + uID + ' #attributeNames .att3').text();
	newattributes.attSet.att4.name = jQuery('#oneProduct_' + uID + ' #attributeNames .att4').text();
	newattributes.attSet.id = uID;

	/**
	* This is a function sorts attribute values in the page and puts them in the attributes object.
	* @param{string} attributeNumber is the specified attribute e.g. att1. This is a value 1-4
	* @param{string} i is an index used to pass the current value from the jQuery each function that passes it.
	* @author Alby Barber <abarber@venda.com>
	*/
 	var checkAndPush = function (attributeNumber,attributeValue ,i) {
		for(var i = 0; i < Venda.Attributes.attsArray.length; i++) {
			if(Venda.Attributes.attsArray[i].invtuuid == uID) {
				if (jQuery.inArray(Venda.Attributes.attsArray[i][attributeNumber], newattributes.attSet[attributeNumber].options) == -1){
					newattributes.attSet[attributeNumber].options.push(Venda.Attributes.attsArray[i][attributeNumber]);
					newattributes.attSet[attributeNumber].optionValues.push(Venda.Attributes.attsArray[i][attributeValue]); // Push on the Values
				}
			}
		}
	};
	
	jQuery.each(Venda.Attributes.attsArray, function(i, val) {
		for (var j = 1 ;j<=4;j++){
			checkAndPush('att' + j ,'atr' + j , i);

			// /[^0-9]/g The values being checked and pushed at this point could be sorted using nat-sort
		}
		if (jQuery.inArray(val.translatedatt1, newattributes.attSet.att1.transValues) == -1){
				newattributes.attSet.att1.transValues.push(val.translatedatt1);
		}	
	}); 
	return newattributes;
	
}
 
/**
* This is a function updates the attribute object with the current attribute value
* @param{string} attName is the current attribute name e.g. att1
* @param{string} attValue is the current attribute value e.g. white
* @param{string} uID is the unique id of the attribute selection area
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.setSelectedJSON = function (attName,attValue, uID){

	for(var i = 0; i < Venda.Attributes.productArr.length; i++) {
		if(Venda.Attributes.productArr[i].attSet.id == uID) {
				
			if (Venda.Attributes.productArr[i].attSet[attName].selected == attValue && attName !== "att3"){
				Venda.Attributes.productArr[i].attSet[attName].selected = '';
				Venda.Attributes.productArr[i].attSet[attName].selectedValue = '';
				
			}
			else {
				Venda.Attributes.productArr[i].attSet[attName].selected = attValue;
				Venda.Attributes.productArr[i].attSet[attName].selectedValue = Venda.Attributes.getValueRef(attName,attValue);
			}
		}
	}
	if(Venda.Attributes.productArr[0]) {
		if(Venda.Attributes.productArr[0].attSet[attName]) {
			Venda.Attributes.productArr[0].attSet[attName].imageRef = Venda.Attributes.getValueRef(attName,attValue);
		}
	}
};

/**
* This is a function that shows / updates the price
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.Price = function (uID){
	var currentCurrency = Venda.Ebiz.CookieJar.get("locn") || "restofworld";
	if (currentCurrency == "eur") {
		if (Venda.Attributes.Get('atrsell') !== "  ")	{ 
		  jQuery('#oneProduct_' + uID + ' #price').hide().text(Venda.Attributes.Get('atrsell').replace(/\./g, ',') + " " + jQuery('#tag-currsym').text()).addClass("Re-paint"); 
		  jQuery('#oneProduct_' + uID + ' #price').nextAll().remove();
		} else {
		  jQuery('#oneProduct_' + uID + ' #price').hide().text(Venda.Attributes.GetPriceRange(uID)).addClass("Re-paint"); 
		  jQuery('#oneProduct_' + uID + ' #price').nextAll().remove();
		}
	}
	else {
		if (Venda.Attributes.Get('atrsell') !== "  ")	{
		  jQuery('#oneProduct_' + uID + ' #price').hide().text(jQuery('#tag-currsym').text() + Venda.Attributes.Get('atrsell')).addClass("Re-paint"); 
		  jQuery('#oneProduct_' + uID + ' #price').nextAll().remove();
		} else	{
		  jQuery('#oneProduct_' + uID + ' #price').hide().text(Venda.Attributes.GetPriceRange(uID)).addClass("Re-paint"); 
		  jQuery('#oneProduct_' + uID + ' #price').nextAll().remove();
		}
	}
	jQuery('.atributesPrice #price').data('price',jQuery('#tag-currsym').text() + Venda.Attributes.Get('atrsell')); 
	jQuery('#oneProduct_' + uID + ' #price').nextAll().remove();
};

/**
* This is a function that shows / updates the price
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.Paint = function (){
	jQuery(".Re-paint-out").hide().removeClass("Re-paint-out");
	jQuery(".Re-paint").show().removeClass("Re-paint");
};

/**
* This is a function updates the selected values stored in the 'Venda.Attributes.productAr' object and displays this on
* the front-end to the user
* @param{string} att1 this is the current selected value for att1
* @param{string} att2 this is the current selected value for att2
* @param{string} att3 this is the current selected value for att3
* @param{string} att4 this is the current selected value for att4
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.SelectedValues = function (att1,att2,att3,att4, uID){

	var productselected = jQuery('#attributes-productselected').text(),
		productstatus	= jQuery('#attributes-productstatus').text();
	
	
	for(var j = 0; j < Venda.Attributes.productArr.length; j++) {  
		if(Venda.Attributes.productArr[j].attSet.id === uID) {  
		
			for(var i = 1; i <= Venda.Attributes.HowManyAtts(uID); i++) {
			
				var attNumber = 'att'+i;
			
				if (Venda.Attributes.productArr[j].attSet[attNumber].selected){
					productselected += Venda.Attributes.productArr[j].attSet[attNumber].selected + ', ';
				}
				else{
					if (attNumber != 'att3') {
						productstatus += Venda.Attributes.productArr[j].attSet[attNumber].name + ', ';
					}
				}
			}
	
			if (productselected == jQuery('#attributes-productselected').text()){
				jQuery('#oneProduct_' + uID + ' .attrFeedback #productselected').addClass("Re-paint-out");
			}
			else {
				jQuery('#oneProduct_' + uID + ' .attrFeedback #productselected').hide().text(productselected.substring(0, productselected.length-2)).addClass("Re-paint");
			}
			if (productstatus == jQuery('#attributes-productstatus').text()){
				jQuery('#oneProduct_' + uID + ' .attrFeedback #productstatus').addClass("Re-paint-out");
			}
			else {
				jQuery('#oneProduct_' + uID + ' .attrFeedback #productstatus').hide().text(productstatus.substring(0, productstatus.length-2));
			}
		}
	}
	// Updating the class for calculated values
};

/**
* This is a function updates the element on the page that has the passed ID
* @param{string} id this is the id of the page element that you want updated
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.updateItem = function (id, uID) {
	jQuery('#oneProduct_' + uID + ' .attrFeedback  #' + id).hide().text(Venda.Attributes.Get(id)).addClass("Re-paint");
};

/**
* This is a function updates price type element on the page that has the passed ID
* @param{string} id this is the id of the page element that you want updated
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.updateItemPrice = function (id, uID) {
	var textValue =  '';
	if (Venda.Attributes.Get(id).length > 2) {
		textValue = jQuery('#tag-currsym').text() + Venda.Attributes.Get(id);
		jQuery('#oneProduct_' + uID + ' .attrFeedback  #' + id).hide().text(textValue).addClass("Re-paint");
	}
};

/**
* This is a function updates calculated type elements on the page that has the passed ID
* @param{string} id this is the id of the page element that you want updated
* @param{string} textValue this is the text or name of the element to be displayed 
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.updateCalcItem = function (id, textValue, uID){
		jQuery('#oneProduct_' + uID + ' .attrFeedback  ' + id).hide().text(textValue).addClass("Re-paint");
}

/**
* This is a function updates calculated price type elements on the page that has the passed ID
* @param{string} id this is the id of the page element that you want updated
* @param{string} textValue this is the text or name of the element to be displayed 
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.updateCalcItemPrice = function (id, textValue, uID){

	var currsym = jQuery('#tag-currsym').text();
	if (textValue.length > 2) {			
		textValue = currsym + textValue;
	}
	jQuery('#oneProduct_' + uID + ' .attrFeedback  ' + id).hide().text(textValue).addClass("Re-paint");
};


///// SWATCH Functions /////
/**
* This is a function generates the swatch interface
* @param{string} attributeNumber is the specified attribute e.g. att1. This is a value 1-4
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.generateSwatch = function(attributeNumber, uID){
	for(var i = 0; i < Venda.Attributes.productArr.length; i++) {
		if (Venda.Attributes.productArr[i].attSet.id == uID) {
			
		var swatchList = '';
		for (var t = 0; t < Venda.Attributes.productArr[i].attSet[attributeNumber].options.length; t++) {
			swatchList += '<li class="'+ (Venda.Attributes.productArr[i].attSet[attributeNumber].options[t]).replace(/ /g,"_") +' attributeSwatch" id="attributeSwatch_' + uID + '" data-attName="'+ attributeNumber +'" data-attValue="'+ Venda.Attributes.productArr[i].attSet[attributeNumber].options[t] +'"><span class="swatchText">' + Venda.Attributes.productArr[i].attSet[attributeNumber].options[t] + '</span></li>';
		}

		var selectName = "#oneProduct_" + uID + " select[name='" + attributeNumber + "']";
		jQuery(selectName).replaceWith("<ul id='swatchList_" + attributeNumber + "'>" + swatchList + "</ul>");
		
		}
	}
};


/**
* This is a function gets the swatch image and associates on the correct swatch
* @param{string} attributeNumber is the specified attribute e.g. att1. This is a value 1-4
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.swatchImage = function(attnumber, uID){  
	jQuery('#oneProduct_' + uID + ' #swatchList_'+attnumber+' li').each(function(index) {  
		jQuery(this).addClass('colourSwatch');
		
		var swatchdata = this.getAttribute('data-attvalue'),
			swatchname = this.getAttribute('data-attname'),
			imageRef = Venda.Attributes.getValueRef(swatchname,swatchdata);

		if (Venda.Attributes.SwatchURL[imageRef]){
			jQuery(this).css("background-image", "url(" + Venda.Attributes.SwatchURL[imageRef] + ")");
		}
		else {
			jQuery('.swatchText',this).css({'text-indent':'0', 'display':'block'});
		}
	});
}

///// DROPDOWN Functions /////
/**
* This is a function generates the dropdown interface
* @param{string} attributeNumber is the specified attribute e.g. att1. This is a value 1-4
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.generateDropDowns = function(attributeNumber, uID) {
	var optionDefault = jQuery('#attributes-optionDefault').text() + Venda.Attributes.productArr[0].attSet[attributeNumber].name;
	for(var i = 0; i < Venda.Attributes.productArr.length; i++) {
		if (Venda.Attributes.productArr[i].attSet.id == uID) {
			var options = '<option value="">'+ optionDefault + '</option>';
			for (var t = 0; t < Venda.Attributes.productArr[i].attSet[attributeNumber].options.length; t++) {
			  if(attributeNumber == 'att1'){
    				options += '<option data-attText="' + Venda.Attributes.productArr[i].attSet[attributeNumber].options[t] + '" value="'+ Venda.Attributes.productArr[i].attSet[attributeNumber].optionValues[t] +'">' + Venda.Attributes.productArr[i].attSet[attributeNumber].transValues[t] + '</option>';
    		} else {
    				options += '<option data-attText="' + Venda.Attributes.productArr[i].attSet[attributeNumber].options[t] + '" value="'+ Venda.Attributes.productArr[i].attSet[attributeNumber].optionValues[t] +'">' + Venda.Attributes.productArr[i].attSet[attributeNumber].options[t] + '</option>';
				}
			}
			var selectName = "select[name='" + attributeNumber + "']";
			jQuery("#oneProduct_" + uID + " " + selectName).html(options);
		}
	}
	
};

Venda.Attributes.PresetAtt = function(index, uID) {
	var allAttsOne = 0;
	for(var e = 1; e <= Venda.Attributes.HowManyAtts(uID); e++) {
		if(Venda.Attributes.productArr[index].attSet["att" + e].options.length == 1) {
			allAttsOne+=1;
		}
	}
	if(allAttsOne >= Venda.Attributes.HowManyAtts(uID)) {
		for(var o = 1; o <= Venda.Attributes.HowManyAtts(uID); o++) {
		
		// If there is only one value for an attribute, then pre select it
			//jQuery("select[id='att"+ o +"_" + uID + "'] option[value='" + Venda.Attributes.productArr[index].attSet["att" + o].options[0] + "']").attr('selected', 'selected');
			//Venda.Attributes.setSelectedJSON("att" + o,Venda.Attributes.productArr[index].attSet["att" + o].options[0], uID);
			
		}
	}
};

///// EVENTS /////
/**
* Shows a tooltip for out of stock elements if the useToolTip config option is 'true'
* This will not work with the product grid
*/
jQuery('.Out_of_stock:not(.gridBlock, .key li)').live('mouseenter', function(){
	
	if (Venda.Attributes.Settings.useToolTip){
		var attName 	= this.getAttribute('data-attName');
		var attValue 	= this.getAttribute('data-attValue');
		var thisname	= 'This';
		var uID = this.id.substr(16);
		
		for(var j = 0; j < Venda.Attributes.productArr.length; j++) {  
			if(Venda.Attributes.productArr[j].attSet.id === uID) {  
				thisname = Venda.Attributes.productArr[j].attSet[attName].name
			}
		}

		var message 	= thisname + ' ' + attValue + jQuery('#attributes-tooltip').text();

		jQuery(this).prepend('<div class="toolTip-wrap"><div class="toolTip">' + message + '<div class="toolTip-shadow"></div><div class="toolTip-arrow"></div></div></div>');
		jQuery('.toolTip').hide().fadeIn('slow');
	}
	
});

/**
* Hides a tooltip for out of stock elements if the useToolTip config option is 'true'
* This will not work with the product grid
*/
jQuery('.Out_of_stock:not(.gridBlock, .key li)').live('mouseleave', function(){
	
	if (Venda.Attributes.Settings.useToolTip){
		jQuery('.toolTip-wrap').remove();
	}
});

/**
* This is a function that updates all the display elements of the attributes display 
* This is called once on the page load and whenever the attribute combination is changed .
* @param{string} uID this is the unique ID for attribute display in the DOM
* @param{string} what is the 'this' property of a grid block clicked
* @param{string} param is a property of an attribute passed from a product page swatch.
* @author Alby Barber <abarber@venda.com>, Donatas Cereska <dcereska@venda.com>
* @author Matt Wyatt <mwyatt@anthropologie.com>
*/

Venda.Attributes.updateAttributes = function (uID, what, param) {
	for(var i = 0; i < Venda.Attributes.productArr.length; i++) {
		if (Venda.Attributes.productArr[i].attSet.id == uID) {
			
			var attributesUI 		= jQuery(".attributesForm").text(),
				hiddenInput_att1 	= document.getElementById("hiddenInput_att1"),
				hiddenInput_att2 	= document.getElementById("hiddenInput_att2"),
				hiddenInput_att3 	= document.getElementById("hiddenInput_att3"),
				hiddenInput_att4 	= document.getElementById("hiddenInput_att4");

			switch(attributesUI) {
				case "dropdown":
				
				break;
				
				case "halfswatch":
					hiddenInput_att1.name  = "att1";
					hiddenInput_att1.value = Venda.Attributes.productArr[i].attSet['att1'].selectedValue;
				break;
				
				case "swatch":
					hiddenInput_att1.name  = "att1";
					hiddenInput_att1.value = Venda.Attributes.productArr[i].attSet['att1'].selectedValue;
					hiddenInput_att2.name  = "att2";
					hiddenInput_att2.value = Venda.Attributes.productArr[i].attSet['att2'].selectedValue;
				break;
				
				case "grid":
					if(what != null) {
						Venda.Attributes.productArr[i].attSet['att1'].selected = what.getAttribute('data-attValue1');
						Venda.Attributes.productArr[i].attSet['att2'].selected = what.getAttribute('data-attValue2');
						Venda.Attributes.productArr[i].attSet['att1'].selectedValue = Venda.Attributes.getValueRef('att1',what.getAttribute('data-attValue1'));
						Venda.Attributes.productArr[i].attSet['att2'].selectedValue = Venda.Attributes.getValueRef('att2',what.getAttribute('data-attValue2'));
					}
					if(param != null) {
						Venda.Attributes.productArr[0].attSet['att1'].selected = param;
					}

					hiddenInput_att1.name  = "att1";
					hiddenInput_att1.value = Venda.Attributes.productArr[i].attSet['att1'].selectedValue;
					hiddenInput_att2.name  = "att2";
					hiddenInput_att2.value = Venda.Attributes.productArr[i].attSet['att2'].selectedValue;

					Venda.Attributes.productArr[0].attSet['att1'].imageRef = Venda.Attributes.getValueRef('att1',Venda.Attributes.productArr[0].attSet['att1'].selected);

				break;
			}

			Venda.Attributes.Set(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, uID);		

			if (Venda.Attributes.IsAllSelected(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, uID)) {

				Venda.Attributes.updateItemPrice('atrmsrp', uID);
				Venda.Attributes.updateItemPrice('atrwas', uID);
				Venda.Attributes.updateItemPrice('atrsell', uID);
				Venda.Attributes.updateItemPrice('atrcost', uID);

				Venda.Attributes.updateItem('atrsku', uID);
				Venda.Attributes.updateItem('atrsuplsku', uID);
				Venda.Attributes.updateItem('atrpublish', uID);
				Venda.Attributes.updateItem('atronhand', uID);
				Venda.Attributes.updateItem('atrreleasedy', uID);
				Venda.Attributes.updateItem('atrreleasemn', uID);
				Venda.Attributes.updateItem('atrreleaseyr', uID);
				Venda.Attributes.updateItem('atretady', uID);
				Venda.Attributes.updateItem('atretamn', uID);
				Venda.Attributes.updateItem('atretayr', uID);

				// Updates all calculated data item values
				Venda.Attributes.updateCalcItem('#savemsrp',Venda.Attributes.GetCustomData(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, "savemsrp"), uID);
				Venda.Attributes.updateCalcItem('#savewas',Venda.Attributes.GetCustomData(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, "savewas"), uID);
				Venda.Attributes.updateCalcItem('#etadate',Venda.Attributes.GetCustomData(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, "etadate"), uID);
				Venda.Attributes.updateCalcItem('#releasedate',Venda.Attributes.GetCustomData(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, "releasedate"), uID);
				Venda.Attributes.updateCalcItem('#nofweta',Venda.Attributes.GetCustomData(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, "nofweta"), uID);
				Venda.Attributes.updateCalcItem('#nofwrelease',Venda.Attributes.GetCustomData(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, "nofwrelease"), uID);
				Venda.Attributes.updateCalcItem('#savepercentmsrp', Venda.Attributes.GetCustomData(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, "savepercentmsrp"), uID);
				Venda.Attributes.updateCalcItem('#savepercentwas', Venda.Attributes.GetCustomData(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, "savepercentwas"), uID);

				// Update The Price (change between pricerange/price)
				Venda.Attributes.Price(uID);

			}
			
			// Update selected Feedback display
			Venda.Attributes.SelectedValues(Venda.Attributes.productArr[i].attSet.att1.selected,Venda.Attributes.productArr[i].attSet.att2.selected,Venda.Attributes.productArr[i].attSet.att3.selected,Venda.Attributes.productArr[i].attSet.att4.selected, uID);
			
			// Show all elements with "Re-paint" class
			Venda.Attributes.Paint();

		}
	}
	
	if((Venda.Attributes.storeImgsArr.length > 0) && (Venda.Attributes.productArr[0].attSet.att1.imageRef != "") && (param == "att1")) { Venda.Attributes.ImageSwap(Venda.Attributes.productArr[0].attSet.att1.imageRef); 
	};

};

/**
* This is a function gets the attribute object value reference
* @param{string} attName is the current attribute name e.g. att1
* @param{string} attValue is the current attribute value e.g. white
* @return{string} The value referance of the attName and attValue
* @author Alby Barber <abarber@venda.com>
* @author Matt Wyatt <mwyatt@anthropologie.com>
*/
Venda.Attributes.getValueRef = function(attName,attValue){
	var atrNumber = 'atr' + attName.replace(/[a-z]/g,'');
	for(var j = 0; j < Venda.Attributes.attsArray.length; j++) {
		if(Venda.Attributes.attsArray[j][attName] == attValue) {
			return Venda.Attributes.attsArray[j][atrNumber];
		}
	}
}


/* PRODUCT IMAGE SWAP */


Venda.Attributes.ImageSwapReset = function() {
	Venda.Attributes.initImgObj = {};
	Venda.Attributes.storeImgsArr = [];
	Venda.Attributes.howManyZoomImgs = 0;
	Venda.Attributes.objImageNum = {};
	Venda.Attributes.imgParam = null;
}
Venda.Attributes.ImageSwapReset();

Venda.Attributes.initViewLargeImagePopup = function() {
	Venda.Attributes.viewLargeImgPopup = new jQuery("<div class=\"Zoompopup\"></div>");
	var popupOpts = {
		autoOpen : false, 
		resizable : false, 
		draggable : false, 
		modal : true,
		dialogClass : "zoomPopupWrapper"		
	};
	Venda.Attributes.viewLargeImgPopup.dialog(popupOpts);
	
	document.onclick = function(e) {;
		var el;
		if(e==null) el = event.srcElement;
		else	el = e.target;
		if(el.className == "mousetrap" && jQuery('.quickBuy-Details').length == 0) Venda.Attributes.ViewLargeImg(Venda.Attributes.imgParam);
	}
	
	if(typeof is_touch_device == 'function' && is_touch_device() && jQuery('.quickBuy-Details').length == 0) {
		jQuery(".cloud-zoom").click(function() {
			Venda.Attributes.ViewLargeImg(Venda.Attributes.imgParam); return false;
		});
	}

};


Venda.Attributes.ViewLargeImg = function(param) {
  
	var popupContentSlides = "",
	    popupImgsAvail = Venda.Attributes.objImageNum[Venda.Attributes.storeImgsArr[param].param],
	    startSlideHere = parseInt(jQuery(".flex-active-slide").attr("id").split("-")[2], 10)
	
	for(var i = 0; i < popupImgsAvail; i++) {
		popupContentSlides += "<li><img src=\"" + Venda.Attributes.storeImgsArr[param].images.imgL[i] + "\" /></li>";
	}
	
	jQuery(".Zoompopup").html("<div class=\"flexslider popupslider\"><ul class=\"slides\">" + popupContentSlides + "</ul></div>");
	jQuery('.popupslider').flexslider({
  	slideshow: false,
  	animationSpeed: 200, 
  	startAt: startSlideHere,
  	start: function(slider){
      var slideTot = jQuery('.popupslider .flex-control-nav li').length
      jQuery('.popupslider .flex-control-nav li a').append('/' + slideTot);
    }
	});
	Venda.Attributes.viewLargeImgPopup.dialog("open");
	jQuery('.ui-widget-overlay').live('click',function() {
		Venda.Attributes.viewLargeImgPopup.dialog("close");
	});
};

Venda.Attributes.StoreImageSwaps = function(obj) {
	  var toAdd = obj.param
	  Venda.Attributes.objImageNum[toAdd] = 0
		for(var i = 0; i < obj.images.imgM.length; i++) {
			if(obj.images.imgM[i]) Venda.Attributes.objImageNum[toAdd]+=1;
		}
		Venda.Attributes.storeImgsArr.push(obj);
};

Venda.Attributes.ImageSwap = function(att) {

	var obj;
	var sliderHTML = "";
	
	if(jQuery('.quickBuy-Details').length >= 1) {
  	var cloudZoomOpts = {"czWidth":"400","czXadjust":"10"}
	} else {
  	var cloudZoomOpts = {"czWidth":"460","czXadjust":"90"}
	}
	
	for(var i = 0; i < Venda.Attributes.storeImgsArr.length; i++) {
		if(Venda.Attributes.storeImgsArr[i].param === att) {
			obj = Venda.Attributes.storeImgsArr[i];
			Venda.Attributes.imgParam = i;
			if(obj.images.imgL.length == obj.images.imgM.length){
  			jQuery("#productdetail-viewlarge").html("<a href='javascript: Venda.Attributes.ViewLargeImg(" + Venda.Attributes.imgParam + ");'>" + jQuery("#attributes-fullimage").text() + "</a>");
			} else {
  			jQuery("#productdetail-viewlarge").html("");
			}
		}
	}
	if(obj) {
  	for(var i = 0; i < obj.images.imgM.length; i++) {
      if(obj.images.imgL.length == obj.images.imgM.length){
        sliderHTML += "<li id=\"slide-id-" + i + "\"><a href=\"" + obj.images.imgL[i] + "\" class=\"cloud-zoom\" rel=\"adjustX:" + cloudZoomOpts.czXadjust + ", zoomWidth:" + cloudZoomOpts.czWidth + ", lensOpacity: 1\"><img src=\"" + obj.images.imgM[i] + "\" /></a></li>"
      } else {
        sliderHTML += "<li id=\"slide-id-" + i + "\"><img src=\"" + obj.images.imgM[i] + "\" /></li>"
      }
  	}
  	jQuery("#main .slider").html("<div class=\"flexslider uo-product-slider\"><ul class=\"slides\">" + sliderHTML + "</ul></div>");		
    jQuery('.uo-product-slider').flexslider({
      animation: "fade",
      slideshow: false,
      animationSpeed: 300, 
      start: function(slider){
        var slideTot = jQuery('.uo-product-slider .flex-control-nav li').length
        jQuery('.uo-product-slider .flex-control-nav li a').append('/' + slideTot);
      }
    });	
    jQuery(".uo-product-slider").hover(function() {
      if(!jQuery('.cloud-zoom, .cloud-zoom-gallery').data('zoom')){
        jQuery('.cloud-zoom, .cloud-zoom-gallery').CloudZoom();
      }
    });
	}
};

    


/**
* The following two functions build up the list of attribute images based on file name so that we can transition to scene7 and use on both sites
* ImageMediaAssignment is called once during initialize
* @param{string} imgAtt is the unique part of the image, typically colour as stored in attr1 but could be something else i.e. suplsku 
* @author Matthew Wyatt <mwyatt@anthropologie.com>
*/

Venda.Attributes.imageAssigner = function(imgAtt) {
  var imageURLs = {},
      imgNumber = 6,
      imgPath = "/content/ebiz/" + jQuery('#tag-ebizref').text() + "/invt/" + jQuery('#tag-invtref').text() + "/",
      imgStart = jQuery('#tag-invtref').text() + "_",
      imgRoot = jQuery('#tag-ebizurl').text(),
      imgChoice = {
        "imgS" : "_sm",
        "imgM" : "_l",
        "imgL" : "_z"
      }
  for(var size in imgChoice) {
    var images = []
    for(var j = 1; j < imgNumber; j++) {
    	var imgToAdd = imgRoot + imgPath + imgStart + imgAtt + imgChoice[size] + j + ".jpg"
        if(jQuery.inArray(imgStart + imgAtt + imgChoice[size] + j + ".jpg", Venda.Attributes.availableMedia) != -1 || jQuery.inArray(imgRoot + "/invt/" + imgStart + imgAtt + imgChoice[size] + j + ".jpg", Venda.Attributes.availableMedia) != -1 || jQuery.inArray(imgRoot + "/invt/" + jQuery('#tag-invtref').text() + "/" + imgStart + imgAtt + imgChoice[size] + j + ".jpg", Venda.Attributes.availableMedia) != -1) {
        	images.push(imgToAdd) 
        }
    }  
    imageURLs[size] = images           
  }
  return imageURLs
}

Venda.Attributes.ImageMediaAssignment = function() {
  var uniqueAtt1 = []
  for (var i = 0; i < Venda.Attributes.attsArray.length; i++) {
      var currAtt1 = Venda.Attributes.attsArray[i].att1
      if(jQuery.inArray(currAtt1,uniqueAtt1) == -1) { 
        var currImages = Venda.Attributes.imageAssigner(currAtt1)
        uniqueAtt1.push(currAtt1);
        Venda.Attributes.StoreImageSwaps({
          "param": currAtt1,
          "images": currImages
          });
        Venda.Attributes.SwatchURL[currAtt1] =  jQuery('tag-ebizurl').text() + "/content/ebiz/" + jQuery('#tag-ebizref').text() + "/invt/" + jQuery('#tag-invtref').text() + "/" + jQuery('#tag-invtref').text() + "_" + currAtt1.toLowerCase() + "_sw.jpg";  
      }
  }
}