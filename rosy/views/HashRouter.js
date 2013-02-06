define(

	[
		"./Router"
	],

	function (Router) {

		"use strict";

		return Router.extend({

			init : function (routes, config) {
				this.sup.apply(this, arguments);
			},

			onRoute : function (path) {
				// push state
			}
		});
	}
);
