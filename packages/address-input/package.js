Package.describe({
    name: 'meetwhere:address-input',
    summary: 'Address Input button',
    version: '0.0.1'
});

Package.onUse(function (api) {

    var packages = [
        //https://github.com/meteor/meteor/pull/4851
        'meteor-base',
        'blaze-html-templates',
    ];
    api.use(packages);

    api.addFiles([
        'lib/addressInput.html',
        'lib/addressInput.js',
        'lib/addressInput.css'
    ], 'client');

    api.export([
        //'SlidesManager'
    ]);
});
