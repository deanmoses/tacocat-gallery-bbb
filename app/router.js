/**
 * URL router module.
 *
 * This file follows the AMD javascript module format.
 */
define([
	"app",  // The main application module
	"modules/album" // The module with all the album logic and views
],
function(app, Album) {

	/**
	 * The application router.  You can attach sub routers here.
	 */
	var Router = Backbone.Router.extend({
		routes: {
			"v/*path.html": "viewPhoto",
			"v/*path": "viewAlbum",
			"*path": "notFound"
		},

		/**
		 * Show the album page
		 */
		viewAlbum: function(path) {
			console.log("Router.viewAlbum(path: [" + path + "])");

			// regularize path by getting rid of any preceding or trailing slashes
			path = this.normalizePath(path);

			// fetch album, either from cache or from server
			Album.Store.fetchAlbum(path).fail(function(xhr, options) {
				console("Couldn't find album " + path + ". Error: ", xhr, options);
			}).done(function(album) {
				//console.log("URL router viewAlbum() got album " + path + ".  Album: " , album);
				new Album.Views.Week({model: album,el: $('#main')}).render();
			});
		},

		/**
		 * Show the 'not found' page
		 */
		notFound: function(path) {
			// retrieve the root album
			this.viewAlbum("");
		},

		/**
		 * Helper method to normalize paths
		 */
		normalizePath: function(path) {
			// strip any trailing slash
			path = path.replace(/\/$/, "");

			// Regularize path by getting rid of any preceding or trailing slashes
			var pathParts = path.split("/");
			return pathParts.join("/");
		}
	});

	return Router;

});
