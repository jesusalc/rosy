require.config({

	paths : {
		"$" : "jquery/jquery",
		"rosy" : "rosy/rosy",
		"json" : "json3/lib/json3",
		"Cookies" : "cookies/index",
		"text" : "requirejs-text/text",
		"templates" : "../../templates",
		"jsonFile" : "rosy/plugins/json-file/jsonFile",
		"Handlebars" : "libs/handlebars.js/dist/handlebars",
		"$plugin" : "rosy/plugins/jquery-plugin/jquery-plugin"
	},

	waitSeconds : 15,

	shim : {
		"$" : {
			exports : "jQuery"
		},

		"Handlebars" : {
			exports : "Handlebars"
		}
	}
});
