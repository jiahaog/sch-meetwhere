Router.configure({
    layoutTemplate: 'mainLayout'
});


Router.route('/', function () {
    this.render('home');
});
