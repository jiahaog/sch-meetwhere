Template.userWorkflow.onRendered(() => {
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

        const currentState = this.state.addressBoxes;
        currentState.forEach(addressBox => {
            if (addressBox.id === id) {
                addressBox.address = value;
            }
        });
        this.setState({
            addressBoxes: currentState
        });
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
    }
});
