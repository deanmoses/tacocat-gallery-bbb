/**
 * Kick off the app
 */
 
// Set up the authentication system.
// Fetching the model will trigger a render of the authentication view,
// which writes some CSS classes into the body tag
app.authenticationModel = new Authentication.Model();
app.authenticationView = new Authentication.View({model:app.authenticationModel});
app.authenticationModel.fetch({
	error : function(model, xhr, options) {
		console.log("gallery.authentication.fetch() - error.  xhr: ", xhr);
	}
});

// Create the master router.  We'll trigger all navigation from this instance.
app.router = new Router();

// Trigger the initial route 
Backbone.history.start({ pushState: false});