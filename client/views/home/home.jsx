Template.home.helpers({
    shouldShowMap: function () {
        return Session.get('shouldShowMap');
    }
});

Template.home.onRendered(function () {

});


Template.home.events({
    'click js-add-marker': function (event) {
        GoogleMaps.ready('exampleMap', function(map) {
            // Add a marker to the map once it's ready
            var marker = new google.maps.Marker({
                position: map.options.center,
                map: map.instance
            });
        });
    }
}
);

Meteor.startup(function() {
    //GoogleMaps.load();
    GoogleMaps.load({
        key: 'AIzaSyB0wJuC2ZTaul7QfU3UC9BtG7uAK3MoWzc',
        libraries: 'places'  // also accepts an array if you need more than one
    });

});

Template.home.helpers({
    exampleMapOptions: function() {
        // Make sure the maps API has loaded
        if (GoogleMaps.loaded()) {
            // Map initialization options
            return {
                center: new google.maps.LatLng(1.3577522,103.8206165),
                zoom: 11
            };
        }
    }
});

Template.home.onCreated(function() {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('exampleMap', (map)=> {

        let mapMarkers = [];
        this.autorun(function() {
            var markers = Session.get('markers');
            if (!markers || markers.length === 0)
                return;

            // delete all markers
            mapMarkers.forEach(marker => {
                console.log('DELETING');
                marker.setMap(null);
            });
            mapMarkers = [];

            markers.forEach(latLngArray => {
                const newMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(latLngArray[0], latLngArray[1]),
                    map: map.instance
                });
            });
        });
    });
});


Template.home.onRendered(function () {

    UserWorkflow = React.createClass({

        getInitialState: function () {
            return {
                addressBoxes: [
                    {
                        id: this.getRandomId(),
                        address: null
                    },
                    {
                        id: this.getRandomId(),
                        address: null
                    }
                ]
            };
        },

        renderInputs() {
            return this.state.addressBoxes.map((addressBox) => {
                const key = addressBox.id;
                $(`#${key}`).geocomplete().bind("geocode:result", (event, result) => {
                    this.findIdAndUpdate(key, result.formatted_address);
                });
                return <form className key={key}>
                    <i className="material-icons prefix">account_circle</i>
                    <input className="js-address-input" id={key} type="text" name="address"
                           onChange={this.handleInputChange} placeholder="Enter a location"/>
                </form>
            });
        },

        handleInputChange: function (event) {
            const id = event.target.id;
            const value = event.target.value;
            this.findIdAndUpdate(id, value);
        },

        getRandomId: function () {
            return Math.random().toString(36).substring(7);
        },

        submit: function (event) {
            const allAddresses = this.state.addressBoxes.map(addressBox => {
                return addressBox.address;
            }).filter(address => {
                return address;
            });

            Meteor.call('getCenterAndFeatures', allAddresses, (error, results) => {
                if (error) {
                    console.error(error);
                    return;
                }
                const locations = results.features.map(place => {
                    return [place.geometry.location.lat, place.geometry.location.lng];
                });
                Session.set('markers', locations);

                if (locations.length > 0) {
                    Session.set('shouldShowMap', true);
                }

                this.setState({
                    results: results
                });
            });
        },

        addAddressBox: function () {
            const currentState = this.state.addressBoxes;
            currentState.push({
                id: this.getRandomId(),
                address: null
            });
            this.setState({
                addressBoxes: currentState
            });

            //Session.set('markers', [2,103.86434489999999]);

        },

        renderResults: function () {
            return this.state.results.features.map((results, index) => {
                return (
                    <div key={`key-result-feature-${index}`}>
                        {results.name}
                    </div>
                );
            });
        },
        maybeRenderResults: function () {
            if (this.state.results) {
                return (
                    <div className="hoverable card">
                        <div className="card-content">
                            {this.renderResults()}
                        </div>
                    </div>
                );
            } else {
                return '';
            }
        },

        render: function () {

            return (
                <div>
                    <div className="hoverable card">
                        <div className="card-content">
                            {this.renderInputs()}
                        </div>
                        <div className="card-action">
                            <a className="waves-effect waves-light btn" onClick={this.addAddressBox}>Add Person</a>
                            <a className="waves-effect waves-light btn" onClick={this.submit}>Meet Where!</a>
                        </div>
                    </div>

                    {this.maybeRenderResults()}
                </div>
            );
        },

        findIdAndUpdate: function (id, newValue) {
            const currentState = this.state.addressBoxes;
            currentState.forEach(addressBox => {
                if (addressBox.id === id) {
                    addressBox.address = newValue;
                }
            });
            this.setState({
                addressBoxes: currentState
            });
        }

    });

    ReactDOM.render(<UserWorkflow />, document.getElementById("render-target"));
});
