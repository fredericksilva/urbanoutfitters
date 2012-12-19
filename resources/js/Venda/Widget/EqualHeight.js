/**
* @fileoverview Venda.Platform.EqualHeight
*
* This script provides us with the ability to set the same height for the html element.
* Mostly use to format the product within the same row by set the same height for each html element.
*
* @requires JQuery
* @author Donatas Cereska <dcereska@venda.com>
*/

//create namespace
Venda.namespace('Platform.EqualHeight');

/**
* Stub function is used to support JSDoc.
* @class Venda.Platform.EqualHeight
* @constructor
*/
Venda.Platform.EqualHeight = function () { };

/**
* This function will find the max height of each class and set the max height to that class
* @param {Element} each value in Array - the html element and class name to set height
*/
Venda.Platform.EqualHeight.init = function (elementsToSet) {
    var elementsToSetLen = elementsToSet.length;
    for (var i = 0; i < elementsToSetLen; i++) {
        var maxHeight = 0;
        jQuery(elementsToSet[i]).each(function () {
            var curHeight = jQuery(this).height();
            if (curHeight >= maxHeight) {
                maxHeight = curHeight;
            }
        });
        jQuery(elementsToSet[i]).css((jQuery.browser.msie && jQuery.browser.version < 7 ? '' : 'min-') + 'height', maxHeight + 'px');
    }
};

jQuery(function () {
    if (typeof Venda.Platform.EqualHeight != "undefined") {
        var classtoset = new Array('.storeListHolder .store', '#iacc li', '#iacc li .image', '#iacc li .details', '#iacc li .details h2', '#iacc li .details .invtdesc2', '#iacc li .details .priceDetails', '#iacc li .details .price', '#iacc li .details .release', '#iacc li .details .moreInfo', '#substitute li', '#substitute li .image', '#substitute li .details', '#substitute li .details h2', '#substitute li .details .invtdesc2', '#substitute li .details .priceDetails', '#substitute li .details .price', '#substitute li .details .release', '#substitute li .details .moreInfo', '#rvilist li', '#rvilist li .image', '#rvilist li .details', '#rvilist li .details h2', '#rvilist li .details .invtdesc2', '#rvilist li .details .priceDetails', '#rvilist li .details .price', '#rvilist li .details .release', '#rvilist li .details .moreInfo', '#sliderlist li', '#sliderlist li .image', '#sliderlist li .details', '#sliderlist li .details h2', '#sliderlist li .details .invtdesc2', '#sliderlist li .details .priceDetails', '#sliderlist li .details .moreinfo', '.prodsGrid li .image', '.prodsGrid li .icatsdesc', '.prodsGrid li .moreInfo', '.catsList li', '.catsList li .image', '.catsList li .itemInfo', '.catsList li .itemInfo h2', '.catsList li .itemInfo p', '.catsList li .itemInfo .moreLink', '.featprods li', '.featprods li .image', '.featprods li .details', '.featprods li .details h2', '.featprods li .details .invtdesc2', '.featprods li .details .priceDetails', '.featprods li .details .price', '.featprods li .details .release', '.featprods li .details .moreInfo', '.bestsellers li', '.bestsellers li .image', '.bestsellers li .details', '.bestsellers li .details h2', '.bestsellers li .details .invtdesc2', '.bestsellers li .details .priceDetails', '.bestsellers li .details .price', '.bestsellers li .details .release', '.bestsellers li .details .moreInfo', '#sliderlist li', '#sliderlist li .image', '#sliderlist li .details', '#sliderlist li .details h2', '#sliderlist li .details .invtdesc2', '#sliderlist li .details .priceContainer', '#sliderlist li .details .price', '#sliderlist li .details .release', '#sliderlist li .details .moreInfo', '#address_list li', '#address_list li .header', '#address_list li .addressBox', '#orderdetail #paymentdetailSection .boxContent');
        Venda.Platform.EqualHeight.init(classtoset);
    }
});