jQuery(document).ready(function(){
	// Add Inactive Class To All Accordion Headers
	jQuery('.accordion-header').each(function () {
		var accHeader = jQuery(this);
		// activate open accordions on load
		accHeader.toggleClass('inactive-header');
		/*jQuery('#first-head').toggleClass('active-header').toggleClass('inactive-header');
		jQuery('#first-content').show().toggleClass('open-content');
		jQuery('#sec-head').toggleClass('active-header').toggleClass('inactive-header');
		jQuery('#sec-content').show().toggleClass('open-content');*/
	
		// The Accordion Effect
		accHeader.click(function () {
			if(accHeader.is('.inactive-header')) { 													
				accHeader.toggleClass('active-header').toggleClass('inactive-header');
				accHeader.next().slideDown().show('open-content');
			}
			else {
				accHeader.toggleClass('inactive-header').toggleClass('active-header');
				accHeader.next().slideUp().hide('open-content');
			}
		})
	})
	return false;
});
function scrollToAnchor(aid){
	var dTag = jQuery("div[id='"+ aid +"']");
	jQuery('html,body').animate({scrollTop: dTag.offset().top},'slow');
}
jQuery("#first-head").click(function() {
	scrollToAnchor('milly-bk');
});
jQuery("#sec-head").click(function() {
	scrollToAnchor('lucy-bk');
});