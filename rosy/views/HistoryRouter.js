define(

	[
		"./Router"
	],

	function (Router) {

		"use strict";

		var HISTORY_SUPPORTED = window.history && window.history.pushState;

		return Router.extend({

			_usePushState : true,
			_selectors : "[data-route], a[href^='/']",

			init : function (routes, config) {
				this.sup.apply(this, arguments);

				this._usePushState = config.usePushState && HISTORY_SUPPORTED;

				if (this._usePushState) {
					window.addEventListener('popstate', this._onPopState);
				}
			},

			_onPopState : function () {
				var url = location.pathname + location.search,
					hash = location.hash.replace('#', '');
				if (hash) {
					url += '#' + hash;
				}

				this.route(url);
			},

			onRoute : function (path) {
				this.sup(path);
				if (this._usePushState) {
					history.pushState(null, "", path);
				}
			}
		});
	}
);
