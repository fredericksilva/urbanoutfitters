/**
 * @fileoverview Venda.Widget.CompareProduct - cookie based compare functionality.
 *
 * This widget enables us to compare products within a category which are of the same product type.  
 * The script also uses the ajax function to write items to the page.
 * @author Arunee Keyourawong (May) <Keyourawong@venda.com>
 */

//create namespace
Venda.namespace("Widget.Compare"); 

//declare constants here
var COOKIE_PRODUCT = 'CPIDetail';
var CPI_SEPARATOR   = ',';
var CPI_COOKIE_NAME = 'CPI';
var numberCompare =1;

//declare object property
Venda.Widget.Compare.check = 1;

Venda.Widget.Compare.config = {
    ebizUrl :'',
    currCategory : '',
    alwaysdisplay:'',
    comparePage:'',
    allcondition:'',
    elxtCompareNumber:'',
	compareTitle:'',
	comparePopupSetting:null
};

Venda.Widget.Compare.setConfig = function (config) {
   for (eachProp in config) {
         Venda.Widget.Compare.config[eachProp] = config[eachProp];
    }
};

/**
 * cookie string format: category***producttype**+sku+sku:category***producttype**+sku+sku
 * e.g. gamecube***product**+fifa+grand:dvdcinema***cinema**+79459+akira
 *
 * category- category this product is in
 * producttype - the product type of the selected product.
 * sku - sku of the selected product
 */

/**
 * This function splits a cookie string with commas.
 * @return splitted cookie strings.
 */
Venda.Widget.Compare.getCompareItems = function(cpiCookie) {
    return cpiCookie.split(CPI_SEPARATOR);
};

/**
 * This function returns all the cookie strings.
 * @return cookie string
 */
Venda.Widget.Compare.getCPICookie = function (cpiCookieName) {
    var cj = new CookieJar({expires: 3600 * 24 * 7, path: '/'});  
    var cpiCookie = cj.get(cpiCookieName);
    return cpiCookie;
};

/**
 * This function saves cookies string to the cookie.
 * @param {string} CookieVal is the cookie value.
 */
Venda.Widget.Compare.putCompareCookie = function (cpiCookieName,CookieVal){
    var cj = new CookieJar({expires: 3600 * 24 * 7, path: '/'});  
    cj.put(cpiCookieName, CookieVal);
};

/**
 * This function returns a string of the format sku::name::description::image
 * @param {string} sku is sku of the product
 * @param {string} name is name of the product
 * @param {string} image is image source of the product
 * @returns a string of the product detail
*/
Venda.Widget.Compare.buildProductString = function (sku,name,image) {
	var productString = sku +"::"+ name +"::" + image;
	return productString;
};


Venda.Widget.Compare.isShow = function() {
    if (this.config.allcondition[this.config.comparePage] == "1"){
        return true;
    }else{
        return false;
    }
};




/**
 * This function provides a cookie string of a current category, and display all the selected products by ajax.
 * @requires /venda-support/js/Ajax.js 
 * @param {string} categoy is a current category.
 * @param {string} ebizurl is the ebiz URL.
 */
Venda.Widget.Compare.loadCompareItems = function () {
    var cpiCookie = Venda.Widget.Compare.getCPICookie(CPI_COOKIE_NAME);
    //find current category that we are looking in
    var curCategory = this.config.currCategory;

    if(curCategory!=''){
        Venda.Widget.Compare.alwaysdisplaybox();  
    }

    if((cpiCookie) && (curCategory!='')) {
        //get string of category in cookie, category1***producttype**+sku+sku:
        var compareList = Venda.Widget.Compare.getCategoryString(curCategory, cpiCookie);
        if(compareList!=""){
        var cpi = Venda.Widget.Compare.getProductCompareList(compareList);

            // Load the compare items list.
            for(var i = 0; i < cpi.length; i++) {
                var item = cpi[i];
                numberCompare++;
                Venda.Widget.Compare.setCompareItems(item);
            }
        }
    }
	//Venda.Widget.Compare.loadingPanel();
	//Venda.Widget.Compare.setPopupCompare();
};
/**
 * Show compare product feature panel
 * Will show/hide generated feature popup
 * @param {string} compareUrl used to get compare content to display in light box
 */
