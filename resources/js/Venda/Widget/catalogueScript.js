var offset = jQuery(".gameContents").offset(),
    offsetBottom = jQuery(document).outerHeight() - (offset.top + jQuery(".gameContents").outerHeight()),
    superScrolling = {
        options: {
            $headerHeight: offset.top,
            $footerHeight: offsetBottom,
            $controlHeight: jQuery(".gameSticky").outerHeight(),
            $docHeight: jQuery(document).outerHeight(),
            $currentPage: "." + jQuery(".gameContents").attr("id"),
            topPad: offset.top,
            demoBar: jQuery(".demo").outerHeight()
        },
        init: function () {
            this.stickyScroller()
        },
        stickyScroller: function () {
            jQuery(".controlBox, .gameSticky").css("top", superScrolling.options.topPad - superScrolling.options.demoBar);
            jQuery(superScrolling.options.$currentPage).prevAll().addClass("fullyLoaded");
            jQuery(window).bind("scroll", function (b) {
                var c = jQuery(window).scrollTop(),
                    a = jQuery(".gameSticky").outerHeight();
                if (c > superScrolling.options.$headerHeight) {
                    jQuery(".controlBox,.gameSticky").css("top", 0 + "px");
                    jQuery(".controlBox,.gameSticky").addClass("fixMe")
                }
                if (c < superScrolling.options.$headerHeight) {
                    jQuery(".controlBox,.gameSticky").css("top", superScrolling.options.topPad - superScrolling.options.demoBar + "px");
                    jQuery(".controlBox,.gameSticky").removeClass("fixMe")
                }
                if (c > superScrolling.options.$docHeight - superScrolling.options.$footerHeight - a - superScrolling.options.demoBar) {
                    jQuery(".controlBox,.gameSticky").removeClass("fixMe");
                    jQuery(".controlBox,.gameSticky").css("top", superScrolling.options.$docHeight - superScrolling.options.$footerHeight - a - superScrolling.options.demoBar + "px")
                }
                superScrolling.loadMeUp()
            })
        },
        loadMeUp: function () {
            var c = jQuery(".controlBox").offset(),
                d = jQuery(window).outerHeight(),
                e = superScrolling.options.$headerHeight + superScrolling.options.topPad - superScrolling.options.demoBar,
                a = superScrolling.options.$docHeight - (d + offsetBottom),
                b = Math.round((c.top - e) / (a - e) * 100);
            if (b < 1) {
                b = 0;
            }
            if (b > 99) {
                b = 100;
            }
            jQuery(".controlBox " + superScrolling.options.$currentPage + " .loadProgress").css("height", b + "%")
            if (jQuery(".controlBox " + superScrolling.options.$currentPage + " .loadProgress").css("height") > "0px") {
	            jQuery(".controlBox " + superScrolling.options.$currentPage + " .loadProgress").addClass("borderScroll")
            }
            else {
	            jQuery(".controlBox " + superScrolling.options.$currentPage + " .loadProgress").removeClass("borderScroll")
            }
        }
    }, lazyLoadImages = {
	    init: function () {
		    jQuery("img.lazy").lazyload({
			    effect : "fadeIn"
			})
	    }
    }, gameSticky = {
        options: {
            $gameStage: jQuery(".gameContents").attr("id")
        },
        init: function () {
            this.percentage()
        },
        percentage: function () {
            var a = (((jQuery(window).scrollTop() - offset.top) / ((jQuery(document).outerHeight() - offsetBottom - offset.top) - jQuery(window).outerHeight())) * 100) / 3;
            if (gameSticky.options.$gameStage === "page1") {
                if (a.toFixed(0) <= 0) {
                    jQuery(".percentage").text("0%")
                } else {
                    if (a.toFixed(0) > 33) {
                        jQuery(".percentage").text("33%")
                    } else {
                        jQuery(".percentage").text(a.toFixed(0) + "%")
                    }
                }
            }
            if (gameSticky.options.$gameStage === "page2") {
                a = a + 33;
                if (a.toFixed(0) <= 33) {
                    jQuery(".percentage").text("33%")
                } else {
                    if (a.toFixed(0) > 66) {
                        jQuery(".percentage").text("66%")
                    } else {
                        jQuery(".percentage").text(a.toFixed(0) + "%")
                    }
                }
            }
            if (gameSticky.options.$gameStage === "page3") {
                a = a + 66;
                if (a.toFixed(0) <= 66) {
                    jQuery(".percentage").text("66%")
                } else {
                    if (a.toFixed(0) > 99) {
                        jQuery(".percentage").text("100%")
                    } else {
                        jQuery(".percentage").text(a.toFixed(0) + "%")
                    }
                }
            }
        }
    }, scrollToAnchor = {
        init: function (a) {
            if (a !== undefined) {
                jQuery(window).scrollTo(a, 800, {
                    margin: true,
                    offset: {
                        top: +5
                    }
                })
            }
        }
    }, scrollToPoint = {
        init: function () {
            var b = jQuery(".segment"),
            	t = b.length - 1,
                a = 0,
                d = jQuery(".anchorLink-next"),
                e = jQuery(".anchorLink-prev").hide(),
                f = jQuery(".toTop").hide();
            d.click(function (g) {
                scrollToAnchor.init(b[a])
            });
            e.click(function (g) {
                scrollToAnchor.init(b[a - 2])
            });
            f.click(function (g) {
                scrollToAnchor.init(b[0])
            });
            var c = 0;
            jQuery(window).scroll(function (k) {
                var i = jQuery(this).scrollTop(),
                    h = jQuery(window).scrollTop() - offset.top,
                    l = jQuery(b[a]).offset(),
                    j = l.top - offset.top,
                    g = jQuery(".gameContents").outerHeight() / t;
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
                if (a <= 1) {
                    e.hide()
                    f.hide()
                }
                if (a > 1) {
                    e.show()
                    f.show()
                }
                c = i
            })
        }
    }, socialWindow = {
        options: {
            win: null
        },
        init: function (e, d, b, c, a) {
            LeftPosition = (screen.width) ? (screen.width - b) / 2 : 0;
            TopPosition = (screen.height) ? (screen.height - c) / 2 : 0;
            settings = "height=" + c + ",width=" + b + ",top=" + TopPosition + ",left=" + LeftPosition + ",scrollbars=" + a + ",resizable";
            socialWindow.options.win = window.open(e, d, settings)
        }
    };