define(

	[
		"../base/Class",
		"../utils/Utils",
		"rosy/views/ViewNotification",
		"./Route"
	],

	function (Class, Utils, ViewNotification, Route) {

		"use strict";

		var transitionSequences = {
			sync : "transitionOut cleanup load transitionIn complete".split(' '),
			async : "load transitionInOut cleanup complete".split(' '),
			preload : "load transitionOut transitionIn cleanup complete".split(' '),
			reverse : "load transitionIn transitionOut cleanup complete".split(' ')
		};

		return Class.extend({

			path : null,
			_newPath : null,
			_routes : [],
			_links : [],
			_sequence : "async",

			_lastView : null,
			view : null,

			init : function (routes, config) {
				this._routes = [];
				this._links = [];
				this._queue = [];
				this.addRoutes(routes);
				this._sequence = config && config.transition || "async";
			},

			/**********************
				Adding routes
			**********************/

			addRoutes : function (routes) {
				var i;
				for (i = 0; routes && i < routes.length; i++) {
					this.addRoute(routes[i].path, routes[i].view, routes[i].config);
				}
			},

			addRoute : function (path, view, config) {
				var route = new Route(path, view, config);
				this._routes.push(route);
				return route;
			},

			/**********************
				Linking
			**********************/

			unlink : function (other) {
				var i;
				for (i = 0; i < this._links.length; i++) {
					if (this._links[i] === other) {
						this._links.splice(i, 1);
						other.unlink(this);
						return;
					}
				}
			},

			link : function (other) {
				var i;
				for (i = 0; i < this._links.length; i++) {
					if (this._links[i] === other) {
						return; // already linked
					}
				}
				this._links.push(other);
				other.link(this);
			},

			/**********************
				Changing routes
			**********************/

			route : function (path) {
				// don't route if none of the linked routers can be routed
				var i;
				if (!this.canRoute()) {
					return;
				}
				for (i = 0; i < this._links.length; i++) {
					if (!this._links[i].canRoute()) {
						return;
					}
				}

				if (this._newPath !== path) {
					this._newPath = path;
					this.onRoute(path);
					for (i = 0; i < this._links.length; i++) {
						this._links[i].route(path);
					}
				}
			},

			canRoute : function () {
				if (this.view) {
					return this.view.canClose();
				}
				return true;
			},

			onRoute : function (path) {
				var nextRoute = this.routeForPath(path);
				if (!nextRoute) {
					return;
				}
				this.path = path;
				this._lastView = this.view;
				nextRoute.loadViewClass(this.proxy(function (View) {
					this.view = new View(nextRoute.config, nextRoute.params(path));
					this.transition();
					this.publish(ViewNotification.VIEW_CHANGED, {
						view : this.view
					});
				}));
			},

			routeForPath : function (path) {
				var i;
				for (i = 0; i < this._routes.length; i++) {
					if (this._routes[i].matches(path)) {
						return this._routes[i];
					}
				}
			},

			close : function () {
				this._lastView = this.view;
				this.view = null;
				this.transition();
			},

			/**********************
				Transitions
			**********************/

			transition : function () {
				var i,
					sequence = transitionSequences[this._sequence];

				this._queue = [];

				// add from end to beginning
				for (i = 0; i < sequence.length; i++) {
					this._queue.push(sequence[i]);
				}

				this._nextInTransition();
			},

			_waitForCallback : function (cb, waitCount) {
				var total = 0;
				return function () {
					total++;
					if (total === waitCount) {
						cb();
					}
				};
			},

			_nextInTransition : function () {
				// if we don't have a queue or are at the end of the queue, do nothing
				if (this._queue.length === 0) {
					return;
				}

				// get the next in the queue
				var next = this._queue.shift(),
					count, wait;

				//console.log('_nextInTransition', next);

				// handle the next action in the queue
				switch (next) {
				case "load":
					if (this.view) {
						this.view.__load(this._nextInTransition);
					} else {
						this._nextInTransition();
					}
					break;
				case "transitionInOut":
				case "transitionOutIn":
					count = 0;
					if (this._lastView) {
						count++;
					}
					if (this.view) {
						count++;
					}
					wait = this._waitForCallback(this._nextInTransition, count);
					if (this.view) {
						this.view.__transitionIn(wait);
					}
					if (this._lastView) {
						this._lastView.__transitionOut(wait);
					}
					if (!this.view && !this._lastView) {
						this._nextInTransition();
					}
					break;
				case "transitionIn":
					if (this.view) {
						this.view.__transitionIn(this._nextInTransition);
					}
					break;
				case "transitionOut":
					if (this._lastView) {
						this._lastView.__transitionOut(this._nextInTransition);
					} else {
						this._nextInTransition();
					}
					break;
				case "cleanup":
					if (this._lastView) {
						this._lastView.__cleanup(this._nextInTransition);
					} else {
						this._nextInTransition();
					}
					break;
				}
			}
		});
	}
);
