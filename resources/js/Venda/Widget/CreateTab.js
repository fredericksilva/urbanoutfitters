/**
* jQuery plugin for display tabview please create css by class name .tabview
* @requires /venda-support/js/external/jquery-1.4.x.min.js
* @param {String} id of element
* @param {object}
*		activeIndex: set active index
* 		className: set class name for styling
*		hideEmpty: if this true hide tab that not has text inside
*		totalHide: total hidden tab
*		callBack():  the function that call after tab clicked
* @author Sakesan Panjamawat (Auii) <sakp@venda.com>
*/ 
Venda.namespace("Widget.createTab");

Venda.Widget.createTab = function(ID,config) {
	var defaults = {
		activeIndex:0,
		className:"tabview",
		hideEmpty:true,
		callBack:function(){}
	};
	this.totalHide=0;
	/* pass option from agrument to default */
	this.options=jQuery.extend(defaults, config);
	this.tabID=ID;
};

Venda.Widget.createTab.prototype= {
	/**
	 * Tab options
	 * @type Object
	 */
	options:{},
	/**
	 * Total empty tab 
	 * @type Number
	 */
	totalHide: null,
	/**
	 *  The element containing the tab
	 * @type jQuery Element
	 */
	tabElement: null,
	/**
	 *  The element containing the tab nav
	 * @type jQuery Element
	 */
	tabNav: null,
	 /**
	 * Set up the slider functionality.
	 */
	init: function(){
		jQuery(this.tabID).addClass(this.options.className);
		this.tabNav=jQuery(this.tabID).find(".tabheader > .nav li a");
		this.tabElement=jQuery(this.tabID).find(".tabcontent > div.tab");
		/* hide Empty tab first if options.hideEmpty was set */
		if(this.options.hideEmpty){
			this.hideEmptyTab(this.tabID);
		}
		if(this.totalHide<this.getTotalTab()){
			this.setActiveTab(this.options.activeIndex);
			/* pass this object into this.clickedTab for set/get tab options */
			this.tabNav.bind("click",{scope: this},this.clickedTab);
		}else{
			jQuery(this.tabID).hide();
		}
	},
	hideEmptyTab: function(ID){
		var totalHide=0,txt="";
		var activeTab = this.options.activeIndex;
		var setNewactiveTab = false;
		jQuery(ID).find(".tabheader > .nav li").each(function(i){
			txt=jQuery(ID).find(".tabcontent > div.tab").eq(i).text();
			txt=jQuery.trim(txt);
			if(txt.length==0){
				totalHide++;
				jQuery(ID).find(".tabheader > .nav li").eq(i).hide();
				jQuery(ID).find(".tabcontent > div.tab").eq(i).hide();
				if(i==activeTab){ setNewactiveTab=true; }
			}
		});
		if(setNewactiveTab){this.options.activeIndex=jQuery(ID).find(".tabheader > .nav li:visible").index(ID+' .tabheader > .nav li');this.setActiveTab(this.options.activeIndex);}		
		this.totalHide=totalHide;
	},
	/**
	 * active tab
	 * @type function
	 */
	setActiveTab: function(index){
		/* remove all class active from .nav li and hide all tab first */
		this.tabNav.parent().removeClass("active");
		this.tabElement.hide().removeClass("active");
		/* set class active to tab and .nav li */
		this.tabNav.eq(index).parent().addClass("active");
		this.tabElement.eq(index).addClass("active").show();
	},
	/**
	 * get tab number
	 * @type function
	 */
	getTotalTab: function(){
		return this.tabNav.length;
	},
	/**
	 * even on clicked tab
	 * @type function
	 */
	clickedTab: function(evt){
		/* prevent from event click */
		evt.preventDefault();
		/* pass obect::createTab for set active index and active Callback function  */
		var obj =evt.data.scope;
		/* find clicked tab index */
		obj.options.activeIndex=obj.tabNav.index(jQuery(this));
		/* do activeTab */
		obj.setActiveTab(obj.options.activeIndex);
		/* do callback(); */
		obj.options.callBack();
	}
};