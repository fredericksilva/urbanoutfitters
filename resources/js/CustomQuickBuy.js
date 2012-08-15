  /* ## UO QUICKBUY ## */
  /* # Productlist Hover show/hide link # */
  jQuery(function () {
    if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
      jQuery(".image").click(function () {
        if(jQuery(this).find(".quickLinkBox").css("visibility") == "hidden") {
          jQuery(".quickLinkBox").css({"visibility":"hidden"});
          jQuery(this).find(".quickLinkBox").css({"visibility":"visible"});
          return false;
        } else {
          jQuery(this).find(".quickLinkBox").css({"visibility":"hidden"});
        }
      });
    }
    else { 
      jQuery(".image").hover(function () {
        /* On hover */
        jQuery(this).find(".quickLinkBox").css({"visibility":"visible"});
      }, function () {
        /* On leave */
        jQuery(this).find(".quickLinkBox").css({"visibility":"hidden"});
      });
    }
    /* # Pop Up function # */
    jQuery('.quickLinkBox a').click(function (e) {
       jQuery("body").prepend('<div id="loadhere" class="loadhere"></div>');
       //jQuery('#loadhere').show();
       jQuery('#loadhere').html('<img src="/content/ebiz/urbanoutfitters/resources/images/signin_loader.gif" alt="loading" class="loading">').load($(this).attr('href')).dialog({
	       title: $(this).attr('title'),
	       minHeight: 800,
	       height: 800,
	       width: 735,
	       position: 'center',
	       draggable: false,
	       resizable: false,
	       modal: true,
	       close: function() { jQuery("#loadhere").dialog("destroy"); jQuery("#loadhere").remove(); }
        });
        
        jQuery('.ui-widget-overlay').live('click',function() {
            jQuery("#loadhere").dialog("close");
        });
        return false;
      });
  });
