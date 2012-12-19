(function($) {
    "use strict";
    $.fn.socialButtons = function(method, options) {

        var defaults = {
            networks    : ['twitter','facebook','googlePlus','pinterest'],
            fadeInTime  : 2000
        };
        
        var opts = $.extend({},defaults, options);
        var methods = {
            load : function() { 

                return this.each(function() {

                  var $this = $(this);
                  $this.hide();

                  for (var i = 0; i < (opts.networks.length); i++) {
                    $this.socialButtons(opts.networks[i]);
                  }

                  $this.delay(opts.fadeInTime).fadeIn();

                });
            },
            twitter : function() {
                window.twttr = (function (d,s,id) {
                var t, js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return; js=d.createElement(s); js.id=id;
                js.src="//platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
                return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } });
                }(document, "script", "twitter-wjs"));

                // Wait for the asynchronous resources to load
                twttr.ready(function(twttr) {
                  _ga.trackTwitter(); //Google Analytics tracking
                });
            },
            facebook : function() {
                window.fbAsyncInit = function() {
                  FB.init({
                    appId      : jQuery('#tag-fbAppId').html(), // FB App ID
                    status     : true, // check login status
                    cookie     : true, // enable cookies to allow the server to access the session
                    xfbml      : true  // parse XFBML
                  });

                  _ga.trackFacebook(); //Google Analytics tracking
                };

                // Load the Facebook SDK Asynchronously
                (function(d){
                  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
                  if (d.getElementById(id)) {return;}
                  js = d.createElement('script'); js.id = id; js.async = true;
                  if(document.location.href.indexOf('urbanoutfitters.fr') != -1) {
                  	js.src = "//connect.facebook.net/fr_FR/all.js";
                  }
                  if(document.location.href.indexOf('urbanoutfitters.de') != -1) {
                  	js.src = "//connect.facebook.net/de_DE/all.js";
                  }
                  if(document.location.href.indexOf('urbanoutfitters.co.uk') != -1) {
                  	js.src = "//connect.facebook.net/en_GB/all.js";
                  }
                  else if(document.location.href.indexOf('uat.venda.com') != -1) {
                  	js.src = "//connect.facebook.net/en_GB/all.js";
                  }
                  ref.parentNode.insertBefore(js, ref);
                }(document));
            },
            googlePlus : function() {
                methods._createScript('https://apis.google.com/js/plusone.js');
                // Social tracking is built in for googlePlus
            },
            pinterest : function() {
                methods._createScript('//assets.pinterest.com/js/pinit.js');
                // There is no social tracking for pinterest becasue they don't have any callback events
            },
            _createScript : function(src) {
                var t, s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = src;
                document.getElementById('socialButtons').appendChild(s);
            }
        };

        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.load.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.socialButtons' );
        }

    };
})(jQuery);