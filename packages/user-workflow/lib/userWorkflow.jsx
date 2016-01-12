Meteor.startup(function () {
    GoogleMaps.load({
        key: 'AIzaSyB0wJuC2ZTaul7QfU3UC9BtG7uAK3MoWzc',
        libraries: 'places'  // also accepts an array if you need more than one
    });

});

Template.userWorkflow.onRendered(function () {
    this.autorun(function () {
        if (GoogleMaps.loaded()) {
            //$(".js-address-input").geocomplete();
        }
    });
    ReactDOM.render(<UserWorkflow />, document.getElementById("render-target"));
});

UserWorkflow = React.createClass({

    getInitialState: function () {
        return {
            addressBoxes: [
                {
                    id: this.getRandomId(),
                    address: null
                }
            ]
        };
    },

    renderTasks() {
        return this.state.addressBoxes.map((addressBox) => {
            const key = addressBox.id;
            $(`#${key}`).geocomplete().bind("geocode:result", (event, result) => {
                this.findIdAndUpdate(key, result.formatted_address);
            });
            return <form className="input-field" key={key}>
                <div>
                    <i className="material-icons prefix">account_circle</i>
                    <input className="js-address-input" id={key} type="text" name="address"
                           onChange={this.handleInputChange}/>
                    <label className="active" htmlFor={key}>Enter a place</label>
                </div>
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
        console.log(allAddresses);
        // todo put code here to do computation


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

    render: function () {

        return (
            <div className="container">

                {this.renderTasks()}
                <a className="waves-effect waves-light btn" onClick={this.addAddressBox}>Add Person</a>
                <a className="waves-effect waves-light btn" onClick={this.submit}>Meet Where!</a>
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
