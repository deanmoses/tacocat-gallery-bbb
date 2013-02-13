/**
 * Module that kicks off the app.
 *
 * This file follows the AMD javascript module format.
 */
require([
  // require that app.js be loaded first, and passed into this module via tha 'app' parameter below
  "app",

	"modules/authentication",

  // require that router.js be loaded first, and passed into this module via the 'Router' parameter below
  "router"
],
function(app, authentication, Router) {
	console.log("main()");

	app.authenticationModel = new authentication.Model();
	app.authenticationView = new authentication.View({model:app.authenticationModel});
	
	// Fetching the model will trigger a render of the authentication view,
	// which writes some CSS classes into the body tag
	app.authenticationModel.fetch({
		error : function(model, xhr, options) {
			console.log("gallery.authentication.fetch() - error.  xhr: ", xhr);
		}
	});
	
  // Create the master router.  We'll trigger all navigation from this instance.
  app.router = new Router();

  // Trigger the initial route and enable HTML5 History API support, set the
  // root folder to '/' by default.  Change in app.js.
  Backbone.history.start({ pushState: false, root: app.root });

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router. If the link has a `data-bypass`
  // attribute, bypass the delegation completely.
  $(document).on("click", "a[href]:not([data-bypass])", function(evt) {
	
    // Get the absolute anchor href.
    var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };

    // Get the absolute root.
    var root = location.protocol + "//" + location.host + app.root;

    // Ensure the root is part of the anchor href, meaning it's relative.
    if (href.prop.slice(0, root.length) === root) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // `Backbone.history.navigate` is sufficient for all Routers and will
      // trigger the correct events. The Router's internal `navigate` method
      // calls this anyways.  The fragment is sliced from the root.
      Backbone.history.navigate(href.attr, true);
    }
  });

});
