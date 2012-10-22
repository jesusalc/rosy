define(

	[
		"OxBlood",
		"JSHint",
		"$"
	],

	function (OxBlood, JSHint, $) {

		/*global describe, expect, it, before, beforeEach, after, afterEach */

		"use strict";

		OxBlood.addQualityTests(function () {

			describe("Code Quality", function () {

				var options = {};

				var excludes = /lib(s)?|ssla-analytics/;

				var test = function (script, done) {
					$.ajax({
						url: script,
						dataType: "text",
						success: function (source) {
							var result,
							messages = [],
							sourceCode = [];

							if (source !== undefined) {
								var hint = new JSHint(source, options),
									i, j, error;

								for (i = 0, j = JSHint.errors.length; i < j; i++) {
									error = JSHint.errors[i];

									if (error) {
										messages.push("Line " + error.line + ": " + error.reason);
										sourceCode.push("Line " + error.line + ": " + error.evidence);
									}
								}
							}

							if (messages.length) {
								result = new Error("\n" + messages.join("\n"));
							}

							done(result);
						},
						error: function () {
							done();
						}
					});
				};

				var getPrettyPrint = function (script) {
					var loc = window.location,
						pretty = script.replace(loc.protocol + "//" + loc.host + "/", "");

					return pretty.split("?")[0];
				};

				var setupTest = function (script, test) {
					var loc = window.location;

					if (script.indexOf(loc.host) === -1 || excludes.test(script)) {
						return;
					}

					var pretty = getPrettyPrint(script);

					it(pretty, function (done) {
						test(script, done);
					});
				};

				var loadOptions = function () {
					$.getJSON("/.jshintrc", function (json) {
						options = json;
					});
				};

				describe("JSHint", function () {
					var scripts = $("script[data-requiremodule]"),
						i, j;

					for (i = 0, j = scripts.length; i < j; i++) {
						setupTest(scripts[i].src, test);
					}
				});

				loadOptions();
			});

		});
	}
);
