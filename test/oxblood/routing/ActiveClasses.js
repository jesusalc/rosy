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
			hashLinkA = $('<a>').attr('href', '#/a'),
			hashLinkB = $('<a>').attr('href', '#/b'),
			hashLinkBElse = $('<a>').attr('href', '#/b/else'),
			historyLinkA = $('<a>').attr('href', '/a'),
			historyLinkB = $('<a>').attr('href', '/b'),
			historyLinkBElse = $('<a>').attr('href', '/b/else'),
			dataRouteLinkA = $('<a>').attr('data-route', '/a'),
			dataRouteLinkB = $('<a>').attr('data-route', '/b'),
			dataRouteLinkBElse = $('<a>').attr('data-route', '/b/else');

		container.append(hashLinkA);
		container.append(hashLinkB);
		container.append(hashLinkBElse);
		container.append(historyLinkA);
		container.append(historyLinkB);
		container.append(historyLinkBElse);
		container.append(dataRouteLinkA);
		container.append(dataRouteLinkB);
		container.append(dataRouteLinkBElse);

		OxBlood.addRoutingTests(function () {

			describe("Router Activation Classes", function () {

				describe("Adding active class to data-routes", function () {
					var router = new Router();
					router.addRoute("/a", Test1);
					router.addRoute("/b", Test1);
					router.addRoute("/b/else", Test1);
					router.activate(container, "[data-route]");

					it("should add an active class to data-routes", function (done) {
						router.route('/a');

						expect(hashLinkA.hasClass('active')).to.be(false);
						expect(historyLinkA.hasClass('active')).to.be(false);
						expect(dataRouteLinkA.hasClass('active')).to.be(true);
						expect(dataRouteLinkB.hasClass('active')).to.be(false);

						done();
					});

					it("should remove active class from data-routes", function (done) {
						router.route('/b');

						expect(dataRouteLinkA.hasClass('active')).to.be(false);
						expect(dataRouteLinkB.hasClass('active')).to.be(true);
						expect(dataRouteLinkBElse.hasClass('active')).to.be(false);

						done();
					});

					it("should add active class if the data-routes starts with the path", function (done) {
						router.route('/b/else');

						expect(dataRouteLinkA.hasClass('active')).to.be(false);
						expect(dataRouteLinkB.hasClass('active')).to.be(true);
						expect(dataRouteLinkBElse.hasClass('active')).to.be(true);

						done();
					});
				});

				describe("Adding active class to hrefs", function () {
					var router = new Router();
					router.addRoute("/a", Test1);
					router.addRoute("/b", Test1);
					router.addRoute("/b/else", Test1);
					router.activate(container, "a[href^='/']");

					it("should add an active class to hrefs", function (done) {
						router.route('/a');

						expect(hashLinkA.hasClass('active')).to.be(false);
						expect(historyLinkA.hasClass('active')).to.be(true);
						expect(historyLinkB.hasClass('active')).to.be(false);
						expect(dataRouteLinkA.hasClass('active')).to.be(false);

						done();
					});

					it("should remove active class from hrefs", function (done) {
						router.route('/b');

						expect(historyLinkA.hasClass('active')).to.be(false);
						expect(historyLinkB.hasClass('active')).to.be(true);
						expect(historyLinkBElse.hasClass('active')).to.be(false);

						done();
					});

					it("should add active class if the href starts with the path", function (done) {
						router.route('/b/else');

						expect(historyLinkA.hasClass('active')).to.be(false);
						expect(historyLinkB.hasClass('active')).to.be(true);
						expect(historyLinkBElse.hasClass('active')).to.be(true);

						done();
					});
				});

				describe("Adding active class to hashes", function () {
					var router = new Router();
					router.addRoute("/a", Test1);
					router.addRoute("/b", Test1);
					router.addRoute("/b/else", Test1);
					router.activate(container, "a[href^='#']");

					it("should add an active class to hrefs", function (done) {
						router.route('/a');

						expect(hashLinkA.hasClass('active')).to.be(true);
						expect(hashLinkB.hasClass('active')).to.be(false);
						expect(historyLinkA.hasClass('active')).to.be(false);
						expect(dataRouteLinkA.hasClass('active')).to.be(false);

						done();
					});

					it("should remove active class from hrefs", function (done) {
						router.route('/b');

						expect(hashLinkA.hasClass('active')).to.be(false);
						expect(hashLinkB.hasClass('active')).to.be(true);
						expect(hashLinkBElse.hasClass('active')).to.be(false);

						done();
					});

					it("should add active class if the href starts with the path", function (done) {
						router.route('/b/else');

						expect(hashLinkA.hasClass('active')).to.be(false);
						expect(hashLinkB.hasClass('active')).to.be(true);
						expect(hashLinkBElse.hasClass('active')).to.be(true);

						done();
					});
				});

				describe("Adding active class to all", function () {
					var router = new Router();
					router.addRoute("/a", Test1);
					router.addRoute("/b", Test1);
					router.addRoute("/b/else", Test1);
					router.activate(container, "[data-route], a[href^='/'], a[href^='#']");

					it("should add an active class to hrefs", function (done) {
						router.route('/a');

						expect(hashLinkA.hasClass('active')).to.be(true);
						expect(hashLinkB.hasClass('active')).to.be(false);
						expect(historyLinkA.hasClass('active')).to.be(true);
						expect(historyLinkB.hasClass('active')).to.be(false);
						expect(dataRouteLinkA.hasClass('active')).to.be(true);
						expect(dataRouteLinkB.hasClass('active')).to.be(false);

						done();
					});

					it("should remove active class from hrefs", function (done) {
						router.route('/b');

						expect(hashLinkA.hasClass('active')).to.be(false);
						expect(hashLinkB.hasClass('active')).to.be(true);
						expect(hashLinkBElse.hasClass('active')).to.be(false);
						expect(historyLinkA.hasClass('active')).to.be(false);
						expect(historyLinkB.hasClass('active')).to.be(true);
						expect(historyLinkBElse.hasClass('active')).to.be(false);
						expect(dataRouteLinkA.hasClass('active')).to.be(false);
						expect(dataRouteLinkB.hasClass('active')).to.be(true);
						expect(dataRouteLinkBElse.hasClass('active')).to.be(false);

						done();
					});

					it("should add active class if the href starts with the path", function (done) {
						router.route('/b/else');

						expect(hashLinkA.hasClass('active')).to.be(false);
						expect(hashLinkB.hasClass('active')).to.be(true);
						expect(hashLinkBElse.hasClass('active')).to.be(true);
						expect(historyLinkA.hasClass('active')).to.be(false);
						expect(historyLinkB.hasClass('active')).to.be(true);
						expect(historyLinkBElse.hasClass('active')).to.be(true);
						expect(dataRouteLinkA.hasClass('active')).to.be(false);
						expect(dataRouteLinkB.hasClass('active')).to.be(true);
						expect(dataRouteLinkBElse.hasClass('active')).to.be(true);

						done();
					});
				});

			});
		});
	}
);
