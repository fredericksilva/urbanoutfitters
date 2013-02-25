/*******************************************************************************

FILE: mud_FadeGallery.js
REQUIRES: prototype.js
AUTHOR: Takashi Okamoto mud(tm) - http://www.mudcorp.com/
VERSION: 2.2.1 - autoplay option added
DATE: 01/13/2006

--------------------------------------------------------------------------------

This file is part of MudFadeGallery.

	MudFadeGallery is free for anyone to use, but this header MUST be
	included, and may not be modified.
	
--------------------------------------------------------------------------------

Usage:

MudFadeGallery('instance_var', 'img_var', imgsArray, options)

options:
	startNum: (int) image number to start with.
	preload: (bool) set whether you want to initially preload images.
	autoplay: (int) set if you want to autoplay the image slide, and define
					the time for switch in seconds. default: 0 (no autoplay)

*******************************************************************************/

var MudFadeGallery = Class.create();

MudFadeGallery.FADE_UP = new Array(0, 6, 11, 17, 23, 30, 38, 47, 56, 66, 75, 84, 92, 100);

MudFadeGallery.prototype = {
	
	/* ------------- CALLBACKS ------------- */
	/* ------------- EDITABLE -------------- */
	
	// runs right before fade begins
	onFadeStart: function() {
		var title = "...";
		var caption = "";
		if ($(this.id+"_title")) $(this.id+"_title").innerHTML = title;
		if ($(this.id+"_caption")) $(this.id+"_caption").innerHTML = caption;
		if ($(this.id+"_number")) $(this.id+"_number").innerHTML = (this.imgCurrent+1) + " of " + this.imgTotal + " projects";
	},
	
	// runs right after fade completes
	onFadeEnd: function() {
		var title = (this.imgsArray[this.imgCurrent].title) ? this.imgsArray[this.imgCurrent].title : "";
		var caption = (this.imgsArray[this.imgCurrent].caption) ? this.imgsArray[this.imgCurrent].caption : "";
		if ($(this.id+"_title")) $(this.id+"_title").innerHTML = title;
		if ($(this.id+"_caption")) $(this.id+"_caption").innerHTML = caption;
	},
	
	/* ------------- DON'T EDIT PAST HERE ------------- */
	
	initialize: function(thisObj, id, imgsArray, options) {
		this.id = id;
		this.thisObj = thisObj;
		this.imgsArray = imgsArray;
		this.imgTotal = imgsArray.length;
		this.opacity = 100;
		this.fadeFrame = 0;
		this.timerID = null;
		this.apTimerID = null;
		this.imgsLoaded = new Array(this.imgTotal);
		this.options = options;
		
		// checking options
		this.imgCurrent = (this.options.startNum) ? this.options.startNum : 0;
		if (this.options.preload) {
			window.setTimeout(this.thisObj+'.preloadImgs()', 50);
		}
		if (this.options.autoplay > 0) {
			var delay = this.options.autoplay * 1000 + 1000; // the additional 1000 compensates for the fade in time of the next image.
			this.apTimerID = window.setTimeout(this.thisObj + '.autoplayImgs(' + delay + ')', delay);
		}
	},
	
	changeImg: function(imgNum) {
		if (!this.imgsLoaded[imgNum]) {
			this.loadImgNumber(imgNum);
		}
		$(this.id).src = this.imgsLoaded[imgNum].src;
	},
	
	nextImg: function() {
		this.imgCurrent++;
		if (this.imgCurrent == this.imgTotal) {
			this.imgCurrent = 0;
		}
		this.doFade();
	},
	
	prevImg: function() {
		this.imgCurrent--;
		if (this.imgCurrent == -1) {
			this.imgCurrent = this.imgTotal - 1;
		}
		this.doFade();
	},
	
	showImg: function(imgNum) {
		if (this.imgCurrent != imgNum) {
			if (this.imgCurrent == -1) {
				this.imgCurrent = this.imgTotal - 1;
			}
			else if (this.imgCurrent > this.imgTotal-1) {
				this.imgCurrent = 0;
			}
			else this.imgCurrent = imgNum;
			this.doFade();
		}
	},
	
	doFade: function() {
		this.onFadeStart();
		Element.hide(this.id);
		// firefox seems to change the image too early
		// so we'll just insert a slight delay
		window.setTimeout(this.thisObj+'.changeImg('+this.imgCurrent+')', 50);
		if (!(/MSIE/.test(navigator.userAgent) && /Mac/.test(navigator.userAgent)))
			this.startFade();
		else {
			Element.show(this.id);
			this.onFadeEnd();
		}
	},
	
	startFade: function() {
		if (this.timerID) {
			window.clearTimeout(this.timerID);
			this.timerID = null;
		}
		// place delay before fade
		this.timerID = window.setTimeout(this.thisObj + ".fade()", 100); //was 500//
	},
	
	preloadImgs: function() {
		for (var i = 0; i < this.imgTotal; i++) {
			this.loadImgNumber(i);
		}
	},
	
	loadImgNumber: function(imgNumber) {
		// check if already loaded
		if (!this.imgsLoaded[imgNumber]) {
			this.imgsLoaded[imgNumber] = new Image();
			this.imgsLoaded[imgNumber].src = this.imgsArray[imgNumber].image;
		}
	},
	
	autoplayImgs: function(delay) {
		if (this.apTimerID) {
			window.clearTimeout(this.apTimerID);
			this.apTimerID = null;
		}
		this.nextImg();
		this.apTimerID = window.setTimeout(this.thisObj + ".autoplayImgs(" + delay + ")", delay);
	},
	
	apStart: function(delay) {
		if (!delay || delay < 1) delay = 1;
		delay = delay * 1000 + 1000;
		this.autoplayImgs(delay);
	},
	
	apStop: function(delay) {
		if (this.apTimerID) {
			window.clearTimeout(this.apTimerID);
			this.apTimerID = null;
		}
	},
	
	fade: function() {
		if (this.timerID) {
			window.clearTimeout(this.timerID);
			this.timerID = null;
		}
		this.calcOpacity(this.fadeFrame);
		this.setOpacity(this.opacity);
		this.fadeFrame++;
		if ($(this.id).style.display == "none") Element.show(this.id);
		if (this.fadeFrame < MudFadeGallery.FADE_UP.length) {
			this.timerID = window.setTimeout(this.thisObj + ".fade()", 20);
		}
		else {
			this.fadeFrame = 0;
			this.onFadeEnd();
		}
	},
	
	calcOpacity: function(frameNumber) {
		this.opacity = MudFadeGallery.FADE_UP[frameNumber];
	},
	
	setOpacity: function(opacity) {
		var obj = $(this.id).style;
		// Fix for math error in some browsers
		opacity = (opacity == 100) ? 99.999 : opacity;
		// IE/Windows
		obj.filter = "alpha(opacity:"+opacity+")";
		// Safari < 1.2, Konqueror
		obj.KHTMLOpacity = opacity/100;	
		// Older Mozilla and Firefox
		obj.MozOpacity = opacity/100;
		// Safari 1.2, newer Firefox and Mozilla, CSS3
		obj.opacity = opacity/100;
	}
}