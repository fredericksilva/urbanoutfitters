/**
* @fileoverview
 * JS for Tablet (or any Touch) Devices.
 *
 * @author Juanjo Dominguez <juanjodominguez@venda.com>
*/
function is_touch_device() {
  if ("ontouchstart" in document.documentElement)
    return true;
  else
    return false;
};

/**
* Display the desktop to mobile link
 * if device is touch AND the resolution is equal/less than 520
 * so it doesn't show for tablets as they are higher resolution
 * @author Issawararat Chumchinda <bowc@venda.com>
*/

var mobileDetect = "<div class='mobileDetect'><a href='/page/home' title='Go to Mobile Site'><span>Go to Mobile Site</span></a></div>";
jQuery(document).ready(function() {
	 if (jQuery(".mobileDetect")) { jQuery(".mobileDetect").remove(); }
 if (is_touch_device()) {
  jQuery("body").prepend(mobileDetect);
 }
});
jQuery(window).resize(function() {
	if (jQuery(".mobileDetect")) { jQuery(".mobileDetect").remove(); }
	if (is_touch_device()) {
		jQuery("body").prepend(mobileDetect);
	}
});

jQuery(".mobileDetect a").live("click", function(){
	var cj = new CookieJar({expires: 3600 * 24 * 7, path: '/', domain: document.domain});
	cj.put("device", "mobile");
});