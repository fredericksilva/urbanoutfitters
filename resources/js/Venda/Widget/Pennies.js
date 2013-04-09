/**
* @fileoverview Venda.CurrencyConverter
 * Venda's Currency Converter functionality is designed to make currency conversion on Venda easy.
 * This has been written in the style of a plug-in so that its use could easily be expanded upon.
 *
 * The files below will be included dynamically when required:
 * @requires js/external/jquery-1.7.1.min.js
 * @requires js/external/cookiejar.js
 *
 *
 * @author Alby Barber <abarber@venda.com>
*/

/**
* Runs when the page is ready
*/

var StartPennies = function() {
		var xmlloc = jQuery('#tag-xml').html();
		jQuery('#tag-xml').html(Venda.Widget.RegionLangSwitch.ebizURL + xmlloc);
		jQuery('.price, #updateTotal, .pounds, .baskettotals .totalprice, .subtotal div, .orscTotalFig')
			.pennies('check',jQuery('#tag-xml')
			.pennies('rates'));
	// Events
	  jQuery('.price-info').live('click',function () {
  	  jQuery('.price-expanded').slideToggle();
	  });
		// This sets the currency using the switcher widget
		jQuery('.loadcurrency').live('click',function () { 
			jQuery('.price, #updateTotal, .pounds, .baskettotals .totalprice, .subtotal div, .orscTotalFig').pennies('convert',{to: jQuery(this).attr('rel')});
			Venda.Widget.RegionLangSwitch.conversionSwitch();
			jQuery('.region #restofworld, .region #eur').addClass('resetcurrency');
			return false;
		});
		
		// This resets the currency using the switcher widget
		jQuery('.resetcurrency').live('click',function () {
			jQuery('.price, #updateTotal, .pounds, .baskettotals .totalprice, .subtotal div, .orscTotalFig').pennies('reset');
			return false;
		});
}	

