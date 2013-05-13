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
    this.features.push('priceSlider', 'viewMoreLess','indicateLoading','hideLoading','viewStyleSwitcher','colorSwatch','perLine','searchAccordion','swatches','swatchHide','uiSelectmenu','removePrice','icxtHideRefine','removeRefine','currencyConvert');
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
        jQuery('#content-search').delegate('#collate a.updatesearch, #term a.removesearch, #collate a.removesearch', 'click',  refine);
        jQuery('#content-search').delegate('#collate input:checkbox', 'change', refine);

        // Pagination links & dropdown
        var pagination = this.getNavHandler({ pagination: true });
        var pagnlinks = jQuery('#content-search .pagn a').not(".viewProduct");
        jQuery('#content-search').delegate('#content-search .pagnContents a.updatesearch', 'click',  pagination);
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

Venda.Search.Feature.multiRefine = function() {};
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
};

Venda.Search.Feature.indicateLoading = function() {};
Venda.Search.Feature.indicateLoading.prototype = {
    clickHandler: function(evt) {
    	jQuery("#quickBuy").dialog("destroy");
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

Venda.Search.Feature.filterRefinements = function() {};
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
};

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
* Search perLine '3 or 5 products'
* can be pre selected in the VCP or selected using paginator buttons
* @author Jotis Moore <jmoore@urbanoutfitters.com>
**/
Venda.Search.Feature.perLine = function() {
	var $swatchIcon,
		$swatchContainer,
		$three,
		$five,
		$UOexcl,
		$quickBuy,
		$prodImages,
		$swatchImages,
		prodColumn,
		icxtFive;
};
Venda.Search.Feature.perLine.prototype = {
	threePerLine: function() {
		jQuery($quickBuy).each( function() {
			jQuery(this).addClass("qb-large").removeClass("qb-small");
		})
		$swatchIcon.add($three).hide();
		$swatchContainer.add($five).add($UOexcl).show();
		jQuery(prodColumn).css('width','33%');
	},
	threePerLineImg: function() {
		jQuery($prodImages).each(function () {
    		var ImageSrc = jQuery(this).attr("src").replace('_sm1.jpg','_ca1.jpg');
    		jQuery(this).attr("src",ImageSrc);
    	})
    	jQuery($swatchImages).each(function () {
    		var SetImageSrc = jQuery(this).data("setimage").replace('_sm1.jpg','_ca1.jpg');
    		jQuery(this).data("setimage",SetImageSrc);
    	});
        jQuery($prodImages).css({width:'244px',height:'366px'});
	},
	threeClick: function() {
		var href = jQuery('.threePerLineLink').attr('href');
    	if (document.location.href.indexOf('perline=5') > -1 ) {
    		var newHref = href.replace('perline=5', 'perline=3');
    		jQuery('.threePerLineLink').attr('href', newHref);
    	}
    	else {
        	jQuery('.threePerLineLink').attr('href', href + '&perline=3');
        }
        return true;
	},
	fivePerLine: function() {
		jQuery($quickBuy).each( function() {
			jQuery(this).removeClass("qb-large").addClass("qb-small");
		})
		$swatchIcon.add($three).show();
		$swatchContainer.add($five).add($UOexcl).hide();
		jQuery(prodColumn).css('width','19.5%');
	},
	fivePerLineImg: function() {
		jQuery($prodImages).each(function () {
    		var ImageSrc = jQuery(this).attr("src").replace('_ca1.jpg','_sm1.jpg');
    		jQuery(this).attr("src",ImageSrc);
    	})
    	jQuery($swatchImages).each(function () {
    		var SetImageSrc = jQuery(this).data("setimage").replace('_ca1.jpg','_sm1.jpg');
    		jQuery(this).data("setimage",SetImageSrc);
    	});
        jQuery($prodImages).css({width:'142px',height:'213px'});
	},
	fiveClick: function() {
		var href = jQuery('.fivePerLineLink').attr('href');
    	if (document.location.href.indexOf('perline=3') > -1 ) {
    		var newHref = href.replace('perline=3', 'perline=5');
    		jQuery('.fivePerLineLink').attr('href', newHref);
    	}
    	else {
        	jQuery('.fivePerLineLink').attr('href', href + '&perline=5');
        }
        return true;
	},
	display: function() {
		$swatchIcon = jQuery(".swatchIcon"),
		$swatchContainer = jQuery(".swatchContainer"),
		$three = jQuery(".threePerLine"),
		$five = jQuery(".fivePerLine"),
		$UOexcl = jQuery(".onlineExLogo-underlay"),
		$quickBuy = jQuery(".quickLinkBox"),
		$prodImages = jQuery("a.moredetail img"),
		$swatchImages = jQuery(".sw_image"),
		prodColumn = jQuery(".prodsFiveColumns li"),
		icxtFive = jQuery(".icxt5perline").text();
		jQuery('.threePerLineLink').on("click", jQuery.proxy(this, 'threeClick'))
		jQuery('.fivePerLineLink').on("click", jQuery.proxy(this, 'fiveClick'))
		if (document.location.href.indexOf('&perline=3') > -1 ) {
			this.threePerLine();
			this.threePerLineImg();
		}
		if (document.location.href.indexOf('&perline=5') > -1 || (document.location.href.indexOf('&perline=3') < 0 && icxtFive === "1")) {
			this.fivePerLine();
			this.fivePerLineImg();
		}
	}
};

/**
* Swatch functionality 
* Swatch building creates the url link for the swatch image
* Plus removes swatches depending on amount
* Plus display swatch paginator if more than 8 swatches
* Swatch Paginator functionality
* Colour refine determines the att1 value of a swatch
* based on the att3 selection then selects it
* @author Jotis Moore <jmoore@urbanoutfitters.com>
**/
Venda.Search.Feature.swatches = function() {};
Venda.Search.Feature.swatches.prototype = {
	display: function () {
		this.swatchBuilding();
		this.swatchPaginator();
		this.colourRefine();
	}, swatchBuilding: function() {
		jQuery(".prodsFiveColumns li").each(function () {
			var t = jQuery(this).find(".swatchContainer"),
				c = jQuery(this).find(".swatchIcon"),
				u = jQuery(this).find(".imageUrl").text(),
				b = t.find('.swatchImage img.swatch'),
				d = t.find('.arrowDown');
	    	if (b.length < 2) {
		    	t.empty().hide();
		    	c.hide();
	    	}
	    	if (b.length > 1) {
		    	b.attr("src", function() {
	    			return u+this.name+'/'+this.name+'_'+this.title.toLowerCase()+'_sw.jpg'; 
	    		}).error(function () {
	    			jQuery(this).parents('a.sw_image').remove();
	    		})
	    	}
	    	if ((b.length - 8) < 9) {
		    	d.hide();
	    	}
	    })
	}, swatchPaginator: function () {
    	jQuery(".swatchContainer").each(function () {
    		var t = jQuery(this),
				f = t.find('.swatchLayer'),
				a = 0,
				d = t.find('.arrowDown'),
				e = t.find('.arrowUp').hide();
    		function scrollToSwatch(s) {
		    	jQuery(f).scrollTo(s, 200, {
			    	margin: true
			    })
			}
			d.click(function (g) {
				var b = t.find('.swatchImage img.swatch');
            	e.show();
            	scrollToSwatch(b[a += 1]);
            	if (a === b.length - 8) {
	            	d.hide();
	            }
	        });
	        e.click(function (g) {
	        	var b = t.find('.swatchImage img.swatch');
            	d.show();
            	scrollToSwatch(b[a -= 1]);
            	if (a === 0) {
	            	e.hide();
	            }
	        })
	    })
    }, colourRefine: function () {
    	var a = jQuery(".colourFacet ul > li"),
        	c = jQuery(".colourFacet ul > li:last").text(),
        	b = [];
        a.each(function () {
        	b.push(jQuery(this).text())
        });
        b.reverse();
        jQuery(".prodsFiveColumns li").each(function () {
        	var l = jQuery(this).find(".swatchContainer"),
            	o = l.find("a"),
            	n = jQuery(this).find(".att3value").text().split(","),
            	h = jQuery(this).find(".productSku").text(),
            	d = [];
            jQuery.each(n, function (j, i) {
            	if (jQuery.inArray(i, d) === -1) {
                	d.push(i)
                }
            });
            d = jQuery.map(d, jQuery.trim);
            var g, f, m = [];
            assignSwatch = function () {
            	var i = [];
            	l.find("a").each(function () {
                	i.push(jQuery(this).data("color"))
                });
                for (f = 0; f < m.length; f++) {
                	if (i.indexOf(m[f]) >= 0) {
                    	l.find("a." + m[f]).click().prependTo("#swatch" + h);
                    	return false
                    }
                }
            };
            for (var e = 0; e < b.length; e++) {
            	for (g = 0; g < d.length; g++) {
                	attribute3val = jQuery.trim(d[g].split("=")[0]);
                	if (b.indexOf(attribute3val) === e) {
                    	m.push(jQuery.trim(escape(d[g].split("=")[1])))
                    }
                }
            }
            assignSwatch();
        })
    }
}

Venda.Search.Feature.searchAccordion = function() {};
Venda.Search.Feature.searchAccordion.prototype = {
    display: function() {
    	jQuery(".accordion_slice").each(function (c) {
        	var b = "";
        	jQuery(this).find(".vendaField").each(function (f) {
	        	b = jQuery(this).text();
	        });
	        var fa = "";
	        jQuery('#'+b).click(function() {
		        jQuery('#'+b+'results').slideToggle('slow');	    
		        jQuery('#'+b+'icon').toggleClass('iconMinus');
		    });
		    if (jQuery(this).find("div.chosen").length > 0) {
		    	jQuery(".clear"+b).show();
		    	jQuery(".clear-"+b).show();
		    }
		    jQuery(function(){
		    	jQuery(this).find(".vendasearchURL").each(function (d) {
	        		url = jQuery(this).text();
	        	});
	        	jQuery(".clear-price a[href^='"+url+"']").each(function() {
			    	var reP = new RegExp('\&price_from='+'([^&]*)'+'\&price_to='+'([^&]*)', "g");
			    	this.href = this.href.replace(reP, "");
			    })
		        jQuery(".clear"+b+" a[href^='"+url+"']").each(function() {
		        	var re = new RegExp('\&'+b+'='+'([^&]*)', "g");
		        	this.href = this.href.replace(re, "");
		        })
			})
			jQuery(this).find(".facet").each(function () {
				var facet = jQuery(this);
				var count = jQuery(this).find(".count").text();
				if (facet.text().indexOf("ALL") >=0) {
					facet.html("One Size <span class='count'>"+count+"</span>");
				}
			})
		})
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
    		var mainImg = jQuery(this).find("a.moredetail img"),
    			mediumImgKey = jQuery(this).find(".mediumImgKey").text().replace('_m1.jpg','_l1.jpg');;
    		mainImg.error(function () {
	    		jQuery(this).unbind("error").attr("src", mediumImgKey);
	    	});
    	})
    }
};

