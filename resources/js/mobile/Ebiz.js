//create namespace
Venda.namespace("Ebiz");
/**
* Media Code
* Validate and submit media code using ajax if not on basket for in-page display
* Update minicart figures with ajax too if not on basket
*/
checkVoucherForm = function(defaulttext) {
	var str = jQuery.trim(jQuery("#vcode").val());

	if(jQuery("#vcode_submit_shopcart").length > 0){ //if on workflow
		if(str == '' || str == defaulttext) {
			alert(jQuery("#tag-alert").html());
		} else {

			jQuery.mobile.loadingMessage = "Please wait while we apply your promotion code.";
			jQuery.mobile.showPageLoadingMsg();
			jQuery("#vcode").val(str);
			var src = (jQuery("#tag-curstep").html() == "ordersummary") ? jQuery("#tag-protocol").html()+"?ex=co_wizr-promocodehttpsmobile&curstep=vouchercode&step=next&mode=process&curlayout=promocoderesultmobile&layout=promocoderesultmobile&vcode="+jQuery("#vcode").val()+"&action=add"
					: jQuery('#tag-protocol').html()+'?ex=co_wizr-promocodehttpmobile&curstep=vouchercode&step=next&mode=process&curlayout=promocoderesultmobile&layout=promocoderesultmobile&vcode='+jQuery("#vcode").val()+'&action=add';

			var oScript = jQuery("<script />", {
				type: "text/javascript",
				src: src
			});
			jQuery("#ajax-error").append(oScript);
			jQuery.mobile.hidePageLoadingMsg();
		}
	}
};

/**
* A prompt shows when you first visit the site allowing the user to add a link to the iphone/ipad dashboard
* Add this back once the functionality is needed
*/
addToHome = function (){
	if(jQuery.cookie('visited') == null) {
		jQuery.cookie('visited', '1',  { path: '/' });
		jQuery(".addtohome").remove();
		jQuery('<div class="addtohome"><div class="contents"><div class="logo"></div><span>Add Venda to your Homepage</span><a class="closeAddtohome"></a></div>').appendTo("body");
		jQuery(window).bind("scroll", function(){
			jQuery(".addtohome").css("top", window.pageYOffset+window.innerHeight-jQuery(".addtohome").height()+"px");
		});
		jQuery("#mobile, a.closeAddtohome").bind("click", function() {
			jQuery(".addtohome").remove();
		});
	}
};

/**
* To show the information of gift certificate value
*/
giftInfo = function (){
	jQuery(".giftInfo").hide();
	jQuery("#amount").bind("click focus", function(){
		jQuery(".giftInfo").show();
		jQuery("#amount").bind("blur", function(){
			jQuery(".giftInfo").hide();
		});
	});
};
textCounter = function(field, maxlimit) {
	if (field.value.length > maxlimit) {
		// trim if too long
		field.value = field.value.substring(0, maxlimit);
	}
};

/**
* Update quantity on your basket page
* @param {String} qtyid - QTY id of product to update
* @param {Object} self
*/
updateQTYBasket = function(qtyid, self) {
	var formid = "#"+jQuery("#tag-curstep").text()+"form";

	if(jQuery(self).is('.qtyDropdown')) {
		/* Dropdown version */
		jQuery(self).change(function(){
			jQuery(qtyid).val(jQuery(qtyid+" option:selected").val());
		});
	}
	jQuery.mobile.showPageLoadingMsg();
	jQuery(formid+" input[type=hidden][name=param2]").val("updated");
	jQuery(formid).submit();
};

/**
* To validate Qty - the accept value is only number
*
* @return {boolean} - true if only number entered
*/
validateQty = function(){
	var filterNumber = /(^-?[1-9](\d{1,2}(\,\d{3})*|\d*)|^0{1})$/;
	var hasQty = true;

	jQuery("#qty, .qty").each(function (index) {
		if((parseInt(jQuery(this).val()) < 0) || (filterNumber.test(jQuery(this).val())==false)){
			if(jQuery(this).attr("type") == "text") jQuery(this).val(1);
			hasQty = false;
			return false;
		}
	});
	if(!hasQty){ alert('Please enter a valid quantity.'); return false;	}

	return true;
};



