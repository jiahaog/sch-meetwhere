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
        'react',
        'dburles:google-maps',
        'jeremy:geocomplete'
    ];
    api.use(packages);

    api.addFiles([
        'lib/userWorkflow.html',
        'lib/userWorkflow.jsx'
    ], 'client');

    api.export([
        //'SlidesManager'
    ]);
});
