Locs = new Mongo.Collection("locs");

Session.setDefault("locs", []);
Session.setDefault("center", null);
Session.setDefault("featured", []);

var map;
var locMarkers = [];

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

function showMap(center, locs){
	var latlng = new google.maps.LatLng(center[0], center[1]);

	map = new google.maps.Map(document.getElementById('map'), {
      center: latlng,
      zoom: 15,
      scrollwheel: false
    });

	var centerMarker = new google.maps.Marker({
			position: latlng, 
			icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
		});

    console.log(locs);
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < locs.length; i++){
		var marker = new google.maps.Marker({
			position: locs[i].result.geometry.location
		});
		marker.setMap(map);
		bounds.extend(marker.getPosition());
	}
	if (locs.length > 1){
		map.fitBounds(bounds);
	}
	centerMarker.setMap(map);

	var request = {
    	location: latlng,
    	radius: '2000'
    	// types: ['neighborhood', 'train_station']
    };
    var service = new google.maps.places.PlacesService(map);

	service.nearbySearch(request, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
      	console.log(JSON.stringify(results));
	      for (var i = 0; i < results.length; i++) {
	        var place = results[i];
	        // console.log(place);
	        // If the request succeeds, draw the place location on
	        // the map as a marker, and register an event to handle a
	        // click on the marker.
	        var marker = new google.maps.Marker({
	          map: map,
	          position: place.geometry.location,
      	      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
	        });
	        // bindInfoWindow(marker, map, infowindow, place);
	      }
	    }
	  });

 //  // Create the PlaceService and send the request.
 //  // Handle the callback with an anonymous function.
 //  var infowindow = new google.maps.InfoWindow();

  
	// function bindInfoWindow(marker, map, infowindow, place) {
	//     marker.addListener('click', function() {
	//         infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
	//         'Place ID: ' + place.place_id + '<br>' +
	//         place.formatted_address + '</div>');
	//         infowindow.open(map, this);
	//     });
	// }


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
  var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),{componentRestrictions:{country:"sg"}});
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
	  		showMap(Session.get("center"), Session.get("locs"));
	  		// Meteor.call("getNearby", Session.get("center"), function(err, res){
	  		// 	var details = JSON.parse(res.content);
	  		// 	console.log(details);
	  		// 	Session.set("featured", details.results);
	  		// 	console.log(Session.get("featured"));
	  		// 	showMap(Session.get("center"));
	  		// });
	  		Meteor.call("getNearbyFourSquare", average(Session.get("locs")), function(err, res){
	  			var details = JSON.parse(res.content);
	  			// console.log(JSON.stringify(details));
	  			Session.set("foursquare", details);
	  			var fsquare = Session.get("foursquare");
		  		for (var i = 0; i < fsquare.response.venues.length; i++){
		  			var latlng = new google.maps.LatLng(fsquare.response.venues[i].location.lat, fsquare.response.venues[i].location.lng);
					var marker = new google.maps.Marker({
						position: latlng,
						icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
					});
					marker.setMap(map);
				}
	  		});
	  		
	  	});
	  });
      // Clear form
      event.target.text.value = "";
    }
});
