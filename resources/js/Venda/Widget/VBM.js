/**
* @fileoverview Venda.Widget.VBM
 * Venda Behavioural Merchandising (VBM) replaces the Predictor Products functionality and offers Clients control unparalleled by Predictor Products
 * Data can be collected from:
 * Order history;
 * Click history;
 * Search history (both internal and external).
 *
 * @author Juanjo Dominguez <juanjodominguez@venda.com>
*/
Venda.namespace("Widget.VBM");
/**
 * Start Venda Behavioural Merchandising
 * Remove these functions if not using VBM to make file smaller
 */
Venda.Widget.VBM.showVBMH2 = function(ref) {
	var h2="h2"+ref;
	if (document.getElementById(h2)) {
		aHeader=document.getElementById(h2);
		aHeader.style.display='block';
	} 
};

Venda.Widget.VBM.hideVBMContent = function(){
	if(Venda.Widget.VBM.tabObj){
		jQuery(Venda.Widget.VBM.tabObj.tabID +" .tabcontent .vbmTab").html("");
		Venda.Widget.VBM.tabObj.hideEmptyTab(Venda.Widget.VBM.tabObj.tabID);
		jQuery(".vbmTab").hide();
	}
};
Venda.Widget.VBM.populateProductRecs = function(elref,recadded,vbmtrack) {
	if (elref==="vbmpd" && document.getElementById('tag-invtref')){
		var cj = new CookieJar({expires:'',path: '/'});
		var prodid = document.getElementById('tag-invtref').innerHTML;
		if (document.getElementById('__avail_log__')){
			var emark = new Emark(true);
		}else{
			var emark = new Emark();
		}
		if(cj.get("vbmtracker")){
			var trackCode = cj.get("vbmtracker").split(',');
		}else{
			var trackCode = "";
		}

		if (recadded === "" && vbmtrack === "true") {
		//For Tracking 'logClickedOn' function, check if a tracking-code has been passed to this page from the previous page (e.g. in a htxt), if it has, then we need to track logClickedOn.
			emark.logClickedOn(prodid, trackCode[0]);
	
		//For Tracking 'logAddedToCart' function
		}
		if (recadded !== "") {
			if (querySt("vbmrec") === "true"){
				emark.logAddedToCart(prodid, trackCode[1]);
				Venda.Widget.VBM.SaveSearch(prodid);
			}else{
				emark.logAddedToCart(prodid);
				Venda.Widget.VBM.SaveSearch(prodid);
			}	
		}
		var avaiInput = ["'ProductId:"+prodid+"'"];
		var prodRecs = emark.getRecommendations('ProductDetailRecs', avaiInput);
		
		//copy product recs from Avail to the vbmprods cookie
		emark.commit(function() { 
			cj.put("vbmprods",prodRecs);
			cj.put("vbmtracker",prodRecs.trackingcode+','+trackCode);
			jQuery("#vbm-panel-loading").ajaxStart(function(){
			   jQuery(this).show();
			});
			if (prodRecs!="") {
				jQuery("#vbm-panel-"+elref).load('/page/vbm',function(){
					if(jQuery(".vbmTab #vbm-panel-"+elref).find("li").length < 1){
						Venda.Widget.VBM.tabObj	= bottomtab;
						Venda.Widget.VBM.hideVBMContent();
					}
				});
				Venda.Widget.VBM.showVBMH2(elref);
			} else {
				jQuery("#vbm-panel-"+elref).hide();
				Venda.Widget.VBM.tabObj	= bottomtab;
				Venda.Widget.VBM.hideVBMContent();
			}
		});
	}
	if (elref==="vbmsrch" && document.getElementById('tag-searchterm')){
		var cj = new CookieJar({expires:'',path: '/'});
		var searchTerm = document.getElementById('tag-searchterm').innerHTML;
		if (document.getElementById('__avail_log__')){
			var emark = new Emark(true);
		}else{
			var emark = new Emark();
		}
		
		var searchadd = vbmtrack;
		if(searchadd !== ""){
			if (recadded !== "") {
					var saveSearch = emark.saveSearch(searchTerm,searchadd);
					emark.logAddedToCart(searchadd);
					Venda.Widget.VBM.SaveSearch(prodid);
			}
		}
		var avaiInputsearch = ["'Phrase:"+searchTerm+"'"];
		var prodRecs = emark.getRecommendations('SearchResultRecs', avaiInputsearch);

		emark.commit(function() { 
			cj.put("vbmprods",prodRecs.values);
			cj.put("vbmtracker",prodRecs.trackingcode);
			jQuery("#vbm-panel-loading").ajaxStart(function(){
			   jQuery(this).show();
			});

			if (prodRecs!="") {
				jQuery("#vbm-panel-"+elref).load('/page/vbmbasket',function(){
					if(jQuery(".vbmTab #vbm-panel-"+elref).find("li").length < 1){
						Venda.Widget.VBM.tabObj	= tabview;
						Venda.Widget.VBM.hideVBMContent();	
					}
				});
				Venda.Widget.VBM.showVBMH2(elref);
			} else {
				jQuery("#vbm-panel-"+elref).hide();	
				Venda.Widget.VBM.tabObj	= tabview;
				Venda.Widget.VBM.hideVBMContent();
			}
		});
	}
	if (elref==="vbmbasket" && document.getElementById('tag-basketitems')){
		var cj = new CookieJar({expires:'',path: '/'});
		var prodid = document.getElementById('tag-basketitems').innerHTML;
		prodid = prodid.split(",");
		prodid.pop(); //to remove the last element
		
		if (document.getElementById('__avail_log__')){
			var emark = new Emark(true);
		}else{
			var emark = new Emark();
		}
		
		if(cj.get("vbmtracker")){
			var trackCode = cj.get("vbmtracker").split(',');
		}else{
			var trackCode = "";
		}
		
		if (recadded !== "") {
			if (querySt("vbmrec") === "true") {
			}else{
				emark.logAddedToCart(recadded);
			}	
		}

		var avaiInputbasket = ["'ProductIds:"+prodid+"'"];
		var prodRecs = emark.getRecommendations('ShoppingCartRecs', avaiInputbasket);
		
		emark.commit(function() { 
			cj.put("vbmprods",prodRecs.values);
			cj.put("vbmtracker",prodRecs.trackingcode);
			jQuery("#vbm-panel-loading").ajaxStart(function(){
			   jQuery(this).show();
			});

			if (prodRecs!="") {
				jQuery("#vbm-panel-"+elref).load('/page/vbmbasket',function(){
					if(jQuery(".vbmTab #vbm-panel-"+elref).find("li").length < 1){
						Venda.Widget.VBM.tabObj	= bottomtab;
						Venda.Widget.VBM.hideVBMContent();
					}
				});
				Venda.Widget.VBM.showVBMH2(elref);
			} else {
				jQuery("#vbm-panel-"+elref).hide();
				Venda.Widget.VBM.tabObj	= bottomtab;
				Venda.Widget.VBM.hideVBMContent();
			}
		});
	}
	if (elref==="vbmuser" && document.getElementById('tag-useremail')){
		var cj = new CookieJar({expires:'',path: '/'});
		var userid = document.getElementById('tag-useremail').innerHTML;
		userid = userid.replace(/@/,"_AT_");
		userid = userid.replace(/\./,"_DOT_");
		if (document.getElementById('__avail_log__')){
			var emark = new Emark(true);
		}else{
			var emark = new Emark();
		}
		var avaiInputuser = ["'UserId:"+userid+"'"];
		var prodRecs = emark.getRecommendations('UserRecs', avaiInputuser);		

		emark.commit(function() { 
			cj.put("vbmprods",prodRecs.values);
			cj.put("vbmtracker",prodRecs.trackingcode);
			jQuery("#vbm-panel-loading").ajaxStart(function(){
			   jQuery(this).show();
			});

			if (prodRecs!="") {
				jQuery("#vbm-panel-"+elref).load('/page/vbm',function(){
					if(jQuery(".vbmTab #vbm-panel-"+elref).find("li").length < 1){
						Venda.Widget.VBM.tabObj	= bottomtab;
						Venda.Widget.VBM.hideVBMContent();
					}
				});
				Venda.Widget.VBM.showVBMH2(elref);
			} else {
				jQuery("#vbm-panel-"+elref).hide();
				Venda.Widget.VBM.tabObj	= bottomtab;
				Venda.Widget.VBM.hideVBMContent();				
			}
		});

	}
};

