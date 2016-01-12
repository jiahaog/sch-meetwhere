Meteor.methods({
    	getPlace: function(text) {
    		this.unblock();
    		var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + text + "&key=AIzaSyB0wJuC2ZTaul7QfU3UC9BtG7uAK3MoWzc&components=country:sg";
    		console.log(url);
    		return Meteor.http.call("GET",url);
    	},

    	getPlaceDetails: function(id){
    		this.unblock();
    		var url = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyB0wJuC2ZTaul7QfU3UC9BtG7uAK3MoWzc&placeid=" + id;
    		console.log(url);
    		return Meteor.http.call("GET",url);
    	},

    	getNearby: function(latlng){
    		this.unblock();
    		var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyB0wJuC2ZTaul7QfU3UC9BtG7uAK3MoWzc&location="+latlng[0]+","+latlng[1]+"&radius=500&types=food|cafe";
    		console.log(url);
    		return Meteor.http.call("GET",url);	
    	},

    	getNearbyFourSquare: function(latlng){
    		this.unblock();
    		var url = "https://api.foursquare.com/v2/venues/search?client_id=2EP0TZRYTCQAPXNVURLLI4FDAWPRCX1CPAVB3WQFHJWQIKQW&client_secret=B510NTZIFSZHOKOBO3HZU15CRAUXC5NZZNYJKNK0A14V1WDA&v=20130815&ll="+latlng[0]+","+latlng[1]+"&query=town&radius=2000";
    		console.log(url);
    		return Meteor.http.call("GET", url);
    	}
    });