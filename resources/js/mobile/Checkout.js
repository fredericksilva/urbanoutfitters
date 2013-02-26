/**
* Update shipping method by submitting the form
* @param {String} formId - a form id to submit
*/
updateShipmethod = function (formId, shipmethod){
	jQuery.mobile.loadingMessage = "Please wait while we update your shipping method.";
	jQuery.mobile.showPageLoadingMsg();
	jQuery(formId+" input[type=hidden][name=param1]").val(shipmethod);
	jQuery(formId).submit();
};

/**
* Clean login session value in the form
* @param {String} formId - a form id to clear unnecessary value
*/
cleanUp = function(formId){
	var email = jQuery('#'+formId+' #email').val();
	if(email != ''){
		if ((email.substring(0,1)=='<') || (email.substring(0,4)=='user')) {
			jQuery('#'+formId+' #email').val('');
		}
	}
	if(jQuery('#'+formId+' #password').val()!= ''){
		jQuery('#'+formId+' #password').val('');
	}
};
/**
* Get UK address 
*/
addressList = function(){
	var zipc = jQuery("#zipc").val();
	var zipcodeUrl = encodeURI(jQuery("#zipcodeUrl").html()+zipc);
	var selectedCountry = jQuery('select#cntrylist option:selected').val();

	if(zipc == ""){
		jQuery("#error").html("Please enter a postcode");
	}else{
		if (countries[selectedCountry]) {
			if (europePostalCheck(selectedCountry)) {
				if (jQuery("#invalid-zipc").length > 0) {
					jQuery("#invalid-zipc").remove();
					jQuery("#zipc").removeClass("highlight");
				}
				loadZipCode(zipcodeUrl);
			}
		} else {
			loadZipCode(zipcodeUrl);
		}
	}
};

writeInlineMessage = function(id, msg){
	var errorDiv = "<div id=\"invalid-"+id+"\" class=\"errorMsg\"><span>"+msg+"</span></div>";
	var eleType = jQuery("#"+id).prop("type");

	jQuery("#invalid-"+id).remove();
	jQuery("#"+id).removeClass("highlight");
	switch(eleType) {
		case "select-one":
			jQuery("#"+id).parents().find("div.ui-select").eq(0).after(errorDiv);
		break;

		case "checkbox":
			jQuery("#"+id).parents().find("div.ui-checkbox").eq(0).after(errorDiv);
		break;

		default:
		jQuery("#"+id).after(errorDiv);
	}
	jQuery("#"+id).addClass("highlight");
}

loadZipCode = function(zipcodeUrl) {
	jQuery(".loading").show();
	jQuery(".submitButton input[type=submit]").attr("disabled","disabled");
	
	jQuery("#error").hide();
	jQuery("#error").html(" ");
	if(jQuery("#uklist").find("#error").length){
		jQuery("#uklist").html(" ");
	}		
	jQuery("#uklist").load(zipcodeUrl,function(response, status, xhr) {
		jQuery(".loading").hide();
		jQuery(".submitButton input[type=submit]").removeAttr("disabled");
		jQuery("select[name=zcdropdown]").attr("id","zcdropdown");
		jQuery("select").selectmenu();
		if (status == "error") {
			var msg = "Sorry but there was an error: ";
			jQuery("#error").html(msg + xhr.status + " " + xhr.statusText);
		}
		if(jQuery("#uklist select[name=zcdropdown]").length==0) {
			jQuery("#error").html("Postcode not found");
			jQuery("#zipc").val("");
			jQuery("#error").show();
			jQuery("#uklist").hide();
		}
	});
}
/**
* Fill the UK address from dropdown to input field
*/
selectAddress = function(){
	var zcdropdown = "&zcdropdown="+ jQuery("select[name=zcdropdown] option:selected").val();
	var zipc = "&zipc="+ jQuery("#zipc").val();
	jQuery("#ukaddress").load(encodeURI(addressUrl+zcdropdown+zipc),function(response, status, xhr) {
		loadAddress();
		if (status == "error") {
			var msg = "Sorry but there was an error: ";
			jQuery("#error").html(msg + xhr.status + " " + xhr.statusText);
		}
	});
};

