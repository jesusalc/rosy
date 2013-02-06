define(

	[
		"OxBlood",
		"./Transitions",
		"./History",
		"rosy/views/Router",
		"./views/CanCloseTest",
		"./views/Test1",
		"./views/Test2",
		"./views/Test3"
	],

	function (OxBlood, Transitions, History, Router, CanCloseTest, Test1, Test2, Test3) {

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

			var transitions = new Transitions(),
				history = new History();

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

				it("should allow you to cancel route changes", function (done) {
					var router = new Router(),
						view = new CanCloseTest();
					router.addRoute('/home', Test1);
					router.view = view;

					view.locked = true;

					router.route('/home');
					expect(router.view).to.equal(view);

					view.locked = false;

					router.route('/home');
					expect(router.view).to.not.equal(view);

					done();
				});

				it("should update linked routers", function (done) {
					var routerA = new Router(),
						routerB = new Router(),
						routerC = new Router();

					routerA.addRoute('/a', Test1);
					routerA.addRoute('/b', Test2);
					routerB.addRoute('/a', Test1);
					routerB.addRoute('/b', Test2);
					routerC.addRoute('/a', Test1);
					routerC.addRoute('/b', Test2);

					routerA.link(routerB);
					routerA.link(routerC);

					routerA.route('/a');

					expect(routerA.path).to.equal('/a');
					expect(routerB.path).to.equal('/a');
					expect(routerC.path).to.equal('/a');

					routerB.route('/b');

					expect(routerA.path).to.equal('/b');
					expect(routerB.path).to.equal('/b');
					expect(routerC.path).to.equal('/b');

					done();
				});

				it("should allow linked routers to cancel route changes", function (done) {
					var routerA = new Router(),
						routerB = new Router(),
						view = new CanCloseTest();

					routerA.link(routerB);

					routerB.addRoute('/home', Test1);
					routerA.addRoute('/home', Test1);
					routerA.view = view;

					view.locked = true;

					routerB.route('/home');
					expect(routerA.path).to.equal(null);
					expect(routerB.path).to.equal(null);
					expect(routerA.view).to.equal(view);

					view.locked = false;

					routerB.route('/home');
					expect(routerA.path).to.equal('/home');
					expect(routerB.path).to.equal('/home');
					expect(routerA.view).to.not.equal(view);

					done();
				});

				it("should not change the path if there are no route matches", function (done) {
					var router = new Router();

					router.addRoute('/alt', Test1);
					expect(router.path).to.equal(null);

					router.route('/home');
					expect(router.path).to.equal(null);

					router.route('/alt');
					expect(router.path).to.equal('/alt');

					done();
				});

			});
		});
	}
);
