Venda.namespace('digibook');
Venda.digibook = {
    options: {
        o: '',
        oB: '',
        d: 'digibook',
        jn: '../content/ebiz/urbanoutfitters/resources/json/digibookSS13.json?v=6'
    },
    init: function () {
        Venda.digibook.options.o = jQuery('.' + Venda.digibook.options.d + 'Contents').offset();
        Venda.digibook.options.oB = jQuery(document).outerHeight() - (Venda.digibook.options.o.top + jQuery('.' + Venda.digibook.options.d + 'Contents').outerHeight());
        Venda.digibook.jsonLoad();
    },
    jsonLoad: function () {
        jQuery.ajax({
            type: 'GET',
            url: Venda.digibook.options.jn,
            dataType: 'json',
            cache: true,
            success: function (data) {
                var h = "";
                for (var i = 0; i < data.digibook.slides.length; i++) {
                    h += '<div class="section ' + data.digibook.slides[i].spread + '">';
                    h += '<img src="/content/ebiz/urbanoutfitters/resources/images/spring-lookbook/lazyLoader.png" data-original="' + data.digibook.slides[i].image + '" class="uo-loading lazy" />';
                    for (var hs = 0; hs < data.digibook.slides[i].hotspots.length; hs++) {
                        h += '<a href="/invt/' + data.digibook.slides[i].hotspots[hs].sku + '/&temp=quickLook&layout=noheaders" ' + 'class="uo-hotspot lookbookQuick" style="left: ' + data.digibook.slides[i].hotspots[hs].xcord + 'px; top: ' + data.digibook.slides[i].hotspots[hs].ycord + 'px;"></a>';
                    };
                    h += '<p class="digibookSectionText">' + data.digibook.slides[i].text + '</p>';
                    h += '</div>';
                }
                jQuery('.' + Venda.digibook.options.d + 'Contents').html(h);
                Venda.digibook.lazyload();
                Venda.digibook.stickyScroller();
                Venda.digibook.parallax.p = new Venda.digibook.parallax();
            }
        });
    },
    lazyload: function () {
        jQuery(".section img.lazy").lazyload({
            effect: "fadeIn"
        })
    },
    stickyScroller: function() {
        var hh = jQuery('.' + Venda.digibook.options.d + 'Contents').offset().top,
            dh = jQuery(document).outerHeight();
        jQuery('.' + Venda.digibook.options.d + 'controlBox, .' + Venda.digibook.options.d + 'Sticky').css("top", hh);
        jQuery(window).bind('scroll', function () {
            var c = jQuery(window).scrollTop(),
                a = jQuery('.' + Venda.digibook.options.d + 'Sticky').outerHeight();
            if (c > hh) {
                jQuery('.' + Venda.digibook.options.d + 'controlBox, .' + Venda.digibook.options.d + 'Sticky').css("top", 0 + "px");
                jQuery('.' + Venda.digibook.options.d + 'controlBox, .' + Venda.digibook.options.d + 'Sticky').addClass("fixMe");
            }
            if (c < hh) {
                jQuery('.' + Venda.digibook.options.d + 'controlBox, .' + Venda.digibook.options.d + 'Sticky').css("top", hh + "px");
                jQuery('.' + Venda.digibook.options.d + 'controlBox, .' + Venda.digibook.options.d + 'Sticky').removeClass("fixMe");
            }
            if (c > dh - Venda.digibook.options.oB - a) {
                jQuery('.' + Venda.digibook.options.d + 'controlBox, .' + Venda.digibook.options.d + 'Sticky').removeClass("fixMe");
                jQuery('.' + Venda.digibook.options.d + 'controlBox, .' + Venda.digibook.options.d + 'Sticky').css("top", dh - Venda.digibook.options.oB - a + "px");
            }
        Venda.digibook.loadMeUp();
        });
    },
    loadMeUp: function () {
        var c = jQuery('.' + Venda.digibook.options.d + 'controlBox').offset(),
            d = jQuery(window).outerHeight(),
            e = jQuery('.' + Venda.digibook.options.d + 'Contents').offset().top,
            a = jQuery(document).outerHeight(),
            b = Math.round((c.top) / (a) * 100);
        if (b < 1) {
            b = 0;
        }
        if (b > 99) {
            b = 100;
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
    }
}