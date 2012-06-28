// ### Part of the [Rosy Framework](http://github.com/ff0000/rosy)
/* shell.js */

// ## Local Namespace

var red = red || {};

red.module = red.module || {};

red.module.social = red.module.social || {};


/**
 *	Requires DOM elements:
 *		<link rel="media_url">
 *		<meta property="og:app_id">
 *		<div id="fb-root">
 *	Refer to http://yoast.com/social-buttons/ for more information on social-tracking-events
 *
 *	add [data-custom-social="twitter"] to automatically fire customTweet()
 *
 *	EXAMPLE
 *	<a
 *		data-custom-social-="twitter"						// REQUIred
 *		data-url="http://example.com"						// optional
 *		data-text="Some tweet you are sending"				// optional
 *	>Twitter</a>
 *
 *	Also, you can this.publish() a "custom-twitter-post" event to fire customTweet()
 *
 *	Example
 *	this.publish("custom-twitter-post", {url:"http://example.com", text : "Some Tweet Message"})
 *
 */

red.module.social.Twitter = (function () {

	var EVENTS = {
			POST : "custom-twitter-post",
			RENDER : "social/render"
		};

	return red.Module.extend({

		_twitter_url : "https://twitter.com/share?",


		init : function () {

			this.loadJSDK();

			$('[data-custom-social="twitter"]').live("click", this.proxy(this.customTweet));
			this.subscribe(EVENTS.POST,  this.proxy(this.customTweet));
			this.subscribe(EVENTS.RENDER, this.proxy(this.render));
		},

		onTwitterInit : function () {
			if (window.twttr) {
				window.twttr.events.bind('tweet',   this.proxy(this.onTweet));
				window.twttr.events.bind('follow', this.proxy(this.onFollow));
			}
		},

		querystring : function (url) { // parses query-string
			var a = /\+/g,  // Regex for replacing addition symbol with a space
				r = /([^&=]+)=?([^&]*)/g,
				d = function (s) {
						return decodeURIComponent(s.replace(a, " "));
					},
				q = url || window.location.search.substring(1),
				qs = {},
				e = r.exec(q);

			while (e) {
				qs[d(e[1])] = d(e[2]);
				e = r.exec(q);
			}

			return qs;
		},

		// override this for tracking and such
		// fires from custom tweet AND from @anywhere plugins
		onTweet: function (e, eData) {
			var el = (e.currentTarget) ? $(e.currentTarget) : $(e.target),
				data = eData || el.data() || {},
				url = el.attr("src"),
				tweeturl = this.querystring(url).url;

			this.publish("track", [{type : "event", category: "twitter", action : "on-tweet", label : tweeturl }]);

			return data;
		},

		onFollow: function (e, eData) {
			var el = $(e.currentTarget),
				data = eData || el.data();

			this.publish("track", [{type : "event", category: "twitter", action : "on-follow", label : data.url}]);
			return data;
		},

		customTweet : function (e, eData) {
			// needs URL and text
			var el = $(e.currentTarget),
				data = eData || el.data(),
				url = this._twitter_url,
				i;

			data.url = data.url || window.location.href;
			data.text = data.text || document.title;

			for (i in data) {
				if (typeof(data[i]) === 'string') {
					url += "&" + i + "=" + encodeURIComponent(data[i]);
				}
			}

			// passing through the click event to avoid blockers
			window.open(url, 'sharer', 'toolbar=0,status=0,scrollbars=1,width=575,height=338');

			// fires onTweet
			this.onTweet(e, eData);

		},

		render : function () {
			$.ajax({ url: '//platform.twitter.com/widgets.js', dataType: 'script', cache: true});
		},

		loadJSDK : function () {

			////////////////////////////////////////////////////////////
			/////// TWITTER SHARING and tracking
			// Load G+1
			var e = document.createElement('script');
			e.type = "text/javascript";
			e.async = true;
			e.src = 'http://platform.twitter.com/widgets.js';
			document.getElementsByTagName('head')[0].appendChild(e);

			$(e).load(this.proxy(function () {
				this.onTwitterInit();
			}));
		},

		destroy : function () {
			$('[data-custom-social="twitter"]').die("click", this.proxy(this.customTweet));
			this.unsubscribe(EVENTS.POST,  this.proxy(this.customTweet));
			this.unsubscribe(EVENTS.RENDER, this.proxy(this.render));
		}
	}, EVENTS);

}.call(red.module.social));
