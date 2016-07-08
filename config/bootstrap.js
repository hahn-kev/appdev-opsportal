/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */
var path = require('path');
var AD = require('ad-utils');
var async = require('async');

module.exports = function (cb) {

    async.series([

        // make sure our permissions are setup:
        function(next) {
            AD.module.permissions(path.join(__dirname, '..', 'setup', 'permissions'), next);
        },

        // make sure our OpsTool Defintions are setup:
        function(next) {
            OPSPortal.NavBar.ToolDefinition.setupPath(path.join(__dirname, '..', 'setup', 'opstools', 'opstools.js'), next);
        }

    ],function(err, result){
        cb(err);
    });
	


    // cause our navigation cache to flush on the following events:
    // ADCore.queue.subscribe(OPSPortal.Events.NAV_STALE, function(message, data){
    //     OPSPortal.NavBar.cache.flush();
    // });
    ADCore.queue.subscribe(OPSPortal.Events.NAV_STALE,  OPSPortal.NavBar.cache.flush);
    ADCore.queue.subscribe(OPSPortal.Events.PERM_STALE, OPSPortal.NavBar.cache.flush);

};

// Add CSRF route exclusion
if (sails.config.csrf) {
    
    var csrf = sails.config.csrf;
    csrf.routesDisabled = csrf.routesDisabled || '';
    
    if (csrf.routesDisabled == '-') {
        csrf.routesDisabled = '';
    }
    else if (csrf.routesDisabled) {
        csrf.routesDisabled += ',';
    }
    csrf.routesDisabled += '/opsportal/feedback';
    
}