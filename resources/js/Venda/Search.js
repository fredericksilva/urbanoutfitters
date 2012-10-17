Venda.namespace('Venda.Search');

Venda.Search = function(options) {
    this._searchLifo = [];
    jQuery.extend(this, {
        maxPagesCached: 5,
        showViewAll:    true,
        viewAllLimit:   100,
        features:       []
    }, options);

    // showing all options
    this.features.push('priceSlider', 'viewMoreLess', 'multiRefine','indicateLoading','hideLoading','filterRefinements','viewStyleSwitcher','colorSwatch','perLine','searchAccordion','swatchHide','swatchCase','uiSelectmenu','removePrice','icxtHideRefine','refineColours');
};

// Utility method.
Venda.Search.start = function(options) {
   new Venda.Search(options).initialise();
};

Venda.Search._decodeURI = function(u) {
    // Because UNIFORM Resource Identifiers aren't.
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
    return decodeURIComponent(u.replace(/\+/g, '%20'));
};
// Workaround for bug in older code.
Venda.Search.fixRefinementUri = function(refine, chosen) {
    var uri = new Uri(refine.url);
    if(chosen) {
        // Workaround because uri.deleteQueryParam(k,v) is broken.
        var rem = uri.getQueryParamValues(refine.field);
        uri.deleteQueryParam(refine.field);
        jQuery.each(rem, function(i, f) {
            // Only decode at point of comparison to handle "+" in param values.
            if(Venda.Search._decodeURI(f) != refine.facet)
                uri.addQueryParam(refine.field, f);
        });
    }
    return uri.toString();
};

Venda.Search.prototype = {
    initialise: function() {
        this.setupSearchHandlers();
        this.setupDomHandlers();
        jQuery(window).bind('statechange', jQuery.proxy(this, 'stateChangeHandler'));

        var state = History.getState();
        // This is a workaround for IE for the case where the user has
        // navigated through the results, gone to another page then come back
        // again. It will forceably load the last known set of results.
        if(History.getHash().match(/&_suid=/)) {
            var newState = jQuery.extend(state.data, {forceLoad: new Date});
            History.replaceState(newState, this.getDocumentTitle(), state.url);
        } else {
            jQuery('#content-search').trigger('search-loading-end', [{ url: state.url }]);
        }
    },

    setupSearchHandlers: function() {
        // Handle history navigation.
        jQuery('#content-search').bind('search-navigate', jQuery.proxy(this, 'updateHistoryHandler'));
        // Move view to the top of the results if necessary
        jQuery('#content-search').bind('search-navigate', jQuery.proxy(this, 'moveResultsIntoViewHandler'));
        // Recreate the price slider.
        jQuery('#content-search').bind('search-loading-end', jQuery.proxy(this, 'showFeaturesHandler'));
    },

    setupDomHandlers: function() {
        var me = this;
        // Sorting
        jQuery('#content-search').delegate('#sortby', 'change', this.getNavHandler());

        // Facets links & checkboxes
        var refine = this.getNavHandler({ resetPrice: true });
        jQuery('#content-search').delegate('#collate a.updatesearch, #term a.removesearch', 'click',  refine);
        jQuery('#content-search').delegate('#collate input:checkbox', 'change', refine);

        // Pagination links & dropdown
        var pagination = this.getNavHandler({ pagination: true });
        var pagnlinks = jQuery('#content-search .pagn a').not(".viewproduct");
        jQuery('#content-search').delegate(pagnlinks, 'click',  pagination);
        jQuery('#content-search').delegate('.pagn select', 'change', pagination);
    },

    validSearchUrl: function(url) {
        var u = new Uri(url);
        return url && u.path().match(new RegExp('/(icat/|search\\b)'));
    },

    getNavHandler: function(params) {
        var self = this;
        return function navigationHandler(evt) {
            var href = this.href || jQuery(this).val();
            if(!self.validSearchUrl(href))
                return;
            jQuery('#content-search').trigger('search-navigate', [jQuery.extend(params || {}, { url: href })]);
            return false;
        };
    },

    // TODO - Have this reflect useful things.
    getDocumentTitle: function(uri) {
        return window.document.title;
    },

    updateHistoryHandler: function(evt, params) {
        var uri = new Uri(params.url);
        // Ensure the protocol always reflects the requested page.
        uri.setProtocol(window.location.protocol);
        if(!params.pagination)
            uri.deleteQueryParam('setpagenum');
        if(params.resetPrice) {
            uri.deleteQueryParam('minprice');
            uri.deleteQueryParam('maxprice');
        }
        History.pushState({realUri: uri.toString()}, this.getDocumentTitle(), uri.toString());
    },

    moveResultsIntoViewHandler: function() {
        if(jQuery('#content-top:in-viewport').is('a'))
            return;
        jQuery('html, body').animate({ scrollTop : jQuery("#searchResults").offset().top });
    },

    showFeaturesHandler: function() {
        jQuery.each(this.features, function(idx, f) {
            var feature = typeof f === 'string' ? Venda.Search.Feature[f] : f;
            if(!feature) return; // XXX Warn here somehow?
            var featureObj = new feature();
            if(featureObj.display) featureObj.display();
        });
    },

    stateChangeHandler: function(evt) {
        var state = History.getState(),
              // History.js helpfully "unescapes" URLs, this workaround will handle
              // params containing ampersands.
              url = state.data.realUri || state.url; 
        jQuery('#content-search').trigger('search-loading-start', [{ url: url }]);
        this.loadResults(url);
    },

    _addToStack: function(content, url) {
        this._searchLifo.push({content: content, url: url});
        if(this._searchLifo.length > this.maxPagesCached)
            this._searchLifo.shift();
    },
        
    _onStack: function(url) {
        var res = jQuery.grep(this._searchLifo, function(res, idx) { return res.url == url });
        return res[0];
    },

    loadResults: function (url) {
        var seenOnStack = this._onStack(url);

        if(!this.validSearchUrl(url)) {
            jQuery('#content-search').trigger('search-loading-end', [{ url: null }]);
        } else if(seenOnStack) {
            jQuery('#content-search')
                .html(seenOnStack.content)
                .trigger('search-loading-end', [{ url: url }]);
        } else {
            jQuery('#content-search').load(url + ' #content-search-body',
                jQuery.proxy(function(html, status, xhr) {
                    this._addToStack(jQuery('#content-search').html(), url);
                    jQuery('#content-search').trigger('search-loading-end', [{ url: url }]);
                }, this));
        }
    }
};

