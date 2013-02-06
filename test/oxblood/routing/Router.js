define(

	[
		"OxBlood",
		"rosy/views/Router"
	],

	function (OxBlood, Router) {

		/*global describe, expect, it, before, beforeEach, after, afterEach */

		"use strict";

		var specificityRouter = new Router();
		specificityRouter.addRoute("/a", "one");
		specificityRouter.addRoute("/b/d", "two");
		specificityRouter.addRoute("/b", "three");
		specificityRouter.addRoute("/b/c", "four");
		specificityRouter.addRoute("/b/c/:d?", "five");
		specificityRouter.addRoute(new RegExp("(testRegEx)([a-zA-Z0-9_-]+)(/?)$"), "six");

		OxBlood.addRoutingTests(function () {

			describe("Router", function () {

				it("should initialize with routes successfully", function (done) {
					var router = new Router([
						{
							path : "/home",
							viewClass : "/mySite/views/Home",
							config : {
								some : "thing"
							}
						},
						{
							path : "/about",
							viewClass : "/mySite/views/About",
							config : {
								some : "thing else"
							}
						}
					]);
					expect(router._routes.length).to.equal(2);
					done();
				});

				it("should initialize without routes successfully", function (done) {
					var router = new Router();
					expect(router._routes.length).to.equal(0);
					router.addRoutes([
						{
							path : "/home",
							viewClass : "/mySite/views/Home",
							config : {
								some : "thing"
							}
						},
						{
							path : "/about",
							viewClass : "/mySite/views/About",
							config : {
								some : "thing else"
							}
						}
					]);
					expect(router._routes.length).to.equal(2);
					router.addRoute("/home", "/mySite/views/Home", {
						some : "thing"
					});
					expect(router._routes.length).to.equal(3);
					done();
				});

				it("should be able to change routes programatically", function (done) {
					expect(specificityRouter.routeForPath('/a').view).to.equal("one");
					expect(specificityRouter.routeForPath('/a/').view).to.equal("one");
					expect(specificityRouter.routeForPath('/b/d').view).to.equal("two");
					expect(specificityRouter.routeForPath('/b/d/').view).to.equal("two");
					expect(specificityRouter.routeForPath('/b').view).to.equal("three");
					expect(specificityRouter.routeForPath('/b/').view).to.equal("three");
					expect(specificityRouter.routeForPath('/b/c').view).to.equal("four");
					expect(specificityRouter.routeForPath('/b/c/').view).to.equal("four");
					done();
				});

				it("should support optional params", function (done) {
					expect(specificityRouter.routeForPath('/b/c/d').view).to.equal("five");
					expect(specificityRouter.routeForPath('/b/c/e').view).to.equal("five");
					expect(specificityRouter.routeForPath('/b/c/d/').view).to.equal("five");
					done();
				});

				it("should support RegEx routes", function (done) {
					expect(specificityRouter.routeForPath('/testRegEx123131/').view).to.equal("six");
					done();
				});

				it("should populate params correctly", function (done) {
					var router = new Router(),
						route = router.addRoute("/some/:a?/:b?/:c?", "/view", {});
					expect(route.params('/some/x').a).to.equal('x');
					expect(route.params('/some/x/y').b).to.equal('y');
					expect(route.params('/some/x/y/z').c).to.equal('z');
					expect(route.params('/some/thing/else/here').a).to.equal('thing');
					expect(route.params('/some/thing/else/here').b).to.equal('else');
					expect(route.params('/some/thing/else/here').c).to.equal('here');
					done();
				});

			});
		});
	}
);
