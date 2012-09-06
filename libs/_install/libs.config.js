module.exports = {
	"libs" : [{
		"name" : "jQuery",
		"src" : "http://code.jquery.com/jquery.js"
	}, {
		"name" : "Handlebars",
		"filename" : "handlebars.js",
		"src" : "http://cloud.github.com/downloads/wycats/handlebars.js/handlebars-1.0.0.beta.6.js"
	}, {
		"name" : "JSON3",
		"src" : "http://bestiejs.github.com/json3/lib/json3.js"
	}, {
		"name" : "Modernizr",
		"src" : "http://modernizr.com/downloads/modernizr.js"
	}, {
		"name" : "Require.js",
		"src" : "https://raw.github.com/jrburke/requirejs/master/require.js",
		"pluginsPath" : "require",
		"plugins" : [{
			"name" : "text",
			"src" : "https://raw.github.com/requirejs/text/latest/text.js"
		}, {
			"name" : "json",
			"src" : "https://raw.github.com/millermedeiros/requirejs-plugins/master/src/json.js"
		}]
	}]
};