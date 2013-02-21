
/**
 * Global location to place configuration and helper functions.
 */
var app = {

	/**
	 * Flag as to whether the system should be run offline.
	 * Only for development when disconnected.
	 */
	mock: false,

	/**
	 * The base of the URL for all JSON calls
	 */
	baseAjaxUrl: "http://tacocat.com/pictures/main.php?g2_view=",

	/**
	 * Helper for managing templates
	 *
	 * @param templateId ID of template
	 * @param context - the model attributes, or whatever data you pass to a template
	 */
	renderTemplate : function(templateId, context) {
		//console.log("app.renderTemplate(["+templateId+"])");
		var template = this.getTemplate(templateId);
		//var template = Handlebars.getTemplate(templateId);
		if (!template) throw "Error retrieving template [" + templateId + "]";
		return template(context);
	},

	/**
	 * Return the compiled template
	 *
	 * @param templateId ID of template
	 */
	getTemplate : function(templateId) {
		if (Handlebars.templates === undefined || Handlebars.templates[templateId] === undefined) {
			//console.log("app.getTemplate("+templateId+"): fetching from server");
			$.ajax({
				url : 'app/templates/' + templateId + '.handlebars',
				async : false
			}).done(function(data) {
				if (Handlebars.templates === undefined) {
					Handlebars.templates = {};
				}
				Handlebars.templates[templateId] = Handlebars.compile(data);
			}).fail(function(data, textStatus, jqXHR) {
				throw "Failed to retrieve template [" + templateId + "]: " + jqXHR
			});
		}
		return Handlebars.templates[templateId];
	}

};
