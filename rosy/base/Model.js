define(

	[
		"../base/Class"
	],

	function (DOMClass) {

		"use strict";

		return DOMClass.extend({

			__data : null,

			init : function (input) {
				this.__data = {};
				this.set(input);
			},

			set : function (key, val, trigger) {
				var i;

				if (typeof key === "string") {
					if (this.__data[key] !== val) {
						this.__data[key] = val;
						if (trigger !== false) {
							this.trigger('change:' + key);
						}
					}
				} else {
					for (i in key) {
						this.set(i, key[i], val);
					}
				}
			},

			get : function (key) {
				var i, output;

				if (key) {
					return this.__data[key];
				}

				output = {};

				for (i in this.__data) {
					output[i] = this.__data[i];
				}

				return output;
			},

			keys : function () {
				var output = [],
					i;

				for (i in this.__data) {
					output.push(i);
				}

				return output;
			}
		});
	}
);
