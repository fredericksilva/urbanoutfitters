<!--
/*
 * cmcustom.js 
 * $Id: cmcustom-10067076-europe-032911.txt 167945 2011-04-06 17:57:09Z abrink $
 * $Rev: 167945 $
 *
 * The following functions aid in the creation of Coremetrics data tags.
 * 26 Jan 2010	CMICHAEL Add support for currency conversion. Changes to Shop Action, Order and calls to Maketag.
 * 29 Mar 2011  ABRINK   Update Product tag to support virtual categories / cm_vc.
 */
 
function cmCreateProductviewTag(productID, productName, categoryID, attributes, cm_vc) {
	cmMakeTag(["tid","5","pi",c1(cm_ClientID) ? c1(cm_ClientID) : "Product: " + productName + " (" + productID + ")","pr",productID,"pm",productName,"cg",categoryID,"pc","Y","cm_vc",cm_vc?cm_vc:cmExtractParameter("cm_vc",document.location.href),"cmAttributes",attributes]);
}

/*
 * Creates a Registration tag and/or a Newsletter tag
 *
 * customerID		: required for Registration. ID of Customer to register.
 * customerEmail	: required for Newsletters. Optional for Registration.
 * customerCity		: optional. City of Customer that placed this order
 * customerState	: optional. State of Customer that placed this order
 * customerZIP		: optional. Zipcode of Customer that placed this order
 * newsletterName	: required for Newsletters. The name of the Newsletter.
 * subscribe		: required for Newsletters. Either "Y" or "N"
 * customerCountry  : optional. Country of Customer
 * 
 */
function cmCreateRegistrationTag(customerID, customerEmail, customerCity, customerState, customerZIP, newsletterName, subscribe, customerCountry, attributes) {
	cmMakeTag(["tid","2","cd",customerID,"em",customerEmail,"ct",customerCity,"sa",customerState,"zp",customerZIP,"nl",newsletterName,"sd",subscribe,"cy",customerCountry,"cmAttributes",attributes]);
}
//-->