/*
 * @example jQuery('.price').pennies('convert',{from: 'GBP',to: 'USD'});
 * @desc Converts all prices with class 'price' from GBP to USD 
 *
 * @example jQuery('.price').pennies('convert',{to: 'PHP'});
 * @desc Converts all prices with class 'price' to PHP using the default from setting
 *
 * @example jQuery('.price').pennies('get');
 * @desc Returns the set currency
 *
 * @example jQuery('.price').pennies('rates');
 * @desc Gets the rates from the specified url. Normally used on load with 'check'
 *
 * @example jQuery('.price').pennies('reset');
 * @desc Resets the currency but does not convert the prices, for that use convert
 *
 * @param Object
 *            defaults An object literal containing key/value pairs to provide optional/default settings.
 *
 * @option String from 		(optional) The currency code that you are changing the currency from
 * @option String to 		(optional) The currency code that you are changing the currency to
 * @option String display 	(optional) The position that you want the converted price to be placed
 *
 */
 jQuery(function() {
	(function($) {
			if(jQuery("#tag-currencycode").length) {
			var checkObj,
				exrates;

			$.fn.pennies = function(method, options) {

				var Cookie = new CookieJar({expires: 3600 * 24 * 7, path: '/'});

				var defaults = {
					from 		: $('#tag-currencycode').html() ? $('#tag-currencycode').html() : 'GBP',
					to  		: 'USD',
					display		: 'replace' // replace, append
				};
				
				var opts = $.extend({},defaults, options);
				
				var methods = {
					convert : function() { 

						var o = $.meta ? $.extend({}, opts, $this.data()) : opts;

						Cookie.put("setCurrency",o.to); // set Cookie

						$('#flagContent')
							.find('a')
							.removeClass('setCurrency')
							.end()
							.find('[rel='+ o.to +']')
							.addClass('setCurrency');

						$('.currently').html(o.to);

						if (o.from !== o.to){
						  $('.oneProduct .price-info').show();
							return this.each(function() {

								var $this = $(this);

								if (typeof $this.data('price') == 'undefined'){
									$this.data('price',$this.text());
								}
								$this
									.html(convertPrice($this.data('price'),o.from,o.to) + " / " + $this.data('price'))
									.end()
									.addClass('convertedPrice');
							});
						}
					},
					check 	: function(exrates) {

						if(Cookie.get("setCurrency")!== null){
							
							var to 		= Cookie.get("setCurrency");

							if (typeof(exrates.GBP)!=='undefined'){
								$(this).pennies('convert',{from: defaults.from,to: to});
							}
							else if (typeof(AjaxError)!=='undefined'){
								console.warn('There was an error with the exchange rates Ajax request');
							}
							else {
								// we have to store the data form the next loop
								checkObj = { 'that': $(this) };
								setTimeout(checkAgain, 1000);
							}
						}
					},
					get 	: function() {
						return Cookie.get("setCurrency") ? Cookie.get("setCurrency") : defaults.from;
					},
					reset 	: function() {

							if(Cookie.get("setCurrency")!== null){
								Cookie.remove("setCurrency")		
							}
							
							$('#flagContent')
								.find('a')
								.removeClass('setCurrency')
								.end()
								.find('[rel='+ defaults.from +']')
								.addClass('setCurrency');

							$('.currently').html(defaults.from);

							return this.each(function() {
								var $this = $(this);
								$this.text($this.data('price')).removeClass('convertedPrice');
							});

					},
					rates 	: function(url) {

						var rate = { 'EUR' : 1 }; // Adding object with predefined EURO rate
						jQuery.ajax({
						   url: $(this).html(),
						   dataType: "xml",
						   success: function(o){
  						   
								jQuery(o).find('Cube').each(function(index, value){
									var currencyXMLnode = jQuery(this).attr('currency');
									var rateXMLnode = jQuery(this).attr('rate');

									if ((typeof currencyXMLnode != 'undefined') && (typeof rateXMLnode != 'undefined')){
										rate[currencyXMLnode] = parseFloat(rateXMLnode);
									}
								});
						   },
						   error: function(errorThrown) {                
								AjaxError = 'ERROR';
								console.warn("Error occured: " + errorThrown);
							}
						 });
						 exrates = rate;
						 return rate;
					}
				};

				// Method calling logic
				if ( methods[method] ) {
				  return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
				} else if ( typeof method === 'object' || ! method ) {
				  return methods.convert.apply( this, arguments );
				} else {
				  $.error( 'Method ' +  method + ' does not exist on jQuery.pennies' );
				}

				function checkAgain(){ 
					checkObj.that.pennies('check',exrates);
				}

				//	(£52.00 / GBP (0.82675)) * USD (1.2832) 
				//	(price  / currentRate) * newRate
				function convertPrice(price,from,to){

					var currencycode = { 
						'EUR' : "\u20AC",
						'GBP' : "\u00A3",
						'USD' : "\u0024",
						'AUD' : "\u0024",
						'CAD' : "\u0024",
						'HKD' : "\u0024",
						'NZD' : "\u0024",
						'SGD' : "\u0024",
						'MXN' : "\u0024",
						'JPY' : "\u00A5",
						'CNY' : "\u00A5",
						'BGN' : "\u043b\u0432",
						'CZK' : "K\u010d",
						'DKK' : "kr",
						'EEK' : "kr",
						'SEK' : "kr",
						'NOK' : "kr",
						'HUF' : "Ft",
						'LTL' : "Lt",
						'LVL' : "Ls",
						'PLN' : "z\u0142",
						'RON' : "lei",
						'CHF' : "CHF",
						'HRK' : "kn",
						'RUB' : "py\u0431",
						'TRY' : "YTL",
						'BRL' : "R\u0024",
						'IDR' : "Rp",
						'INR' : "\u20A8",
						'KRW' : "\u20A9",
						'MYR' : "RM",
						'PHP' : "\u20B1",
						'THB' : "\u0E3F",
						'ZAR' : "R"
					};

					if (price.match(/([0-9]*\.[0-9]+|[0-9]+)/) !== null){
						var price = price.match(/([0-9]*\.[0-9]+|[0-9]+)/)[0];
					}
					else {
						var price = 0;
					}

					var currentRate	= exrates[from];
					var newRate		= exrates[to];

					switch(to){
						case 'EUR':
						case 'DKK':
						case 'PHP':
						case 'PLN':
						case 'CZK':
						case 'RUB':
							// Currency symbol at the end
							return ((price  / currentRate) * newRate).toFixed(2).replace('.',',') + currencycode[to];
						break;
						default:
							// Currency symbol at the begining 
							return currencycode[to] + ((price  / currentRate) * newRate).toFixed(2).replace(',','.');
					}
				}
			};
				StartPennies();
			};
	// end of closure
	})(jQuery);
});