Venda.Widget.Compare.popupCompare= function(compareUrl) {
	var dialogOpts = { dialogClass:'compareDialog', width: 'auto', autoOpen: false,closeOnEscape:true,resizable: false, modal: true,close: function() {dialogObj.dialog( "destroy" ); dialogObj.remove(); }}
	var H=jQuery(window).height();
	divObj = jQuery("<div>").attr("id","comparePopup").appendTo("body");
	dialogObj = jQuery(divObj);/* popup object */
	dialogObj.dialog(dialogOpts);
	dialogObj.addClass("loadingImg");
	jQuery(".ui-dialog-titlebar").hide();
	jQuery(".ui-dialog").popupIframe();		
	dialogObj.dialog("open");
	dialogObj.load(compareUrl,function(){		
		dialogObj.removeClass("loadingImg");
		jQuery(".ui-dialog-titlebar").show();
		var setHeight = H - dialogObj.height();
		dialogObj.dialog("option","position", setHeight);		
		Venda.Widget.Compare.closeCompare(".close");
	});
	jQuery('.ui-widget-overlay').live('click',function() {
		dialogObj.dialog("close");
	});	
};
/**
 * Bind event click to close link
 */
Venda.Widget.Compare.closeCompare = function(closePopupId) {
	jQuery(closePopupId).click(function(){
		dialogObj.dialog("close");
		return false;
	});
};

Venda.Widget.Compare.doMainWindow = function(url) {
	window.location.href=url; 
	dialogObj.dialog("close");
};
/**
 * This function adds a product information to the cookie string and display that product in a compare list area.
 * Listed below are all conditions used by this function:
 * Case 1: if the cookie string does not exist, the function will create a new cookie string.
 * Case 2: if the cookie string does exist, the function will check the category ,
 * Case 2.1: if it does not match with the previous category, it will append the category to the cookie string,
 * Case 3: if it matches with the previous category, the function will check product type,
 * Case 3.1: if it does not match with the previous product type, it will display a warning,
 * Case 4: if it matches with the previous product type, it will check the product SKU,
 * case 4.1: if it does not match with the previous product SKU,  it will append the product to the cookie string,
 * case 4.2: if it matches the previous product SKU, it will display a warning.
 * @param {string} productType is the product type of the selected product
 * @param {string} sku is the SKU of the selected product
 */

Venda.Widget.Compare.addToCompare = function (productType,sku,whichForm){
    var cookieVal = '';
    var cpiCookie = Venda.Widget.Compare.getCPICookie(CPI_COOKIE_NAME);// get the compare cookie
    var newCookieVal = "";
    var curCategory = this.config.currCategory;
    var ebizurl = this.config.ebizUrl;
  
        if(cpiCookie){
            var categoryStr = Venda.Widget.Compare.getCategoryString(curCategory, cpiCookie);
            var productExists = Venda.Widget.Compare.getCompareProductExists(sku, categoryStr);
            if(categoryStr!=""){
                // category is existent in cookie
                var productyTypeExists = Venda.Widget.Compare.getProductTypeString(productType, categoryStr);  
   
                //check if the product has same product type and it has not been saved
                if((productyTypeExists)&&(productExists!="true")){

                    if((numberCompare <= this.config.elxtCompareNumber) && (numberCompare <= 20)){
                        //  combine product with the existing category string
                        var  newCategoryString= categoryStr + productExists; 
                        newCookieVal = Venda.Widget.Compare.reCombineCompareCookie(curCategory, newCategoryString, cpiCookie);
                        Venda.Widget.Compare.putCompareCookie(CPI_COOKIE_NAME,newCookieVal);   
                        Venda.Widget.Compare.setCompareItems(sku);
                        numberCompare++; 
                    }else{
                     alert(this.config.removeItemBeforeMessage);
                    }
                      
                }else if((productyTypeExists)&&(productExists=="true")){
                    //check if the product has same product type and it has been saved
                    alert(this.config.productExistsMessage);
                }else{
                    // product type is difference
                    alert(this.config.differenceProductTypeMessage);
                }    
            }else{
                // cookie value existing and category doesn't existing
                numberCompare++;
                var newProdTypeStr = Venda.Widget.Compare.doProductTypeString(productType,productExists);
                var newCatStr = Venda.Widget.Compare.doCategoryString(curCategory, newProdTypeStr);
                newCookieVal = Venda.Widget.Compare.reCombineCompareCookie(curCategory, newCatStr,cpiCookie);
                Venda.Widget.Compare.putCompareCookie(CPI_COOKIE_NAME,newCookieVal);   
                Venda.Widget.Compare.setCompareItems(sku);                     
            }
        }else{
                // cookie is null, save cookie string into cookie value and show products in compare box
                numberCompare++;
                var newProdStr = Venda.Widget.Compare.doProductString(sku);
                var newProdTypeStr = Venda.Widget.Compare.doProductTypeString(productType,newProdStr);
                newCookieVal = Venda.Widget.Compare.doCategoryString(curCategory, newProdTypeStr);
                Venda.Widget.Compare.putCompareCookie(CPI_COOKIE_NAME,newCookieVal);   
                Venda.Widget.Compare.setCompareItems(sku);
        }
};