Venda.namespace('Venda.Search.Feature');

Venda.Search.Feature.priceSlider = function() {
    var state = History.getState(),
          uri = new Uri(state.data.realUri || state.url),
     minprice = uri.getQueryParamValue('minprice'),
     maxprice = uri.getQueryParamValue('maxprice');

    jQuery.extend(this, {
        currency: jQuery("#tag-currsym").text(),
        minprice: minprice !== undefined ? Number(minprice) : Math.floor(this._getPrice('minprice')),
        maxprice: maxprice !== undefined ? Number(maxprice) : Math.ceil( this._getPrice('maxprice')),
        from:     Math.floor(this._getPrice('pricefrom')),
        to:       Math.ceil( this._getPrice('priceto'))
    });

    this._sliderOptions = {
        range:  true,
        min:    this.minprice,
        max:    this.maxprice,
        values: [this.from, this.to]
    };
};

Venda.Search.Feature.priceSlider.prototype = {
    setText: function(from, to) {
        jQuery("#pricerangevalues").text(this.currency + from + ' - ' + this.currency + to);
    },

    _getPrice: function(id) {
        return parseFloat(jQuery("#tag-"+id).text());
    },

    slideHandler: function (event, ui) {
        this.setText(ui.values[0], ui.values[1]);
    },

    stopHandler: function (event, ui) {
        var uri = new Uri(History.getState().url),
        newFrom = ui.values[0],
          newTo = ui.values[1];
        // Don't search again if the values haven't changed.
        if(newFrom == this.from & newTo == this.to)
            return;
        uri.replaceQueryParam('price_from', newFrom);
        uri.replaceQueryParam('price_to',   newTo);
        uri.replaceQueryParam('minprice',   this.minprice);
        uri.replaceQueryParam('maxprice',   this.maxprice);
        jQuery('#content-search').trigger('search-navigate', [{ url: uri.toString() }]);
    },

    display: function() {
        jQuery("#priceslider").slider(
            jQuery.extend(this._sliderOptions, {
                slide: jQuery.proxy(this, 'slideHandler'),
                stop:  jQuery.proxy(this, 'stopHandler')
            })
        );
        this.setText(this.from, this.to);
    }
};

Venda.Search.Feature.viewMoreLess = function() {
    this.showViewAll  = 1 == jQuery('#tag-showviewall').text();
    this.viewAllLimit = Number(jQuery('#tag-viewallcount').text());

    // Take off one as this is used by :eq - http://api.jquery.com/eq-selector/
    if(this.viewAllLimit)
        this.viewAllLimit -= 1;
};

