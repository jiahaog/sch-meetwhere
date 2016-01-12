Template.addressInput.helpers({
    uniqueId: function () {
        return getRandomId();
    }
});


function getRandomId() {
    return Math.random().toString(36).substring(7);
}
