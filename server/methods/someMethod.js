Meteor.methods({
    /**
     * Performs search for text
     * @param text
     */
    apiGetPlace: function (text) {
        this.unblock();
        var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + text + "&key=AIzaSyB0wJuC2ZTaul7QfU3UC9BtG7uAK3MoWzc&components=country:sg";
        const res = Meteor.http.call("GET", url);
        return JSON.parse(res.content);
    },

    /**
     * Gets details for a place_id
     * @param id
     */
    apiGetPlaceDetails: function (id) {
        this.unblock();
        var url = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyB0wJuC2ZTaul7QfU3UC9BtG7uAK3MoWzc&placeid=" + id;
        const res = Meteor.http.call("GET", url);
        return JSON.parse(res.content);
    },

    /**
     * Gets nearby things from a location
     * @param latlng
     */
    apiGetNearby: function (latlng) {
        this.unblock();
        var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyB0wJuC2ZTaul7QfU3UC9BtG7uAK3MoWzc&location=" + latlng[0] + "," + latlng[1] + "&radius=500&types=food|cafe";
        const res = Meteor.http.call("GET", url);
        return JSON.parse(res.content);
    },

    getCenterAndFeatures: function (addresses) {
        const locations = addresses.map(address => {
            return Meteor.call('getPlaceDetailsAll', address);
        }).map(placeDetail => {
            const location = placeDetail.result.geometry.location;
            return [location.lat, location.lng];
        });
        return Meteor.call('getCenterAndFeaturesFromLatLong', locations);
    },

    getCenterAndFeaturesFromLatLong: function (locations) {
        const center = average(locations);
        return {
            center: center,
            features: Meteor.call('apiGetNearby', center).results
        };
    },

    getPlaceDetailsAll: function (address) {
        this.unblock();
        const searchResults = Meteor.call('apiGetPlace', address);
        const best = searchResults.predictions[0];
        const bestId = best.place_id;
        return Meteor.call('apiGetPlaceDetails', bestId);
    },

});

function average(locations) {
    var latsum = 0;
    var lngsum = 0;
    const number = locations.length;

    locations.forEach(location => {
        latsum = latsum + location[0];
        lngsum = lngsum + location[1];
    });

    var lat = latsum / number;
    var lng = lngsum / number;

    const result = [lat, lng];
    return result;
}