/**
 * This function adds a product information to the cookie string
 * @param {string} productType is product type of the product
 * @param {string} sku is sku of the product
 * @param {string} name is name of the product
 * @param {string} image is image source of the product
 */
Venda.Widget.Compare.addToCompareAndProductString = function (productType,sku,name,image) {
	Venda.Widget.Compare.productString(sku,name,image);
	Venda.Widget.Compare.addToCompare(productType,sku);
};


/**
 * This function adds a product information to the cookie string
 * @param {string} sku is sku of the product
 * @param {string} name is name of the product
 * @param {string} image is image source of the product
 */
Venda.Widget.Compare.productString = function (sku,name,image) {
    var productNameArray = new Array();
    var productExists = false;
    var cpiDetailCookie = Venda.Widget.Compare.getCPICookie(COOKIE_PRODUCT);
    var prodStr = Venda.Widget.Compare.buildProductString(sku,name,image);
   // prodStr =  escape(prodStr);
    if(cpiDetailCookie){
        var productInfoArray = cpiDetailCookie.split("*+*");
        for (var i = 0; i < productInfoArray.length; i++) {
            productExists = Venda.Widget.Compare.getCompareProductExistsDetail(sku,productInfoArray[i]);
            if(productExists){
               break;
            }
        }

         if(!productExists){
            var CookieVal = cpiDetailCookie+ "*+*" + prodStr;
            Venda.Widget.Compare.putCompareCookie(COOKIE_PRODUCT,CookieVal); 
         }
    }else{
        Venda.Widget.Compare.putCompareCookie(COOKIE_PRODUCT,prodStr); 
    }
};

/**   
 * This function displays the product compare list area.
 * @param {string} sku is sku of the product 
 */
Venda.Widget.Compare.setCompareItems = function (sku) {
    var cpiDetailCookie = Venda.Widget.Compare.getCPICookie(COOKIE_PRODUCT);

    if(cpiDetailCookie){
        var productInfoArray = cpiDetailCookie.split("*+*");
    
        for (var i = 0; i < productInfoArray.length; i++) {
            var productExists = Venda.Widget.Compare.getCompareProductExistsDetail(sku,productInfoArray[i]);
            if(productExists){
                Venda.Widget.Compare.getCompareProductsHtml(productInfoArray[i]);
            }
        }
            document.getElementById('compareProduct').style.display="block";
            document.getElementById('compareButton').style.display="block";
    } 
};

/**   
 * This function displays the product in  compare list area.
 * @param {string} sku is sku of the product 
 */
Venda.Widget.Compare.getCompareProductsHtml = function (product) {
    product = unescape(product);
    var productInfoArray = product.split("::"); 
    var compareProductsHtml = document.getElementById("cpilist").innerHTML;
    compareProductsHtml = compareProductsHtml +
     "<li><div class='deletecomp'><a href='#' onClick='Venda.Widget.Compare.deleteCompareItems(this.parentNode.parentNode,\""+productInfoArray[0]+"\");return false;'><span></span></a></div>"
    +"<div class='image'><img src='"+productInfoArray[2]+"' alt='"+productInfoArray[1]+"'></a></div>"
    + "<div class='details'><p><a href='" +this.config.ebizUrl +"/invt/"+ productInfoArray[0] +"'>"+productInfoArray[1]+"</a></p>"+"</div></li>";
		
    var compareProductsBox = document.getElementById("cpilist");
	if ((compareProductsHtml != "nohtml") && (compareProductsHtml != "")) {
		compareProductsBox.innerHTML = compareProductsHtml;
	}
};


