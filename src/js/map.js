 /* Declare a map variable in the global scope that will hold
  * the instance of the google maps class.
  */

  var map;

/* Declare a markers array in the global scope that will hold
 * the collection of markers created.
 */

  var markers = [];

 // Function to initialize the map within the map div.
 function initMap() {

    //Intialize the location of edappally as an object consisting of the lattitude and longitude.

    var edapallyLatLng = {lat: 10.024999 , lng: 76.308687};

    /* Create an instance of LatLngBounds class
     * to check and extend the bounds of the map as we add new markers.
     */

    var bounds = new google.maps.LatLngBounds();

    // Create and assign the map instance to the map variable.

    map = new google.maps.Map(document.getElementById('map'), {
       center: edapallyLatLng,
       zoom: 16
    });

   // Intialize a default icon for the  map maker.

   var defaultIcon = makeMarkerIcon('0091ff');

   // Intialize a highlighted for the map marker.

   var highlightedIcon = makeMarkerIcon('FFFF24');

   // Function to make a new marker icon with the passed in color.
   function makeMarkerIcon(markerColor){
      var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
          new google.maps.Size(21,34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10,34),
          new google.maps.Size(21,34)
          );

          return markerImage;

   }

   // Intialize the URL for zomato API to get restauant collection based on geocode.

   var zomatoUrl = "https://developers.zomato.com/api/v2.1/geocode?lat=" + edapallyLatLng.lat + "&lon=" + edapallyLatLng.lng;

   // AJAX request to the zomato API to get the collection of restaurants.
    $.ajax({
      url: zomatoUrl,
      headers: {
                // Authentication key for zomato API.
                  "user-key" : "712f98e6b0c6af2838568407a010b798"
               },
      success: function(response) {

                //check if the response received has the expected collection.

                if(response.nearby_restaurants) {

                   // Update the observable array in the view model with restaurants collection received.

                   viewModel.restaurants(response.nearby_restaurants);

                   // Iterate through the collection to set markers.

                   response.nearby_restaurants.forEach(function(item){

                      // store the geo codes of the current item in a variable.

                      var latitude = parseFloat(item.restaurant.location.latitude);
                      var longitude = parseFloat(item.restaurant.location.longitude);

                      // create an instance of the marker class with the geocodes of this item.

                      var marker = new google.maps.Marker({
                          position: {lat: latitude, lng: longitude },
                          map: map,
                          icon: defaultIcon,
                          animation: google.maps.Animation.DROP,
                          title: item.restaurant.name
                      });

                      // Add the created marker to the markers collection array.
                      markers.push(marker);

                      // Extend the boundaries of the map for each marker.
                      bounds.extend(marker.position);

                      // Click event listener for the marker. Opens an infowindow.

                      marker.addListener('click', function() {
                         populateInfoWindow(this, largeInfoWindow, item.restaurant);
                      });

                      // Mouseover event listener for the marker. Changes the marker icon to highlighted icon.

                      marker.addListener('mouseover',function() {
                        this.setIcon(highlightedIcon);
                      });

                      // Mouseout event listener for the marker. Changes the marker icon to the default icon.

                      marker.addListener('mouseout',function() {
                        // check to avoid reseting the clicked marker icon.
                        if(marker.getAnimation() === null)
                        this.setIcon(defaultIcon);
                      });

                   });

                // set the boundaries of the map to fit bounds of the markers created.
                map.fitBounds(bounds);
              }
              else {
                alert("Oops! Unexpected response received from the API. Please refresh the page or try again later.");
              }
          },
          error: function(){
            alert("Oops! Information on restaurants could not be loaded since The zomato API was unreachable. Please refresh the page or try again later.");
          }

      });


     // Creat an instance of the InfoWindow class.

     var largeInfoWindow = new google.maps.InfoWindow();

     // Function to populate the infowindow with information of the restaurant when clicked on a marker.
     function populateInfoWindow(marker, infowindow, restaurantDetails){

      // Check to avoid repopupalating the window for the active marker.
      if(infowindow.marker != marker){

        // Check and reset the animation and icon of the previously active marker.
        if(infowindow.marker) {
           infowindow.marker.setAnimation(null);
           infowindow.marker.setIcon(defaultIcon);
        }

        // Set the active marker with passed in marker.

        infowindow.marker = marker;

        // Set bounce animation for the active marker.

        marker.setAnimation(google.maps.Animation.BOUNCE);

        // Change icon of the active marker to the highlighted icon.

        marker.setIcon(highlightedIcon);

        // Intialize the html content for the info window.

        var infoContent = '<div class="restaurant-info"><h2 class="restaurant-name row">' + restaurantDetails.name + '</h2>' +
                          '<img class="restaurant-image" src="' + restaurantDetails.featured_image + '" alt="image of' + restaurantDetails.name + '" />' +
                          '<div class="restaurant-details row"><b>Cuisine(s): </b>' + restaurantDetails.cuisines + '</div>' +
                          '<div class="restaurant-details row"><b>Rating: </b>' + restaurantDetails.user_rating.aggregate_rating + '/5</div>' +
                          '<a class="restaurant-link row" target="_blank" href="' + restaurantDetails.url + '">View on Zomato</a></div></div>';

        // Set html content to the infowindow instance.

        infowindow.setContent(infoContent);

        // Open the info window.

        infowindow.open(map, marker);

        // Click event listener for when the ifo window is closed. Resets the active marker.

        infowindow.addListener('closeclick', function(){
          infowindow.marker = null;
          marker.setAnimation(null);
          marker.setIcon(defaultIcon);
        });
      }
     }

 }

// Function to handle error in loading the google maps API
 function mapError() {
    alert('Error! Unable to load the  google maps API. Please refresh or try again later.');
 }

/* Self invoked function to load google maps api asynchronously and
 * avoid race issue with the api loading before the init and error function are executed.
 */

 (function loadGoogleMaps(){

        var script_tag = document.createElement('script');
        script_tag.setAttribute("src","https://maps.googleapis.com/maps/api/js?key=AIzaSyByHfWjtl0r4XC2BhGENiUo0wNGGAHXZ2w&callback=initMap");
        script_tag.setAttribute("onError", "mapError()");
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);

 })();

