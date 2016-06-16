
steal(
	// List your Controller's dependencies here:
	function () {
		System.import('appdev').then(function () {
			steal.import('appdev/ad',
				'appdev/control/control',
				'OpsPortal/classes/OpsTool',
				'site/labels/app_builder').then(function () {


					// OPView
					//
					// An Generic OpsPortal View that will request it's 
					// configuration information from an API, and then load the 
					// dependend Models and Controllers as a result.
					//
					// The OPView requires 2 options:
					//     options.url		the url to the api that will 
					// 						return the config data
					//     options.key		the container ID required by the
					//						loaded controller to attach it's 
					// 						webix components to. 
					//
					// The Data returned from the options.url should contain:
					//		data.objects 	: a Hash of the object models to load
					//							{
					//								'application.object1': 'opstool/[Application]/models/[object1].js',
					//								'application.object2': 'opstool/[Application]/models/[object2].js',
					//							}
					//
					//		data.controller : a Hash of the UI controller to load
					//							{
					//								'application.page' : 'opstool/[Application]/controllers/[page].js'
					//							}
					//

					// Namespacing conventions:
					// AD.Control.OpsTool.extend('[ToolName]', [{ static },] {instance} );
					AD.Control.OpsTool.extend('OPView', {
						

						init: function (element, options) {
							var _this = this;
							options = AD.defaults({
								key: '',	// the div.id that the dependent webix data will attach to.
								url: '',  	// the url to use to GET the config data
								// templateDOM: '/opstools/BuildApp/views/BuildApp/BuildApp.ejs',
								resize_notification: 'OPView.resize',
								tool: null   // the parent opsPortal Tool() object
							}, options);
							this.options = options;

							// Call parent init
							this._super(element, options);
							
							// a Deferred representing if our view is ready
							this.dfdReady = AD.sal.Deferred();

			
							if (this.options.url != '') {
								AD.comm.service.get({ url: this.options.url })
								.fail(function(err){
									AD.error.log('Error loading OPView url:'+_this.options.url, {url: _this.options.url, error:err });
									_this.dfdReady.reject(err);
								})
								.then(function( viewData ){

									// now begin to load any dependent models and controllers:

									var objectsReady = [];
									viewData.objects = viewData.objects || [];
									viewData.objects.forEach(function(object){
										if ((object.key) && (object.path)) {
											objectsReady.push(AD.Model.ready(object.key));
											steal(object.path);  // loads the model
										} else {

											AD.error.log('Invalid definition for an object provided.', {object: object, viewdata:viewData, url:_this.options.url});
										}
									})

									$.when.apply($, objectsReady)
									.fail(function(err){
										AD.error.log('Error loading OPView objects:'+_this.options.url, {objects: viewData.objects, error:err });
										_this.dfdReady.reject(err);
									})
									.then(function(){

										// all objects are loaded, now load the controller(s)

										var controllersReady = [];
										viewData.controller = viewData.controller || [];
										viewData.controller.forEach(function(controller){ 
											if ((controller.key) && (controller.path)) {
												controllersReady.push(AD.Control.ready(controller.key));
												steal(controller.path);
											} else {

												AD.error.log('Invalid definition for a controller provided.', {controller: controller, viewdata:viewData, url:_this.options.url})
											}
										})

										_this.initDOM(viewData.controller);

										$.when.apply($, controllersReady)
										.fail(function(err){
											AD.error.log('Error loading OPView controller:'+_this.options.url, {controller: viewData.controller, error:err });
											_this.dfdReady.reject(err);

										})
										.then(function(){


											viewData.controller.forEach(function(controller){ 

												if ((controller.key) && (controller.path)) {
													// NOTE:  jQuery and '.' notations!
													var id = AD.util.string.replaceAll(controller.key, '.', '_');
													var $el = _this.element.find("#"+id);
													AD.Control.new(controller.key, $el, {});
												}

											})
_this.translate();


console.error('... OPView.init() : controller should be loaded now! :');
										})

									})
									


								})
							} else {
console.error('... OPView.init() : no url provided to this OPView!');
							}

							// this.data = {};

							// this.initDOM();
							// this.initControllers();
							// this.initEvents();

							// this.translate();
						},



						initDOM: function (arrayControllers) {

							var div = '';

							arrayControllers = arrayControllers || [];
							arrayControllers.forEach(function(controller){ 
							
								// insert the container <div> for the controller that will 
								// attach webix to this:
								var id = AD.util.string.replaceAll(controller.key, '.', '_');
								div += '<div id="'+id+'"></div>';
							})
							this.element.html(div);
						},


						ready:function() {
							return this.dfdReady;
						}


					});

				});
		});

	});