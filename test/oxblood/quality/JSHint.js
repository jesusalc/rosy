define(

	[
		"OxBlood",
		"JSHint",
		"jsonFile!/.jshintrc",
		"text!/.jshintignore",
		"$"
	],

	function (OxBlood, JSHint, options, ignore, $) {

		/*global describe, expect, it, before, beforeEach, after, afterEach */

		"use strict";

		OxBlood.addQualityTests(function () {

			describe("Code Quality", function () {

				var test = function (script, done) {
					$.ajax({
						url: script,
						dataType: "text",
						success: function (source) {
							var result,
								messages = [];

							if (source !== undefined) {
								var hint = new JSHint(source, options),
									i, j, error;

								for (i = 0, j = JSHint.errors.length; i < j; i++) {
									error = JSHint.errors[i];

									if (error) {
										messages.push("Line " + error.line + ": " + error.reason);
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

				var setupTest = function (script, excludes) {
					var loc = window.location;

					if (script.indexOf(loc.host) === -1 || excludes.test(script)) {
						return;
					}

					var pretty = getPrettyPrint(script);

					it(pretty, function (done) {
						test(script, done);
					});
				};

				var setupExcludes = function () {
					var lines = ignore.trim();
					lines = lines.replace(/\./mg, "\\.");
					lines = lines.replace(/^\*/mg, ".*");

					return new RegExp(lines.split("\n").join("|"));
				};

				describe("JSHint", function () {
					var scripts = $("script[data-requiremodule]"),
						excludes = setupExcludes(),
						i, j;

					for (i = 0, j = scripts.length; i < j; i++) {
						setupTest(scripts[i].src, excludes);
					}
				});
			});

		});
	}
);
