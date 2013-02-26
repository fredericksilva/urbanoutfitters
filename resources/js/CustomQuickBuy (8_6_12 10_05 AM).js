  /* ## UO QUICKBUY ## */
  /* # Productlist Hover show/hide link # */
  jQuery(function () {
    jQuery("#comp-image.image").hover(function () {
      /* On hover */
      jQuery(this).find(".quickLinkBox").css({"visibility":"visible"});
    }, function () {
      /* On leave */
      jQuery(this).find(".quickLinkBox").css({"visibility":"hidden"});
    });
    
    /* # Pop Up function # */
    jQuery('.quickLinkBox a').click(function (e) {
       jQuery("body").append('<div id="loadhere" class="loadhere"></div>');
       jQuery('#loadhere').html('<img src="/content/ebiz/urbanoutfitters/resources/images/signin_loader.gif" alt="loading" class="loading">').load($(this).attr('href')).dialog({
	       title: $(this).attr('title'),
	       width: 735,
	       minHeight: 435,
	       draggable: false,
	       resizable: false,
	       modal: true,
	       close: function() { jQuery("#loadhere").dialog("destroy");jQuery("#loadhere").remove(); }
        });
        
        jQuery('.ui-widget-overlay').live('click',function() {
            jQuery("#loadhere").dialog("close");
        });
        return false;
      });
  });













