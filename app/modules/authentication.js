// Authentication module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Authentication = app.module();

  // Default Model.
  Authentication.Model = Backbone.Model.extend({
	
		/**
		 * Called when a new instance of this model is created
		 */
		initialize : function() {
			// Ensure that the 'this' variable is pointing to myself 
			// in the specified methods in all contexts
    	_.bindAll(this, "isAuthenticated", "isSiteAdmin");
		},
	
		/**
		 * Return the URL that Backbone uses to fetch the model data.
		 */
		url : function() {
			//console.log('models.Authentication.url() called');
			
			// if we 
			if (app.mock) {
				return "mock/authentication.json.txt";	
			}
			// else return real URL
			else {
				return app.baseAjaxUrl + "json.Auth";
			}
		},
		
		/**
		 * Return true if the current user is logged in.
		 *
		 * This will return false until the authentication
		 * model is actually fetched from the server.
		 */
		isAuthenticated : function() {
			return this.get("isAuthenticated") == true;
		},
		
		/**
		 * Return true if the current user is logged in
		 * and a site admin.
		 *
		 * This will return false until the authentication
		 * model is actually fetched from the server.
		 */
		isSiteAdmin : function() {
			return this.get("isSiteAdmin") == true;
		}
  });

  // Return the module for AMD compliance.
  return Authentication;

});