europePostalCheck = function (country) {
	//get the postal code entered, should pass this as an argument really	
	var	postalCode = jQuery('#zipc').val()
	//only run if country details have been included
	if (countries[country] != null) {
		//cache the country
		var	countryCache = (countries[country]), 
				//validate against this
				validate = new RegExp(countryCache.regex.validate, "i"),
				//format with this, easier to do this when we have multiple groups i.e. UK than get the format regex to do it
				format = new RegExp(countryCache.regex.format, "i"),
				//some countries deliminate with something other than " "
				deliminate = countryCache.deliminate || "",
				//some countries want a prefix
				prefix = countryCache.prefix || ""
		//oh dear the postcode doesn't match! from the beginning of the string... could improve... anyway display an alert... 
		if (postalCode.search(validate) != 0) {
			writeInlineMessage('zipc', 'Please enter a valid postcode for your selected country e.g. ' + countryCache.example);
			return false;
		} else if (postalCode.search(validate) == 0) {
			//good job user, you've entered something that matches, lets just clean it up a little
			if (countryCache.regex.format != null) {
				//if we had a format regex make sure we use it, we also need a format regex if the country has a different deliminator even if its the same... something to improve
				jQuery('#zipc').val(postalCode.replace(format, "$1" + deliminate + "$2").toUpperCase());
			} else if (prefix != "") {
				//has a prefix make sure we include that
				jQuery('#zipc').val(postalCode.replace(validate, prefix + "$2"));
			} else {
				//these are my favourite countries, simple postcodes...
				jQuery('#zipc').val(postalCode.replace(validate, "$1"));
			}
			return true;
		}
		return true;
	}
	return true;
};

jQuery(function(){
	//Bind change event for UK address dropdown	
	jQuery("select[name=zcdropdown]").live('change',function() {
	 	selectAddress();
	 	return false;
   	});
	jQuery("#zipc").bind({
		keypress: function(e) {
			if (e.which == 13  && !jQuery("#zcdropdown").is(":visible")) {
				e.preventDefault();
				jQuery("#lookupBtn").trigger("click");
			}		
		},
		blur: function(e) {
			if (jQuery("#zipc").val() != "" && !jQuery("#zcdropdown").is(":visible")) {
				jQuery("#lookupBtn").trigger("click");
			}
		}
	});
});

