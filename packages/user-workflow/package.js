Package.describe({
    name: 'meetwhere:user-workflow',
    summary: 'Workflow for user button',
    version: '0.0.1'
});

Package.onUse(function (api) {

    var packages = [
        //https://github.com/meteor/meteor/pull/4851
        'meteor-base',
        'blaze-html-templates',
        'manuel:reactivearray',
        'meetwhere:address-input'
    ];
    api.use(packages);

    api.addFiles([
        'lib/userWorkflow.html',
        'lib/userWorkflow.js',
    ], 'client');

    api.export([
        //'SlidesManager'
    ]);
});
