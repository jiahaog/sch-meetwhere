Meteor.methods({
    	getPlace: function(text) {
    		this.unblock();
    		var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + text + "&key=AIzaSyB0wJuC2ZTaul7QfU3UC9BtG7uAK3MoWzc&components=country:sg";
    		console.log(url);
    		return Meteor.http.call("GET",url);
    	},

    	getPlaceDetails: function(id){
    		this.unblock();
    		var url = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyB0wJuC2ZTaul7QfU3UC9BtG7uAK3MoWzc&placeId=" + id;
    		console.log(url);
    		return Meteor.http.call("GET",url);
    	}
    });