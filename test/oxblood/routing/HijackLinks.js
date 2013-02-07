define(

	[
		"OxBlood",
		"rosy/views/Router",
		"./views/Test1",
		"$"
	],

	function (OxBlood, Router, Test1, $) {

		/*global describe, expect, it, before, beforeEach, after, afterEach */

		"use strict";

		var container = $('<div>'),
			linkA = $('<a>').attr('href', '#/a'),
			linkB = $('<a>').attr('href', '/b'),
			linkC = $('<a>').attr('data-route', '/c'),
			linkD = $('<div>').attr('data-route', '/d');

		container.append(linkA);
		container.append(linkB);
		container.append(linkC);
		container.append(linkD);

		OxBlood.addRoutingTests(function () {

			describe("Router Link Hijacking", function () {

				var router = new Router();
				router.addRoute("/0", Test1);
				router.addRoute("/a", Test1);
				router.addRoute("/b", Test1);
				router.addRoute("/c", Test1);
				router.addRoute("/d", Test1);
				router.hijack(container, "[data-route], a[href^='/'], a[href^='#']", "click custom");

				it("should hijack clicks", function (done) {
					$('body').append(container);
					router.route("/0");

					expect(router.path).to.be("/0");
					linkA.click();
					expect(router.path).to.be('/a');
					linkB.click();
					expect(router.path).to.be('/b');
					linkC.click();
					expect(router.path).to.be('/c');
					linkD.click();
					expect(router.path).to.be('/d');

					container.detach();
					done();
				});

				it("should hijack custom events", function (done) {
					$('body').append(container);
					router.route("/0");

					expect(router.path).to.be("/0");
					linkA.trigger('custom');
					expect(router.path).to.be('/a');
					linkB.trigger('custom');
					expect(router.path).to.be('/b');
					linkC.trigger('custom');
					expect(router.path).to.be('/c');
					linkD.trigger('custom');
					expect(router.path).to.be('/d');

					container.detach();
					done();
				});

				it("should ignore disabled links", function (done) {
					$('body').append(container);
					router.route("/0");

					expect(router.path).to.be("/0");
					linkA.addClass('disabled').click().removeClass('disabled');
					expect(router.path).to.be('/0');

					router._disabledClass = "diabled2";
					linkA.addClass('diabled2').click().removeClass('diabled2');
					expect(router.path).to.be('/0');

					container.detach();
					done();
				});

			});
		});
	}
);
