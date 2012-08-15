/**
 * createSlider 
 * @param {object} slider configuation
 * 		sliderID: id of element
 *		displayCount: display element in slider frame
 *		slideAmtNum: slide amount in each time
 *		slideLeft: id of left arrow
 *		slideRight:id of right arrow
 *		duration: slide dulation in second
 *		direction: slide direction
 *		slideAction: slide action 
 *		autoScroll: set slide auto scroll in [scrollInterval] second
 *		scrollInterval: auto scroll in [scrollInterval] second
 * @author Sakesan Panjamawat (Auii) <sakp@venda.com>
*/
var jqSlider=function(opts){
	var defaults = {
		sliderID:'sliderlist', 
		displayCount: 4, 
		slideAmtNum: 1, 
		slideLeft:'sliderLeft', 
		slideRight:'sliderRight', 
		duration: 0.3,
		direction: "horizontal",
		slideAction: "click",
		autoScroll: false,
		scrollInterval: 5
	};
	var options = jQuery.extend(defaults, opts);
	if(options.direction!="horizontal" && options.direction!="vertical"){options.direction="horizontal";}
	var itemCount=jQuery("ul[id="+options.sliderID+"]").find('li').length;
	var scrollPos=1;
	var doIntervalTime;
	var width=jQuery("ul[id="+options.sliderID+"]").find('li:eq(0)').outerWidth();
	var height=jQuery("ul[id="+options.sliderID+"]").find('li:eq(0)').outerHeight();
	if(options.direction=="horizontal"){
		jQuery("ul[id="+options.sliderID+"]").css({"position":"relative","width": width*(1+itemCount)});
	}else{
		jQuery("ul[id="+options.sliderID+"]").css({"position":"relative","height": height*(1+itemCount)});
	}
	var slideComplete=function(){
		jQuery("[id="+options.slideRight+"]").css("visibility",((stepAmount()>itemCount)?"hidden":"visible"));
		jQuery("[id="+options.slideLeft+"]").css("visibility",((scrollPos<=1)?"hidden":"visible"));
	}
	var doSlideLeft=function(e){
		e.preventDefault();
		if(scrollPos<=1){
			return ;
		}else{
			scrollPos-=options.slideAmtNum;
			doSlide();
		}
		doIntervalTime=options.scrollInterval*1000;
	};
	var doSlideRight=function(e){
		e.preventDefault();
		if(stepAmount()>itemCount){
			return ;
		}else{
			scrollPos+=options.slideAmtNum;
			doSlide();
		}
		doIntervalTime=options.scrollInterval*1000;
	};
	var stepAmount=function(){
		var amn=scrollPos+options.displayCount;
		return amn;
	};
	var doSlide=function(){
		if(options.direction=="horizontal"){
			jQuery("ul[id="+options.sliderID+"]").animate({right : ((scrollPos-1)*width)},options.duration*1000);
		}else{
			
			jQuery("ul[id="+options.sliderID+"]").animate({bottom : ((scrollPos-1)*height)},options.duration*1000);
		}
		slideComplete();
	};
	if(options.slideAmtNum>options.displayCount){options.slideAmtNum=options.displayCount;}
	/* hide arrow */
	if(options.displayCount>=itemCount){jQuery("[id="+options.slideRight+"]").css("visibility","hidden");}
	jQuery("[id="+options.slideLeft+"]").css("visibility","hidden");
	jQuery("[id="+options.slideLeft+"]").bind(options.slideAction,doSlideLeft);
	jQuery("[id="+options.slideRight+"]").bind(options.slideAction,doSlideRight);
	
	if(options.autoScroll){
		doIntervalTime=setInterval(function(){
			if(stepAmount()>itemCount){scrollPos=(1-options.slideAmtNum);}
			jQuery("[id="+options.slideRight+"]").trigger(options.slideAction);
		},options.scrollInterval*1000);
	}
};