Venda.Search.Feature.uiSelectmenu = function() {};
Venda.Search.Feature.uiSelectmenu.prototype = {
	display: function() {
		jQuery(".sort select").selectmenu({ style:'dropdown', maxHeight: 2000, positionOptions: { collision: 'none' } });
		jQuery(".sortby").click(function(){
			jQuery(".sort select").selectmenu({ style:'dropdown', maxHeight: 2000, positionOptions: { collision: 'none' } });
		});
		jQuery(".accordion_slice").each( function() {
			jQuery(this).find(".viewScroll .collatedresult").css('height','auto');
			var collateHeight = jQuery(this).find(".viewScroll .collatedresult").height(),
				facetLength = jQuery(this).find(".termtext").length;
			if (facetLength > 10) {
				jQuery(this).find(".viewScroll .collatedresult").css('height','207px');
				jQuery(this).find(".scrollerTrack").show();
			}
			else {
				jQuery(this).find(".viewScroll .collatedresult").css('height', collateHeight);
				jQuery(this).find(".scrollerTrack").hide();
			}
		})
		//jQuery('.viewScroll').tinyscrollbar();
		jQuery('.collatedresult').alternateScroll({ 'vertical-bar-class': 'styled-v-bar', 'hide-bars': false });
	}
};

Venda.Search.Feature.icxtHideRefine = function() {};
Venda.Search.Feature.icxtHideRefine.prototype= {
	display: function() {
		var icxthiderefine = jQuery('.icxthiderefine').text(),
			icxt = icxthiderefine.split(' ');
		for (var i = 0; i < icxt.length; i++) {
			jQuery('.accordion'+icxt[i]).hide();
		}
	}
};

Venda.Search.Feature.removeRefine = function() {};
Venda.Search.Feature.removeRefine.prototype = {
	display: function() {
		var catRef = jQuery("#parentCatRef").text();
		if (catRef == "valentine13") {
			jQuery(".leftSidebar,.pagnContents,.boxSearchAlt").hide();
			jQuery(".prodsFiveColumns a.moredetail img").css({'width':'236px','height':'354px','margin-bottom':'2px'});
			jQuery(".prodsFiveColumns li").css('width','235px');
			jQuery("#searchResults").toggleClass("grid_19 push_5").toggleClass("grid_24 pull_0 alpha").css('width','952px');
			jQuery(".leftSidebar").toggleClass("grid_5 pull_19").toggleClass("grid_0 pull_24");
			//jQuery(".prodsFiveColumns .productlistinfo").hide();
			jQuery(".qb-large").css('width','234px');
		};
	}
};
Venda.Search.Feature.currencyConvert = function() {};
Venda.Search.Feature.currencyConvert.prototype = {
  display: function() {
    jQuery('.price, #updateTotal, .pounds, .baskettotals .totalprice, .subtotal div, .orscTotalFig').pennies('convert',{to: jQuery('.price').pennies('get')});	
  }
};