/**   
 * This function deletes all products from product compare list area at current category
 */
Venda.Widget.Compare.deleteAll = function () {
    var CookieVal = '';
    var cpiCookie = Venda.Widget.Compare.getCPICookie(CPI_COOKIE_NAME);
    var curCategory = this.config.currCategory;
    var alwaysDisplay = this.config.alwaysdisplay;
    var separateCat = cpiCookie.split(":");
    for(var i = 0; i < separateCat.length; i++){
      var categoryString = separateCat[i].indexOf(curCategory + "***");
        if(categoryString !=-1){ 
                separateCat.splice(i, 1);
        } 
    }   
    separateCat = separateCat.join(":");
    Venda.Widget.Compare.putCompareCookie(CPI_COOKIE_NAME,separateCat);
    document.getElementById("cpilist").innerHTML = "";
    Venda.Widget.Compare.alwaysdisplaybox();
    if(this.config.setAlwaysShowCompare == 1 ){
        Venda.Widget.Compare.putCompareCookie(COOKIE_PRODUCT,CookieVal); 
    }
    numberCompare = 1;
};

/**   
 * This function removes a particular product item from product compre list area.
 * @item {string} item is the selected product.
 */
Venda.Widget.Compare.deleteCompareItems = function (oNode,item) {
    var cpiCookie = Venda.Widget.Compare.getCPICookie(CPI_COOKIE_NAME);
    var newCookieVal = "";
    var curCategory = this.config.currCategory;
    var compareList=Venda.Widget.Compare.getCategoryString(curCategory, cpiCookie);
    var cpi = compareList.split("+");

    for(var i = 0; i < cpi.length; i++){
            if(cpi[i] == item){ 
               cpi.splice(i, 1);
            numberCompare--;
        }   
     }
     if(cpi.length==1){
            cpi="";
            numberCompare = 1;
            Venda.Widget.Compare.alwaysdisplaybox();
     }else{
            cpi = cpi.join("+");
     }
     newCookieVal = Venda.Widget.Compare.reCombineCompareCookie(curCategory, cpi,cpiCookie);
     Venda.Widget.Compare.putCompareCookie(CPI_COOKIE_NAME,newCookieVal);   
     oNode.parentNode.removeChild(oNode);
};

/**
 * This function check to alwarys display the product compare box.
 */
Venda.Widget.Compare.alwaysdisplaybox = function () {
    var alwaysDisplay = this.config.alwaysdisplay;
    if(alwaysDisplay == 1 ){
        document.getElementById("compareProduct").style.display="block";
        document.getElementById("compareButton").style.display="none";
    }else{
        document.getElementById("compareProduct").style.display="none";
    }
};

/**
 * This function gets the product SKU from cookie string.
 * @param {string} compareList is a set of string in the current category.
 * @return {string} a set of SKUs
 */
Venda.Widget.Compare.getProductCompareList = function (compareList) {
    var cpi = compareList.split("+");
    cpi.splice(0,1);
    return cpi;
};



/**   
 * This function gets a set of current category strings from the whole cookie string.
 * @param {string} curCategory is the current category.
 * @param {string} cpiCookie is the whole cookie string.
 * @returns the string of a current category.
*/
Venda.Widget.Compare.getCategoryString = function (curCategory,cpiCookie){
    var categoryString = curCategory + "***";  
    var begin = cpiCookie.indexOf(categoryString);  
    var end = cpiCookie.indexOf(":", begin);
    if (begin == -1) {
        return "";
    }else{
        if (end == -1) {
            end = cpiCookie.length;
        }
       return unescape(cpiCookie.substring(begin, end));
    }
};

/**   
 * This function checks the product type if it does exist.
 * @param {string} productType is the product type of the selected product.
 * @param {string} categoryStr is the current category string.
 * @returns "true" if the product type does exist, and "false" if the product type does not exist. 
 */
Venda.Widget.Compare.getProductTypeString = function (productType,categoryStr){
	var prodTypeStr = "***"+productType+"**";
    var getProdType = categoryStr.indexOf(prodTypeStr);
    if(getProdType == -1){
        return false;
    }else{
        return true;
    }
};

