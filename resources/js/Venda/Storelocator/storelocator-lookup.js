/**
* @fileoverview Venda.storeloc
 * Venda's storeloc storelocator: This functionlaity  is a storelocator for store search and DTS 
 *
 * @requires js/external/jquery-1.7.2.min.js
 * @requires js/external/jquery-tmpl-min.js
 * @requires js/external/jquery-ui-1.8.14.custom.min.js
 * @requires Google Maps API
 *
 * @author Alby Barber <abarber@venda.com>
*/

Venda.namespace('storeloc');
Venda.storeloc = function () {};

jQuery(document).ready(function() {

    /**
    * Config options
    */
    Venda.storeloc.unitsInMiles = false;


    /**
    * Declares global vars
    */
    Venda.storeloc.limit = 5;
    // Conversion rate for METERS to MILES 
    Venda.storeloc.METERS_TO_MILES_CONV = 0.000621371192;
    Venda.storeloc.geocoder;
    Venda.storeloc.map;     
    Venda.storeloc.marker;  
    Venda.storeloc.bounds;
    Venda.storeloc.myLocation;
    Venda.storeloc.mylat;
    Venda.storeloc.mylng;
    Venda.storeloc.stores = [];
    Venda.storeloc.storesQuery = [];
    Venda.storeloc.storeMarkers = [];
    Venda.storeloc.infowindow = [];
    Venda.storeloc.infowindowActive = false;
    Venda.storeloc.URL = new Uri(window.location);
    Venda.storeloc.URI;
    Venda.storeloc.naved = false; // This setting is used by the back buttons to work out if it is navigated or not
    Venda.storeloc.image = [];

    /**
    * Sets the marker images to use the desired image e.g. Venda Logo
    * Venda.storeloc.image  - image
    * Venda.storeloc.shadow - image shadow
    * Venda.storeloc.shape  - image shape
    */
    Venda.storeloc.image[0] = new google.maps.MarkerImage(
      '/content/ebiz/urbanoutfitters/resources/images/marker-images/store-locator-lolly-1.png',
      new google.maps.Size(23,36),
      new google.maps.Point(0,0),
      new google.maps.Point(12,36)
    );
    Venda.storeloc.image[1] = new google.maps.MarkerImage(
      '/content/ebiz/urbanoutfitters/resources/images/marker-images/store-locator-lolly-2.png',
      new google.maps.Size(23,36),
      new google.maps.Point(0,0),
      new google.maps.Point(12,36)
    );
    Venda.storeloc.image[2] = new google.maps.MarkerImage(
      '/content/ebiz/urbanoutfitters/resources/images/marker-images/store-locator-lolly-3.png',
      new google.maps.Size(23,36),
      new google.maps.Point(0,0),
      new google.maps.Point(12,36)
    );
    Venda.storeloc.image[3] = new google.maps.MarkerImage(
      '/content/ebiz/urbanoutfitters/resources/images/marker-images/store-locator-lolly-4.png',
      new google.maps.Size(23,36),
      new google.maps.Point(0,0),
      new google.maps.Point(12,36)
    );
    Venda.storeloc.image[4] = new google.maps.MarkerImage(
      '/content/ebiz/urbanoutfitters/resources/images/marker-images/store-locator-lolly-5.png',
      new google.maps.Size(23,36),
      new google.maps.Point(0,0),
      new google.maps.Point(12,36)
    );
    Venda.storeloc.shadow = new google.maps.MarkerImage(
      '/content/ebiz/urbanoutfitters/resources/images/marker-images/store-locator-shadow.png',
      new google.maps.Size(40,29),
      new google.maps.Point(0,0),
      new google.maps.Point(18,29)
    );

    Venda.storeloc.shape = {
      coord: [16,0,17,1,18,2,19,3,20,4,21,5,21,6,21,7,22,8,22,9,22,10,22,11,22,12,21,13,21,14,21,15,20,16,20,17,19,18,18,19,16,20,14,21,8,21,6,20,4,19,3,18,3,17,2,16,1,15,1,14,1,13,1,12,0,11,0,10,1,9,1,8,1,7,1,6,2,5,2,4,3,3,4,2,5,1,7,0,16,0],
      type: 'poly'
    };


    jQuery('.accordion').hide();
    jQuery('#map_canvas').css('opacity',0);

    Venda.storeloc.ajaxGetStores('storefinder');
    Venda.storeloc.Initialize();
    
    jQuery(function() {
        jQuery("#address").autocomplete({
            //This bit uses the geocoder to fetch address values
            autoFocus: true,
            minLength: 3,
            source: function(request, response) {
                Venda.storeloc.geocoder.geocode( {'address': request.term }, function(results, status) {
                    response(jQuery.map(results, function(item) {
                        return {
                            label:  item.formatted_address,
                            value: item.formatted_address,
                            latitude: item.geometry.location.lat(),
                            longitude: item.geometry.location.lng()
                        }
                    }));
                })
            },
            select: function(event, ui) {
            
                Venda.storeloc.mylat = ui.item.latitude;
                Venda.storeloc.mylng = ui.item.longitude;
            
                Venda.storeloc.updateMap();
            
                jQuery('.accordion').show();
                jQuery('#map_canvas').animate({ opacity: 1 }, 1000 );
                

                Venda.storeloc.updateUriQueries('0');
                Venda.storeloc.map.setCenter(Venda.storeloc.storeMarkers[0].position);
                Venda.storeloc.infowindow[0].open(Venda.storeloc.map, Venda.storeloc.storeMarkers[0]);
                Venda.storeloc.infowindowActive = true; 
            }
        }).keypress(function(e) {
            if (jQuery('#address').val().length > 0){
                if (e.keyCode === 13){
                    jQuery('.ui-autocomplete li:first-child a').trigger('mouseover').trigger('click');
                }
            }
        });
    });
});