Venda.Search.Feature.viewMoreLess.prototype = {
    clickHandler: function(evt) {
        var facet = jQuery(evt.currentTarget).parent().parent();
        // Only switch more/less if the link is there e.g on click.
        facet.find('p.toggleviewall .viewmorerefinements').toggle();
        facet.find('p.toggleviewall .viewlessrefinements').toggle();
        facet.find('div:nth-child('+ this.viewAllLimit +') ~ div').toggle();
        return false;
    },
    display: function() {
        if(!this.showViewAll)
            return false;

        // Link to toggle large numbers of refinements.
        jQuery('#content-search').delegate('#collate p.toggleviewall a', 'click', jQuery.proxy(this, 'clickHandler'));

        var limit = this.viewAllLimit;
        jQuery('#content-search .showviewall').each(function() {
            var facet = jQuery(this);
            // Don't show the link if a refinement has been chosen.
            if(facet.find('div.termtext').length <= limit
            || facet.find('.chosen').length > 0)
                return;
            facet.find('p.toggleviewall').show();
            facet.find('div:nth-child('+ limit +') ~ div').toggle();
        });
        return false;
    }
};

/*Venda.Search.Feature.multiRefine = function() {};
Venda.Search.Feature.multiRefine.prototype = {
    clickHandler: function(evt) {
        return false;
    },
    display: function() {

        jQuery('#content-search').bind('search-loading-end', jQuery.proxy(this, 'clickHandler'));

        var self = this;
        jQuery('.multirefine .termtext').each(function(idx, refine) {
            var multi = jQuery('#multirefine-tmpl label').clone(true),
               single = jQuery(refine),
               chosen = single.hasClass('chosen'),
                   cb = multi.find('input:checkbox');
            if(chosen)
                cb.get(0).checked = true;
            cb.val(Venda.Search.fixRefinementUri(single.data(), chosen));
            multi.find('.facet').html( single.find('.facet').html() );
            single.html(multi);
        });
        return false;
    }
};*/

Venda.Search.Feature.indicateLoading = function() {};
Venda.Search.Feature.indicateLoading.prototype = {
    clickHandler: function(evt) {
        jQuery('#loadingsearch').show();
        jQuery('.searchContent').hide();
        return false;
    },
    display: function() {
        jQuery('#content-search').bind('search-loading-start', jQuery.proxy(this, 'clickHandler'));
        return false;
    }
};

Venda.Search.Feature.hideLoading = function() {};
Venda.Search.Feature.hideLoading.prototype = {
    clickHandler: function(evt) {
        jQuery('#loadingsearch').hide();
        return false;
    },
    display: function() {
        jQuery('#content-search').bind('search-loading-end',   jQuery.proxy(this, 'clickHandler'));
        return false;
    }
};

/*Venda.Search.Feature.filterRefinements = function() {};
Venda.Search.Feature.filterRefinements.prototype = {
    clickHandler: function(evt) {

        var $this = jQuery(evt.target);

        jQuery(".refine_" + $this.data('areaToRefine') + " div.termtext").each(function () {

            var $termtextThis = jQuery(this);

            if ($termtextThis.text().search(new RegExp($this.val(), "i")) < 0) {
                $termtextThis.addClass("hide");
            } 
            else {
                $termtextThis.removeClass("hide");
            }
        });
        return false;
    },
    display: function() {

	var input = jQuery('<input type="text" class="filterinput"/>').attr({ name: 'filtertype' });	

        jQuery('.collateheading:not(#price)').after(input);

        jQuery(".filterinput").each(function () {
           jQuery(this).data('areaToRefine',jQuery(this).prev('.collateheading').attr('id'));     
        });

        jQuery(".filterinput").bind('keyup', jQuery.proxy(this, 'clickHandler'));
        return false;
    } 
}; */

Venda.Search.Feature.popListItems = function() {};
Venda.Search.Feature.popListItems.prototype = {
    display: function() {
        // pops in the list elements
        jQuery('#content-search-body ul.prods li').hide();
        jQuery(".prods li").each(function(index) {
            jQuery(this).delay(200*index).fadeIn(300);
        })
        return false;
    }
};

