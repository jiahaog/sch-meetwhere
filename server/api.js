Picker.route('/api/meetwhere', function (params, req, res, next) {
    const addresses = _.values(params.query); // response is in the form of { 0: 'location1', 1: 'location2'}
    console.log(params.query, addresses);
    const calculatedResults = Meteor.call('getCenterAndFeatures', addresses);

    res.end(JSON.stringify(calculatedResults)); // put your response here
});