/**
* Uses Ajax to get a list of stores and generate a dropdown containing those stores
* @param{string} stryid is reference of the story category that contains the stores
* @author Alby Barber <abarber@venda.com>
**/
Venda.storeloc.ajaxGetStores = function(stryid) {

    jQuery.get( jQuery('#tag-ebizurl').text().replace('http:',window.location.protocol) + "/scat/" + stryid + "&temp=storesjson&layout=blank", function(dataString) {
        Venda.storeloc.stores = jQuery.parseJSON('[' + dataString + ']');

        var options = '<option value="">' + jQuery('#tag-selectastore').text() + '</option>';

        for (var i = 0; i < Venda.storeloc.stores.length; i++) {
            options += '<option data-StoreID="'+ Venda.storeloc.stores[i].StoreID +'" value="' + Venda.storeloc.stores[i].optionValue + '">' + Venda.storeloc.stores[i].optionDisplay + '</option>';
        }
        
        jQuery('.storeLocSelectHolder .loadingImg').remove();
        jQuery('.storeLocSelect').html(options).show();
        
        Venda.storeloc.restoreState();
        jQuery(".storeLocSelect").selectmenu({ style:'dropdown', maxHeight: 2000, positionOptions: { collision: 'none' } });

    });
}

/**
* Sets settings for the maps, layers and markers
**/
Venda.storeloc.Initialize = function(){

    //SET CENTER  
    Venda.storeloc.map = new google.maps.Map(document.getElementById('map_canvas'), {
      center: new google.maps.LatLng(53.085364,-3.991528), // Default map location
      zoom: 2,
      scrollwheel:false,
      mapTypeControl: false,
      streetViewControl: false,
      overviewMapControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      },
    // CONTROLS      
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL
      },
      mapTypeId: 'roadmap'
    });
  
    //GEOCODER
    Venda.storeloc.geocoder = new google.maps.Geocoder();

    Venda.storeloc.marker = new google.maps.Marker({
        map: Venda.storeloc.map,
        draggable: false
    });
}

