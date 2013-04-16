Venda.namespace('Festival');
Venda.Festival = {
	options: {
		f: '', e: '', m: 'month', g: 'genre', d: 'date', h: 'festivals', fd: 'festivalDropdown', o: 'open', fv: 'festival', p: 'pastEvent'
	}, setMonth: function() {
		var m = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
			d = new Date(),
			n = d.getMonth(),
			b = d.getDate(),
			o = m[n];
		jQuery('.'+Venda.Festival.options.m).each(function() {
			var t = jQuery(this).data(Venda.Festival.options.d).split(".")[1] - 1,
				u = jQuery(this).data(Venda.Festival.options.d).split(".")[0],
				s = m[t];
			jQuery(this).text(s);
			jQuery(this).attr('id', s);
			if (o === s) {
				Venda.Festival.options.e = jQuery(this).data(Venda.Festival.options.d).split(".")[1];
				jQuery(this).addClass('selected');
				Venda.Festival.calculateMonth();
			}
			if (t === n) {
				if (u < b) {
					Venda.Festival.pastEvent(jQuery(this).data(Venda.Festival.options.d));
				}
			}
		})
		Venda.Festival.sortMonth();
		Venda.Festival.sortDay();
		Venda.Festival.removeDuplicates();
	}, sortMonth: function() {
		var a = [], d, e;
		a = jQuery('.'+Venda.Festival.options.m).map(function() {
			return jQuery(this).data(Venda.Festival.options.d).split(".")[1];
		}).get();
		a.sort().reverse();
		while (a.length) {
			d = a.pop();
			e = jQuery('.'+Venda.Festival.options.m).filter(function() {
				return jQuery(this).data(Venda.Festival.options.d).split(".")[1] == d;
			}).detach();
			jQuery('.'+Venda.Festival.options.fv+'Month').append(e);
		}
	}, sortDay: function() {
		var a = [], d, e;
		a = jQuery('.'+Venda.Festival.options.h).map(function() {
			return jQuery(this).data(Venda.Festival.options.d).split(".")[0];
		}).get();
		a.sort().reverse();
		while (a.length) {
			d = a.pop();
			e = jQuery('.'+Venda.Festival.options.h).filter(function() {
				return jQuery(this).data(Venda.Festival.options.d).split(".")[0] == d;
			}).detach();
			jQuery('.'+Venda.Festival.options.fv+'Container').append(e);
		}
	}, removeDuplicates: function() {
		var c = {};
		jQuery('.'+Venda.Festival.options.m+'[id],.'+Venda.Festival.options.g+'[id]').each (function () {
			if (c.hasOwnProperty(this.id)) {
				jQuery(this).remove();
			} else {
				c[this.id] = 'true';
			}
		});
	}, slideOpen: function(a) {
		var e = jQuery('.'+a);
		jQuery('.'+Venda.Festival.options.o).not(e).slideUp().removeClass(Venda.Festival.options.o);
		jQuery(e).slideDown().addClass(Venda.Festival.options.o);
	}, init: function() {
		Venda.Festival.launchSlider();
		Venda.Festival.festivalCalendar();
		jQuery('.'+Venda.Festival.options.fv+'Slot').click(function() {
			var b = jQuery(this).data(Venda.Festival.options.o);
			Venda.Festival.slideOpen(b);
			jQuery('.'+Venda.Festival.options.m).removeClass('selected');
			Venda.Festival.setMonth();
		});
	}, launchSlider: function() {
		jQuery('.festivalslides').flexslider({
			animation: "slide",
			pauseOnHover: true
		});
		var flexWidth = (jQuery(".flex-control-paging").width() + 56) /2;
		jQuery(".flex-control-paging").css('margin-left',-flexWidth);
	}, festivalCalendar: function() {
		jQuery('.'+Venda.Festival.options.h).each(function() { 
			var d = jQuery(this).find('.'+Venda.Festival.options.fd);
			jQuery(this).find('.'+Venda.Festival.options.fv+'Link').click(function() {
				if (jQuery(d).hasClass(Venda.Festival.options.o) === false) {
					jQuery('.'+Venda.Festival.options.fd).slideUp().removeClass(Venda.Festival.options.o);
				}
				jQuery(d).slideToggle().toggleClass(Venda.Festival.options.o);
			})
		});
		jQuery('.'+Venda.Festival.options.g).click(function() {
			Venda.Festival.options.f = jQuery(this).data(Venda.Festival.options.g);
			jQuery('.'+Venda.Festival.options.fd).hide();
			Venda.Festival.calculate();
		});
		jQuery('.'+Venda.Festival.options.m).click(function() {
			jQuery('.'+Venda.Festival.options.m).removeClass('selected');
			jQuery('.'+Venda.Festival.options.fd).hide();
			Venda.Festival.options.e = jQuery(this).data(Venda.Festival.options.d).split(".")[1];
			jQuery(this).addClass('selected');
			Venda.Festival.calculateMonth();
		});
	}, calculate: function () {
		jQuery('.'+Venda.Festival.options.h).each(function() {
			var i = jQuery(this),
				g = i.data(Venda.Festival.options.g),
				d = i.data(Venda.Festival.options.d).split(".")[1];
			if (Venda.Festival.options.f === g && Venda.Festival.options.e === d) {
				i.show();
			} else {
				i.hide();
			}
		})
	}, calculateMonth: function() {
		jQuery('.'+Venda.Festival.options.h).each(function() {
			var i = jQuery(this),
				d = i.data(Venda.Festival.options.d).split(".")[1];
			if (Venda.Festival.options.e === d) {
				i.show();
			} else {
				i.hide();
			}
		})
	}, closeDropdown: function() {
		jQuery('.'+Venda.Festival.options.o).slideUp().removeClass(Venda.Festival.options.o);
	}, pastEvent: function(a) {
		jQuery('.'+Venda.Festival.options.h).each(function() {
			var b = jQuery(this).data(Venda.Festival.options.d);
			if (a === b) {
				var c = jQuery(this).find('.'+Venda.Festival.options.fv+'Past').text(),
					d = jQuery(this).find('.'+Venda.Festival.options.fv+'Blog').text();
				jQuery(this).addClass(Venda.Festival.options.p).find('.'+Venda.Festival.options.fv+'Date').text(c).end()
					.find('.'+Venda.Festival.options.fd).remove();
				if (d.length > 0) {
					jQuery(this).find('.'+Venda.Festival.options.fv+'Location').html('<a href="'+d+'">Read the blog</a>');
				}
			}
		})
	}, socialWindow: function (e, d, b, c, a) {
		var w = null;
        LeftPosition = (screen.width) ? (screen.width - b) / 2 : 0;
        TopPosition = (screen.height) ? (screen.height - c) / 2 : 0;
        settings = "height=" + c + ",width=" + b + ",top=" + TopPosition + ",left=" + LeftPosition + ",scrollbars=" + a + ",resizable";
        w = window.open(e, d, settings)
    }
}