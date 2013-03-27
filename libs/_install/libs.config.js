module.exports = {
	"libs" : [{
		"name" : "jQuery",
		"src" : "http://code.jquery.com/jquery.js"
	}, {
		name : "Google Chrome Frame",
		"filename" : "cfinstall.js",
		"src" : "http://ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js"
	}, {
		"name" : "Cookies.js",
		"src" : "https://raw.github.com/ScottHamper/Cookies/master/src/cookies.js"
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
		"name" : "Zynga Scroller",
		"src" : "https://raw.github.com/zynga/scroller/master/src/Scroller.js",
		"filename" : "zynga/Scroller.js",
		"pluginsPath" : "../zynga",
		"plugins" : [{
			"name" : "Animate",
			"src" : "https://raw.github.com/zynga/scroller/master/src/Animate.js"
		}]
	}, {
		"name" : "Require.js",
		"src" : "https://raw.github.com/jrburke/requirejs/master/require.js",
		"pluginsPath" : "amd",
		"plugins" : [{
			"name" : "text",
			"src" : "https://raw.github.com/requirejs/text/latest/text.js"
		}]
	}]
};
