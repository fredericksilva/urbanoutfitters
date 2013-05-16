Venda.namespace('quickSignup');
Venda.quickSignup = {
    options: {
        eopts: ""
    },
    init: function () {
        jQuery('#commentForm').submit(function (a) {
            Venda.quickSignup.options.eopts = a;
            Venda.quickSignup.quickSubmit(Venda.quickSignup.options.eopts, this);
        });
    },
    addGender: function (gender) {
        jQuery('input[name=GENDER]').val(gender);
    },
    genderFunction: function (a) {
        Venda.quickSignup.addGender(jQuery(a).data("gender"));
    },
    quickSubmit: function (a, b) {
        a.preventDefault();
        if (Venda.quickSignup.checkform(b)) {
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
	            		jQuery(".thanks").fadeOut('slow');
	            		fadeBackIn();
	            	}, 5000);
	            }
	            function fadeBackIn() {
		            setTimeout(function () {
	            		jQuery(b).fadeIn('slow');
	            		b.email.value = u;
	            	}, 1000);
	            }
            });
            jQuery(i).prependTo(document.body);
        } else {
            a.stopImmediatePropagation();
        }
    },
    checkform: function(vfm) {
        var v = true,
            rEx = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-\+])+\.)+([a-zA-Z0-9]{2,4})+$/;
        e = ""
        if (!vfm.email.value || !vfm.email.value.match(rEx)) {
            v = false;
            e += "Please enter a valid e-mail address.\n";
        }
        if (!v) {
            alert(e);
        }
        return v;
    }
}