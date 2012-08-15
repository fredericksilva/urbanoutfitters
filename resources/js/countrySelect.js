/**
 * @fileoverview Venda.CountrySelect
 *
 * Rearange country dropdown list to show top most popular countries first.
 * Manage a country specific registration form display.
 *
 * @author Donatas Cereska <dcereska@venda.com>
 */

Venda.namespace('CountrySelect');


/**
 * Stub function is used to support JSDoc.
 * @class Venda.CountrySelect
 * @constructor
 */
 
Venda.CountrySelect = function () {};


 /**
 * Initiate an empty object to collect the country data printed from within the
 */

Venda.CountrySelect.countryAndData = {};

Venda.CountrySelect.Init = function() {
	
	var topCountries;
	
	switch(jQuery('#venda_locn').text()) {
	
		case 'uk':
			topCountries = [
			/*'United Kingdom',
			'Ireland',
			'France', 
			'Germany', 
			'Spain', 
			'Italy'*/
			];
		break;
		
		case 'us':
			topCountries = [
			/*'United States', 
			'Canada', 
			'Mexico', 
			'Brazil'*/
			];
		break;
		
		//restoftheworld
		default:
			topCountries = [
			/*'United States', 
			'United Kingdom', 
			'France', 
			'Germany', 
			'Spain', 
			'Italy'*/
			];
	
	}

	var el = {
		countrySelect			:		jQuery('select#cntrylist'),
		countrySelectOption	:		jQuery('select#cntrylist option'),
		stateSelect				: 		jQuery('select#statelist'),
		stateText					: 		jQuery('input#stateText'),
		
		houseNum					:		jQuery('#houseNum'),
		houseNumInput			:		jQuery('input#num'),
		zipLabel 					:		jQuery('#zipcLabel'),
		zipInput 					:		jQuery('#zipc'),
		
		countyDiv					:		jQuery('#stateDiv'),
		countyLabel 				:		jQuery('#stateLabel'),
		countyInput 				:		jQuery('#statelist'),
		countyText				:		jQuery('#statetext'),
		
		postcodeLookup			:		jQuery("#postcodelookup")
	};
	var selectOptions = {};
	
	el.stateSelect.change(function() {
		el.countyText.val(Venda.CountrySelect.countryAndData[jQuery("#cntrylist option:selected").val()][jQuery('#statelist option:selected').index()].split(':')[0]);
	});
	
	el.countrySelectOption.each(function(index) {
		selectOptions[index] = jQuery(this).text();
	});
	
	
	if(topCountries.length > 0) {
		el.countrySelect.prepend('<option value="-" disabled>-</option>'); 
		var matchDiff = 0;
		for(var i = (topCountries.length-1); i >= 0; i--) {
			for(key in selectOptions) {
				if(selectOptions[key] == topCountries[i]) {
					jQuery("select#cntrylist option[value='" + topCountries[i] + "']").remove();
					el.countrySelect.prepend("<option value='" + topCountries[i] + "'>" + topCountries[i] + "</option>");
					matchDiff++;
				}
			}
		}
		matchDiff = topCountries.length - matchDiff;
		el.countrySelect.prepend(jQuery('select#cntrylist option').get(topCountries.length - matchDiff + 1));
	}
	
	
	if(jQuery('#venda_cntry').text().length > 0) {
		Venda.CountrySelect.SetCountry(jQuery('#venda_cntry').text(), el);
		jQuery("select#cntrylist option[value='" + jQuery('#venda_cntry').text() + "']").attr("selected","selected");
	} else {
		Venda.CountrySelect.SetCountry(null, el);
		jQuery('select#cntrylist option').get(0).setAttribute("selected","selected");
	}
	
	el.countrySelect.change(function () { Venda.CountrySelect.SetCountry(jQuery(this).val(), el);	});
};


jQuery(document).ready(function() {
	if(jQuery('select#cntrylist').length > 0) Venda.CountrySelect.Init();
});


// Populate input according to selection
//el.stateText.val(jQuery("select#statelist option[option='" + jQuery('#venda_state').text() + "']"));