/**
* Updates all elements of the map and populates the accordion list of stores
**/
Venda.storeloc.updateMap = function(){
        
    Venda.storeloc.storesQuery  = [];
    Venda.storeloc.bounds       = [];
    
    // get the markers to all clear!
    Venda.storeloc.deleteOverlays();
    
    // Add class on map show
    jQuery('.Storelookup').attr('id','details-shown');
        
    // This hides store options that are related to store location
    jQuery('.storeLocSelectHolder, .altStoreView').hide();
    jQuery('.loadingbar').addClass('active');
    
    
    Venda.storeloc.myLocation = new google.maps.LatLng(Venda.storeloc.mylat, Venda.storeloc.mylng);
    Venda.storeloc.marker.setPosition(Venda.storeloc.myLocation);
    Venda.storeloc.map.setCenter(Venda.storeloc.myLocation);
    
    Venda.storeloc.bounds = new google.maps.LatLngBounds();

    // This adds the point of the marker to the bounds of the view
    var point = new google.maps.LatLng(Venda.storeloc.marker.getPosition().lat() , Venda.storeloc.marker.getPosition().lng());
    Venda.storeloc.bounds.extend(point);
    
    Venda.storeloc.cacluateDistance();
    
    // This sorts by distance from point
    Venda.storeloc.stores = Venda.storeloc.stores.sort(function(a,b) { return parseFloat(a.Dist) - parseFloat(b.Dist) } );

    Venda.storeloc.populateMarkers();
    
    // Zoom to fit
    Venda.storeloc.map.fitBounds(Venda.storeloc.bounds);
    
    // jQuery templates 
    jQuery('#storelocatorresults').empty();
    jQuery('#store-tmpl').tmpl(Venda.storeloc.storesQuery).appendTo('#storelocatorresults');

    // jQuery UI accordion
    jQuery('.accordion').accordion('destroy').accordion({autoHeight: false, clearStyle: true, collapsible: true});

}

/**
* Populates markers an array the list of stores and makes sure that it zooms to fit
**/
Venda.storeloc.populateMarkers = function(){

    for (i=0; i<Venda.storeloc.stores.length; i++){
                    
        if (Venda.storeloc.storesQuery.length < Venda.storeloc.limit){
            Venda.storeloc.storesQuery.push(Venda.storeloc.stores[i]);
            var point = new google.maps.LatLng(Venda.storeloc.stores[i].Latitude, Venda.storeloc.stores[i].Longitude);  // point of the current store
            
            // This extends the bounds of the maps view by passing it the lat and lng of each stores points
            Venda.storeloc.bounds.extend(point);
            Venda.storeloc.addMarker(point, i);
        }
        
    }
}

