Session.setDefault('counter', 0);

Template.clickButton.helpers({
    counter: function () {
        return Session.get('counter');
    }
});

Template.clickButton.events({
    'click button': function () {
        // increment the counter when button is clicked
        Session.set('counter', Session.get('counter') + 1);
    }
});
