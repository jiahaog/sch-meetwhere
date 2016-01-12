Locs = new Mongo.Collection("locs");

Session.setDefault("locs", []);
Session.setDefault("center", null);
Session.setDefault("featured", []);

var example = [[1.3984457, 103.9072046], [1.300555, 103.781179], [1.3507722, 103.8722242]]

function average(locs){
	var latsum = 0;
	var lngsum = 0;
	for (var i = 0; i < locs.length; i++){
		// latsum+=locs[i].geometry.location.lat;
		// console.log(locs[i][0]);
		latsum = latsum + locs[i].result.geometry.location.lat;
		lngsum = lngsum + locs[i].result.geometry.location.lng;
	}
	var lat = latsum/locs.length;
	var lng = lngsum/locs.length;
	return [lat, lng]
}

Template.home.helpers({
	locs: function() {
		return Session.get("locs");
	}, 
	center: function(){
		return Session.get("center");
	}, 
	featured: function(){
		return Session.get("featured");
	}
});

Template.home.onRendered(function () {
  var pyrmont = new google.maps.LatLng(-33.8665, 151.1956);

  var map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 15,
    scrollwheel: false
  });

  var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),{componentRestrictions:{country:"sg"}});
  autocomplete.bindTo('bounds', map);
  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  // autocomplete.addListener('place_changed', fillInAddress);

 //  // Specify location, radius and place types for your Places API search.
 //  var request = {
 //    location: pyrmont,
 //    radius: '500',
 //    types: ['food']
 //  };

 //  // Create the PlaceService and send the request.
 //  // Handle the callback with an anonymous function.
 //  var infowindow = new google.maps.InfoWindow();
 //  var service = new google.maps.places.PlacesService(map);
  
	// function bindInfoWindow(marker, map, infowindow, place) {
	//     marker.addListener('click', function() {
	//         infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
	//         'Place ID: ' + place.place_id + '<br>' +
	//         place.formatted_address + '</div>');
	//         infowindow.open(map, this);
	//     });
	// }

 //  service.nearbySearch(request, function(results, status) {
 //    if (status == google.maps.places.PlacesServiceStatus.OK) {
 //      for (var i = 0; i < results.length; i++) {
 //        var place = results[i];
 //        // If the request succeeds, draw the place location on
 //        // the map as a marker, and register an event to handle a
 //        // click on the marker.
 //        var marker = new google.maps.Marker({
 //          map: map,
 //          position: place.geometry.location
 //        });
 //        bindInfoWindow(marker, map, infowindow, place);
 //      }
 //    }
 //  });
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
	  	Meteor.call("getPlaceDetails", best.place_id, function(err, res){
	  		var details = JSON.parse(res.content);
	  		// Locs.insert(details);
	  		var locs = Session.get("locs");
	  		locs.push(details);
	  		Session.set("locs", locs);
	  		Session.set("center", average(Session.get("locs")));
	  		Meteor.call("getNearby", Session.get("center"), function(err, res){
	  			var details = JSON.parse(res.content);
	  			console.log(details);
	  			Session.set("featured", details.results);
	  			console.log(Session.get("featured"));
	  		});
	  	});
	  });
      // Clear form
      event.target.text.value = "";
    }
});
