jQuery(function () {	
	//main menu setup
	function megaHoverOver(){
	jQuery(this).find(".sub").stop().fadeTo(1, 1).show();
		
	//Calculate width of all ul's
	(function(jQuery) { 
		jQuery.fn.calcSubWidth = function() {
			rowWidth = 0;
			//Calculate row
			jQuery(this).find("ul").each(function() {					
				rowWidth += jQuery(this).width(); 
			});	
		};
	})(jQuery); 
	
	if ( jQuery(this).find(".row").length > 0 ) { //If row exists...
		var biggestRow = 0;	
		//Calculate each row
		jQuery(this).find(".row").each(function() {							   
			jQuery(this).calcSubWidth();
			//Find biggest row
			if(rowWidth > biggestRow) {
				biggestRow = rowWidth;
			}
		});
		//Set width
		jQuery(this).find(".sub").css({'width' :biggestRow});
		jQuery(this).find(".row:last").css({'margin':'0'});
		
	} else { //If row does not exist...
		
		jQuery(this).calcSubWidth();
		//Set Width
		jQuery(this).find(".sub").css({'width' : rowWidth});
		
	}
	}
	
	function megaHoverOut(){ 
	jQuery(this).find(".sub").stop().fadeTo(1, 0, function() {
	  jQuery(this).hide(); 
	});
	}
	
	
	var config = {    
	 sensitivity: 2, // number = sensitivity threshold (must be 1 or higher)    
	 interval: 1, // number = milliseconds for onMouseOver polling interval    
	 over: megaHoverOver, // function = onMouseOver callback (REQUIRED)    
	 timeout: 0, // number = milliseconds delay before onMouseOut    
	 out: megaHoverOut // function = onMouseOut callback (REQUIRED)    
	};
	
	jQuery("#primaryNav li .sub").css({'opacity':'0'});
	jQuery("#primaryNav li").hoverIntent(config);
});// JavaScript Document