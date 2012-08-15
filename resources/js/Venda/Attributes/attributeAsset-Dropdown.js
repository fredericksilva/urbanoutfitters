/**
* @fileoverview Venda.Attributes
 * Venda's Attributes functionality incorporates a standardized way of interfacing Attribute Products with the front-end as to make
 * the modification and creation of selection methods easier.
 *
 * These are the dropdown assets required for intefaces that use select dropdown boxes.
 *
 * @author Alby Barber <abarber@venda.com>
 * @author Donatas Cereska <DonatasCereska@venda.com>
*/

Venda.Attributes.UpdateDD = function (attName, uID) {

	for(var i = 0; i < Venda.Attributes.productArr.length; i++) {
		if (Venda.Attributes.productArr[i].attSet.id == uID) {
			var options = '<option value="">' + jQuery('#attributes-optionDefault').text() + '</option>';
			var att1 = Venda.Attributes.productArr[i].attSet.att1.selected,
				att2 = Venda.Attributes.productArr[i].attSet.att2.selected,
				att3 = Venda.Attributes.productArr[i].attSet.att3.selected,
				att4 = Venda.Attributes.productArr[i].attSet.att4.selected;	
					
			for (var t = 0; t < Venda.Attributes.productArr[i].attSet[attName].options.length; t++) {
				
				var attOption 	= Venda.Attributes.productArr[i].attSet[attName].options[t]
					
				if (attName == 'att1'){
					var stockstatus = Venda.Attributes.GetAll(Venda.Attributes.productArr[i].attSet.att1.options[t], att2, att3, att4, 'stockstatus', uID);
				}
				if (attName == 'att2'){
					var stockstatus = Venda.Attributes.GetAll(att1, Venda.Attributes.productArr[i].attSet.att2.options[t], att3, att4, 'stockstatus', uID);
				}			
				if (attName == 'att3'){
					var stockstatus = Venda.Attributes.GetAll(att1, att2, Venda.Attributes.productArr[i].attSet.att3.options[t], att4, 'stockstatus', uID);
				}
				if (attName == 'att4'){
					var stockstatus = Venda.Attributes.GetAll(att1, att2, att3, Venda.Attributes.productArr[i].attSet.att4.options[t], 'stockstatus', uID);
				}
				
				options += '<option data-attText="' + Venda.Attributes.productArr[i].attSet[attName].options[t] + '" value="'+ Venda.Attributes.productArr[i].attSet[attName].optionValues[t] +'">' + Venda.Attributes.productArr[i].attSet[attName].options[t] + ' - ' + stockstatus + '</option>';
			}
			
			jQuery("select[id='"+ attName +"_" + uID + "']").html(options).val(Venda.Attributes.productArr[i].attSet[attName].selectedValue);
		}
	}
};
