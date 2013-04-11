require.config({

	paths : {
		"$" : "../jquery/jquery",
		"json" : "../json3/lib/json3",
		"Cookies" : "../cookies/index",
		"text" : "../requirejs-text/text",
		"Handlebars" : "../handlebars.js/dist/handlebars",
		"templates" : "../../templates",
		"rosy" : "src",
		"jsonFile" : "src/plugins/json-file/jsonFile",
		"$plugin" : "src/plugins/jquery-plugin/jquery-plugin"
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