Venda.Search.Feature.viewStyleSwitcher = function() {};
Venda.Search.Feature.viewStyleSwitcher.prototype = {
    display: function() {
        // ViewStyle - Grid switcher
        Venda.Widget.ViewStyle.setCookieForViewStyle();
        Venda.Widget.ViewStyle.addClassForViewStyle(viewStyleCookieName);
        return false;
    }
};

Venda.Search.Feature.colorSwatch = function() {};
Venda.Search.Feature.colorSwatch.prototype = {
    display: function() {
        // colorSwatch - Colour swatch image switcher
        var colorSwatch = new Venda.Ebiz.colorSwatch();
        colorSwatch.init();
        return false;
    }
};

/**
* The following scripts have been added to perform the following functionality on the 
* productlist and categorylist templates.
* Search perLine '3 or 5 products', Accordion toggle on Refine List, Clear button on
* each collate results, Hide swatchContainer if there are less than 2 swatches and jQuery UI dropdown styling
* @author Jotis Moore <jmoore@urbanoutfitters.com>
**/
Venda.Search.Feature.perLine = function() {};
Venda.Search.Feature.perLine.prototype = {
    display: function() {
    	var prodRef = jQuery(".prodRef").text();
    if (document.location.href.indexOf('&perline=3') > -1 ) {
    	jQuery(".swatchContainer").show();
    	jQuery(".quickLinkBox").each( function () {
	    	jQuery(this).addClass("qb-large");
	    	jQuery(this).removeClass("qb-small");
    	});
    	jQuery(".prodsFiveColumns li").css('width','33%');
        jQuery(".threePerLine").hide();
    	jQuery(".fivePerLine").show();
    	jQuery(".roundels").show();
    		jQuery("a.moredetail img").each(function () {
    			var ImageSrc = jQuery(this).attr("src").replace('_sm1.jpg','_l1.jpg');
    			jQuery(this).attr("src",ImageSrc);
    		});
    		jQuery(".sw_image").each(function () {
    			var SetImageSrc = jQuery(this).data("setimage").replace('_sm1.jpg','_l1.jpg');
    			jQuery(this).data("setimage",SetImageSrc);
    		});
        jQuery("a.moredetail img").css({width:'244px',height:'366px'});

    }
    if (document.location.href.indexOf('&perline=5') > -1 ) {
    	jQuery(".swatchContainer").hide();
    	jQuery(".quickLinkBox").each( function () {
	    	jQuery(this).addClass("qb-small");
	    	jQuery(this).removeClass("qb-large");
    	});
    	jQuery(".prodsFiveColumns li").css('width','19.5%');
        jQuery(".threePerLine").show();
    	jQuery(".fivePerLine").hide();
    	jQuery(".roundels").hide();
    		jQuery("a.moredetail img").each(function () {
    			var ImageSrc = jQuery(this).attr("src").replace('_l1.jpg','_sm1.jpg');
    			jQuery(this).attr("src",ImageSrc);
    		});
    		jQuery(".sw_image").each(function () {
    			var SetImageSrc = jQuery(this).data("setimage").replace('_l1.jpg','_sm1.jpg');
    			jQuery(this).data("setimage",SetImageSrc);
    		});
    	jQuery("a.moredetail img").css({width:'142px',height:'213px'});
    	}
        jQuery('.threePerLineLink').click(function() {
    		if ( document.location.href.indexOf('perline=5') > -1 ) {
    			this.href = this.href.replace('perline=5', 'perline=3');
    		}
    		else {
        	jQuery(this).attr('href', this.href + '&perline=3');
        	}
        	return true;
        });
        jQuery('.fivePerLineLink').click(function() {
        	if ( document.location.href.indexOf('perline=3') > -1 ) {
    			this.href = this.href.replace('perline=3', 'perline=5');
    		}
    		else {
        	jQuery(this).attr('href', this.href + '&perline=5');
        	}
        	return true;
        });
    }
};

Venda.Search.Feature.searchAccordion = function() {};
Venda.Search.Feature.searchAccordion.prototype = {
    display: function() {
    	jQuery(".accordion_slice").each(function (c) {
        	var b = "";
        	jQuery(this).find(".vendaField").each(function (f) {
	        	b = jQuery(this).text()
	        });
	        var fa = "";
	        jQuery('#'+b).click(function() {
		        jQuery('#'+b+'results').slideToggle('slow', function() {
		    });
		    jQuery('#'+b+'icon').toggleClass('iconMinus');
		});
		
		if (jQuery(this).find("div.chosen").length > 0) {
		    jQuery(".clear"+b).show();
		}

		jQuery(function(){
		    jQuery(this).find(".vendasearchURL").each(function (d) {
	        	url = jQuery(this).text();
	        });
	        jQuery(".clear"+b+" a[href^='"+url+"']").each(function() {
		    	var re = new RegExp('\&'+b+'='+'([^&]*)', "g");
		    	this.href = this.href.replace(re, "");
		    	});
		    });
		});
	}
};

