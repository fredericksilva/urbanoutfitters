// Create Checkout namespace
Venda.namespace('Platform.Checkout.jsContent');
Venda.namespace('Checkout');
/**
 * Check for JavaScript and load checkbox for different delivery address
 * @param {swapid}	id of tag
 * @param {tags}	output for JS view
 */	
Venda.Platform.Checkout.jsContent.create = function(swapid, tags) {
	Venda.Platform.Checkout.jsContent.tags = tags;
	
	// check if DOM is available
	if(!document.getElementById || !document.createTextNode){return;}
	// check if there is a "No JavaScript" message
	var nojsmsg=document.getElementById(swapid);
	if(!nojsmsg){return;}
	
	switch(swapid) {
		case 'differentdeliveryaddress':
			// create a new div containing different delivery address checkbox
			var newDiv=document.createElement('div');
			
			var newInput=document.createElement('input');
			newInput.type='checkbox';
			newInput.setAttribute('name','differentaddress');// there is an IE bug where you cannot add a name attribute
			newInput.id='differentaddress';
			
			var label = document.createElement('label');
			label.setAttribute('for','differentaddress');
			label.appendChild(document.createTextNode(Venda.Platform.Checkout.jsContent.tags.label));
			
			newDiv.appendChild(newInput);
			newDiv.appendChild(label);
			newDiv.appendChild(document.createTextNode(' '+Venda.Platform.Checkout.jsContent.tags.message));
			nojsmsg.parentNode.replaceChild(newDiv,nojsmsg);
		break;
	}
};

//Function to prevent single quotes in text input - used in gift wrap screen
function noSingleQuotes(formName) {
for(i=0;i<(formName.elements.length);i++){
    	if(((formName.elements[i].type == "textarea") || (formName.elements[i].type == "text")) && (formName.elements[i].value!="")){
    		formName.elements[i].value = formName.elements[i].value.replace(/'/gi, '');
    	}
	}
};
/**
 * Selecting the delivery option automatically by depend the delivery address
 * @param {paramList}	id of the delivery option
 */	
Venda.Checkout.initialDTS = function(paramList){
	var param = {
		dtsOption:'', 
		standardOption:''
	}
	var dialogOpts = {modal: true,autoOpen: false};
	var options = jQuery.extend(param, paramList);
	var reloadPage = false;
	jQuery(".waitMesg").dialog(dialogOpts); 
	if(jQuery(".deliveryoptions").find(options.dtsOption).length){
		if(jQuery(".storeAddress").length){
			jQuery(".storeAddress").each(function(){
				if(!jQuery(this).find(options.dtsOption).attr('checked')){
					jQuery(this).find(options.dtsOption).attr('checked',true); 
					jQuery(this).find(options.dtsOption).trigger("click");
					reloadPage = true;
				}
				jQuery(this).find("input:not(:checked)").each(function(){
					jQuery(this).attr("disabled","disabled");
				});
			});
		}
		if(jQuery(".homeAddress").length){
			jQuery(".homeAddress").each(function(){
				if(jQuery(this).find(options.dtsOption).attr('checked')){
					jQuery(this).find(options.standardOption).attr('checked',true);
					jQuery(this).find(options.standardOption).trigger("click");
					reloadPage = true; 						
				}
				jQuery(this).find(options.dtsOption).attr("disabled","disabled");
			});
		}
	}
	if(reloadPage){
		jQuery(".waitMesg").dialog("open");
		jQuery(".ui-dialog-titlebar").hide();
	}
};

/* Tablet Work */
jQuery(document).ready(function() {

  if (typeof is_touch_device == 'function' && is_touch_device()) {

        jQuery('input[name*="email"]').each(function () {
                var new_email = jQuery(this).clone();
                new_email.attr('type','email');
                new_email.insertBefore(jQuery(this));
                jQuery(this).remove();
        });

        var tel_old = jQuery('input[name*="phone"]');
        var tel_new = tel_old.clone();
        tel_new.attr('type','tel');
        tel_new.insertBefore(tel_old);
        tel_old.remove();

  };
});

jQuery(function() { //Pass email address between login and password reminder screens, by appending to the url
	jQuery('a#passwordReminder').click(function(){ //used on login screen
		var email = jQuery('input#email').val();
		if (email){
			jQuery('a#passwordReminder').attr('href',function(i, val) {return val + '&param2=' + email});
		}
	});	
	jQuery('a#pwrmprevious').click(function(){ //used on pwrm screen & pwrm thank you screen
		var email = jQuery('input#usemail').val();
		if (email){
			jQuery('a#pwrmprevious').attr('href',function(i, val) {return val + '&param2=' + email});
		}
	});	
	jQuery('input#pwrmcontinue').click(function(){ //used on pwrm screen
		var email = jQuery('input#usemail').val();
		if (email){
			jQuery('input[name=param2]').val(email);
		}
	});
});