/**   
 * This function checks the product SKU if it does exist.  
 * @param {string} sku is the product SKU of the selected product.
 * @param {string} categoryStr is the current category string.
 * @returns "true" if the product SKU does exist, or a set of product SKUs.
 */
Venda.Widget.Compare.getCompareProductExists = function (sku, categoryStr){
	var getProductExists = "";
	var prodList = categoryStr.split("+");
	for (var i = 1; i < prodList.length; i++){
		if(sku == prodList[i]){
			 getProductExists = "1";
		}
	}
   if(getProductExists == '1'){
        return "true";
    }else{
        var returnString =  "+"+sku;
        return returnString;
    }
};

/**   
 * This function checks the product SKU if it does exist in cipDetail cookie.  
 * @param {string} sku is the product SKU of the selected product.
 * @param {string} categoryStr is the current category string.
 * @returns "true" if the product SKU does exist, or false if the product SKU doesn't exist.
 */
Venda.Widget.Compare.getCompareProductExistsDetail = function (sku, categoryStr){
    categoryStr =unescape(categoryStr);
    var splitProduct = categoryStr.split("::");
    if (sku == splitProduct[0]){
            return true;
    }else{
            return false;
    }
};

/**   
 * This function provides a product SKU with "+" prefix.
 * @param {string} sku is the product SKU of the selected product.
 * @returns a product SKU with "+" prefix, for example, "+sku".
 */
Venda.Widget.Compare.doProductString = function (sku) {
	var returnString =  "+"+sku;
	return returnString;
};

/**   
 * This functions provides a product type with "**" prefix.
 * @param {string} productType is the product type of the selected product.
 * @param {string} productString is a set of product SKUs.
 * @returns a set of product type with "**" prefix and a set of product SKUs, for example, "producttype**+sku"
 */
Venda.Widget.Compare.doProductTypeString = function (productType,productString) {
	var returnString = productType + "**"+ productString;
	return returnString;
};

/**   
 * This function provides a  category with "***" prefix with a set of product type string.
 * @param {string} categoy is the current category.
 * @param {string} productTypeString is a set of product type and SKUs.
 * @returns a set of category string, for example, "cetegory***producttype**+sku".
 */
Venda.Widget.Compare.doCategoryString = function (category,productTypeString) {
	var returnString = category + "***"+ productTypeString ;
	return returnString;
};

/**   
 * This function combines category string with the existing cookie.
 * @param {string} categoryId is the current category.
 * @param {string} newCategoryString is a new set of category string.
 * @param {string} compareCookie is the whole cookie string.
 * @returns a new cookie string.
 */
Venda.Widget.Compare.reCombineCompareCookie = function (categoryId, newCategoryString, compareCookie) {
	// first split the compareCookie into categoryStrings
	var categoriesArray = compareCookie.split(":");
	var categoryStringReplaced = "false";
	var newCompareCookie = "";
	if (categoriesArray.length > 0) {
		for (var i = 0; i < categoriesArray.length; i++)
		{
			var thisCategoryString = categoriesArray[i];
			if (thisCategoryString != "") {
				// is this the category we are replacing?
				if (thisCategoryString.indexOf(categoryId) != -1) {
					thisCategoryString = newCategoryString;
					categoryStringReplaced = "true";
				}
				if (newCompareCookie != "") {
					newCompareCookie = newCompareCookie + ":" + thisCategoryString;
				}else 
				{
					newCompareCookie = thisCategoryString;
				}
			}
		}
		
		if (categoryStringReplaced == "false") {
			newCompareCookie = newCategoryString + ":" + newCompareCookie;
		}
	}
	return newCompareCookie;
};

/**   
 * This function displays all selected products of current catagory in product compare list area.
 * @returns a cookie string.
 */
Venda.Widget.Compare.toCompareItems = function () {
    var curCategory = this.config.currCategory;
    var cpiCookie = Venda.Widget.Compare.getCPICookie(CPI_COOKIE_NAME);
    var compareList = Venda.Widget.Compare.getCategoryString(curCategory, cpiCookie);
    var cpi = Venda.Widget.Compare.getProductCompareList(compareList);
    return cpi;
};
