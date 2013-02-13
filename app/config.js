/**
 * configures the require.js dependency management system
 */
require.config({

	// initialize the application with the main application file (main.js) and the JamJS
	// generated configuration file
	deps: [
		"../vendor/jam/require.config", 
		"main"
	],

	paths: {
		// use the underscore build of Lo-Dash to minimize incompatibilities
		lodash: "../vendor/jam/lodash/lodash.underscore.min",
		compiled_templates: "templates/templates"
	},

	map: {
		// ensure Lo-Dash is used instead of underscore
		"*": {
			"underscore": "lodash"
		}
	},

	/**
	 * Shims are how to deal with javascript libraries that aren't in module format.
	 * 
	 * Generally these libs export a global variable.  The shim 'exports' attribute
	 * tells Require.js what that global variable is, so Require.js can grab it and
	 * expose it to each module that depends on this lib as if the lib were a regular 
	 * module.
	 */
	shim: {
		// Handlebars has no dependencies.
	    handlebars: {
	      exports: "Handlebars"
	    }
	}

});
