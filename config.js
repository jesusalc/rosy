require.config({

	paths : {
		"$" : "libs/jquery/index",
		"CFInstall" : "libs/chrome-frame/index",
		"ChromeFrame" : "rosy/modules/google-chrome-frame/ChromeFrame",
		"Cookies" : "libs/cookies/index",
		"Handlebars" : "libs/handlebars.js/dist/handlebars",
		"zynga/Scroller" : "libs/zynga-scroller/index",
		"templates" : "../../templates",
		"json" : "libs/json3/lib/json3",
		"text" : "libs/requirejs-text/text",
		"$plugin" : "libs/plugins/amd/jquery-plugin",
		"jsonFile" : "libs/plugins/amd/jsonFile",
	},

	waitSeconds : 15,

	shim : {
		"$" : {
			exports : "jQuery"
		},

		"zynga/Scroller" : {
			exports : "Scroller",
			deps : [
				"libs/zynga-scroller-animate/index"
			]
		},

		"CFInstall" : {
			exports : "CFInstall"
		},

		"Handlebars" : {
			exports : "Handlebars"
		}
	}
});
