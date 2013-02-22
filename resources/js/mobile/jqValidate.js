/**
 * @fileoverview jqValidate
 * This plugin provides us with the ability to validate a form validation
 *
 * @requires JQuery
 * @author Issawararat Chumchinda (Bow) <bowc@venda.com>
 */

  
jQuery(function() {
	var validateRules = {"required":{
					"regex": "none",
					"alertText": jQuery("#defaultErrorMessages #requireText").text(),
					"alertTextMultipleSelect": jQuery("#defaultErrorMessages #requireMultiSelect").text(),
					"alertTextSelect": jQuery("#defaultErrorMessages #requireSelect").text()},
			"phone":{
					"regex": /^[0-9\ ]+$/,
					"alertText": jQuery("#defaultErrorMessages #phone").text()},
			"email":{
					"regex": /^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,7}|\d+)$/i,
					"alertText": jQuery("#defaultErrorMessages #email").text()},
			"onlyLetter":{
					"regex": /^[a-zA-Z\ \']+$/,
					"alertText": jQuery("#defaultErrorMessages #onlyLetter").text()},
			"onlyNumber":{
					"regex": /^[0-9\ ]+$/,
					"alertText": jQuery("#defaultErrorMessages #onlyNumber").text()},
			"password":{
					"regex": /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9])$/,
					"alertText": jQuery("#defaultErrorMessages #password").text()},
			"length":{
					"regex": "none",
					"alertTextLength": jQuery("#defaultErrorMessages #length").text(),
					"alertTextMinLength": jQuery("#defaultErrorMessages #minLength").text(),
					"alertTextMaxLength": jQuery("#defaultErrorMessages #maxLength").text(),
					"alertTextMinMaxLength": jQuery("#defaultErrorMessages #rangeLength").text()},
			"matched":{
					"regex": "none",
					"alertText": jQuery("#defaultErrorMessages #matchedFlds").text()},
			// Specific fields
			"cardExpired":{
					"regex": "none",
					"alertText": jQuery("#defaultErrorMessages #cardExpired").text()},
			"occasionDate":{
					"regex": "none",
					"alertText": jQuery("#defaultErrorMessages #occasionDate").text()},
			"amount":{
					"regex": "none",
					"alertText": jQuery("#defaultErrorMessages #amountMsg").text()}
			/*"ajaxEmail":{
					"file":"page/ajaxemail",
					"alertText":"This email is already taken",
					"alertTextOk":"This email is available",	
					"alertTextLoad":"* Loading, please wait"}*/
			};
		/*do not use for now
		var helpRules = {
						"password": "The password must be between 8 and 20 characters, contain at least one digit and one alphabetic character, and must not contain special characters.",
						"phone": "For example (44) 1234-123456 or 44 1234 123456",
						"email": "For example yourname@domain.com."
						};*/
			
	//jQuery.allHelpRules = helpRules;
	jQuery.allValidateRules = validateRules;
	
	jQuery.fn.formValidator = function(){
		// prepare data
		var elements = [];
		var elementsCustom = [];// customValidatorList
		var arrayMsg = [];
		var _self = jQuery(this);
		
		_self.find("input[type=submit], .submit").bind("click",function(e){
			var isValid = _doNonTriggerValidation();
			if((jQuery('#creditcard').length)>0) {
				if(!isValid && jQuery('#creditcard').is(':checked')) {
					e.preventDefault();
					MessageWriter.writeOntopMessage(arrayMsg, _self.attr("name"));
				} else {
					MessageWriter.clearMessage();
				}
			}
			if((jQuery('#creditcard').length)<=0) {
				if(!isValid){
					e.preventDefault();
					MessageWriter.writeOntopMessage(arrayMsg, _self.attr("name"));
				} else {
					MessageWriter.clearMessage();
				}
			}
		});

		this.validateFields = function(elems){
			elements = elems || [];
			// start process
			_doTriggerValidation();
		};
		
		this.validate = function(){
			return _doNonTriggerValidation();
		};
		
		this.validateCustom = function(setting){
			if(jQuery.isArray(setting)){
				jQuery.each(setting,function(index, props){
					performValidator(props); //props = 1 group for each custom configuration
				});
			} else {
				performValidator(setting);
			}
		};
		
		function _doNonTriggerValidation (){
			var isValid = true;
			arrayMsg = []; // clear all values

			jQuery.each(elements, function(index, props){
				var id = "#"+props.id;
				if(jQuery(id).is(":visible")) { // if an element exists
					var fieldValidator = jQuery(id).fieldValidator(props, true);
					if(!fieldValidator.isValid()){
						isValid = false;
						arrayMsg.push({field:jQuery(id), msg:fieldValidator.getMessage()});
					}
				}
			});
			
			jQuery.each(elementsCustom, function(index, custom){ 
				var lastFieldId = "";
				var customValidFlag = true;
				jQuery.each(custom.config, function(index, props){
					if(jQuery("#"+props).length > 0) {
						if(!custom.callValidate()) {
							isValid = false;
							customValidFlag = false; // specific for custom validate
						}
						lastFieldId = props;							
					}
				});
				if(!customValidFlag && lastFieldId.length > 0){
					arrayMsg.push({field:jQuery("#"+lastFieldId), msg:custom.message});
				}
			});
			return isValid;
		};
		
		//** private function .. can call in scope of formValidator function only **//
		function _doTriggerValidation (){
			jQuery.each(elements,function(index, props){
				jQuery("#"+props.id).fieldValidator(props);
			});
		};
		
		function performValidator(setting){
		// Custom method
			if(setting.validator == "cardExpiredValidator"){
				var fGroup = "#"+setting.id1+","+"#"+setting.id2;
				var custom = new cardExpiredValidator(setting);
				elementsCustom.push(custom);

				jQuery(fGroup).bind("blur", function(){
					var valid = custom.callValidate();
					if(!valid){
						MessageWriter.writeInlineMessage([setting.id1,setting.id2], custom.message);
					} else {
						MessageWriter.clearMessage([setting.id1,setting.id2]);
					}
				});
			} // end cardExpiredValidator
			
			if(setting.validator == "reminderValidator"){
				var fGroup = "#"+setting.id1+","+"#"+setting.id2+","+"#"+setting.id3;
				var custom = new reminderValidator(setting);
				elementsCustom.push(custom);
				
				jQuery(fGroup).bind("blur", function(){
					var valid = custom.callValidate();
					if(!valid){
						MessageWriter.writeInlineMessage([setting.id1,setting.id2,setting.id3], custom.message);
					} else {
						MessageWriter.clearMessage([setting.id1,setting.id2,setting.id3]);
					}
				});
			} // end reminderValidator
	
			/* do not use for now as we left ONE field for phone number */
			if(setting.validator == "phoneValidator"){
				var fGroup = "#"+setting.id1+","+"#"+setting.id2;
				var custom = new phoneValidator(setting);
				elementsCustom.push(custom);
				
				jQuery(fGroup).bind("blur", function(){
				  if (jQuery("#"+custom.config.id1).val().length > 0){
					var valid = custom.callValidate();
						if(!valid){
							// send array of id, and message
							MessageWriter.writeInlineMessage([custom.config.id1,custom.config.id2], custom.message);
						} else {
							MessageWriter.clearMessage(custom.config.id1,custom.config.id2);
						}
					}
				});
			} // end PhoneValidator

			/* for amount of gift certificates */
			if(setting.validator == "amountValidator"){
				var fGroup = "#"+setting.amountid;
				var custom = new amountValidator(setting);
				elementsCustom.push(custom);
				jQuery(fGroup).bind("blur", function(){
				  if (jQuery("#"+custom.config.amountid).val().length > 0){
					var valid = custom.callValidate();
						if(!valid){
							// send array of id, and message
							MessageWriter.writeInlineMessage([custom.config.amountid], custom.message);
						} else {
							MessageWriter.clearMessage(custom.config.amountid);
						}
					}
				});
			} // end amountValidator

		}; // end performValidator
		return this;
	}; // end formValidator

	/* will be called by _doTriggerValidation() or _doNonTriggerValidation() to validate for each field */
	jQuery.fn.fieldValidator = function(setting, nonTrigger/*[option]*/){
		var fieldSetting = jQuery.extend({
			trigger: "blur change",
			nonTrigger: nonTrigger
		},setting);
 
		var validator = new ValidationCore();
		var helpMessage = new HelpMessage();
		var valid = true;
		var visitedFields = [];
		var fieldId = "#"+setting.id;

		// validate section
		if(nonTrigger){
			valid = validator.callValidate(jQuery(fieldId), fieldSetting);
		} else {
			/*if(fieldSetting.helpDisplay){
				jQuery(this).bind("focus", this, function(e) {
					helpMessage.showHelp(e.data, fieldSetting);
				}).bind("blur", function(e){
					MessageWriter.clearMessage();
				});
			}*/

			jQuery(fieldId).live("keypress change", fieldId, function(e){
				if(jQuery(fieldId).val().length > 0){
					if(jQuery.inArray(setting.id,visitedFields) == -1) { //added if doesn't exist
						visitedFields.push(setting.id);
					}
				}
			});
			
			jQuery(fieldId).live(fieldSetting.trigger, fieldId, function(e){
				jQuery.each(visitedFields, function(index, props){
					if (props == setting.id){
						valid = validator.callValidate(jQuery(fieldId), fieldSetting);
						if(!valid){
							MessageWriter.writeInlineMessage(setting.id, validator.getMessage());
						} else {
							MessageWriter.clearMessage(setting.id);
						}
					}
				});
			});
		}

		this.getMessage = function(){
			return validator.getMessage(); // get message from ValidationCore
		}
		
		this.isValid = function(){
			return valid;
		}
		return this;
	}// end fieldValidator
	
	//validation core unit
	var ValidationCore = function(){
		this.message = "";
	}
	
	ValidationCore.prototype = {
		callValidate: function(jQueryField, setting){
			var isValid;
			this.field = jQueryField;
			var rules = setting.rules;
			
			for(var eachProp in rules){
				if (eachProp == "required") {
					isValid = this.required(eachProp,rules[eachProp]);
					if(!isValid) return false;
				}
				if(eachProp == "phone" || eachProp == "email" || eachProp == "onlyLetter" || eachProp == "onlyNumber" || eachProp == "password") {
					isValid = this.regExp(eachProp,rules[eachProp]);
					if(!isValid) return false;
				}
				if(eachProp == "matched") {
					isValid = this.matched(eachProp,rules[eachProp]);
					if(!isValid) return false;
				}
				if(eachProp == "length") {
					isValid = this.length(eachProp,rules[eachProp]);
					if(!isValid) return false;
				}
			}
			return true;
		},
		
		required: function(strRules, cusMSG /*option*/){
			var currRule = jQuery.allValidateRules[strRules];
			if(!this.getFieldValue() || this.getFieldValue() == "") {
				if (cusMSG == "" || cusMSG.length == 0) {
					// use the default message from validationRules
					if(this.getFieldType() == "text" || this.getFieldType() == "password") {
						this.message = currRule.alertText;
						return false;
					}
					if(this.getFieldType() == "select-one" || "select-multiple") {
						this.message = currRule.alertTextMultipleSelect;
						return false;
					}
					if(this.getFieldType() == "checkbox") {
						this.message = currRule.alertTextSelect;
						return false;
					}
				} else {
					// use the custom message from user instead
					this.message = cusMSG;
				}
			} else {
				return true;
			}
		},
		
		regExp: function(strRules, cusMSG /*option*/){
			var currRule = jQuery.allValidateRules[strRules];
			var pattern = currRule.regex; // convert to Object by  eval(rule.regex);

			if(this.getFieldValue() != ""){
				if(!pattern.test(this.getFieldValue())) {
					this.message = (cusMSG == "" || cusMSG.length == 0) ? currRule.alertText : cusMSG;
					return false;
				}
			}
			return true;
		},
		
		matched: function(strRules, props){
			var currRule = jQuery.allValidateRules[strRules];
			var field = jQuery("#"+props.fMatched).val();
			var cusMSG = props.msg || "";

			if(this.getFieldValue() != field) {
				this.message = (cusMSG == null || cusMSG.length == 0) ? currRule.alertText : cusMSG;
				return false;
			}
			return true;
		},
		
		length: function(strRules, props){
			var currRule = jQuery.allValidateRules[strRules];
			var cusMSG = props.msg || "";
			var feildLength = this.getFieldValue().length;
			var startLength = props.min || 0;
			var endLength = props.max || 0;
			
			if (startLength != 0 && endLength != 0) {
				if(feildLength < startLength || feildLength > endLength) {
					// between (min) and (max) characters allowed
					this.message = (cusMSG == null || cusMSG.length == 0) ? this.displayNoOfLength(currRule.alertTextMinMaxLength, [startLength, endLength]) : cusMSG;
					return false;
				}
			} else {
				if (startLength == 0 && feildLength > endLength) {
					// no more than (max) character
					this.message = (cusMSG == null || cusMSG.length == 0) ? this.displayNoOfLength(currRule.alertTextMaxLength, endLength) : cusMSG;
					return false;
				}
				if (endLength == 0 && feildLength < startLength) {
					// at least (min) character
					this.message = (cusMSG == null || cusMSG.length == 0) ? this.displayNoOfLength(currRule.alertTextMinLength, startLength) : cusMSG;
					return false;
				}
			}
			return true;
		},

		getMessage: function(){
			return this.message;
		},
		
		getFieldId: function(){
			return this.field.attr("id");
		},
		
		getFieldName: function(){
			return this.field.attr("name");
		},
		
		getFieldType: function(){
			return this.field.prop("type");
		},
		
		getFieldValue: function(){
			if(this.getFieldType() == "checkbox" || this.getFieldType() == "radio") {
				return this.field.is(":checked");
			} else {
				return this.field.val();
			}
		},
		
		displayNoOfLength: function(oldMsg, minmax){
			if(typeof minmax == "object") {
				var newMsg = oldMsg.replace(/\(\*\)/,minmax[0]);
				return newMsg.replace(/\(\*\)/,minmax[1]);
			} else {
				return oldMsg.replace(/\(.*\)/gi,minmax);
			}
		}
	};// validationCore

	/*
	* Create all customValidator class to specific functionality.
	* 
	*/
	var cardExpiredValidator = function(config){
		this.config = config;
		this.message = (this.config.msg == null || this.config.msg.length == 0) ? jQuery.allValidateRules.cardExpired.alertText : this.config.msg;
	}
	cardExpiredValidator.prototype = {
		callValidate: function(){
			var day = this.config.nowDate.split("/");
			var month = jQuery("#"+this.config.id1+" option:selected").text();
			var year = jQuery("#"+this.config.id2+" option:selected").text();
			var nowDate = new Date(this.config.nowDate);
			var clientDate = new Date(month+"/"+day[1]+"/"+year);

			return (nowDate <= clientDate); // return 'true' if clientDate isn't in the past
		}
	};
	
	var reminderValidator = function(config){
		this.config = config;
		this.message = (this.config.msg == null || this.config.msg.length == 0) ? jQuery.allValidateRules.occasionDate.alertText : this.config.msg;
	}
	reminderValidator.prototype = {
		callValidate: function() {
			var day = jQuery("#"+this.config.id1+" option:selected").text();
			var month = jQuery("#"+this.config.id2+" option:selected").text();
			var year = jQuery("#"+this.config.id3).val();
			day = (day.indexOf("0") == 0) ? day.replace("0","") : day;

			var nowDate = new Date(this.config.nowDate);
			var clientDate = new Date(day+" "+month+" "+year);
			
			return (nowDate < clientDate); // return 'true' if clientDate is in the future
		}
	};
		
	var phoneValidator = function(config){
		this.config = config;
	}
	phoneValidator.prototype = {
		message: jQuery.allValidateRules.phone.alertText,
		callValidate: function() {
			var pattern = jQuery.allValidateRules.phoneValidator.regex;
			var area = jQuery("#"+this.config.id1).val();
			var phone = jQuery("#"+this.config.id2).val();

			if(area != "" && phone != ""){
				if(!pattern.test(area) || !pattern.test(phone)) {
					return false;
				}
			} else {
				return false;
			}
			return true;
		}
	};

	var amountValidator = function(config){
		this.config = config;
		this.message = this.config.msg;
		//(this.config.msg == null || this.config.msg.length == 0) ? jQuery.allValidateRules.occasionDate.alertText : this.config.msg;
	}
	amountValidator.prototype = {
		//message: this.config.msg,
		callValidate: function() {
			var currentVal = jQuery("#"+this.config.amountid).val();
			var minprice = this.config.minprice;
			var maxprice = this.config.maxprice;
			if ((currentVal < minprice) || (currentVal > maxprice)) {
					return false;
			} else {
				return true;
			}
		}
	};
	
	var HelpMessage = function() {}
	HelpMessage.prototype = {
		showHelp: function(jQueryField, setting){
			/* ********need changes*********
			var rules = setting.rules;// this.getRules(setting.rules);
			var helpRules = setting.rules;
			
			for(var eachProp in rules){
				if (eachProp == "required") {
					isValid = this.required(eachProp,rules[eachProp]);
					if(!isValid) return false;
			
			
			
			
				var msg = jQuery.allHelpRules[helpRules[i]];
				if(msg){
					if(!jQuery(jQueryField).hasClass("highlight")) {
						MessageWriter.writeHelpMessage(jQueryField, rules[eachProp]);
					}
				}
			}*/
		}
	};
	
	/*create static class name MessageWriter (static class means user's not necessary to create instance)
		Purpose of the class tends to take all jobs of writing messages in various style such as inline message and on top message
		this class consists of 2 basic writing message 
		+ writeInlineMessage(jQueryField,msg);
		+ writeOntopMessage(arrayMessage);
		
		:: How to use ::
		MessageWriter.writeInlineMessage(jQueryField,msg);
	*/
	var MessageWriter = {
		/*Public Methods for writing inline Msg */
		writeHelpMessage: function(jQueryField, msg){
			var offset = jQueryField.offset();
			var left = offset.left + jQueryField.width()+15;
			var top = offset.top;
			
			jQuery("body").append("<div id=\"helpMessage\"><div class=\"icon\"></div><div class=\"content\">"+msg+"</div></div>");
			jQuery("#helpMessage").css({"left":left,"top":top});
			jQuery("#helpMessage").show();
		},

		/**
		* param id : field id or Array of field id
		* param msg : message
		*/
		writeInlineMessage: function(id, msg){
			if(jQuery.isArray(id)){
				for(var i=0; i < id.length; i++) {
					this.clearMessage(id[i]);
					jQuery("#"+id[i]).addClass("highlight");
					if (i == id.length-1) { // a name of the last field will be created as a classname
						jQuery("#"+id[i]).after("<div id=\"invalid-"+id[i]+"\" class=\"errorMsg\"><span>"+msg+"</span></div>");
					}
				}
			} else {
				var errorDiv = "<div id=\"invalid-"+id+"\" class=\"errorMsg\"><span>"+msg+"</span></div>";
				var eleType = jQuery("#"+id).prop("type");

				this.clearMessage(id);
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
		},
		
		writeOntopMessage: function(arrayMsg, formName){
			var id;
			var requiredFlds = "";
			var sName = "";
			
			for (var i=0; i < arrayMsg.length; i++){
				id = arrayMsg[i].field.attr("id");
				sName = (jQuery("label[for="+id+"]").length > 0) ? jQuery("label[for="+id+"]").html().replace(":", "") : "" ;

				this.writeInlineMessage(id, arrayMsg[i].msg);
				
				if (sName != "") { requiredFlds = requiredFlds+"<li>"+sName+"</li>"; }
				arrayMsg[i] = {};
			}
			
			if(jQuery("#onTopMessage").length == 0){
				jQuery("h1:first").after("<div id=\"onTopMessage\" class=\"error allRequired\"><div class=\"icon\"></div><p>Please supply more details where indicated below.</p><ul>"+requiredFlds+"</ul></div>");
				if(jQuery(".checkoutmobile-content").length != 0) jQuery('html, body').animate({ scrollTop : jQuery(".checkoutmobile-content").offset().top });
			}
		},
		
		clearMessage: function(id){
			if(jQuery("#onTopMessage").length != 0) {jQuery("#onTopMessage").remove();}
			if(jQuery.isArray(id)){
				for(var i=0; i < id.length; i++) {
					if(jQuery("#"+id[i]).next().is(".errorMsg")) { jQuery("#"+id[i]).next().remove(); }
					jQuery("#"+id[i]).removeClass("highlight");
					//if (i == id.length-1) {	jQuery("#"+id[i]).parents().removeClass("highlight"); }
				}
			} else {
				jQuery("#invalid-"+id).remove();
				jQuery("#"+id).removeClass("highlight");
			}
		}
	}; //End static class name MessageWriter
});

/**
* Removes the HTML5 required attribute so jQuery inline validation is used consistently
*/
jQuery(function() {
jQuery('[required]').removeAttr("required");
});