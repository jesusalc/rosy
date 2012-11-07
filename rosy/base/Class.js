define(

	[
		"./AbstractClass",
		"./NotificationManager",
		"../polyfills/function-bind",
		"../polyfills/array-indexof"
	],

	function (AbstractClass, NotificationManager) {

		"use strict";

		return AbstractClass.extend({

			opts : {
				autoProxy : true
			},

			init : function () {},

			/**
			* Subscribes to a notification.
			*/
			subscribe : function (name, handler, priority) {
				this._interestHandlers = this._interestHandlers || {};

				if (handler && !this._interestHandlers[name]) {
					handler = handler;
					NotificationManager.subscribe(name, handler, priority);
					this._interestHandlers[name] = handler;
				}
			},

			/**
			* Unsubscribes from a notification.
			*/
			unsubscribe : function (name) {
				if (!name) {
					return this.unsubscribeAll();
				}

				if (this._interestHandlers && this._interestHandlers[name]) {
					var handler = this._interestHandlers[name];
					this._interestHandlers[name] = null;
					delete this._interestHandlers[name];
					NotificationManager.unsubscribe(name, handler);
				}
			},

			/**
			* Unsubscribes from all notifications registered via this.subscribe();
			*/
			unsubscribeAll : function () {
				for (var interest in this._interestHandlers) {
					if (this._interestHandlers.hasOwnProperty(interest)) {
						this.unsubscribe(interest);
					}
				}
				this._interestHandlers = [];
			},

			/**
			* Publishes a notification with the specified data.
			*/
			publish : function (/*name, arg1, arg2, arg3..., callback*/) {
				var args = Array.prototype.slice.call(arguments);
				NotificationManager.publish.apply(NotificationManager, [].concat(args, this));
			},

			/**
			* Cross-browser shorthand for func.bind(this)
			* or rather, $.proxy(func, this) in jQuery terms
			*/
			proxy : function (fn) {
				return fn ? fn.bind(this) : fn;
			},

			/**
			* Middleware setTimeout method. Allows for scope retention inside timers.
			*/
			setTimeout : function (func, delay) {
				return window.setTimeout(this.proxy(func), delay);
			},

			/**
			* Middleware setInterval method. Allows for scope retention inside timers.
			*/
			setInterval : function (func, delay) {
				return window.setInterval(this.proxy(func), delay);
			},

			destroy : function () {
				this.unsubscribe();
			}
		});
	}
);
