define(

	[
		"../base/Class",
		"rosy/views/ViewNotification",
		"./Route",
		"$"
	],

	function (Class, ViewNotification, Route, $) {

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
			_route : null,
			_routes : [],
			_links : [],
			_sequence : "async",

			_lastView : null,
			view : null,

			disabledClass : "",

			init : function (routes, config) {
				this._routes = [];
				this._links = [];
				this._queue = [];
				this.addRoutes(routes);

				this.config = config || {};
				this._sequence = this.config.transition || "async";
				this._disabledClass = this.config.disabledClass || "disabled";
			},

			/**********************
				Hijacking
			**********************/

			hijack : function (container, selector, events) {
				$(container || "body").on(
					events || "click",
					selector || "[data-route], a[href^='/'], a[href^='#']",
					this._onLinkClick
				);
			},

			_onLinkClick : function (e) {
				var dom = $(e.currentTarget),
					data = dom.data(),
					route = data.route = (data.route || dom.attr("href"));

				if (dom.attr("target")) {
					return;
				}

				if (this._disabledClass && dom.hasClass(this._disabledClass)) {
					e.preventDefault();
					return false;
				}

				if (route && this.route(route, data)) {
					e.preventDefault();
					return false;
				}
				e.preventDefault();
				return false;
			},

			/******************************
				Setting active class
			******************************/

			activate : function (container, selector, activeClass) {
				this.on('route', this.proxy(function () {
					container.find(selector).each(this.proxy(function (i, dom) {
						dom = $(dom);
						var href = dom.data("route") || dom.attr("href");
						href = href.replace('#', '');
						if (this._hrefMatchesPath(href, this.path) && !dom.hasClass(this._disabledClass)) {
							dom.addClass(activeClass || 'active');
						} else {
							dom.removeClass(activeClass || 'active');
						}
					}));
				}));
			},

			_hrefMatchesPath : function (href, path) {
				var i;
				for (i = 1; i < href.length; i++) {
					if (href[i] !== path[i]) {
						return false;
					}
				}
				return true;
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

			route : function (path, data) {
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

				path = this._normalizePath(path);

				if (this._newPath !== path) {
					this._newPath = path;
					this.onRoute(path, data);
					for (i = 0; i < this._links.length; i++) {
						this._links[i].route(path);
					}
				}
				return true;
			},

			canRoute : function () {
				if (this.view) {
					return this.view.canClose();
				}
				return true;
			},

			onRoute : function (path, data) {
				var nextRoute = this.routeForPath(path);
				if (!nextRoute) {
					return;
				}
				this._route = nextRoute;
				this.path = path;
				nextRoute.loadViewClass(this.proxy(function (View) {
					this.shouldTransitionTo(View, nextRoute.config, nextRoute.params(path), data);
					this.publish(ViewNotification.VIEW_CHANGED, {
						view : this.view
					});
				}));
				this.trigger('route');
			},

			_normalizePath : function (path) {
				// force path to start with / and strip off #
				return "/" + path.replace(/^(\/|#\/)/, '');
			},

			routeForPath : function (path) {
				var i;

				path = this._normalizePath(path);

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

			shouldTransitionTo : function (View, config, params, data) {
				if (this.view && this.view._moduleID === View._moduleID) {
					this.view.__update(params, data);
					return;
				}
				this._lastView = this.view;
				this.view = new View(config, params, data);
				this.view.__init(config, params, data);
				this.transition(this.view, this._lastView, this._sequence);
			},

			transition : function (newView, oldView, type) {
				var sequence = transitionSequences[type || 'sync'],
					queue = [],
					router = this,
					i;

				// add from end to beginning
				for (i = 0; i < sequence.length; i++) {
					queue.push(sequence[i]);
				}

				function waitForBoth(fn1, fn2, cb) {
					var count = 0;
					function done() {
						count ++;
						if (count === 2) {
							cb();
						}
					}
					fn1(done);
					fn2(done);
				}

				function next() {
					var action, count, wait;
					// if we don't have a queue or are at the end of the queue, do nothing
					if (queue.length === 0) {
						return;
					}

					action = queue.shift();

					switch (action) {
					case "load":
						if (newView) {
							newView.router = router;
							newView.__load(next);
						} else {
							next();
						}
						break;
					case "transitionInOut":
					case "transitionOutIn":
						count = 0;
						if (oldView && newView) {
							waitForBoth(oldView.__transitionOut, newView.__transitionIn, next);
						} else if (oldView) {
							oldView.__transitionOut(next);
						} else if (newView) {
							newView.__transitionIn(next);
						}
						break;
					case "transitionIn":
						if (newView) {
							newView.__transitionIn(next);
						}
						break;
					case "transitionOut":
						if (oldView) {
							oldView.__transitionOut(next);
						} else {
							next();
						}
						break;
					case "cleanup":
						if (oldView) {
							oldView.__cleanup(next);
						} else {
							next();
						}
						break;
					}
				}

				next();
			}
		});
	}
);
