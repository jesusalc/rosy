define(

	[
		"OxBlood",
		"rosy/base/Class",
		"rosy/views/HistoryRouter",
		"rosy/views/HashRouter",
		"rosy/views/ViewNotification",
		"./views/Test1",
		"./views/Test2"
	],

	function (OxBlood, Class, HistoryRouter, HashRouter, ViewNotification, Test1, Test2) {

		/*global describe, expect, it, before, beforeEach, after, afterEach */

		"use strict";

		var REAL_URL = window.location.pathname + window.location.search,
			REAL_HASH = window.location.hash = "",
			HISTORY_SUPPORT = window.history && window.history.pushState;

		OxBlood.addRoutingTests(function () {

			describe("History Management", function () {

				describe("useHistory = false", function () {

					var router = new HistoryRouter([], {
						usePushState : false
					});

					before(function (done) {
						router.addRoute('/r', Test1);
						router.route('/r');
						done();
					});

					it("should successfully change view without updating history", function (done) {
						expect(window.location.pathname + window.location.search).to.equal(REAL_URL);
						done();
					});

				});

				describe("useHistory = '#'", function () {

					var router = new HashRouter();
					router.addRoute('/r1', Test1);
					router.addRoute('/r2', Test2);
					router.addRoute('/r3', Test2);

					it("should successfully push hash changes", function (done) {
						router.route('/r1');

						expect(router.path).to.equal('/r1');
						expect(window.location.hash).to.equal('#/r1');

						done();
					});

					it("should successfully listen for hash changes", function (done) {
						var subscriber = new Class();
						subscriber.subscribe(ViewNotification.VIEW_CHANGED, function (n) {

							expect(window.location.hash).to.equal('#/r2');
							expect(router.path).to.equal("/r2");

							subscriber.unsubscribe(ViewNotification.VIEW_CHANGED);

							done();
						});

						window.location.hash = "/r2";
					});
				});

				if (HISTORY_SUPPORT) {

					describe("useHistory = true", function () {

						var router = new HistoryRouter([], {
							usePushState : true
						});

						before(function (done) {
							router.addRoute('/r1', Test1);
							router.addRoute('/r2', Test2);
							done();
						});

						it("should successfully push state", function (done) {
							router.route('/r1');
							expect(window.location.pathname).to.equal('/r1');
							expect(router.path).to.equal("/r1");
							done();
						});

						it("should successfully listen for pop state", function (done) {
							router.route('/r2');

							var onPopState = function () {
								expect(window.location.pathname).to.equal("/r1");
								expect(router.path).to.equal("/r1");
								window.removeEventListener('popstate', onPopState);
								history.pushState(null, null, REAL_URL);
								done();
							};

							window.addEventListener('popstate', onPopState);

							history.go(-1);
						});
					});
				}
			});

		});
	}
);
