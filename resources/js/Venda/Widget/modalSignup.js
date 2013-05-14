Venda.namespace('Widget.modalSignup');
Venda.Widget.modalSignup.popupCookieClose = new CookieJar({
    expires: 3600 * 24 * 30,
    path: '/'
});
Venda.Widget.modalSignup.Close = 'closed the popup';
closedPopup = Venda.Widget.modalSignup.popupCookieClose.get('closedPopup');
Venda.Widget.modalSignup.popupCookieSubmit = new CookieJar({
    expires: 3600 * 24 * 365,
    path: '/'
});
Venda.Widget.modalSignup.Submit = 'submitted the popup';
submittedPopup = Venda.Widget.modalSignup.popupCookieSubmit.get('submittedPopup');
Venda.Widget.modalSignup = {
    options: {
        eopts: "",
        w: "wrapper",
        sP: "signupPopup",
        uk: "http://www.urbanoutfitters.co.uk/page/home/&log=4",
        fr: "http://www.urbanoutfitters.fr/page/home/&log=4",
        de: "http://www.urbanoutfitters.de/page/home/&log=4"
    },
    init: function () {
        Venda.Widget.modalSignup.displayPopup();
        jQuery('#modalSignup').submit(function (a) {
            Venda.Widget.modalSignup.options.eopts = a;
            Venda.Widget.modalSignup.modalSubmit(Venda.Widget.modalSignup.options.eopts, this);
        });
    },
    addGender: function (gender) {
        jQuery('input[name=GENDER]').val(gender);
    },
    genderFunction: function (a) {
        Venda.Widget.modalSignup.addGender(jQuery(a).data("gender"));
    },
    modalSubmit: function (a, b) {
        a.preventDefault();
        if (Venda.Widget.modalSignup.checkForm(b)) {
            Venda.Widget.modalSignup.popupCookieSubmit.put('submittedPopup', Venda.Widget.modalSignup.Submit);
            submittedPopup = Venda.Widget.modalSignup.popupCookieSubmit.get('submittedPopup');
            var e = b.email.value,
                g = b.GENDER.value,
                s = b.SOURCE.value,
                aid = b.aid.value,
                n = b.n.value,
                m = b.a.value,
                c = b.COUNTRY.value,
                u = jQuery(b).find('input[name=email]').data('email');
            i = document.createElement('img');
            i.src = "http://ebm.cheetahmail.com/r/regf2?aid=" + aid + "&n=" + n + "&a=" + m + "&email=" + e + "&GENDER=" + g + "&SOURCE=" + s + "&COUNTRY=" + c;
            i.style.display = 'none';
            jQuery(i).bind('error', function (a) {
                jQuery(b).fadeOut('slow');
                setTimeout(function () {
                    jQuery(".thanks").fadeIn('slow');
                    fadeBackOut();
                }, 1000);

                function fadeBackOut() {
                    setTimeout(function () {
                        jQuery('.' + Venda.Widget.modalSignup.options.w + ' .' + Venda.Widget.modalSignup.options.sP).css('display', 'none');
                        jQuery('.' + Venda.Widget.modalSignup.options.w + ' .' + Venda.Widget.modalSignup.options.sP + 'Overlay').css('display', 'none');
                    }, 3000);
                }
            });
            jQuery(i).prependTo(document.body);
        } else {
            a.stopImmediatePropagation();
        }
    },
    checkForm: function (vfm) {
        var v = true,
            rEx = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-\+])+\.)+([a-zA-Z0-9]{2,4})+$/,
            a = jQuery('.' + Venda.Widget.modalSignup.options.w + ' .' + Venda.Widget.modalSignup.options.sP + ' .invalidEmail').text();
        e = ""
        if (!vfm.email.value || !vfm.email.value.match(rEx)) {
            v = false;
            e += a;
        }
        if (!v) {
            alert(e);
        }
        return v;
    },
    displayPopup: function () {
        if ((!closedPopup) && (!submittedPopup) && (unescape(location.href) !== Venda.Widget.modalSignup.options.uk) && (unescape(location.href) !== Venda.Widget.modalSignup.options.fr) && (unescape(location.href) !== Venda.Widget.modalSignup.options.de)) {
            jQuery('.' + Venda.Widget.modalSignup.options.w + ' .' + Venda.Widget.modalSignup.options.sP).css('display', 'block');
            jQuery('.' + Venda.Widget.modalSignup.options.w + ' .' + Venda.Widget.modalSignup.options.sP + 'Overlay').css('display', 'block');
        }
    },
    closePopup: function () {
        Venda.Widget.modalSignup.popupCookieClose.put('closedPopup', Venda.Widget.modalSignup.Close);
        closedPopup = Venda.Widget.modalSignup.popupCookieClose.get('closedPopup');
        jQuery('.' + Venda.Widget.modalSignup.options.w + ' .' + Venda.Widget.modalSignup.options.sP).css('display', 'none');
        jQuery('.' + Venda.Widget.modalSignup.options.w + ' .' + Venda.Widget.modalSignup.options.sP + 'Overlay').css('display', 'none');
    }
}