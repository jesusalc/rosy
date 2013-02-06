define(

	[
		"./Router"
	],

	function (Router) {

		"use strict";

		var HISTORY_SUPPORTED = window.history && window.history.pushState;

		return Router.extend({

			_usePushState : true,

			init : function (routes, config) {
				this.sup.apply(this, arguments);

				if (config.usePushState === false) {
					this._usePushState = false;
				}

				if (HISTORY_SUPPORTED && this._usePushState) {
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
				if (HISTORY_SUPPORTED && this._usePushState) {
					history.pushState(null, "", path);
				}
			}
		});
	}
);
