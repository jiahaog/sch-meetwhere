Meteor.startup(function () {
    GoogleMaps.load({
        key: 'AIzaSyB0wJuC2ZTaul7QfU3UC9BtG7uAK3MoWzc',
        libraries: 'places'  // also accepts an array if you need more than one
    });

});

Template.userWorkflow.onRendered(function () {
    ReactDOM.render(<UserWorkflow />, document.getElementById("render-target"));
});

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
    },

    renderResults: function () {
        return this.state.results.features.map(results => {
            return (
                <div>
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
                        {this.state.results.center[0]},{this.state.results.center[1]}
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
