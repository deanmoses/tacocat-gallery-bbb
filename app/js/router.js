/**
 * The router decides what happens when various URLs in the app are hit.
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
		//console.log("Router.viewAlbum(path: [" + path + "])");

		// regularize path by getting rid of any preceding or trailing slashes
		path = this.normalizePath(path);

		// fetch album, either from cache or from server
		Album.Store.fetchAlbum(path).fail(function(xhr, options) {
			console("Couldn't find album " + path + ". Error: ", xhr, options);
		}).done(function(album) {
			//console.log("URL router viewAlbum() got album " + path + ".  Album: " , album);
			new Album.Views.Main({
				model: album,
				el: $('#main')
			}).render();
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