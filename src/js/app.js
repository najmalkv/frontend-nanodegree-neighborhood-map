// Viewmodel to link the model and view
var ViewModel = function() {

	/* create an alias for viewmodel
	 * to use when the context of the 'this' keyword changes.
	 */
	var self = this;

    // Intialize the observables.
	self.restaurants = ko.observableArray();
	self.filterText = ko.observable('');
	self.selRestaurantIndex = ko.observable();
	self.isSideNavHidden = ko.observable(false);

	// Hide the side nav by default on smaller screens on load.
	if($(window).width() < 800) self.isSideNavHidden(true);

	// function to handle click for the restaurant list in the side nav.
	self.showRestaurantInfo = function (data,event){

		// Get the current context
		var context = ko.contextFor(event.target);

		// Get the index of the list item in the displayed list from the current context.
		var listIndex =  context.$index();

		// set the observable to highlight the selected item on the list.
		self.selRestaurantIndex(listIndex);

		// Get the index of the clicked item in the collection.
		var itemIndex = self.restaurants().indexOf(data);

		// check if it is a small screen.
		if($(window).width() < 800) {

			// Hide the side nav to open up space for the map area.
			self.isSideNavHidden(true);

			// delay until the animation for the side nav is completed.
			setTimeout(function() {

				// trigger resize on the map to re render to fit its container and center it.
		        var center = map.getCenter();
		        google.maps.event.trigger(map, "resize");
		        map.setCenter(center);

		        /* trigger click event of the marker to show information
		         * of the selected restaurant on the infowindow.
		         */
		        google.maps.event.trigger(markers[itemIndex], 'click');

		    }, 500);
		}
		// For bigger screens
		else{
			/* trigger click event of the marker to show information
	         * of the selected restaurant on the infowindow.
	         */
	        var center = map.getCenter();
		    map.setCenter(center);
		 	google.maps.event.trigger(markers[itemIndex], 'click');
		}
	};

	/* Computed observable to filter out the collection based on
	 * the text typed in the filter input field.
	 */

	self.filteredRestaurants = ko.computed(function(){

		// check if the filter input has a valid value.
		if(!self.filterText()) {

			// check to avoid running the code inside before the the markers are set.
			if(typeof markers !== 'undefined'){

				// Iterate through the markers collection and show all markers on the map
				markers.forEach(function(marker){
					if(marker.getVisible() === false)
					marker.setVisible(true);
				});

			}
			// return all items in the collection since there is no filter value.
			return self.restaurants();
		}
		else {

			// Array fiter method to iterate and filter out the items based on the filter value.
			return ko.utils.arrayFilter(self.restaurants(), function(item, index){

			  // Check if the restaurant name matches the filter text in input field.
			  if(item.restaurant.name.toLowerCase().includes(self.filterText().toLowerCase())){

			  	// Show the marker on the map.
			  	if(markers[index].getVisible() === false)
			  	markers[index].setVisible(true);

			    // Return this item to collection since it matches the filter text.
			  	return item;
			  }
			  else{

			  	// hide the marker on the map
			  	markers[index].setVisible(false);

			  }
			});
		}
	});

	// Function to handle click event of the clear button on the filter area.
	self.clearFilter = function(){
		self.filterText('');
	};

	// Function to handle the click event on the hamburger icon to show/hide the side nav.
	self.showHideSideNav = function(){
		// Toggle the sidenav observable state.
		/*jshint -W030 */
		self.isSideNavHidden() ? self.isSideNavHidden(false) : self.isSideNavHidden(true);

		// Trigger resize on the map to re render to fit its container and center it.
		setTimeout(function() {
	        var center = map.getCenter();
	        google.maps.event.trigger(map, "resize");
	        map.setCenter(center);
	    }, 500);
	};

};

// Store the instance of the view model to use it globally.
var viewModel = new ViewModel();

// Create a variable to store the timeout for resizing the map.
var resizeMapTimeout;

// Window resize listener
$(window).resize(function(){
	// Toggle the sidenav observable state based on window width.
	/*jshint -W030 */
	$(window).width() < 800 ? viewModel.isSideNavHidden(true) : viewModel.isSideNavHidden(false);

	// Clear timeout before creating a new one
	if(resizeMapTimeout) clearTimeout(resizeMapTimeout);

    // timeout to trigger resize on the map area and center it.
	resizeMapTimeout = setTimeout(function() {
	        var center = map.getCenter();
	        google.maps.event.trigger(map, "resize");
	        map.setCenter(center);
	    }, 500);

});

// Bind the view model created to the knockout object
ko.applyBindings(viewModel);