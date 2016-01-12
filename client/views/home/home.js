Locs = new Mongo.Collection("locs");

Template.home.helpers({
	locs: function() {
		return Locs.find({});
	},


});

Template.home.onRendered(function () {
  var pyrmont = new google.maps.LatLng(-33.8665, 151.1956);

  var map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 15,
    scrollwheel: false
  });

  // Specify location, radius and place types for your Places API search.
  var request = {
    location: pyrmont,
    radius: '500',
    types: ['food']
  };

  // Create the PlaceService and send the request.
  // Handle the callback with an anonymous function.
  var infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  
	function bindInfoWindow(marker, map, infowindow, place) {
	    marker.addListener('click', function() {
	        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
	        'Place ID: ' + place.place_id + '<br>' +
	        place.formatted_address + '</div>');
	        infowindow.open(map, this);
	    });
	}

  service.nearbySearch(request, function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        console.log(place);
        // If the request succeeds, draw the place location on
        // the map as a marker, and register an event to handle a
        // click on the marker.
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
        bindInfoWindow(marker, map, infowindow, place);
      }
    }
  });
});



Template.home.events({
	"submit .new-loc": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
 
      // Insert a task into the collection
      // Locs.insert({
      //   text: text,
      //   createdAt: new Date() // current time
      // });
	  Meteor.call("getPlace", text, function(error, results){
	  	var resjson = JSON.parse(results.content);
	  	var best = resjson.predictions[0];
	  	Meteor.call("getPlaceDetails", best.place_id, function(err, details){
	  		console.log(details);
	  	});
	  });
      // Clear form
      event.target.text.value = "";
    }
});
