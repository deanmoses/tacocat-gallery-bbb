// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
//
// This is the 0.3.x format, which is now out of date
module.exports = function(grunt) {

  grunt.initConfig({
    
    // The lint task will run the build configuration and the application
    // JavaScript through JSHint and report any errors.  You can change the
    // options for this task, by reading this:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md
    lint: {
      files: [
        "build/config.js", "app/**/*.js"
      ]
    },

    // The jshint option for scripturl is set to lax, because the anchor
    // override inside main.js needs to test for them so as to not accidentally
    // route.
    jshint: {
      options: {
        scripturl: true
      }
    },
    
    // The clean task ensures all files are removed from the dist/ directory so
    // that no files linger from previous builds.
    clean: ["dist/"],

    // This task simplifies working with CSS inside Backbone Boilerplate
    // projects.  Instead of manually specifying your stylesheets inside the
    // configuration, you can use `@imports` and this task will concatenate
    // only those paths.
    styles: {
      // Out the concatenated contents of the following styles into the below
      // development file path.
      "dist/debug/index.css": {

        // Location of the source `index.css` file
        src: "app/styles/css/index.css",

        // The relative path to use for the @imports.
        paths: ["app/styles/css"],

        // Point to where styles live.
        prefix: "app/styles/css",

        // Additional production-only stylesheets here.
        additional: ["app/styles/css/index.css"]
      }
    },
    
	// Compiles all handlebars templates into JavaScript functions.
	handlebars: {
        built: {
            src: ['app/templates/**/*.handlebars'],
            dest: 'app/templates/templates.js',
            handlebarsOptions:{
                    data: true,
                    stringParams: true
                }
          }
	},
	
    // Merge all the JS 
    concat: {
      dist: {
        src: [
		  	"vendor/jam/jquery/jquery-1.9.1.min.js",
		  	"vendor/js/libs/lodash.underscore1.0.1.js",
			"vendor/js/libs/handlebars1.0.rc.2.js",
			"vendor/jam/backbone/backbone.js",
			"app/templates/templates.js",
			"app/js/app.js",
			"app/js/authentication.js",
			"app/js/album.js",
			"app/js/photo.js",
			"app/js/router.js",
		  	"app/js/main.js"
        ],

        dest: "dist/debug/index.js",

        separator: ";"
      }
    },

    // This task uses the MinCSS Node.js project to take all your CSS files in
    // order and concatenate them into a single CSS file named index.css.  It
    // also minifies all the CSS as well.  This is named index.css, because we
    // only want to load one stylesheet in index.html.
    mincss: {
      "dist/release/index.css": [
        "dist/debug/index.css"
      ]
    },

    // Takes the built require.js file and minifies it for filesize benefits.
    min: {
      "dist/release/index.js": [
        "dist/debug/index.js"
      ]
    },

    // If you want to generate targeted index.html builds into the `dist/`
    // folders, uncomment the following configuration block and use the
    // conditionals inside `index.html`.
	targethtml: {
		debug: {
			src: "index.html",
			dest: "dist/debug/index.html"
		},
		 
		release: {
			src: "index.html",
			dest: "dist/release/index.html"
		}
	},
	
	// Running the server without specifying an action will run the defaults,
    // port: 8000 and host: 127.0.0.1.  If you would like to change these
    // defaults, simply add in the properties `port` and `host` respectively.
    // Alternatively you can omit the port and host properties and the server
    // task will instead default to process.env.PORT or process.env.HOST.
    //
    // Changing the defaults might look something like this:
    //
    // server: {
    //   host: "127.0.0.1", port: 9001
    //   debug: { ... can set host and port here too ...
    //  }
    //
    //  To learn more about using the server task, please refer to the code
    //  until documentation has been written.
    server: {
      // Ensure the favicon is mapped correctly.
      files: { "favicon.ico": "favicon.ico" },

      // For styles.
      prefix: "app/styles/",

      debug: {
        // Ensure the favicon is mapped correctly.
        files: "<config:server.files>",

        // Map `server:debug` to `debug` folders.
        folders: {
          "app": "dist/debug",
          "vendor/js/libs": "dist/debug",
          "app/styles": "dist/debug"
        }
      },

      release: {
        // This makes it easier for deploying, by defaulting to any IP.
        host: "0.0.0.0",

        // Ensure the favicon is mapped correctly.
        files: "<config:server.files>",

        // Map `server:release` to `release` folders.
        folders: {
          "app": "dist/release",
          "vendor/js/libs": "dist/release",
          "app/styles": "dist/release"
        }
      }
    }

  });

  // The debug task will remove all contents inside the dist/ folder, lint
  // all your code, precompile all the underscore templates into
  // dist/debug/templates.js, compile all the application code into
  // dist/debug/require.js, and then concatenate the require/define shim
  // almond.js and dist/debug/templates.js into the require.js file.
  //grunt.registerTask("debug", "clean lint requirejs concat styles");
  //grunt.registerTask("debug", "clean lint requirejs concat styles");
  grunt.registerTask("debug", "clean targethtml concat styles");
  // The release task will run the debug tasks and then minify the
  // dist/debug/require.js file and CSS files.
  grunt.registerTask("release", "debug min mincss");
  
  
  grunt.registerTask("default", "debug");
};
