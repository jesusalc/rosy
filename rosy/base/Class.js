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

			init : function () {

				var i,
					l;

				if (this.events && this.events.length) {
					for (i = 0, l = this.events.length; i < l; i ++) {
						this["on_" + this.events[i]] = [];
					}
				}
			},

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

			/**
			* Add pseudo event listener
			*/
			on : function (name, fn) {
				var a = this["on_" + name];
				if (a) {
					a.push(fn);
					return true;
				}

				throw new Error("Invalid event name.");
			},

			/**
			* Remove pseudo event listener
			*/
			off : function (name, fn) {

				var a = this["on_" + name],
					i;

				if (a) {

					if (!fn) {
						a = [];
						return true;
					}

					i = a.indexOf(fn);
					while (i > -1) {
						a.splice(i, 1);
						i = a.indexOf(fn);
					}
					return true;
				}

				throw new Error("Invalid event name.");
			},

			/**
			* Trigger pseudo event
			*/
			trigger : function (name, args) {

				var a,
					e,
					i;

				name = name.split(":");

				while (name.length) {

					e = name.join(":");
					a = this["on_" + e];

					if (a && a.length) {

						args = [].concat(e, this, (args || []));

						for (i = 0, l = a.length; i < l; i ++) {
							a[i].apply(null, args);
						}
					}

					console.log(e);

					name.pop();
				}
			},

			destroy : function () {

				var p;

				for (p in this.events) {
					this.off(p);
				}

				this.unsubscribe();
			}
		});
	}
);
