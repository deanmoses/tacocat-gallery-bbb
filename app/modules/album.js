// Album module
define([
// Require the app.js module before this module can be run
"app"],

// Map dependencies from above array.


function(app) {

	// Create a new module
	var Album = app.module();

	//
	// MODELS
	//
	
	/**
	 * Represents an album.
	 *
	 * Includes all data about child photos.
	 * Includes child albums, but not the child album's photos.
	 */
	Album.Model = Backbone.Model.extend({
		idAttribute: 'fullPath',

		url: function() {
			//console.log('Album.Model.url() called');
			// if not mock, return real URL
			if (!app.mock) {
				return "http://tacocat.com/pictures/main.php?g2_view=json.Album&album=" + this.id;
			}
			// else if it's a sub album with photos
			else if (this.id.indexOf("/") >= 0) {
				return "mock/album.json.txt";
			}
			// else it's a year album
			else {
				return "mock/album-year.json.txt";
			}
		},

		initialize: function() {
			_.bindAll(this, "getPhotoByPathComponent", "getNextPhoto", "getPrevPhoto");
		},

		/**
		 * Find a photo by it's pathComponent, like 'flowers.jpg'
		 */
		getPhotoByPathComponent: function(pathComponent) {
			//console.log("Album.Model.getPhotoByPathComponent("+pathComponent+"): model: ", jQuery.extend(true, {}, this));
			var photo = _.find(this.attributes.children, function(child) {
				//console.log("album.getPhotoByPathComponent("+pathComponent+"): looking at child.pathComponent: " + child.pathComponent);
				return child.pathComponent == pathComponent;
			});

			return photo;
		},

		getNextPhoto: function(pathComponent) {
			//console.log("Album.Model.getNextPhoto("+pathComponent+")");
			var foundCurrentPhoto = false;
			return _.find(this.attributes.children, function(child) {
				//console.log("album.getNextPhoto("+pathComponent+"): looking at child.pathComponent: " + child.pathComponent);
				if (foundCurrentPhoto) {
					//console.log("album.getNextPhoto("+pathComponent+"): " + child.pathComponent + " is the next photo!");
					return true;
				} else if (child.pathComponent == pathComponent) {
					foundCurrentPhoto = true;
				}
			});
		},

		getPrevPhoto: function(pathComponent) {
			var prevPhoto;
			_.find(this.attributes.children, function(child) {
				if (child.pathComponent == pathComponent) {
					return true;
				}
				prevPhoto = child;
			});

			return prevPhoto;
		}
	});

	/**
	 * Caching collection of all the albums in the system
	 * that have been retrieved so far.
	 */
	Album.Collection = Backbone.Collection.extend({
		model: Album.Model,

		initialize: function() {
			_.bindAll(this, "fetchAlbum");
		},

		/**
		 * Retrieve an album model by full path, like '2010/01_31'.
		 *
		 * This is asynchronous -- you have to register a callback via
		 *  .then(), .always(), .done() and .fail()
		 */
		fetchAlbum: function(path) {
			//console.log("Album.Collection.fetchAlbum('" + path + "')");

			// 'this' points to 
			var that = this;

			// build a jQuery Deferred object
			var deferred = $.Deferred();

			// look for album in my cache of albums
			var album = this.get(path);

			// if album is in cache...
			if (album) {
				//console.log("Album.Collection.fetchAlbum(): album " + path + " is in cache");

				// resolve the deferred immediately with success
				deferred.resolve(album);
			}
			// else the album is not in cache...
			else {
				console.log("Album.Collection.fetchAlbum(): album " + path + " not on client, fetching");
				album = new Album.Model({
					fullPath: path
				});
				album.fetch({
					success: function(model, response, options) {
						//console.log("Success fetching album " + path);
						// Figure out path to parent album
						// if there's a slash, then it's a sub album
						if (path.indexOf("/") >= 0) {
							var pathParts = path.split("/");
							pathParts.pop();
							album.attributes.parentAlbumPath = pathParts.join("/");
							album.attributes.albumType = "week";
						}
						// else if the album path is not "", it's a year album
						else if (path.length > 0) {
							album.attributes.parentAlbumPath = "";
							album.attributes.albumType = "year";
						}
						// else this is the root album
						else {
							album.attributes.parentAlbumPath = null;
							album.attributes.albumType = "root";
						}

						// cache the album
						that.push(album);

						// tell the deferred object to call all done() listeners
						deferred.resolve(album);
					},
					error: function(model, xhr, options) {
						console.log("Error fetching album " + path + ": ", xhr, options);

						// tell the deferred object to call all .fail() listeners
						deferred.reject(xhr, options);
					}
				});
			}

			// return the jQuery Promise so that the callers can use .then(), .always(), .done() and .fail()
			return deferred.promise();
		}
	});

	/**
	 * The single store of all albums in the system
	 */
	Album.Store = new Album.Collection();

	//
	// VIEWS
	//
	
	/**
	 * Display an album
	 */
	Album.Views.Main = Backbone.View.extend({

		initialize: function() {
			_.bindAll(this, "render");
		},

		render: function() {
			//console.log("Album.Views.Main.render() model: ", this.model);

			// Render different types of albums differently
			var albumType = this.model.attributes.albumType;

			var albumTypeRenderers = Album.Views[albumType];
			if (!albumTypeRenderers) {
				throw "Unknown album type: [" + albumType + "]";
			}
			
			// Blank the page
			this.$el.empty();

			// Generate the header HTML
			var headerHtml = app.renderTemplate('album_' + albumType + '_header', this.model.attributes);
			
			// Generate the thumbnail HTML
			var bodyHtml = Album.Views[albumType].getBodyHtml(this.model);

			// Generate the layout HTML
			var html = app.renderTemplate('layout_main', {
				pageType: 'album ' + albumType,
				header: headerHtml,
				body: bodyHtml
			});

			// Write the HTML to the DOM
			this.$el.html(html);

			// To support chaining
			return this;
		}
	});
	
	//
	// VIEW HELPERS
	// These help generate the above views
	//
	
	/**
	 * Define an object to store the HTML generators for the week albums.
	 */
	Album.Views.week = {};
	
	/**
	 * Generate the HTML for the body of a week album
	 */
	Album.Views.week.getBodyHtml = function(album) {
			// Generate the thumbnail HTML
			var thumbnailHtml;
			_.each(album.get("children"), function(child) {
				//console.log("Album.Views.Week.render() thumbnail child: " + child.title);
				thumbnailHtml += app.renderTemplate('thumbnail', child);
			});

			// Generate the body HTML
			return app.renderTemplate('album_week_body', {
				album: album,
				thumbnails: thumbnailHtml
			});
	};

	/**
	 * Define an object to store the HTML generators for the year albums.
	 */
	Album.Views.year = {};

	/**
	 * Generate the HTML for the body of a year album
	 */
	Album.Views.year.getBodyHtml = function(album) {
			// Generate the thumbnail HTML
			// Group the child week albums of the year album by month
			var months = _.groupBy(album.get("children"), function(child) {
				// create a new javascript Date object based on the timestamp
				// multiplied by 1000 so that the argument is in milliseconds, not seconds
				var date = new Date(child.creationTimestamp * 1000);
				var month = date.getMonth();
				return month;
			});

			// Template to render an entire month's worth of thumbs
			var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

			// Render the months in reverse chronological order
			// month[0] = January
			var thumbnailHtml;
			for (var i = 11; i >= 0; i--) {
				if (months[i]) {
					var month = {
						name: monthNames[i],
						albums: months[i]
					};
					//console.log("Month: ", month);
					thumbnailHtml += app.renderTemplate('thumbnail_month', month);
				}
			}

			// Generate the body HTML
			return app.renderTemplate('album_year_body', {
				album: album,
				thumbnails: thumbnailHtml
			});
	};

	/**
	 * Define an object to store the HTML generators for the root album.
	 */
	Album.Views.root = {};

	/**
	 * Generate the body HTML for the root album
	 */
	Album.Views.root.getBodyHtml = function(album) {
	
			// Generate the thumbnail HTML
			var thumbnailHtml;
			_.each(album.get("children"), function(child) {
				//console.log("Album.Views.Root.render() thumbnail child: " + child.title);
				thumbnailHtml += app.renderTemplate('thumbnail', child);
			});

			// Generate the thumbnail HTMl for the early years as fake child albums 
			var earlyYears = [{
				url: "/pix/2006/index.php",
				title: "2006",
				thumbnail: {
					url: "/pix/img/2006-reading.jpg",
					height: 75,
					width: 150
				}
			}, {
				url: "/pix/2005/index.php",
				title: "2005",
				thumbnail: {
					url: "/pix/img/2005-bath.jpg",
					height: 75,
					width: 150
				}
			}, {
				url: "/pix/2004/index.php",
				title: "2004",
				thumbnail: {
					url: "/pix/img/2004_fall_milo.jpg",
					height: 75,
					width: 75
				}
			}, {
				url: "/pix/2003/index.php",
				title: "2003",
				thumbnail: {
					url: "/pix/img/21months_small.jpg",
					height: 75,
					width: 75
				}
			}, {
				url: "/pix/2002/index.php",
				title: "2002",
				thumbnail: {
					url: "/pix/img/1year_small.jpg",
					height: 75,
					width: 75
				}
			}, {
				url: "/pix/2001/index.php",
				title: "2001",
				thumbnail: {
					url: "/pix/img/felix_small.jpg",
					height: 75,
					width: 75
				}
			}, {
				url: "/pix/1973/dean/index.php",
				title: "1973",
				thumbnail: {
					url: "/pix/img/1973-dean-2weeks-thumb.jpg",
					height: 75,
					width: 75
				}
			}];

			_.each(earlyYears, function(child) {
				//console.log("Album.Views.Root.render() thumbnail early year: " + child.title);
				thumbnailHtml += app.renderTemplate('thumbnail_earlyyears', child);
			});

			// Generate the body HTML
			return app.renderTemplate('album_week_body', {
				album: album,
				thumbnails: thumbnailHtml
			});
	};

	// Return the module for AMD compliance.
	return Album;
});
