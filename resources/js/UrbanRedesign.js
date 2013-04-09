//          01/10/2012 urban redesign additional javascript
//          using non conflict jQuery statement as "$" replacment
//          1. sticky menu
//          2. special items purchased based on <venda_oishipname>'
//          3. toggle panel item (delivery instructions)

jQuery(document).ready(function () {
    Venda.urbanRedesign.init();
});

Venda.namespace('urbanRedesign');
Venda.urbanRedesign = {
    init: function () {
        this.stickyBasket();
        this.basketCount();
        this.specialItems();
        this.populateDob();
        this.customSelect();
    },
    populateDob: function () {
        var dobStr = jQuery('#usxtdobstr');
        if (dobStr.length > 0) {
            var days = 31,
                months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
                monthId = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                ageMin = 18, ageMax = 90, optDay = '<option>DD</option>', optMonth = '<option>MM</option>', optYear = '<option>YYYY</option>', selected,
                day, month, year;

            string = dobStr.val().split('/');
            // populate days
            for (var i = 0; i < days; i++) {
                selected = (i + 1) == parseInt(string[0], 10) ? 'selected="selected" ' : '';
                optDay += '<option ' + selected + 'value="' + (i + 1) + '">' + (i + 1) + '</option>';
            }
            // populate months
            for (var e = 0; e < months.length; e++) {
                selected = monthId[e] == string[1] ? 'selected="selected" ' : '';
                optMonth += '<option ' + selected + 'value="' + monthId[e] + '">' + months[e] + '</option>';
            }
            // populate years
            for (var x = 0; x < ageMax; x++) {
                var d = new Date(), yearMin = d.getFullYear() - ageMin;
                selected = ((yearMin - x)) == parseInt(string[2], 10) ? 'selected="selected" ' : '';
                optYear += '<option ' + selected + 'value="' + (yearMin - x) + '">' + (yearMin - x) + '</option>';
            }
            dobStr.after('<div class="usxtdob"><div><select rel="DD" id="usxtdobday" name="dobday">' + optDay + '</select></div><div><select rel="MM" id="usxtdobmonth" name="dobmonth">' + optMonth + '</select></div><div><select rel="YYYY" id="usxtdobyear" name="dobyear">' + optYear + '</select></div></div>');
            jQuery('#usxtdobday, #usxtdobmonth, #usxtdobyear').change(function () {
                //alert(jQuery(this).val())
                jQuery('#usxtdobstr').val(jQuery('#usxtdobday').val() + '/' + jQuery('#usxtdobmonth').val() + '/' + jQuery('#usxtdobyear').val())
            })
        
        }
    }, 
    stickyBasket: function () {
        jQuery(window).bind("scroll", function (b) {
            var o = jQuery("#basket").offset();
            if (o) {
            	var	f = jQuery(document).innerHeight() - (o.top + jQuery("#basket").innerHeight() + 4),
            		h = o.top,
            		d = jQuery(document).innerHeight(),
            		demoBar = jQuery(".demo").outerHeight(),
            		c = jQuery(window).scrollTop(),
                	a = jQuery(".summeryContainer").outerHeight();
                console.log(d - f - a - h,h - demoBar);
                if (c > 0) {
                	jQuery(".summeryContainer").addClass("fixMe")
                	jQuery(".summeryContainer").css("top", "auto")
                }
                if (c < 0) {
                	jQuery(".summeryContainer").removeClass("fixMe")
                }
                if (c > d - f - a - h) {
                	jQuery(".summeryContainer").removeClass("fixMe");
                	if (d - f - a - h > 0) {
                		jQuery(".summeryContainer").css("top", d - f - a - demoBar - 8 + "px")
                	}
                	if (d - f - a - h <= 0) {
                		jQuery(".summeryContainer").css("top", h - demoBar - 8 + "px")
                	}
                }
            }
        })
    },
    setMenuOffset: function () {
        this.header = document.getElementById('#summeryContainer');
        if (!this.header) { return; }
        this.currentOffset = document.documentElement.scrollTop || document.body.scrollTop; // body for Safari
        this.startPos = parseInt(Venda.urbanRedesign.setMenuOffset.initialPos, 10) || 190;
        this.desiredOffset = this.startPos - this.currentOffset;
        if (this.desiredOffset < 75) {
            this.desiredOffset = 75;
        }
        if (this.desiredOffset !== parseInt(this.header.style.top, 10)) {
            this.header.style.top = this.desiredOffset + 'px';
        }
    },
    basketCount: function () {
        // replace basket item title with Item[x]
        jQuery('.standarditem .name a').each(function (i) {
            jQuery(this).text('Item ' + (i + 1));
        })
    },
    customSelect: function () {
        // custom select on all browsers except opera (this has bugs)
        if (!jQuery.browser.opera) {
            jQuery('.myAccountTemplate select, .checkoutTemplate select').each(function () {
                var val, title = 'Please Select...';
                if (jQuery(this).attr('rel')) { title = jQuery(this).attr('rel') }
                if (jQuery('option:selected', this).val() !== '') {
                    title = jQuery('option:selected', this).text();
                }
                if (jQuery(this).attr('id') == 'startmonth' || jQuery(this).attr('id') == 'startyear' || jQuery(this).attr('id') == 'month' || jQuery(this).attr('id') == 'year') {
                    if (title == 'Please Select...') {
                        title = ' ';
                    }
                }
                if (jQuery(this).css('display') !== 'none' && jQuery(this).parent().is('div')) {
                    jQuery(this)
                .css({ 'z-index': 10, 'opacity': 0, 'position': 'relative', '-khtml-appearance': 'none'})
                .after('<span class="select">' + title + '</span>')
                .change(function () {
                    val = jQuery('option:selected', this).text();
                    jQuery(this).next().text(val);
                }).parent('div').css({ 'position': 'relative' });
                }
            });
        }
    },
    specialItems: function () {
        // order summary/order reciept special item styles (based on package loop)
        var oishipname = 'bikes', productShip = jQuery('.venda_oishipname');
        productShip.each(function (i) {
            var $package = jQuery(this).closest('.productPackage'), elTitle, elTitleText, el;
            if (i === 0) {
                $package.attr('id', 'leadPackage');
            }
            if (this.value === oishipname && !$package.hasClass('processed')) {
                el = $package.children('.order-summary-box');
                el.each(function () {
                    elTitle = jQuery(this).children('.OrderSummaryHdr');
                    elTitleText = elTitle.text();

                    if (elTitleText.indexOf("Items") !== -1) {
                        elTitle.text('Special ' + elTitleText);
                    } else {
                        elTitle.text('Special Items ' + elTitleText);
                    }
                });
                el.addClass('special');
                $package.addClass('specialPackage');
            } else {
                $package.addClass('standardPackage');
            }
            $package.addClass('processed');
        });
        this.deliveryAccordion();
    },
    deliveryAccordion: function () {
        // order summary - toggle delivery instruction accordion
        jQuery('.jsToggle').each(function () {
            jQuery('#orcfcomment.special').remove();
            var el = jQuery(this),
                height = el.height(),
                minHeight = el.find('.OrderSummaryHdr').height();

            el.find('.OrderSummaryHdr').append('<span class="toggle"></span>');
            el.css({ 'overflow': "hidden", 'height': minHeight + "px" });

            jQuery('.OrderSummaryHdr').toggle(function () {
                el.animate({ 'height': height }, 600);
                jQuery(this).addClass('expanded');
            }, function () {
                el.animate({ 'height': minHeight }, 600);
                jQuery(this).removeClass('expanded');
            });
        });
    }
}