/**
* Adds attributes to the marker and events that are triggered when that marker is clicked
* @param{string} point the google point data of the position on the map
* @param{string} i is the stores array number reference of the marker
* @author Alby Barber <abarber@venda.com>
**/
Venda.storeloc.addMarker = function(point, i) {
    var marker = new google.maps.Marker({
        draggable: false,
        raiseOnDrag: false,
        icon: Venda.storeloc.image[i],
        shadow: Venda.storeloc.shadow,
        shape: Venda.storeloc.shape,
        animation: google.maps.Animation.DROP,
        position: point,
        map: Venda.storeloc.map
    });

    var infowindowButton = jQuery('.dtsStorelocator').length > 0 ? jQuery('#tag-selectthisstore').text() : jQuery('#tag-storedetails').text();

    var contentString = '<div class="storeloc-infowindow">'+
        '<div class="storeloc-logo"></div>'+
        '<div class="header">'+
        '<h2>' + Venda.storeloc.stores[i].StoreName + '</h2>'+
        '<p class="tel">'+ jQuery('#tag-tel').text() + Venda.storeloc.stores[i].Phone + '</p>'+
        '</div>'+
        '<div class="body">'+
            '<p class="dist">'+ jQuery('#tag-distance').text() + Venda.storeloc.stores[i].Dist  + ' ' + Venda.storeloc.stores[i].Unit + '</p>'+
        '</div>'+
        '<div class="linkstore"><a id="' + Venda.storeloc.stores[i].StoreID + '" href="' + Venda.storeloc.stores[i].optionValue + '" class="button buttonAlt buttonArrow">' + infowindowButton + '</a></div>'+
    '</div>';
    
    Venda.storeloc.infowindow[i] = new google.maps.InfoWindow({content: contentString});
    Venda.storeloc.storeMarkers.push(marker);
    
    // This is the Event for the markers
    google.maps.event.addListener(marker, 'click', function() {
        
        // Closes other info windows
        Venda.storeloc.closeInfoWindows();
        
        // This sets the maps centre to the point of the clicked marker
        Venda.storeloc.map.setCenter(point);
        
        Venda.storeloc.infowindow[i].open(Venda.storeloc.map, marker);

        if (i != jQuery(".accordion").accordion('option', 'active')){
            jQuery(".accordion").accordion( "activate" , i);
        }
        
        Venda.storeloc.updateUriQueries(i);
        
    });
}


/**
* Works out the distance between the stores returned and the current location
**/
Venda.storeloc.cacluateDistance = function(){
    
    var LatLng = new google.maps.LatLng(Venda.storeloc.marker.getPosition().lat() , Venda.storeloc.marker.getPosition().lng()); // current location
        
    for (i=0;i<Venda.storeloc.stores.length;i++){
        
        var point = new google.maps.LatLng(Venda.storeloc.stores[i].Latitude, Venda.storeloc.stores[i].Longitude);  // point of the current store
        var meters = google.maps.geometry.spherical.computeDistanceBetween(LatLng, point)       // distance between the two points 



        if(Venda.storeloc.unitsInMiles){
            Venda.storeloc.stores[i].Unit = 'Miles';
            var miles  = meters * Venda.storeloc.METERS_TO_MILES_CONV;                                  // convert from meters to miles
            Venda.storeloc.stores[i].Dist = miles.toFixed(2);                                           // update stores object
        }
        else{
            Venda.storeloc.stores[i].Unit = 'km';
            var kilometers = (meters / 1000);
            Venda.storeloc.stores[i].Dist = kilometers.toFixed(2);
        }
    }
}

/**
* looks at the url and restores the page based on those params
**/
Venda.storeloc.restoreState = function() {

    var currentUri = new Uri(window.location);

        if (currentUri.getQueryParamValues('loc').toString()){
            
            Venda.storeloc.mylat    = currentUri.getQueryParamValues('lat').toString();
            Venda.storeloc.mylng    = currentUri.getQueryParamValues('lng').toString();

            var activeTab           = parseInt(currentUri.getQueryParamValue('active')),
                cleanAddress        = unescape(currentUri.getQueryParamValues('loc').toString());

            jQuery('#address').val(cleanAddress);

            Venda.storeloc.updateMap();
        
            jQuery('.accordion').fadeIn();
            jQuery('#map_canvas').animate({ opacity: 1 }, 1500 );

                if (activeTab > 0){
                    jQuery('.accordion').accordion( "activate" , activeTab);
                }

                Venda.storeloc.infowindow[activeTab].open(Venda.storeloc.map, Venda.storeloc.storeMarkers[activeTab]);
                Venda.storeloc.infowindowActive = true;
                Venda.storeloc.updateUriQueries(activeTab);


        }

    // Track the URL changes so we can make sure the user back and forward buttons work
    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
        var State = History.getState(); // Note: We are using History.getState() instead of event.state

        // This does not track the changing of tabs via the back button

            if (!Venda.storeloc.naved) {

                if (jQuery('.mainHolder .Storeview').length > 0){
                    jQuery("#page_storelocator .Storeview .buttonAlt2").trigger('click');    
                }
                
                if (State.url.search('/stry/') > -1){
                    Venda.storeloc.loadStore(State.url);
                }
            }


        Venda.storeloc.naved = false;
    });

}