Venda.CountrySelect.SetCountry = function(cntry, el) {

	el.countyText.val('');

 	switch(cntry) {
	
		case 'United States':
			Venda.CountrySelect.ShowHide('hide', el.houseNum);
			Venda.CountrySelect.ShowHide('hide', el.houseNum.next());
			Venda.CountrySelect.ShowHide('show', el.countyDiv);
			Venda.CountrySelect.ShowHide('show', el.countyDiv.next());
			Venda.CountrySelect.ShowHide('hide', el.countyText);
			Venda.CountrySelect.ShowHide('show', el.countyInput);
			el.countyLabel.text(jQuery('#user_details_label_us_state').text() + ':');
			el.stateSelect.empty();
			el.zipLabel.text(jQuery('#user_details_label_us_zip').text() + ':');
			el.postcodeLookup.addClass("hide");
			isRequiredField = true;
		break;
	
		case 'United Kingdom':
			Venda.CountrySelect.ShowHide('show', el.houseNum);
			Venda.CountrySelect.ShowHide('show', el.houseNum.next());
			Venda.CountrySelect.ShowHide('show', el.countyDiv);
			Venda.CountrySelect.ShowHide('show', el.countyDiv.next());
			Venda.CountrySelect.ShowHide('show', el.countyText);
			Venda.CountrySelect.ShowHide('hide', el.countyInput);
			el.countyLabel.text(jQuery('#user_details_label_uk_county').text() + ':');
			el.stateSelect.empty();
			el.zipLabel.text(jQuery('#user_details_label_non_us_postcode').text() + ':');
			el.postcodeLookup.removeClass("hide");
			isRequiredField = false;
		break;
		
		case 'Germany':
			Venda.CountrySelect.ShowHide('show', el.houseNum);
			Venda.CountrySelect.ShowHide('show', el.houseNum.next());
			Venda.CountrySelect.ShowHide('hide', el.countyDiv);
			Venda.CountrySelect.ShowHide('hide', el.countyDiv.next());
			el.stateSelect.empty();
			el.zipLabel.text(jQuery('#user_details_label_non_us_postcode').text() + ':');
			el.postcodeLookup.addClass("hide");
			isRequiredField = false;
		break;
		
		case 'France':
			Venda.CountrySelect.ShowHide('show', el.houseNum);
			Venda.CountrySelect.ShowHide('show', el.houseNum.next());
			Venda.CountrySelect.ShowHide('hide', el.countyDiv);
			Venda.CountrySelect.ShowHide('hide', el.countyDiv.next());
			el.stateSelect.empty();
			el.zipLabel.text(jQuery('#user_details_label_non_us_postcode').text() + ':');
			el.postcodeLookup.addClass("hide");
			isRequiredField = false;
		break;
		
		case 'Spain':
			Venda.CountrySelect.ShowHide('hide', el.houseNum);
			Venda.CountrySelect.ShowHide('hide', el.houseNum.next());
			Venda.CountrySelect.ShowHide('show', el.countyDiv);
			Venda.CountrySelect.ShowHide('show', el.countyDiv.next());
			Venda.CountrySelect.ShowHide('show', el.countyText);
			Venda.CountrySelect.ShowHide('hide', el.countyInput);
			el.countyLabel.text(jQuery('#user_details_label_non_us_uk_region').text() + ':');
			el.stateSelect.empty();
			el.zipLabel.text(jQuery('#user_details_label_non_us_postcode').text() + ':');
			el.postcodeLookup.addClass("hide");
			isRequiredField = false;
		break;
		
		default:
			Venda.CountrySelect.ShowHide('hide', el.houseNum);
			Venda.CountrySelect.ShowHide('hide', el.houseNum.next());
			Venda.CountrySelect.ShowHide('show', el.countyText);
			Venda.CountrySelect.ShowHide('hide', el.countyInput);
			el.countyLabel.text(jQuery('#user_details_label_non_us_uk_region').text() + ':');
			el.stateSelect.empty();
			el.zipLabel.text(jQuery('#user_details_label_non_us_postcode').text() + ':');
			el.postcodeLookup.addClass("hide");
			isRequiredField = false;
		break;
	
	};
	
	if(cntry && Venda.CountrySelect.countryAndData[cntry]) {
		for(var i = 0; i < Venda.CountrySelect.countryAndData[cntry].length; i++) {
			if(i == 0) {
				el.stateSelect.append("<option value=''>" + jQuery("#please_select_multi_dot").text() + "</option>");
			} else {
				el.stateSelect.append("<option value='" + Venda.CountrySelect.countryAndData[cntry][i].split(':')[0] + "'>" + Venda.CountrySelect.countryAndData[cntry][i].split(':')[1] + "</option>");
			}
		}
 		if(typeof Venda.CountrySelect.countryAndData[cntry][0] != 'undefined') {
			el.countyText.val(Venda.CountrySelect.countryAndData[cntry][0].split(':')[0]);
		}
		if(jQuery('#venda_state').text().length > 0) {
			jQuery("select#statelist option[value='" + jQuery('#venda_state').text() + "']").attr("selected","selected");
		}
	}

};


Venda.CountrySelect.ShowHide = function(act, el) {

	if(el) {
		 switch(act) {
		
			case 'show':
				jQuery('#' + el.attr('id') + ' :input').css('display','block');
				el.show();
			break;
		
			case 'hide':
				el.hide();
				jQuery('#' + el.attr('id') + ' :input').css('display','none').val('');
			break;
		
		};
	};

};