/**
* Form submition with no reload page
*
*/
jQuery.fn.submitForm = function(){
	var formObj = jQuery(this);
	var URL = formObj.attr('action'); /* get target*/
	var params = formObj.find("input, select, textarea").serialize(); /* get the value from all input type*/

	jQuery.mobile.showPageLoadingMsg();
	jQuery.ajax({
		type: "POST",
		url: URL,
		dataType: "html",
        data: params,
		cache: false, /* do not cache*/
		error: function() {
			jQuery("div.ui-page-active div[data-role='content']").html('error');
		},
		success: function(data) {
			jQuery.mobile.hidePageLoadingMsg();
			jQuery("div.ui-page-active div[data-role='content']").html(data);
		}
	});
};

/**
* Detect a touch screen device
* return true if a touch screen device uses
*/
isTouchDevice = function() {
	var deviceAgent = navigator.userAgent.toLowerCase();
	var isTouchDevice = (deviceAgent.match(/(ipad)|(iphone)|(ipod)|(android)|(webos)/i)) ? true : false;
	return isTouchDevice;
};

replaceValue = function(reValue){
	var re = new RegExp('[?&]'+reValue+'=([^&]+)');
	jQuery("#collate").find("select option").each(function(){
		optionQbj = jQuery(this);
		var match = optionQbj.val().match(re);
		if(match){
			optionQbj.val(optionQbj.val().replace(match[0],""));
		}
	});
	jQuery("#term").find("a").each(function(){
		optionQbj = jQuery(this).attr("href");
		var match = optionQbj.match(re);
		if(match){
			jQuery(this).attr("href",optionQbj.replace(match[0],""));
		}
	});
};

refineSearch = function(selectObj){
	var $this = jQuery(selectObj);
	if($this.val() != ''){
		var target = $this.find(':selected').val();
		target = target.replace(/&setpagenum=([^?&]+)/g,'');

		if($this.attr('id')=='price') {
			var price = $this.find(':selected').data('price').split('-');
			target = target.replace(/&price_from=([^?&]+)/g,'');
			target = target.replace(/&price_to=([^?&]+)/g,'');
			location = target+'&price_from='+price[0]+'&price_to='+price[1];
		} else {
			location = target;
		}
	}
};

/**
* To override default settings, bind to mobileinit
*/
jQuery(document).bind("mobileinit", function(){
  jQuery.mobile.ajaxEnabled = false;
  jQuery.mobile.hashListeningEnabled = false;
});

/**
* Triggered on the page being initialized
*/
jQuery(document).bind("pageinit", function(event) {

	// EVENTS
	jQuery("#search").keypress(function(event) {
		if ( event.which == 13 ) {
			if(jQuery("#search").val() ==""){
				event.preventDefault();
				alert("Please enter a search query.");
			}
		}
	});

	jQuery("#searchsubmit").click(function(event) {
		if(jQuery("#search").val() ==""){
			event.preventDefault();
			alert("Please enter a search query.");
		}
	});

	jQuery("#desktop").click(function(){
		// Creating cookie with all available options
		jQuery.cookie('device', 'desktop', { path: '/', domain: document.domain });
	});

	//login page
	jQuery(".existing").live( "click", function(event, ui) {
		jQuery(".newCustomerbuttonDiv").toggleClass("greyButton");
		jQuery(".guestCheckout").toggleClass("greyButton");
	});

	if(jQuery(".productdetailMulti").length > 0){
		var qtylist = 0;
		var url = location.href;
		if(url.indexOf("&ex=co_disp-shopc") != -1){
			var params = url.split("&");
			for (i=0; i<params.length; i++) {
				val = params[i].split("=");
				if( (val[0] == "qtylist") && (val[1] != "")){
					qtylist = qtylist + parseInt(val[1]);
				}
			 }
			jQuery("#multiaddedmsg").removeClass("hide");
			jQuery("#multiaddedmsg .multiaddedmessage").find("span").text(qtylist);
		}else{
			jQuery("#multiaddedmsg").addClass("hide");
		}
	}
	//Grid/List view link
	jQuery(".searchOptions .viewProduct").live("click", function() {
		var view =  jQuery(this).attr("data-viewstyle");
		jQuery.cookie("setViewMobile", view, { path: '/' });
		location.reload();
	});
	//Bind change event for search refine list
	jQuery("select.refineselect").live("change",function() {
		refineSearch(this);
		return false;
	});
});

jQuery(document).bind('pagecreate',function(){
	if(jQuery(".searchResults .viewStyle").length){
		setVeiwProduct();
	}
});