//'ClickStreamRecs' not used

Venda.Widget.VBM.SetCookie = function(htxtvalue,ivref) {
	// ivref is used on basket
	var vbmsearchKeyWord = htxtvalue;
	var searchWordHtxt = Venda.Platform.getUrlParam(window.location.href,'htxt');
	if (vbmsearchKeyWord !== "") {
		var cj = new CookieJar({expires: 3600 * 24 * 21, path: '/'});  
		cj.put("vbmsearchterm", htxtvalue);   
		cj.put("vbmivref", ivref);
	}
};
// capture vbmSearch Term
Venda.Widget.VBM.SaveSearch = function(ivref, quickB) {
	var cj = new CookieJar({expires: 3600 * 24 * 21, path: '/'});  
	var searchKeyWord = cj.get("vbmsearchterm");
	if(!ivref){
		var ivref = cj.get("vbmivref");
	}
	if(quickB) {
		var emark = new Emark();
		emark.logAddedToCart(ivref);
	//	alert("logAddedToCart with ivref: "+ivref);
	}
	else {
	if (!quickB && searchKeyWord !== "" && searchKeyWord != null) {
		var emark = new Emark();
		var saveSearch = emark.saveSearch(searchKeyWord,ivref);
		emark.commit();
		cj.remove("vbmsearchterm");
		cj.remove("vbmivref");
	}}
};
// prevent double logging
Venda.Widget.VBM.SetCheck = function() {
	var VBM_CHECK = 'vbmchecking';
	var cjVBM = new CookieJar({expires:'',path: '/'});
	cjVBM.put(VBM_CHECK, "1");
};
