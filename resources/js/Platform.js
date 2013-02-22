/*WARNING!! PLEASE DO NOT AMEND THIS FILE IT WILL BE REMOVED IN WHEN BRANCH VENDA_5_3_13 IS AVAILABLE ON THIS SITE.*/

/**
 * @fileoverview Venda.Platform - A module for use across all the platform (includes VCP and website areas)
 * This will file will contain small universal functions that would be useful throughout the platform. These functions are stored as properteis of the 'platform'  symbol.
 * @author Aron San <asan@venda.com>
 */

/**
 * Stub function is used to support JSDoc.
 * @class Venda.Platform
 * @constructor
 */


/**
 * Gets the value of a specified URL parameter
 * @param {String} currURL 		this is the URL which you wish to get the URL parameter value from
 * @param {String} urlParam 	this is the name of the URL parameter you want to get the value for
 * @return match 							unescaped value for parameter specified urlParam if true else false
 */
function getUrlParam(url,urlParam) {
	//declare regular expression to be use.
	var re = new RegExp('[?&]'+urlParam+'=([^&]+)');
	var match = url.match(re);
	return match ? unescape(match[1]) : false;
};

/**
 * Produces encoded HTML to be safely displayed on a webpage which mitigates XSS risks.
 * @param {String} 							value to escape
 * @return container.innerHTML 	escaped value
 */
function escapeHTML(strToEscape) {
	var container = document.createElement('span');
	container.appendChild(document.createTextNode(strToEscape));
	return container.innerHTML;
};