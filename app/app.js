/**
 * Main application module that provides configuration info and helper methods to the rest of the app.
 *
 * This file follows the AMD javascript module format.
 */
define([
	// packages that need a mapping in function() below
	"jquery",
	"backbone",
	"handlebars"
], 
function($, Backbone, Handlebars) {

	/**
	 * Global location to place configuration settings and module
	 * reation.
	 */
	var app = {

		/**
		 * The root path to run the application
		 */
		root: "/",

		/**
		 * Flag as to whether the system should be run offline.
		 * Only for development when disconnected.
		 */
		mock: false,

		/**
		 * The base of the URL for all JSON calls
		 */
		baseAjaxUrl: "http://tacocat.com/pictures/main.php?g2_view="
	};

	/**
	 * Mix Backbone.Events, modules, and layout management into the app object.
	 */
	return _.extend(app, {
		
		/**
		 * Function that allows other modules to create a custom module object 
		 * with a nested Views object
		 */
		module: function(additionalProps) {
			return _.extend({
				Views: {}
			}, additionalProps);
		},

		/**
		 * Helper for using layouts
		 */
		useLayout: function(name, options) {
			// Enable variable arity by allowing the first argument to be the options
			// object and omitting the name argument.
			if (_.isObject(name)) {
				options = name;
			}

			// Ensure options is an object.
			options = options || {};

			// if a name property was specified, use that as the template.
			if (_.isString(name)) {
				options.template = name;
			}

			// Create a new Layout with options.
			var layout = new Backbone.Layout(_.extend({
				el: "#main"
			}, options));

			// Cache the refererence.
			return this.layout = layout;
		},
		
		/**
		 * Helper for managing templates
		 * 
		 * @param templateId ID of template
		 * @param context - the model attributes, or whatever data you pass to a template
		 */
		renderTemplate : function(templateId, context) {
			console.log("app.renderTemplate(["+templateId+"])");
			return this.getTemplate(templateId)(context);
		},
		
		/**
		 * Return the compiled template
		 *
		 * @param templateId ID of template
		 */
		getTemplate : function(templateId) {
			if (Handlebars.templates === undefined || Handlebars.templates[templateId] === undefined) {
				$.ajax({
					url : 'app/templates/' + templateId + '.handlebars',
					success : function(data) {
						if (Handlebars.templates === undefined) {
							Handlebars.templates = {};
						}
						Handlebars.templates[templateId] = Handlebars.compile(data);
					},
					async : false
				});
			}
			return Handlebars.templates[templateId];			
		}
		
	}, Backbone.Events);

});
