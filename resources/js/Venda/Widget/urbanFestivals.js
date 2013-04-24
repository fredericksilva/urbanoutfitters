Venda.namespace('Festival');
Venda.Festival = {
	options: {
		f: '', e: '', m: 'month', g: 'genre', d: 'date', h: 'festivals', fd: 'festivalDropdown', o: 'open', fv: 'festival', p: 'pastEvent', i: 'instagram', instagramAPI: 'https://api.instagram.com/v1/tags/urbanoutfitters/media/recent?access_token=209854882.ddd6073.4813ec04484442bd9f0b808562d1161d&count=40&callback=?'
	}, setMonth: function() {
		var l = document.documentElement.lang;
		switch (l) {
			case 'fr': var m = [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Sept", "Octobre", "Novembre", "Décembre" ];
			break;
			case 'de': var m = [ "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "Aug", "Sept", "Oktober", "November", "Dezember" ];
			break;
			default: var m = [ "January", "February", "March", "April", "May", "June", "July", "Aug", "Sept", "October", "November", "December" ];
		};
		var	d = new Date(),
			n = d.getMonth(),
			b = d.getDate(),
			o = m[n];
		jQuery('.'+Venda.Festival.options.m).each(function() {
			var t = jQuery(this).data(Venda.Festival.options.d).split(".")[1] - 1,
				u = jQuery(this).data(Venda.Festival.options.d).split(".")[0],
				s = m[t];
			jQuery(this).text(s).attr('onclick', '_gaq.push([\'_trackEvent\', \'Festival\', \'Calendar\', \''+ s +'\']);');
			jQuery(this).attr('id', s);
			//remove this as soon as we enter May
			if (n === 3) {
				Venda.Festival.options.e = jQuery(this).data(Venda.Festival.options.d).split(".")[1];
				jQuery('#May').addClass('selected');
				Venda.Festival.calculateMonth();
			}
			// eo remove area
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
		jQuery(e).addClass(Venda.Festival.options.o).slideDown(function () {
			jQuery(window).scrollTo(this, 'slow');
			var h = jQuery(e).outerHeight();
			Venda.Festival.addImages(h)
		});
	}, init: function() {
		Venda.Festival.launchSlider();
		Venda.Festival.instagram();
		Venda.Festival.festivalCalendar();
	}, openCalendar: function(a) {
		var b = jQuery(a).data(Venda.Festival.options.o);
		jQuery('.'+Venda.Festival.options.m).removeClass('selected');
		Venda.Festival.setMonth();
		Venda.Festival.slideOpen(b);
	}, launchSlider: function() {
		jQuery('.'+Venda.Festival.options.fv+'slides').flexslider({
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
				jQuery(d).slideToggle(function() {
					var h = jQuery('.'+Venda.Festival.options.fv+'Accordion-middle').outerHeight();
					Venda.Festival.addImages(h)
				}).toggleClass(Venda.Festival.options.o);
			})
		});
		jQuery('.'+Venda.Festival.options.g).click(function() {
			Venda.Festival.options.f = jQuery(this).data(Venda.Festival.options.g);
			jQuery('.'+Venda.Festival.options.fd).hide();
			Venda.Festival.calculate();
			Venda.Festival.addImages('1');
		});
		jQuery('.'+Venda.Festival.options.m).click(function() {
			jQuery('.'+Venda.Festival.options.m).removeClass('selected');
			jQuery('.'+Venda.Festival.options.fd).hide();
			Venda.Festival.options.e = jQuery(this).data(Venda.Festival.options.d).split(".")[1];
			jQuery(this).addClass('selected');
			Venda.Festival.calculateMonth();
			Venda.Festival.addImages('1');
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
		Venda.Festival.addImages('1');
	}, pastEvent: function(a) {
		jQuery('.'+Venda.Festival.options.h).each(function() {
			var b = jQuery(this).data(Venda.Festival.options.d);
			if (a === b) {
				var c = jQuery(this).find('.'+Venda.Festival.options.fv+'Past').text(),
					d = jQuery(this).find('.'+Venda.Festival.options.fv+'Blog').text(),
					e = jQuery(this).find('.'+Venda.Festival.options.fv+'BlogText').text();
				jQuery(this).addClass(Venda.Festival.options.p).find('.'+Venda.Festival.options.fv+'Date').text(c).end()
					.find('.'+Venda.Festival.options.fd).remove();
				if (d.length > 0) {
					jQuery(this).find('.'+Venda.Festival.options.fv+'Location').html('<a onclick="_gaq.push([\'_trackEvent\', \'Festival\', \'Calendar\', \'Read The Blog\']);" href="'+d+'">'+e+'</a>');
				}
			}
		})
	}, addImages: function (a) {
		if (a >= 300) {
			jQuery('.'+Venda.Festival.options.fv+'ImgVis').fadeIn('500');
		}
		if (a < 300) {
			jQuery('.'+Venda.Festival.options.fv+'ImgVis').fadeOut('500');
		}
	}, socialWindow: function (e, d, b, c, a) {
		var w = null;
        l = (screen.width) ? (screen.width - b) / 2 : 0;
        t = (screen.height) ? (screen.height - c) / 2 : 0;
        s = "height=" + c + ",width=" + b + ",top=" + t + ",left=" + l + ",scrollbars=" + a + ",resizable";
        w = window.open(e, d, s)
    }, instagram: function () {
		jQuery.ajax({
			type: 'GET',
			url: Venda.Festival.options.instagramAPI,
			dataType: 'json',
			cache: true,
			success: function(data) {
          		var h = "";
          		for (var i = 0; i < data.data.length; i++) {
          			h += '<div class="image"><img onclick="Venda.Festival.instagramZoom(this,400,400); _gaq.push([\'_trackEvent\', \'Festival\', \'Instagram\', \'Instagram Image '+ data.data[i].link +'\']);" rel="' + data.data[i].images.standard_resolution.url + '"src="' + data.data[i].images.low_resolution.url + '" alt="" /></div>';
          		}
          		var d = h.replace(/\n/g,'').replace(/((<div class="image">(.*?)<\/div>){6})/g,'<li>$1</li>')
          				.replace(/(.*)<\/li>(.*)/, '$1</li><li>$2</li>');
          		jQuery('ul.'+Venda.Festival.options.i+'Images').html(d).find('li:empty').remove();
          		jQuery('.'+Venda.Festival.options.i+'Slides').flexslider({
	          		animation: "slide",
	          		pauseOnHover: true,
	          		useCSS: false
	          	});
			}
		});
	}, instagramZoom: function(a,b,c) {
		var t = (jQuery(window).height() - b) / 2 + jQuery(window).scrollTop() + "px",
        	l = (jQuery(window).width() - c) / 2 + jQuery(window).scrollLeft() + "px";
	    jQuery('.'+Venda.Festival.options.fv+'bg').css({"opacity" : "0.7"}).fadeIn("slow");
	    jQuery('.'+Venda.Festival.options.i+'Large').html('<img width="'+ b +'" height="'+ c +'" src="'+jQuery(a).attr('rel')+'" />').fadeIn('slow').css({'top':t,'left':l});
        jQuery(document).keypress(function(e){
        	if(e.keyCode==27){
            	jQuery('.'+Venda.Festival.options.fv+'bg').fadeOut('slow');
            	jQuery('.'+Venda.Festival.options.i+'Large').fadeOut('slow');
            }
        });
        jQuery('.'+Venda.Festival.options.fv+'bg').click(function(){
        	jQuery('.'+Venda.Festival.options.fv+'bg').fadeOut('slow');
        	jQuery('.'+Venda.Festival.options.i+'Large').fadeOut('slow');
       });
	}
}