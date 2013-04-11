require.config({
	baseUrl : "../../",

	paths : {
		"$" : "libs/jquery/jquery",
		"json" : "libs/json3/lib/json3",
		"Cookies" : "libs/cookies/index",
		"text" : "libs/requirejs-text/text",
		"Handlebars" : "libs/handlebars.js/dist/handlebars",
		"templates" : "../../templates",
		"rosy" : "libs/rosy/src",
		"jsonFile" : "libs/rosy/src/plugins/json-file/jsonFile",
		"$plugin" : "libs/rosy/src/plugins/jquery-plugin/jquery-plugin"
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
