/**
* @fileoverview Venda.storeloc
 * Venda's storeloc storelocator: This functionlaity  is a fallback for Google API implementation.
 * There is a switch in the VCP to activate this 'NON GOOGLE STORE LOCATOR'
 *
 * @requires js/external/jquery-1.7.1.min.js
 * @author Alby Barber <abarber@venda.com>
*/

Venda.namespace('storeloc');
Venda.storeloc = function () {};

Venda.storeloc.stores;
Venda.storeloc.URL = window.location.href;

jQuery(function(){
	Venda.storeloc.createSelect();
	Venda.storeloc.ajaxPopulate('storelocator');
	//jQuery('.DTScontinue').hide();
})

/**
* Creates a blank select and loading image div to be populated via AJAX
* @param{string} that is the this passed from the chnaged select
* @author Alby Barber <abarber@venda.com>
**/
Venda.storeloc.createSelect = function(that) {
		
		jQuery(that).nextAll('.storeLocSelect').remove();
		
		if (that && that.value){
			jQuery('.storeLocSelectHolder').append('<select class="storeLocSelect"></select><div class="loadingImg"></div>');
		}
		else{
			jQuery('.storeLocSelectHolder').append('<select class="storeLocSelect"></select>');
		}
		
		jQuery('.storeLocSelectHolder select:last').hide();

}

/**
* Populates the created select with values supplied by the passed story id via AJAX
* @param{string} stryid is the id of the story category or story store
* @author Alby Barber <abarber@venda.com>
**/
Venda.storeloc.ajaxPopulate = function(stryid) {

	if (stryid != ""){
		jQuery.get( jQuery('#tag-ebizurl').text().replace('http:',window.location.protocol) + "/scat/" + stryid + "&temp=storesjsonDropdown&layout=blank", function(dataString) {
			var data = jQuery.parseJSON('[' + dataString + ']');

			var options = '<option value="">' + jQuery('#tag-selectaregion').text() + '</option>';
			
			if(data[0].StoreID){
				jQuery('.storeLocSelectHolder select:last').addClass('storeSelect');
				Venda.storeloc.stores = data;
				options = '<option value="">' + jQuery('#tag-selectastore').text() + '</option>';
			}

			for (var i = 0; i < data.length; i++) {
				options += '<option data-StoreID="' + data[i].StoreID + '" value="' + data[i].optionValue + '">' + data[i].optionDisplay + '</option>';
			}
			jQuery('.loadingImg').remove();
			jQuery('.storeLocSelectHolder select:last').html(options).show();
		});
	}
}

/**
* Populates the hidden form with the values from the selected store
* @param{string} that is the unique store id
* @author Alby Barber <abarber@venda.com>
**/
Venda.storeloc.fillForm = function(that){

	for (i=0;i<Venda.storeloc.stores.length;i++){

		if (Venda.storeloc.stores[i].StoreID == that){
			jQuery('input[name="num"]').val(Venda.storeloc.stores[i].StoreName).parent().find('span').html(Venda.storeloc.stores[i].StoreName);
			jQuery('input[name="addr1"]').val(Venda.storeloc.stores[i].Address).parent().find('span').html(Venda.storeloc.stores[i].Address);
			jQuery('input[name="addr2"]').val(Venda.storeloc.stores[i].Address2).parent().find('span').html(Venda.storeloc.stores[i].Address2);
			jQuery('input[name="city"]').val(Venda.storeloc.stores[i].City).parent().find('span').html(Venda.storeloc.stores[i].City);
			jQuery('input[name="zipc"]').val(Venda.storeloc.stores[i].PostCode).parent().find('span').html(Venda.storeloc.stores[i].PostCode);
			
			// This sets 2 hidden inputs that are used in conditions on the order summary screen
			jQuery('input[name="addrname"]').val(Venda.storeloc.stores[i].StoreName).parent().find('span').html(Venda.storeloc.stores[i].StoreName);
			//jQuery('input[name="fax"]').val(Venda.storeloc.stores[i].StoreID);
			
		}
	}

	jQuery(".DTSchangeStore, .dtsSubmit, .f-storedeliveryaddress").show();
}

/**
* EVENTS - General
**/
jQuery('.storeLocSelect:not(.storeSelect)').live('change', function() {
		Venda.storeloc.createSelect(this);
		Venda.storeloc.ajaxPopulate(this.value);
});

// Drop down select Store
jQuery('.storeSelect').live('change', function() {

	jQuery('.loadingbar').addClass('active');
  
	var height = jQuery('.mainHolder .Storelookup').height();
	jQuery('.mainHolder').css('height',height).addClass('loadingImg');
	jQuery('.mainHolder .Storelookup').animate({ opacity: 0, display: 'block' }, 1000 ).hide();
  
 	jQuery.get(this.value.replace('http:',window.location.protocol) + '&layout=blank', function(data) {
	
		jQuery('.mainHolder').removeClass('loadingImg');
		jQuery('.mainHolder').append('<div class="Storeview">' + data + '<p class="button buttonAlt2">'+ jQuery('#tag-back').text() +'</p></div>');
		jQuery('.mainHolder .Storeview').animate({ opacity: 1, display: 'block' }, 1000 );
		// Add the select store button
		jQuery('.dtsStorelocator').append('<div class="linkstore dtsfallback-linkstore"><a class="button buttonAlt buttonArrow" href="#">' + jQuery('#tag-selectthisstore').text() + '</a></div>').hide().fadeIn();
  	})
  return false
})
// Back button
jQuery(".Storeview .buttonAlt2").live("click", function(){

	jQuery('.loadingbar').removeClass('active');
	jQuery('.mainHolder .Storeview').animate({ opacity: 0, display: 'block' }, 1000 ).hide();
	jQuery('.mainHolder').addClass('loadingImg');
	jQuery('.mainHolder .Storelookup').show().animate({ opacity: 1, display: 'block' }, 1000 );
	jQuery('.mainHolder').delay(3000).removeClass('loadingImg');
	jQuery('.storeLocSelectHolder select:last').val(''); // Reset the original dropdown
	jQuery(".dtsfallback-linkstore").remove(); // Remove the select store button

})



/**
* EVENTS - DTS
**/
// 'Select Store' Button
jQuery(".dtsStorelocator .linkstore a").live("click", function(e){
  
  	var StoreID = jQuery('.storeLocSelectHolder select:last option:selected').attr('data-StoreID');

	Venda.storeloc.fillForm(StoreID);

	jQuery(".dtsfallback-linkstore").remove(); // Remove the select store button

	// hide store locator DTS
	jQuery(".dtsStorelocator").fadeOut();

  e.preventDefault();
  return false
})

// DTS show store locator DTS
jQuery(".DTSchangeStore").live("click", function(){
	jQuery(".dtsStorelocator").fadeIn();
})