/**
* Updates the URL #! with the status of the stores page
**/
Venda.storeloc.updateUriQueries = function(index){
    

    var uri = new Uri().replaceQueryParam('loc', escape(jQuery('.Storelookup #address').val())).replaceQueryParam('lat', Venda.storeloc.mylat).replaceQueryParam('lng', Venda.storeloc.mylng).replaceQueryParam('active', index);

    Venda.storeloc.URI = uri.toString();

    Venda.storeloc.naved = true;
    History.pushState({ path: this.path }, document.title, uri.toString());  
}

/**
* Populates the hidden form with the values from the selected store
* @param{string} that is the unique store id
* @author Alby Barber <abarber@venda.com>
**/
Venda.storeloc.fillForm = function(that){

    for (i=0;i<Venda.storeloc.stores.length;i++){

        if (Venda.storeloc.stores[i].StoreID == that){
            jQuery('input[name="num"]').val(Venda.storeloc.stores[i].StoreName).parent().find('span').html(Venda.storeloc.stores[i].StoreName);
            jQuery('input[name="addr1"]').val(Venda.storeloc.stores[i].Address).parent().find('span').html(Venda.storeloc.stores[i].Address);
            jQuery('input[name="addr2"]').val(Venda.storeloc.stores[i].Address2).parent().find('span').html(Venda.storeloc.stores[i].Address2);
            jQuery('input[name="city"]').val(Venda.storeloc.stores[i].City).parent().find('span').html(Venda.storeloc.stores[i].City);
		    jQuery('input[name="cntry"]').val(Venda.storeloc.stores[i].Country).parent().find('span').html(Venda.storeloc.stores[i].Country);
            jQuery('input[name="zipc"]').val(Venda.storeloc.stores[i].PostCode).parent().find('span').html(Venda.storeloc.stores[i].PostCode);
            jQuery('input[name="state"]').val(Venda.storeloc.stores[i].State).parent().find('span').html(Venda.storeloc.stores[i].State);
            // This sets 2 hidden inputs that are used in conditions on the order summary screen
            jQuery('input[name="addrname"]').val(Venda.storeloc.stores[i].StoreName).parent().find('span').html(Venda.storeloc.stores[i].StoreName);
            //jQuery('input[name="fax"]').val(Venda.storeloc.stores[i].StoreID);
            
        }
    }
    // Show the DTS 'Select Store' button
    jQuery(".DTSchangeStore, .dtsSubmit, .f-storedeliveryaddress").show();
}

/**
* HELPER FUNCTIONS
**/
// Deletes all markers in the array by removing references to them
Venda.storeloc.deleteOverlays = function() {
  if (Venda.storeloc.storeMarkers) {
    for (i in Venda.storeloc.storeMarkers) {
      Venda.storeloc.storeMarkers[i].setMap(null);
    }
    Venda.storeloc.storeMarkers.length = 0;
  }
}

// This looks for infowindows and close them
Venda.storeloc.closeInfoWindows = function() {
    if (Venda.storeloc.infowindowActive){
        for(var j=0;j<Venda.storeloc.infowindow.length;j++){
            Venda.storeloc.infowindow[j].close();
        }
    }
    Venda.storeloc.infowindowActive = true;
}

// This loads in the store to the mainHolder frame
Venda.storeloc.loadStore = function(storeUrl){

    jQuery('.mainHolder').css('height',jQuery('.mainHolder .Storelookup').height()).addClass('loadingImg');
    jQuery('.mainHolder .Storelookup').animate({ opacity: 0 }, 1000 ).hide();

    jQuery.get(storeUrl + '&layout=blank', function(data) {

        jQuery('.mainHolder').removeClass('loadingImg');
        jQuery('.mainHolder').append('<div class="Storeview">' + data +'</div>');

        jQuery('.mainHolder .Storeview').animate({ opacity: 1 }, 1000 );

    })
}