var countries = ({
	"United Kingdom" :
	{
		"regex" : 
		{
			"validate" : "(GIR 0AA)|((((A[BL]|B[ABDHLNRSTX]?|C[ABFHMORTVW]|D[ADEGHLNTY]|E[HNX]?|F[KY]|G[LUY]?|H[ADGPRSUX]|I[GMPV]|JE|K[ATWY]|L[ADELNSU]?|M[EKL]?|N[EGNPRW]?|O[LX]|P[AEHLOR]|R[GHM]|S[AEGKLMNOPRSTY]?|T[ADFNQRSW]|UB|W[ADFNRSV]|YO|ZE)[1-9]?[0-9]|((E|N|NW|SE|SW|W)1|EC[1-4]|WC[12])[A-HJKMNPR-Y]|(SW|W)([2-9]|[1-9][0-9])|EC[1-9][0-9])) *?([0-9][ABD-HJLNP-UW-Z]{2})$)",
			"format" : "(^[A-Z]{1,2}[A-Z0-9]{1,2}) *?([0-9][A-Z]{2}$)"
		},
		"deliminate" : " ",
		"example" : "AA00 0AA"
	},
	"Austria" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{4}$)"
		},
		"example" : "1234"	
	},
	"Belgium" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{4}$)"
		},
		"example" : "1234"
	},
	"Bulgaria" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{4}$)"
		},
		"example" : "1234"		
	},
	"Cyprus" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{4}$)"
		},
		"example" : "1234"
	},
	"Czech Republic" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{3}) *?([0-9]{2}$)",
			"format" : "(^[0-9]{3}) *?([0-9]{2}$)"
		},
		"deliminate" : " ",	
		"example" : "123 45"	
	},
	"Denmark" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{4}$)"
		},
		"example" : "1234"
	},
	"Estonia" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{5}$)"
		},
		"example" : "12345"	
	},
	"Finland" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{5}$)"
		},
		"example" : "12345"
	},
	"France" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{5}$)"
		},
		"example" : "12345"
	},
	"Germany" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{5}$)"
		},
		"example" : "12345"
	},
	"Greece" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{5}$)"
		},
		"example" : "12345"		
	},
	"Hungary" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{4}$)"
		},
		"example" : "1234"
	},
	"Italy" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{5}$)"
		},
		"example" : "12345"
	},
	"Latvia" :
	{
		"regex" : 
		{
			"validate" : "(^LV)? *?-*?([0-9]{4}$)"
		},
		"prefix" : "LV-",
		"example" : "LV-1234"		
	},
	"Lithuania" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{5}$)"
		},
		"example" : "12345"
	},
	"Luxembourg" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{4}$)"
		},
		"example" : "1234"		
	},
	"Malta" :
	{
		"regex" : 
		{
			"validate" : "(^[A-Z]{3}) *?([0-9]{4}$)",
			"format" : "(^[A-Z]{3}) *?([0-9]{4}$)"
		},
		"deliminate" : " ",
		"example" : "ABC 1234"
	},
	"Netherlands" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{4}) *?([A-Z]{2}$)",
			"format" : "(^[0-9]{4}) *?([A-Z]{2}$)"
		},
		"deliminate" : " ",
		"example" : "1234 AB"		
	},
	"Norway" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{4}$)"
		},
		"example" : "1234"
	},
	"Poland" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{2}) *?-*?([0-9]{3}$)",
			"format" : "(^[0-9]{2}) *?-*?([0-9]{3}$)"
		},
		"deliminate" : "-",	
		"example" : "12-345"	
	},
	"Portugal" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{4}$)"
		},
		"example" : "1234"
	},
	"Romania" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{6}$)"
		},
		"example" : "123456"		
	},
	"Slovakia" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{3}) *?([0-9]{2}$)",
			"format" : "(^[0-9]{3}) *?([0-9]{2}$)"
		},
		"deliminate" : " ",
		"example" : "123 45"
	},
	"Slovenia" :
	{
		"regex" : 
		{
			"validate" : "(^SI)? *?-*?([0-9]{4}$)"
		},
		"prefix" : "SI-",
		"example" : "SI-1234"		
	},
	"Spain" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{5}$)"
		},
		"example" : "12345"
	},
	"Sweden" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{3}) *?([0-9]{2}$)",
			"format" : "(^[0-9]{3}) *?([0-9]{2}$)"
		},
		"deliminate" : " ",
		"example" : "123 45"		
	},
	"Switzerland" :
	{
		"regex" : 
		{
			"validate" : "(^[0-9]{4}$)"
		},
		"example" : "1234"
	}
});

/**
* Pass email address between login and password reminder screens, by appending to the url
* Add this back once 1.7 is used by jQuery mobile

jQuery(function() { 
	jQuery(document).on('click','a#passwordreminder',function(){ //used on login screen - forgotten password link
		var email = jQuery('input#email').val();
		if (email){
			jQuery('a#passwordreminder').attr('href',function(i, val) {return val + '&param1=' + email});
		}
	});
	jQuery(document).on('click','a#cancelreminder',function(){ //used on pwrm screen - cancel button
		var email = jQuery('input#usemail').val();
		if (email){
			jQuery('a#cancelreminder').attr('href',function(i, val) {return val + '&param1=' + email});
		}
	});	
	jQuery(document).on('click','input#passwordsent',function(){ //used on pwrm screen - continue button
		var email = jQuery('input#usemail').val();
		if (email){
			jQuery('input[name=param1]').val(email);
		}
	});
});
*/