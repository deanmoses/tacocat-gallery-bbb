/**
 * Authentication
 */

  // create the Authentication object
  var Authentication = {};

	/**
	 * Authentication Model
	 * 
	 * Main task is to answer the question:  is the user authenticated?
	 */
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
			return this.get("isAuthenticated") === true;
		},
		
		/**
		 * Return true if the current user is logged in
		 * and a site admin.
		 *
		 * This will return false until the authentication
		 * model is actually fetched from the server.
		 */
		isSiteAdmin : function() {
			return this.get("isSiteAdmin") === true;
		}
  });

	/**
	 * Authentication View
	 * 
	 * If the user is authenticated, write some classes into the body tag.
	 */
	Authentication.View = Backbone.View.extend({
		
		/**
		 * Called when a new instance of this view is created
		 */
		initialize : function() {
			// Ensure that the 'this' variable is pointing to myself 
			// in the specified methods in all contexts
	    	_.bindAll(this, "render");
	
			// When the model changes, call render()
			this.listenTo(this.model, "change", this.render);
		},
		
		/**
		 * If the user is authenticated, write some classes into the body tag.
		 */
		render : function() {
			console.log("Authentication.View.render().  model: ", this.model);
			
			if (this.model.isAuthenticated()) {
				$("body").addClass('authenticated');
			}
			else {
				$("body").removeClass('authenticated');
			}
			
			if (this.model.isSiteAdmin()) {
				$("body").addClass('is-site-admin');
			}
			else {
				$("body").removeClass('is-site-admin');
			}			
		}
	});