/**
* EVENTS - General
**/

// Highlight address seach content on click
jQuery('#address').live("click", function() {
    jQuery(this).select();
});


// Search Go button
jQuery("#address_holder #pcsubmit").live("click", function(){
    if (jQuery('#address').val().length > 0){
        jQuery('.ui-autocomplete li:first-child a').trigger('mouseover').trigger('click');
    }
});

// Select quick store navigation
jQuery(".Storelookup .storeLocSelect").live("change", function(){
    Venda.storeloc.loadStore(this.value);
});

// Accordion click event
jQuery(".accordion h3").live("click", function(){

    Venda.storeloc.naved = true;

    Venda.storeloc.closeInfoWindows();

    var lastindex = 0,
        index = jQuery(".accordion").accordion('option', 'active') ? jQuery(".accordion").accordion('option', 'active') : lastindex;

        lastindex = index;
        
        Venda.storeloc.map.setCenter(Venda.storeloc.storeMarkers[index].position);

        Venda.storeloc.infowindow[index].open(Venda.storeloc.map, Venda.storeloc.storeMarkers[index]);
        
        Venda.storeloc.updateUriQueries(index);

});

/// General store locator store link
jQuery("#page_storelocator .linkstore a").live("click", function(e){

    e.preventDefault();    

    Venda.storeloc.naved = true;

    History.pushState({ path: this.path }, document.title, this.href);

    Venda.storeloc.loadStore(this.href);

})

// General store locator back button
jQuery("#page_storelocator .Storeview .buttonAlt2").live("click", function(){

    Venda.storeloc.naved = true;

    // We have to do this in two steps beacasue if IE
    History.pushState({ path: this.path }, document.title, Venda.storeloc.URL); // Push back the URL
    History.pushState({ path: this.path }, document.title, Venda.storeloc.URI); // Replace the URIs

    jQuery('.mainHolder .Storeview').animate({ opacity: 0 }, 1000 ).hide();
    jQuery('.mainHolder').addClass('loadingImg');
    
    jQuery('.mainHolder .Storelookup').show().animate({ opacity: 1 }, 1000 );   
    jQuery('.mainHolder').delay(3000).removeClass('loadingImg');

    jQuery('.mainHolder .Storeview').remove(); // tidy up after we are back at the main screen

})

/**
* EVENTS - DTS
**/
// DTS 'Select Store' link
jQuery(".dtsStorelocator .linkstore a").live("click", function(e){

    e.preventDefault();
  
    Venda.storeloc.fillForm(this.id);
    jQuery(".dtsStorelocator").fadeOut();

})

// DTS dropdown select store 
jQuery(".dtsStorelocator .storeLocSelect").live("change", function(){

    var storeID = jQuery(".dtsStorelocator .storeLocSelect option:selected").attr('data-storeid');
    Venda.storeloc.fillForm(storeID);
    // hide store locator DTS
    jQuery(".dtsStorelocator").fadeOut();
});

// DTS show store locator DTS
jQuery(".DTSchangeStore").live("click", function(){
    jQuery(".dtsStorelocator").fadeIn();
})

/* Part of Storelocator V2
jQuery("#optionsCheckboxes").live("click", function(){
    if (jQuery('.arrowOn').length){
        jQuery('.arrowIcon').removeClass('arrowOn');
    }
    else {
        jQuery('.arrowIcon').addClass('arrowOn');
    }
    jQuery(".input").fadeToggle("fast", "linear");
});

jQuery("#optionsCheckbox1, #optionsCheckbox2, #optionsCheckbox3").live("click", function(){
    if (jQuery('#address').val().length > 0){
        Venda.storeloc.updateMap();
    }
});
*/