/**
* Grid/List view
*/
setVeiwProduct = function(){
	var getViewCookie = jQuery.cookie("setViewMobile") || 'List';
	if(getViewCookie == "Grid"){
		jQuery(".searchResults ul.prods").attr("data-role","");
	}
	jQuery(".searchResults ul.prods").removeClass('prodsList prodsGrid');
	jQuery(".searchResults ul.prods").addClass("prods"+getViewCookie);
	jQuery(".searchResults .viewProduct").removeClass("iconListActive iconGridActive");
	jQuery(".searchResults .viewProduct.icon"+getViewCookie).addClass("icon"+getViewCookie+"Active");
};

/**
* Store locator dropdown version
*/
changeSelectStore = function(selectObj,parentsObj) {
	var sURL = selectObj.options[selectObj.selectedIndex].value;
	jQuery(selectObj).parents(parentsObj).next().html("");
	jQuery("#storeDetail").html("");
	if(parentsObj == ".regionselect"){
		jQuery(".store").html("");
	}
	jQuery(selectObj).parents(parentsObj).next().load(sURL, function(){
		jQuery(this).find("select").selectmenu();
	});

};
showStoreDetails =function(selectObj){
	var sURL = selectObj.options[selectObj.selectedIndex].value;
	jQuery("#storeDetail").load(sURL);
};

Venda.Ebiz.switchCurrency = function (location, region, workflow) {
		var fullURL = unescape(location.href);
		var baseURL = location.protocol + "//" + location.host;
		if (baseURL.substring(baseURL.length-2, baseURL.length-1) == "/") {
			baseURL = baseURL.substring(0, baseURL.length-2);
		}
		var redirectURL = "";
		// only for LIVE site because parameter setlocn doesn't on short URL (e.g. www.sitename.com&setlocn=xxx)
		if ((baseURL == fullURL) || ((baseURL + "/") == fullURL) || workflow != "") {
			redirectURL = baseURL.replace("https","http") + "/page/home&setlocn=" + region + "&log=4";
		} else {
			var afterHash = "";
			var hashPos = fullURL.indexOf("\#");
			if (hashPos != -1) {
				afterHash = fullURL.substring(hashPos, fullURL.length);
				fullURL = fullURL.substring(0, hashPos);
 			}
			// clean log parameter + prevent error when switch currency after add to basket
			var logValue = Venda.Platform.getUrlParam(fullURL, "log");
			if (logValue == 4) {
				fullURL = fullURL.replace("&log=4","");

			} else if (logValue == 22) {
				fullURL = fullURL.replace("&log=22","");
				fullURL = fullURL.replace("&mode=add","");
			} else if ((logValue == "") && (fullURL.indexOf("&log=") != -1)) {
				fullURL = fullURL.replace("&log=","");
			}

			var setlocnValue = Venda.Platform.getUrlParam(fullURL, "setlocn");
			if (setlocnValue != "") {
				redirectURL = fullURL.replace("=" + setlocnValue, "=" + region) + "&log=4" + afterHash;
			} else if ((setlocnValue == "") && (fullURL.indexOf("&setlocn=") != -1)) {
				redirectURL = fullURL.replace("&setlocn=", "&setlocn=" + region) + "&log=4" + afterHash;
			} else if ((setlocnValue == "") && (fullURL.indexOf("&setlocn=") == -1)) {
				redirectURL = fullURL + "&setlocn=" + region + "&log=4" + afterHash;
			}

		}
		if (redirectURL != "") {
			location.href = redirectURL;
		}
	};