Venda.Search.Feature.removePrice = function() {};
Venda.Search.Feature.removePrice.prototype = {
	display: function() {
		jQuery(".accordion_slice").each(function () {
			jQuery(this).find(".vendasearchURL").each(function (d) {
	        	url = jQuery(this).text();
	        })
	    });
		jQuery("#priceresults").find(".chosen").each(function () {
			var priceParams = "";
			jQuery(this).find(".priceFacet").each(function () {
				priceParams = jQuery(this).text();
				var prePrice = priceParams.split('-')[0];
				var postPrice = escape(priceParams.split('-')[1]);
				priceParams = "&price_from=" + prePrice + "&price_to=" + postPrice;
			})
			jQuery(this).find("a[href^='"+url+"']").each(function() {
		    	var priceUrl = new RegExp(priceParams, "g");
		    	this.href = this.href.replace(priceUrl, "");
		    });
		})
	}
}

Venda.Search.Feature.swatchHide = function() {};
Venda.Search.Feature.swatchHide.prototype = {
	display: function() {
    	jQuery(".prodsFiveColumns li").each(function () {    	
    		var n = jQuery(this).find(".sw_image").length;
    		if (n < 2) {
    			var swatchCont = jQuery(this).find(".swatchContainer");
    			jQuery(swatchCont).html("");
    			jQuery(swatchCont).hide();
    		}
    	});
    }
};

Venda.Search.Feature.swatchCase = function() {};
Venda.Search.Feature.swatchCase.prototype = {
	display: function() {
		jQuery(".prodsFiveColumns li").each(function () {  
    		var imageUrl = jQuery(this).find(".imageUrl").text(); 
    		jQuery(this).find(".sw_image span img").attr("src", function() {
	    		return imageUrl+this.name+'/'+this.name+'_'+this.title.toLowerCase()+'_sw.jpg'; 
	    	});
	    })
	}
};

Venda.Search.Feature.uiSelectmenu = function() {};
Venda.Search.Feature.uiSelectmenu.prototype = {
	display: function() {
		jQuery(".sort select").selectmenu({ style: 'dropdown' });
		jQuery(".sortby").click(function(){
			jQuery(".sort select").selectmenu({ style: 'dropdown' });
		});
		jQuery(".accordion_slice").each( function() {
			var facetLength = jQuery(this).find(".termtext").length;
			if (facetLength > 9) {
				jQuery(this).find(".viewScroll .collatedresult").css('height','210px');
			}
			else {
				jQuery(this).find(".viewScroll .collatedresult").css('height','auto');
			}
		})
		jQuery('.viewScroll').tinyscrollbar();
	}
};

Venda.Search.Feature.icxtHideRefine = function() {};
Venda.Search.Feature.icxtHideRefine.prototype= {
	display: function() {
		var icxthiderefine = jQuery('.icxthiderefine').text();
		var icxt1 = icxthiderefine.split(',')[0];
		var icxt2 = icxthiderefine.split(',')[1];
		var icxt3 = icxthiderefine.split(',')[2];
		var icxt4 = icxthiderefine.split(',')[3];
		var icxt5 = icxthiderefine.split(',')[4];
		var icxt6 = icxthiderefine.split(',')[5];
		var caticxt = [icxt1,icxt2,icxt3,icxt4,icxt5,icxt6];
		for (var i = 0; i < caticxt.length; i++) {
			jQuery('.accordion'+caticxt[i]).hide();
		}
	}
};

Venda.Search.Feature.refineColours = function() {};
Venda.Search.Feature.refineColours.prototype = {
	display: function() {
		var colourFacet = jQuery('.colourFacet').text();
		var lastColour = colourFacet.substring(colourFacet.lastIndexOf(",") + 1);
		jQuery(".swatchContainer").each(function() {
			jQuery(this).find("a").each( function() {
			var $this = jQuery(this);
				var sCol = $this.data("color");
				var pId = $this.find("img").attr("name");
				if (lastColour.indexOf(sCol) >=0) {
					$this.click();
					$this.prependTo("#swatch"+pId);
				}
			})
		})
 	}
};