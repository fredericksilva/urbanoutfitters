Venda.namespace('digibook');
Venda.digibook = {
    options: {
        o: '',
        oB: '',
        d: 'digibook',
        js: jQuery('.jsonUrl').text()
    },
    init: function () {
        Venda.digibook.options.o = jQuery('.' + Venda.digibook.options.d + 'Contents').offset();
        Venda.digibook.options.oB = jQuery(document).outerHeight() - (Venda.digibook.options.o.top + jQuery('.' + Venda.digibook.options.d + 'Contents').outerHeight());
        Venda.digibook.jsonLoad();
    },
    jsonLoad: function () {
        jQuery.ajax({
            type: 'GET',
            url: Venda.digibook.options.js,
            dataType: 'json',
            cache: true,
            success: function (data) {
                var h = "";
                for (var i = 0; i < data.digibook.length; i++) {
                    h += '<div class="' + Venda.digibook.options.d + 'Row">'
                    for (var r = 0; r < data.digibook[i].row.length; r++) {
                        for (var s = 0; s < data.digibook[i].row[r].slides.length; s++) {
                            h += '<div class="section ' + data.digibook[i].row[r].slides[s].spread + '">';
                            h += '<img src="/content/ebiz/urbanoutfitters/resources/images/spring-lookbook/lazyLoader.png" data-original="' + data.digibook[i].row[r].slides[s].image + '" class="uo-loading lazy" onmouseover="_gaq.push([\'_trackEvent\', \'Digibook May\', \'Row Number ' + data.digibook[i].row[r].slides[s].number + '\', \'UO_' + data.digibook[i].row[r].slides[s].image.split("_").pop() + '\']);" />';
                            for (var hs = 0; hs < data.digibook[i].row[r].slides[s].hotspots.length; hs++) {
                                h += '<a href="/invt/' + data.digibook[i].row[r].slides[s].hotspots[hs].sku + '/&temp=quickLook&layout=noheaders" ' + 'class="uo-hotspot lookbookQuick" style="left: ' + data.digibook[i].row[r].slides[s].hotspots[hs].xcord + 'px; top: ' + data.digibook[i].row[r].slides[s].hotspots[hs].ycord + 'px;" onmouseover="_gaq.push([\'_trackEvent\', \'Digibook May\', \'UO_' + data.digibook[i].row[r].slides[s].image.split("_").pop() + '\', \'' + data.digibook[i].row[r].slides[s].hotspots[hs].sku + '\']);"></a>';
                            };
                            h += '<p class="' + Venda.digibook.options.d + 'SectionText">' + data.digibook[i].row[r].slides[s].text + '</p>';
                            h += '</div>';
                        }
                    }
                }
                jQuery('.' + Venda.digibook.options.d + 'Contents').html(h + '<div class="' + Venda.digibook.options.d + 'Row last"></div>');
                Venda.digibook.lazyload();
                Venda.digibook.stickyHola();
                Venda.digibook.stickyScroller();
                Venda.digibook.scrollToPoint();
                Venda.digibook.parallax.p = new Venda.digibook.parallax();
            }
        });
    },
    lazyload: function () {
        jQuery(".section img.lazy").lazyload({
            effect: "fadeIn"
        })
    },
    stickyHola: function () {
	    jQuery(window).bind('scroll', function () {
	    	var s = jQuery(window).scrollTop(),
	    		w = (jQuery(window).outerHeight() / 2) - 147,
	    		o = 495 - w;
	    	if (s > o) {
		    	jQuery('.' + Venda.digibook.options.d + 'StickySign').css({ 'top' : '50%','margin' : '-147px 0 0 -122px', 'position' : 'fixed' })
	    	}
	    	if (s < o) {
		    	jQuery('.' + Venda.digibook.options.d + 'StickySign').css({ 'top' : '495px','margin' : '0 0 0 -122px', 'position' : 'absolute' })
	    	}
	    });
    },
    stickyScroller: function () {
        var hh = jQuery('.' + Venda.digibook.options.d + 'Contents').offset().top,
            dh = jQuery(document).outerHeight();
        jQuery('.' + Venda.digibook.options.d + 'controlBox, .' + Venda.digibook.options.d + 'Sticky').css("top", hh);
        jQuery(window).bind('scroll', function () {
            var c = jQuery(window).scrollTop(),
                a = jQuery('.' + Venda.digibook.options.d + 'Sticky').outerHeight(),
                d = jQuery('.' + Venda.digibook.options.d + 'Contents').outerHeight();
            if (c > hh) {
                jQuery('.' + Venda.digibook.options.d + 'controlBox, .' + Venda.digibook.options.d + 'Sticky').css("top", 0 + "px");
                jQuery('.' + Venda.digibook.options.d + 'controlBox, .' + Venda.digibook.options.d + 'Sticky').addClass("fixMe");
            }
            if (c < hh) {
                jQuery('.' + Venda.digibook.options.d + 'controlBox, .' + Venda.digibook.options.d + 'Sticky').css("top", hh + "px");
                jQuery('.' + Venda.digibook.options.d + 'controlBox, .' + Venda.digibook.options.d + 'Sticky').removeClass("fixMe");
            }
            if (c > d + Venda.digibook.options.o.top - a) {
                jQuery('.' + Venda.digibook.options.d + 'controlBox, .' + Venda.digibook.options.d + 'Sticky').removeClass("fixMe");
                jQuery('.' + Venda.digibook.options.d + 'controlBox, .' + Venda.digibook.options.d + 'Sticky').css("top", d + Venda.digibook.options.o.top - a + "px");
            }
            Venda.digibook.loadMeUp();
        });
    },
    loadMeUp: function () {
        var c = jQuery('.' + Venda.digibook.options.d + 'controlBox').offset(),
            d = jQuery(window).outerHeight(),
            e = Venda.digibook.options.o.top + Venda.digibook.options.oB,
            a = jQuery(document).outerHeight() - (d + Venda.digibook.options.oB),
            b = Math.round((c.top - e) / (a - e) * 200);
        if (b < 10) {
            b = 10;
        }
        jQuery('.' + Venda.digibook.options.d + 'controlBox .loadProgress').css("height", b + "%");
    },
    parallax: function () {
        var p = this;
        p.h = 400;
        p.l = [{
                id: 'layerA',
                ratio: 0.75
            }, {
                id: 'layerC',
                ratio: 1.25
            }
        ];
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
        var b = jQuery('.' + Venda.digibook.options.d + 'Row'),
            t = b.length - 1,
            a = 0,
            d = jQuery(".anchorLink-next"),
            e = jQuery(".anchorLink-prev"),
            f = jQuery(".toTop");
        d.click(function (g) {
            Venda.digibook.scrollToAnchor(b[a])
        });
        e.click(function (g) {
            Venda.digibook.scrollToAnchor(b[a - 2])
        });
        f.click(function (g) {
            Venda.digibook.scrollToAnchor(b[0])
        });
        var c = 0;
        jQuery(window).scroll(function (k) {
            var i = jQuery(this).scrollTop(),
                h = jQuery(window).scrollTop() - Venda.digibook.options.o.top,
                l = jQuery(b[a]).offset(),
                j = l.top - Venda.digibook.options.o.top,
                g = jQuery('.' + Venda.digibook.options.d + 'Contents').outerHeight() / t;

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
    },
    socialWindow: function (e, d, b, c, a) {
        var w = null;
        l = (screen.width) ? (screen.width - b) / 2 : 0;
        t = (screen.height) ? (screen.height - c) / 2 : 0;
        s = "height=" + c + ",width=" + b + ",top=" + t + ",left=" + l + ",scrollbars=" + a + ",resizable";
        w = window.open(e, d, s)
    }
}