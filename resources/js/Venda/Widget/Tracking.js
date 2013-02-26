/**
 * @fileoverview Venda.Widget.Tracking - Creates variables for use in tracking scripts, e.g. Google Analytics
 * 
 * The data used to populate the variables is contained in hidden divs in the required templates stated before the functions.
 * This file must be loaded before any tracking scripts that use it's variables e.g. templates/tracking/googleAnalyticsSnippet
 *
 * @author Oliver Secluna <oliversecluna@venda.com>
 */

// Initiate namespacing 
Venda.namespace('Widget.Tracking'); 

/**
 * Stub function is used to support JSDoc.
 * @class Venda.Widget.Tracking
 * @constructor
 */
Venda.Widget.Tracking = function (){};

/**
 * Create variable to pass current workflow step to tracking javascript
  * Requires templates/tracking/shared/workflowSteps
 */
Venda.Widget.Tracking.WorkflowSteps = function () {
	if (document.getElementById("tag-workflow")){
		var workflow = document.getElementById("tag-workflow").innerHTML;
		var curstep = document.getElementById("tag-curstep").innerHTML;
		curstep = curstep.replace(/^\s+|\s+$/g, "");
		Venda.Widget.Tracking.workflowStep = workflow + ":";
		Venda.Widget.Tracking.workflowStep += curstep;
		if (document.getElementById("tag-errorsboolean")){
			Venda.Widget.Tracking.workflowStep += "-error";
		}
	}
};

/**
 * Create variables to pass order details to tracking javascript
 * Requires templates/tracking/shared/orderDetails
 */
Venda.Widget.Tracking.OrderDetails = function(){
	if(document.getElementById("tag-trackingName")){
		var delimiter = "|";/*delimiter used in the venda_tracking tag above is used to split the arrays*/
		Venda.Widget.Tracking.orderNum = document.getElementById("tag-ohordnum").innerHTML;
		Venda.Widget.Tracking.orderTotal = document.getElementById("tag-ohtot").innerHTML;
		Venda.Widget.Tracking.orderTax = document.getElementById("tag-ohtax").innerHTML;
		Venda.Widget.Tracking.orderShip = document.getElementById("tag-ohship").innerHTML;
		Venda.Widget.Tracking.userCity = document.getElementById("tag-ohcity").innerHTML;
		Venda.Widget.Tracking.userState = document.getElementById("tag-ohstate").innerHTML;
		Venda.Widget.Tracking.userCountry = document.getElementById("tag-ohcntry").innerHTML;
		Venda.Widget.Tracking.storeName = document.getElementById("tag-ebizname").innerHTML;
		Venda.Widget.Tracking.oiname = document.getElementById("tag-trackingName").innerHTML.split(delimiter);
		Venda.Widget.Tracking.sku = document.getElementById("tag-trackingSku").innerHTML.split(delimiter);
		Venda.Widget.Tracking.qty = document.getElementById("tag-trackingQty").innerHTML.split(delimiter);
		Venda.Widget.Tracking.price = document.getElementById("tag-trackingPrice").innerHTML.split(delimiter);
		Venda.Widget.Tracking.ptype = document.getElementById("tag-trackingProducttype").innerHTML.split(delimiter);
	}
};
