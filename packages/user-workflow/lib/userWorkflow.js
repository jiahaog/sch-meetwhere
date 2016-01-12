SESSION_WORKFLOW_STATES = {
    NUM_PEOPLE: 'workflow-state-num-people',
};


Template.userWorkflow.onCreated(function () {
    this.numPeopleArray = ['1', '2'];
    Session.set('lol', true);
});

Template.userWorkflow.helpers({
    personToMeet: () => {
        Session.get('lol');
        //$('.js-address-input').val('');
        console.log(Template.instance().numPeopleArray);
        return Template.instance().numPeopleArray;
    }
});

Template.userWorkflow.events({
    'submit form': event => {
        event.preventDefault();
    },
    'click .js-get-places': events => {
        console.log('Form Submitted');
    },

    'click .js-add-person': events => {
        var values = $('.js-address-input').map(function(option) {
            return $(this).val();
        });

        const copy = [];
        for (var i = 0; i < values.length; i++) {
            var value = values[i];
            copy.push(value);
        }

        copy.push(' ');
        Template.instance().numPeopleArray = copy;
        Session.set('lol', !Session.get('lol'));
    }
});
