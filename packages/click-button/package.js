Package.describe({
    name: 'meetwhere:click-button',
    summary: 'Test button',
    version: '0.0.1'
});

Package.onUse(function (api) {

    var packages = [
        //https://github.com/meteor/meteor/pull/4851
        'meteor-base',
        'blaze-html-templates',
        'mongo',
        'less@2.5.0_2', // use the same version as the top level,
        'tracker',
        'session',
    ];
    api.use(packages);

    api.addFiles([
        'lib/clickButton.html',
        'lib/clickButton.js',
    ], 'client');

    api.export([
        //'SlidesManager'
    ]);
});
