steal(
        'appdev',
        'opstools/RBAC/models/Permission.js'
).then( function(){

    var Permission = AD.Model.get('opstools.RBAC.Permission');

    // Namespacing conventions:
    // AD.Model.Base.extend("[application].[Model]" , { static }, {instance} );  --> Object
    AD.Model.Base.extend("opstools.RBAC.SiteUser", {
        findAll: 'GET /appdev-core/siteuser',
        findOne: 'GET /appdev-core/siteuser/{id}',
        create:  'POST /appdev-core/siteuser',
        update:  'PUT /appdev-core/siteuser/{id}',
        destroy: 'DELETE /appdev-core/siteuser/{id}',
        define:{
            permissions:{
                Type: Permission
            }
        },
        describe: function() {
            return {};
        },
        fieldId:'id',
        fieldLabel:'username'
    },{
        model: function() {
            return AD.Model.get('opstools.RBAC.SiteUser'); 
        },
        getID: function() {
            return this.attr(this.model().fieldId) || 'unknown id field';
        },
        getLabel: function() {
            return this.attr(this.model().fieldLabel) || 'unknown label field';
        }
    });


});