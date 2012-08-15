/**
 * @fileoverview Venda.Widget.RecentlyViewedItems - cookie based recently viewed items.
 *
 * This widget enables us to set a cookie each time a user lands on the product detail.  
 * The script also uses the ajax function to write items to the page.
 * @author Dan Brook <dbrook@venda.com>
 */

//create namespace
Venda.namespace("Widget.RecentlyViewedItems");

//declare constants here
Venda.Widget.RecentlyViewedItems.SEPARATOR   = ',';
Venda.Widget.RecentlyViewedItems.COOKIE_NAME = 'RVI';

//declare object property
Venda.Widget.RecentlyViewedItems.check = 1;

/**
 * calls the cookie and then splits it to be displayed in the saveRecentlyViewedItems
 * @params {string} set rviCookie name and separate it using the SEPARATOR
 */
Venda.Widget.RecentlyViewedItems.getRecentlyViewedItems = function (rviCookie) {
  return rviCookie.split(Venda.Widget.RecentlyViewedItems.SEPARATOR);
};
/**
 * @constructor
 * @class get the item and set the cookie with name and value.
 * @requires CookieJar						/venda-support/js/external/cookiejar.js
 * @param {string} get the item name (product sku)
 * @param {string} cj is the instance cookieJar to set cookie
 * @param {string} numberofrvi is the amount of rvi to be displayed in the cookie
 */
Venda.Widget.RecentlyViewedItems.saveRecentlyViewedItems = function (item, cj, numberofrvi) {
  var cookieVal = '';
  var rviCookie = cj.get(Venda.Widget.RecentlyViewedItems.COOKIE_NAME);
		var cj = new CookieJar({expires: 3600 * 24 * 7, path: '/'});
  if(rviCookie) {
    var rvi = Venda.Widget.RecentlyViewedItems.getRecentlyViewedItems(rviCookie);
    // Don't need to set the cookie if this item is already in the list.
    for(var i = 0; i < rvi.length; i++)
      if(rvi[i] == item)
        return;
    rvi.unshift(item);
    cookieVal += rvi.slice(0,numberofrvi).join(Venda.Widget.RecentlyViewedItems.SEPARATOR);
  } else
    cookieVal += item;
		/**
		 * update the cookie
		 */
  return cj.put(Venda.Widget.RecentlyViewedItems.COOKIE_NAME, cookieVal);
};

/**
 * the following function is called on the product detail
 * template to set the item into the cookie
 * @param {string} invtref is the product sku reference
 * @param {string} numberofrvi are the amount of RVI's being set
 */
Venda.Widget.RecentlyViewedItems.setRecentlyViewedItems = function (invtref,numberofrvi) {
	var cj = new CookieJar({expires: 3600 * 24 * 7, path: '/'});
	var rviCookie = cj.get(Venda.Widget.RecentlyViewedItems.COOKIE_NAME);
		if(rviCookie) {
			document.getElementById('showRVI').style.display="block";
	 }
	Venda.Widget.RecentlyViewedItems.saveRecentlyViewedItems(invtref, cj,numberofrvi);
};
/**
 * the following function is called on the left navigation 
 * to display the text version of the RVI.  
 */
Venda.Widget.RecentlyViewedItems.setRVISiteWide = function () {
	var cj = new CookieJar({expires: 3600 * 24 * 7, path: '/'});
	var rviCookie = cj.get(Venda.Widget.RecentlyViewedItems.COOKIE_NAME);
	if(rviCookie) {
		document.getElementById('showRVISiteWide').style.display="block";
	}
};
/**
 * erase recently viewed items cookie when user logs out
 */
Venda.Widget.eraseCookieIfLoggedOut = function(cookieName) {
	var urlParam = '';
	var loggedout = 4;
	urlStr = document.location.href.split('&');
	for (i=0; i<urlStr.length; i++) {
		var t = urlStr[i].split('=');
		if (t[0] == "log")	{
			urlParam = t[1];
		}
	}
	if (urlParam==loggedout) {
		//erase the cookie cookieName
		new CookieJar({path: '/'}).remove(cookieName);
	}
	return  urlParam;
};

jQuery(function(){Venda.Widget.eraseCookieIfLoggedOut("RVI")});