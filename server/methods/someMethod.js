API_KEY = 'AIzaSyB5T8Fuz3xppG_roO3hL2V104LSi2sYuT8';

clusters = [[1.30616758,103.7993302,],[1.3757285,103.94929786],[1.46722937,103.75735525],[1.31562227,103.87131227],[1.38902096,103.74627578],[1.43068309,103.83036154],[1.25968872,103.82267311],[1.34024457,103.70590711],[1.31259752,103.83817286],[1.3631016,103.84265797],[1.34382476,103.74514933],[1.33782573,103.94872837],[1.369021,103.98493826],[1.33348877,103.78556447],[1.30797351,103.90999824],[1.44161735,103.71061211],[1.28964282,103.85137356],[1.3733761,103.87942697],[1.43888563,103.78901285]]

Meteor.methods({
    /**
     * Performs search for text
     * @param text
     */
    apiGetPlace: function (text) {
        this.unblock();
        var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + text + `&key=${API_KEY}&components=country:sg`;
        const res = Meteor.http.call("GET", url);
        return JSON.parse(res.content);
    },

    /**
     * Gets details for a place_id
     * @param id
     */
    apiGetPlaceDetails: function (id) {
        this.unblock();
        var url = `https://maps.googleapis.com/maps/api/place/details/json?key=${API_KEY}&placeid=` + id;
        const res = Meteor.http.call("GET", url);
        return JSON.parse(res.content);
    },

    /**
     * Gets nearby things from a location
     * @param latlng
     */
    apiGetNearby: function (latlng) {
        this.unblock();
        var url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${API_KEY}&location=` + latlng[0] + "," + latlng[1] + "&radius=500&types=food|cafe";
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
        const center = closestCluster(locations);
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

function closestCluster(locations) {
    var best = 99999
    var best_cluster = -1
    const number = locations.length;

    for(var i = 0; i < clusters.length; i++){
        var dist = 0
        locations.forEach(location => {
            dist += Math.pow(location[0]-clusters[i][0],2)+Math.pow(location[1]-clusters[i][1],2)
        });
        dist/=number
        if (dist < best){
            best = dist;
            best_cluster = i;
        }
    };
    return clusters[best_cluster]
}
