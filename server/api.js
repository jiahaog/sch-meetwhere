Picker.route('/hello', function(params, req, res, next) {
  console.log(params.query); // response is in the form of { 0: 'location1', 1: 'location2'}
  //TODO: calculate the results given an array of location
  res.end('response'); // put your response here
});