/**
* Create tooltip
*
*/
jQuery( document ).ready( function()
{
    var targets = jQuery( '[rel~=tooltip]' ),
		currency, country, register,
        target  = false,
        tooltip = false,
        title   = false,
		visible = false;

    targets.bind( 'click', function()
    {
        target   = jQuery( this );
        currency = jQuery('input[name="currencyTitle"]').val();
		country  = jQuery('input[name="countryTitle"]').val();
		register = jQuery('<div id="tag-ustype">').val();
        tooltip  = jQuery( '<div class="chat-bubble"><div id="tooltipContent">\
			<div>\
				<ul>\
				<li class=headerRegionTitle>' + country + '</li>\
				<a href="/page/home" id="restofworld" class="restofworld"><li class="headerRegionBtn langCls uk"><span class="second">UK Mobile site</span></li></a>\
				<a href="http://www.urbanoutfitters.fr/d/page/home" id="eur" class="eur"><li class="headerRegionBtn langCls fr"><span class="second">FR Main site</span></li></a>\
				<a href="http://www.urbanoutfitters.de/d/page/home" id="restofworld" class="restofworld"><li class="headerRegionBtn langCls de"><span class="second">DE Main site</span></li></a>\
				<li><br/></li>\
				<div id="removeCurrency">\
				<li class=headerRegionTitle>' + currency + '</li>\
				<li class="headerRegionBtn currencyCls"><a href="#" id="restofworld" class="restofworld"><span class="first">£</span><span class="second"> UK Pounds</span></a></li>\
				<li class="headerRegionBtn currencyCls"><a href="#" id="eur" class="eur"><span class="first">€</span><span class="second">  Euros</span></a></li>\
				</div>\
				</ul>\
			</div>\
		</div>\
		<div class="chat-bubble-arrow-border"></div>\
		<div class="chat-bubble-arrow"></div>\
		</div>' );

        if( !country || country == '' || !currency || currency == "" ) {
            return false;
		}


        tooltip.appendTo( 'body' );//.css( 'opacity', 0 )
               //.html( tip )


        var init_tooltip = function()
        {

			var pos_left=0, pos_top=0;
            if( jQuery( window ).width() <= tooltip.outerWidth() * 2.5 )
                tooltip.css( 'max-width', jQuery( window ).width() / 2 );
            else
                tooltip.css( 'max-width', 340 );

				pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( tooltip.outerWidth() / 2 ),
                pos_top  = target.offset().top - tooltip.outerHeight() - 20;

			if( pos_left + tooltip.outerWidth() > jQuery( window ).width() )
			{
				pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
			}

            if( pos_left < 0 )
            {
                pos_left = target.offset().left + target.outerWidth() / 2 - 20;
            }


            if( pos_top <= 0 )
            {
              // var pos_top  = target.offset().top + target.outerHeight();
			   pos_top = 50;
            }

            if( pos_top > 60 )
            {

			   pos_top = 50;
            }

            tooltip.css( { left: pos_left, top: pos_top } ).stop().animate( { top: '+=10', opacity: 1 }, 50 );

			if(jQuery("#tag-ustype").text()=='R') {
			jQuery('#removeCurrency').remove();
			}
        };

        init_tooltip();

		jQuery( window ).resize( init_tooltip );

        var remove_tooltip = function()
        {
            tooltip.animate( { top: '-=10', opacity: 0 }, 50, function()
            {
                jQuery( this ).remove();
            });
        };

		// Closing tooltip by two events
		jQuery("body:not(#tooltipContent .headerLangSwitch)").click(function(e) {
			if (!(jQuery(e.target).hasClass('regionLangSwitch') ||
				  jQuery(e.target).hasClass('selectedlocn') ||
				  jQuery(e.target).hasClass('selectedlang'))) {
				remove_tooltip();
			}
		});

		jQuery("#tooltipContent .currencyCls a").click(function() {
			Venda.Widget.RegionLangSwitch.doURL("setlocn",this,Venda.Widget.RegionLangSwitch.currRegion);
			return false;
		});

		jQuery("#tooltipContent .langCls a").click(function() {
			jQuery(this).click();
			return false;
		});

		visible = true;
    });
});
jQuery(document).bind("pageinit", function(event) {
if(jQuery("#tag-ustype").text()=='R') {
			jQuery('#removeCurrency').remove();
			}
  });


 /*
* @return {boolean} - true if only number entered
*/
stockStatusMove = function(){
	var initials = jQuery(".att2 .ui-btn-text").text().split(" - ");
	if(initials[1] != undefined && initials[1]!= 'In stock') { jQuery("#qtybox .attLabel").html("<span class='selectstatus1'>QTY </span><span class='selectstatus2'>"+initials[1]+"</span>"); }
	else {jQuery("#qtybox .attLabel").html("<span class='selectstatus1'>QTY </span><span class='selectstatus2'></span>");}
	};

stockStatusChange = function(){
	var initials = jQuery(".att2 .ui-btn-text").text().split(" - ");
	jQuery(".att2 .ui-select .ui-btn-text").text(initials[0]);
};

jQuery(".att2 .ui-select select").live('change',function(){
	stockStatusMove();

});


OpacButton = function(){
	jQuery(".keywordsearch span.ui-btn-inner").css("opacity","1");
};

TransparentButton = function(){
	jQuery(".keywordsearch span.ui-btn-inner").css("opacity","0.5");
};

/*
** function to add a pointer to checkout now tooltip from product detail
*/
jQuery(function(){
	jQuery('#addedmsg1').append('<div class="chat-bubble-arrow-border"></div><div class="chat-bubble-arrow"></div>');
	jQuery('.prodContents .att2.ui-hide-label').append('<span class="downArrow"></span>');
	jQuery('.prodContents .buyControls').append('<span class="downArrow"></span>');
});
