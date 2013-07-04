/*
	please add these div's to the start of every
	lookbook to verify the names of each widget
	you wish to use:
	<div class="lookbook hide">Name of your lookbook</div>
	<div class="lazyImage hide">Class name of the images you want to lazyload</div>
	<div class="jsonUrl hide">/content/ebiz/urbanoutfitters/resources/json/'name of json'.json</div>
	<div class="sliderjsonUrl hide">/content/ebiz/urbanoutfitters/resources/json/your_json_name.json</div>
    
    * @author Jotis Moore <jmoore@urbanoutfitters.com>
*/
// declare namespace for lookbook widgets
Venda.namespace('Lookbook.Widgets');
Venda.Lookbook.Widgets = {
	defaults: {
		json: false,
		slideshow: false,
		lazyLoading: false,
		stickyNav: false,
		progressBar: false,
		parallax: false,
		navArrows: false
	},
	options: {
		vars: '',
		offset: '',
		offsetBottom: '',
		jsonUrl: jQuery('.jsonUrl').text(),
		lookbook: jQuery('.lookbook').text(),
		lazy: jQuery('.lazyImage').text(),
		sliderjson: jQuery('.sliderjsonUrl').text()
	},
	init: function (el) {
		Venda.Lookbook.Widgets.options.vars = jQuery.extend({}, Venda.Lookbook.Widgets.defaults, el);
		// Set offset top and bottom of contents to be used later on in the script
		Venda.Lookbook.Widgets.options.offset = jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'Contents').offset();
		Venda.Lookbook.Widgets.options.offsetBottom = jQuery(document).outerHeight() - (Venda.Lookbook.Widgets.options.offset.top + jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'Contents').outerHeight());
		// determine if content is loaded through a json
		// if no - call the other functions
		if (Venda.Lookbook.Widgets.options.vars.json) {
			Venda.Lookbook.Widgets.jsonLoad();
		}
		if (Venda.Lookbook.Widgets.options.vars.slideshow) {
			Venda.Lookbook.Widgets.sliderjsonLoad();
		}
		if (!Venda.Lookbook.Widgets.options.vars.slideshow && !Venda.Lookbook.Widgets.options.vars.json) {
			Venda.Lookbook.Widgets.lazyloading();
			Venda.Lookbook.Widgets.stickyScroller();
			Venda.Lookbook.Widgets.parallax();
			Venda.Lookbook.Widgets.scrollToPoint();
		}
	},
	// json load ajax - load in content asynchronously through ajax
	jsonLoad: function () {
		// grab json url from hidden div at top of lookbook page and execute
		jQuery.ajax({
			type: 'GET',
			url: Venda.Lookbook.Widgets.options.jsonUrl,
			dataType: 'json',
			cache: true,
			success: function (data) {
				// on success populate content into variable h
				var h = "";
				for (var i = 0; i < data.digibook.length; i++) {
					h += '<div class="' + Venda.Lookbook.Widgets.options.lookbook + 'Row">'
					for (var r = 0; r < data.digibook[i].row.length; r++) {
						for (var s = 0; s < data.digibook[i].row[r].slides.length; s++) {
							h += '<div class="section ' + data.digibook[i].row[r].slides[s].spread + '">';
							h += '<img src="/content/ebiz/urbanoutfitters/resources/images/spring-lookbook/lazyLoader.png" data-original="' + data.digibook[i].row[r].slides[s].image + '" class="uo-loading ' + Venda.Lookbook.Widgets.options.lazy + '" onmouseover="_gaq.push([\'_trackEvent\', \'' + Venda.Lookbook.Widgets.options.lookbook + '\', \'Row Number ' + data.digibook[i].row[r].slides[s].number + '\', \'UO_' + data.digibook[i].row[r].slides[s].image.split("_").pop() + '\']);" />';
							for (var hs = 0; hs < data.digibook[i].row[r].slides[s].hotspots.length; hs++) {
								h += '<a href="/invt/' + data.digibook[i].row[r].slides[s].hotspots[hs].sku + '/&temp=quickLook&layout=noheaders" ' + 'class="uo-hotspot lookbookQuick" style="left: ' + data.digibook[i].row[r].slides[s].hotspots[hs].xcord + 'px; top: ' + data.digibook[i].row[r].slides[s].hotspots[hs].ycord + 'px;" onmouseover="_gaq.push([\'_trackEvent\', \'' + Venda.Lookbook.Widgets.options.lookbook + '\', \'UO_' + data.digibook[i].row[r].slides[s].image.split("_").pop() + '\', \'' + data.digibook[i].row[r].slides[s].hotspots[hs].sku + '\']);"></a>';
							};
							h += '<p class="' + Venda.Lookbook.Widgets.options.lookbook + 'SectionText">' + data.digibook[i].row[r].slides[s].text + '</p>';
							h += '</div>';
						}
					}
					h += '</div>';
				}
				// load content into <div class="yourlookbookContents">
				jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'Contents').html(h + '<div class="' + Venda.Lookbook.Widgets.options.lookbook + 'Row last"></div>');
				// once loaded call the other lookbook functions
				Venda.Lookbook.Widgets.lazyloading();
				Venda.Lookbook.Widgets.stickyScroller();
				Venda.Lookbook.Widgets.parallax();
				Venda.Lookbook.Widgets.scrollToPoint();
			}
		});
	},
	sliderjsonLoad: function () {
		// grab json url from hidden div at top of lookbook page and execute
		jQuery.ajax({
			type: 'GET',
			url: Venda.Lookbook.Widgets.options.sliderjson,
			dataType: 'json',
			cache: true,
			success: function (data) {
				var html = '';
				// on success populate content into variable h
				jQuery.each(data.lookbook.pages, function (index, value) {
					html += '<li><img src="' + value.image + '" />';
					for (var i = 0; i < value.hotspots.length; i++) {
						html += '<a href="/invt/' + value.hotspots[i].sku + '/&temp=quickLook&layout=noheaders" ' + 'class="uo-hotspot lookbookQuick" style="left: ' + value.hotspots[i].xcord + 'px; top: ' + value.hotspots[i].ycord + 'px;"></a>';
					};
					html += '</li>';
				});
				jQuery('.flexslider .slides').html(html);
				// once loaded call the other lookbook functions
				jQuery('.flexslider').flexslider({
					animation: "slide",
					slideshow: true,
					start: function (slider) {
						var flexNav = jQuery(".flex-control-nav li a");
						for (var i in data.lookbook.pages) {
							jQuery(flexNav[i - 1]).css('background-image', 'url(' + data.lookbook.pages[i].thumbnail + ')');
						}
					}
				});
			}
		})
	},
	lazyloading: function () {
		// if lazy loading on images has been requested
		if (Venda.Lookbook.Widgets.options.vars.lazyLoading) {
			jQuery('img.' + Venda.Lookbook.Widgets.options.lazy).lazyload({
				effect: "fadeIn"
			})
		}
	},
	stickyScroller: function () {
		// determine if sticky scroller has been requested
		if (Venda.Lookbook.Widgets.options.vars.stickyNav) {
			var hh = jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'Contents').offset().top,
				dh = jQuery(document).outerHeight();
			// set sticky scroller top position
			jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'controlBox, .' + Venda.Lookbook.Widgets.options.lookbook + 'Sticky').css("top", hh);
			// determine top and bottom parameters for sticky scroller
			jQuery(window).bind('scroll', function () {
				var c = jQuery(window).scrollTop(),
					a = jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'Sticky').outerHeight(),
					d = jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'Contents').outerHeight();
				if (c > hh) {
					jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'controlBox, .' + Venda.Lookbook.Widgets.options.lookbook + 'Sticky').css("top", 0 + "px");
					jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'controlBox, .' + Venda.Lookbook.Widgets.options.lookbook + 'Sticky').addClass("fixMe");
				}
				if (c < hh) {
					jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'controlBox, .' + Venda.Lookbook.Widgets.options.lookbook + 'Sticky').css("top", hh + "px");
					jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'controlBox, .' + Venda.Lookbook.Widgets.options.lookbook + 'Sticky').removeClass("fixMe");
				}
				if (c > d + Venda.Lookbook.Widgets.options.offset.top - a) {
					jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'controlBox, .' + Venda.Lookbook.Widgets.options.lookbook + 'Sticky').removeClass("fixMe");
					jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'controlBox, .' + Venda.Lookbook.Widgets.options.lookbook + 'Sticky').css("top", d + Venda.digibook.options.o.top - a + "px");
				}
				// initiate load progress bar
				if (Venda.Lookbook.Widgets.options.vars.progressBar) {
					Venda.Lookbook.Widgets.loadMeUp();
				}
			});
		}
	},
	loadMeUp: function () {
		// load progress percentage bar
		var c = jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'controlBox').offset(),
			d = jQuery(window).outerHeight(),
			e = Venda.Lookbook.Widgets.options.offset.top + Venda.Lookbook.Widgets.options.offsetBottom,
			a = jQuery(document).outerHeight() - (d + Venda.Lookbook.Widgets.options.offsetBottom),
			b = Math.round((c.top - e) / (a - e) * 100);
		jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'controlBox .loadProgress').css("height", b + "%");
	},
	parallax: function () {
		// determine if parallax is required
		if (Venda.Lookbook.Widgets.options.vars.parallax) {
			// set parallax ratios
			var p = this;
			p.h = 400;
			p.l = [{
				id: 'layerA',
				ratio: 0.75
			}, {
				id: 'layerC',
				ratio: 1.25
			}];
			p.c = jQuery('#layerB .p').length;
			p.s = false;
			p.pH = 0;
			p.oC = jQuery('#oC');
			this.crunchWinVars = function () {
				p.winWd = jQuery(window).height();
				p.winHoriSp2Panel = Math.floor((p.winWd - p.h) / 2);
				jQuery('#layerSling').offset({
					top: '50px'
				});
				p.oC.height(p.c * p.h);
			};
			this.init = function () {
				jQuery('#layerB').height(p.c * p.h);
				for (var ih = 0; ih < p.l.length; ih++) {
					p.l[ih].ref = jQuery('#' + p.l[ih].id);
					jQuery(p.l[ih].ref).height(Math.ceil(p.c * p.h * p.l[ih].ratio));
					jQuery('#' + p.l[ih].id + ' .p').height(Math.round(p.h * p.l[ih].ratio));
					p.parallax(p.l[ih].ref, p.l[ih].ratio);
				}
			};
			this.parallax = function (containerRef, ratio) {
				containerRef.css({
					top: (1 - ratio) * (p.h / 2 + jQuery(window).scrollTop()) + 'px'
				});
			}
			p.crunchWinVars();
			p.init();
			this.panelControl = function () {
				jQuery('#panelControl a').click(function (elevator) {
					elevator.preventDefault();
					p.correctScroll(jQuery(this).attr('href'));
				});
			}
			this.correctScroll = function (hash, duration) {
				if (duration === undefined) var duration = 8345;
				if (jQuery(window).scrollLeft()) jQuery.scrollTo(hash, {
					'axis': 'x',
					'queue': true,
					'duration': Math.floor(jQuery(window).scrollLeft() * 3 / 2 + 200),
					'offset': {
						'left': -90
					}
				});
				jQuery.scrollTo(hash, {
					'axis': 'y',
					'queue': true,
					'duration': duration,
					'offset': {
						'top': -p.winHoriSp2Panel
					},
					'easing': 'easeInOutSine'
				});
			}
			p.panelControl();
			jQuery(window).resize(function () {
				p.crunchWinVars();
			});
			jQuery(window).scroll(function () {
				p.s = true;
			});
			setInterval(function () {
				if (p.s) {
					p.s = false;
					for (var ih = 0; ih < p.l.length; ih++) {
						p.parallax(p.l[ih].ref, p.l[ih].ratio);
					}
				}
			}, 30);
		}
	},
	scrollToAnchor: function (a) {
		if (a !== undefined) {
			jQuery(window).scrollTo(a, 800, {
				margin: true,
				offset: {
					top: +5
				}
			})
		}
	},
	scrollToPoint: function () {
		if (Venda.Lookbook.Widgets.options.vars.navArrows) {
			// set variables for clickable events
			var b = jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'Row'),
				t = b.length - 1,
				a = 0,
				d = jQuery(".anchorLink-next"),
				e = jQuery(".anchorLink-prev"),
				f = jQuery(".toTop");
			d.click(function (g) {
				Venda.Lookbook.Widgets.scrollToAnchor(b[a])
			});
			e.click(function (g) {
				Venda.Lookbook.Widgets.scrollToAnchor(b[a - 2])
			});
			f.click(function (g) {
				Venda.Lookbook.Widgets.scrollToAnchor(b[0])
			});
			var c = 0;
			// define position of page in relation to lookbook contents
			jQuery(window).scroll(function (k) {
				var i = jQuery(this).scrollTop(),
					h = jQuery(window).scrollTop() - Venda.Lookbook.Widgets.options.offset.top,
					l = jQuery(b[a]).offset(),
					j = l.top - Venda.Lookbook.Widgets.options.offset.top,
					g = jQuery('.' + Venda.Lookbook.Widgets.options.lookbook + 'Contents').outerHeight() / t;
				if (i > c) {
					if (h >= j) {
						b[a += 1]
					}
				} else {
					if (a !== 0) {
						if (h <= (j - g)) {
							b[a -= 1]
						}
					}
				}
				c = i
			})
		}
	},
	anchorScroll: function (a) {
		jQuery('body').animate({
			scrollTop: jQuery(jQuery.attr(a, 'href')).offset().top
		}, 'slow');
		return false;
	},
	socialWindow: function (e, d, b, c, a) {
		// enable social buttons to load in a new small window
		var w = null;
		l = (screen.width) ? (screen.width - b) / 2 : 0;
		t = (screen.height) ? (screen.height - c) / 2 : 0;
		s = "height=" + c + ",width=" + b + ",top=" + t + ",left=" + l + ",scrollbars=" + a + ",resizable";
		w = window.open(e, d, s)
	}
}