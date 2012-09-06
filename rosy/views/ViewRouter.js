define(

	[
		"../base/Class"
	],

	function (Class) {

		"use strict";

		return Class.extend({

			_routes : [],

			init : function (viewGroups) {

				var i,
					j,
					l,
					l2,
					view,
					path,
					route;

				for (l = viewGroups.length, i = l - 1; i >= 0; i --) {
					for (l2 = viewGroups[i].routes.length, j = l2 - 1; j >= 0; j --) {
						view = viewGroups[i].routes[j];
						path = this._normalize(view.route);
						route = {
							path : path[0],
							params: path[1],
							viewConfig : view.config || {},
							viewClass : view.viewClass,
							viewGroup : viewGroups[i]
						};

						this._routes.push(route);
					}
				}
			},

			getViewsByRoute : function (route) {

				var i,
					j,
					l,
					l2,
					r,
					m,
					param,
					params,
					views = [];

				for (l = this._routes.length, i = 0; i < l; i ++) {

					r = this._routes[i];
					m = r.path.exec(route);

					if (m) {

						params = {};

						for (j = 1, l2 = m.length; j < l2; j ++) {
							param = r.params[j - 1];
							params[param.name] = m[j] || null;
						}

						views.push({
							params : params,
							viewClass : r.viewClass,
							viewGroup : r.viewGroup,
							viewConfig : r.viewConfig
						});
					}
				}

				return (views.length ? views : false);
			},

			getRouteRegexes : function (route) {

				var i,
					l,
					r,
					m,
					str,
					regexes = [],
					regexStrs = {};

				for (i = 0, l = this._routes.length; i < l; i ++) {

					r = this._routes[i].path;
					m = r.exec(route);

					str = r.toString();

					if (m && !regexStrs[str]) {
						regexes.push(r);
						regexStrs[str] = true;
					}
				}

				return (regexes.length ? regexes : false);
			},

			/**
			* Takes a route-type string, and returns an actual RegExp
			*/
			_normalize : function (path) {

				var params = [],
					strict = false,
					sensitive = false;

				if (path instanceof RegExp) {
					return [path, []];
				}

				if (path.indexOf("regex:") > -1) {
					// Convert to a regex and return...
					return [new RegExp(path.replace("regex:", "")), []];
				}

				if (path instanceof Array) {
					path = '(' + path.join('|') + ')';
				}

				path = path
					.concat(strict ? '' : '/?')
					.replace(/\/\(/g, '(?:/')
					.replace(/\+/g, '__plus__')
					.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,
						function (_, slash, format, key, capture, optional) {
							params.push({
								name : key,
								optional : !! optional
							});
							slash = slash || '';
							return '' +
							(optional ? '' : slash) +
							'(?:' +
							(optional ? slash : '') +
							(format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' +
							(optional || '');
						}
					)
					.replace(/([\/.])/g, '\\$1')
					.replace(/__plus__/g, '(.+)')
					.replace(/\*/g, '(.*)');

				return [new RegExp('^' + path + '$', sensitive ? '' : 'i'), params];
			}

		});
	}
);
