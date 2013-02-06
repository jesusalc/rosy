define(

	[
		"OxBlood",
		"rosy/base/Class",
		"rosy/views/Router",
		"rosy/views/ViewNotification",
		"./views/Test1"
	],

	function (OxBlood, Class, Router, ViewNotification, TestView) {

		/*global describe, expect, it, before, beforeEach, after, afterEach */

		"use strict";

		var transitions = {

			sync : [
				"transitionOut",
				"transitionOutComplete",
				"cleanup",
				"cleanupComplete",
				"load",
				"loadComplete",
				"transitionIn",
				"transitionInComplete"
			],

			async : [
				"load",
				"loadComplete",
				"transitionIn",
				"transitionOut",
				"transitionInComplete",
				"transitionOutComplete",
				"cleanup",
				"cleanupComplete"
			],

			preload : [
				"load",
				"loadComplete",
				"transitionOut",
				"transitionOutComplete",
				"transitionIn",
				"transitionInComplete",
				"cleanup",
				"cleanupComplete"
			],

			reverse : [
				"load",
				"loadComplete",
				"transitionIn",
				"transitionInComplete",
				"transitionOut",
				"transitionOutComplete",
				"cleanup",
				"cleanupComplete"
			],

			close : [
				"transitionOut",
				"transitionOutComplete",
				"cleanup",
				"cleanupComplete"
			]
		};

		var mappings = {
			"load"                  : ViewNotification.VIEW_LOAD_STARTED,
			"transitionIn"          : ViewNotification.VIEW_IN_STARTED,
			"transitionOut"         : ViewNotification.VIEW_OUT_STARTED,
			"cleanup"               : ViewNotification.VIEW_CLEANUP_STARTED,
			"loadComplete"          : ViewNotification.VIEW_LOAD_COMPLETED,
			"transitionInComplete"  : ViewNotification.VIEW_IN_COMPLETED,
			"transitionOutComplete" : ViewNotification.VIEW_OUT_COMPLETED,
			"cleanupComplete"       : ViewNotification.VIEW_CLEANUP_COMPLETED
		};

		var positions = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"];


		OxBlood.addRoutingTests(function () {

			function testTransition(name) {

				var i,
					steps = [],
					callbacks = [],
					subscriber = new Class(),
					router = new Router([], {
						transition : name === "close" ? "sync" : name
					}),
					transition = transitions[name];

				router.addRoute("/home", TestView);
				router.addRoute("/transition/sync", "routing/views/Sync");
				router.addRoute("/transition/async", "routing/views/Async");
				router.addRoute("/transition/preload", "routing/views/Preload");
				router.addRoute("/transition/reverse", "routing/views/Reverse");

				// initialize the first view so we don't get events for load + transitionIn on that view
				router.view = new TestView();

				function subscribeToStep(m) {
					subscriber.subscribe(mappings[m], function (n) {
						if (router.view === n.data.view || router._lastView === n.data.view) {
							steps.push(m);
							checkDone();
						}
					});
				}

				function whenDone(cb) {
					if (steps.length >= transition.length) {
						cb();
					} else {
						callbacks.push(cb);
					}
				}

				function checkDone() {
					var i;
					if (steps.length === transition.length) {
						for (i = 0; i < callbacks.length; i ++) {
							callbacks[i]();
						}
						subscriber.unsubscribe();
						callbacks = [];
					}
				}

				function testTransitionStep(i) {
					it("should call " + transition[i] + " " + positions[i], function (done) {
						whenDone(function () {
							expect(steps[i]).to.equal(transition[i]);
							done();
						});
					});
				}

				describe(name, function () {

					for (var m in mappings) {
						subscribeToStep(m);
					}

					for (var i in transition) {
						testTransitionStep(i);
					}

					if (name === "close") {
						router.close();
					} else {
						router.route("/transition/" + name);
					}
				});
			}

			describe("Transitions", function () {
				for (var transition in transitions) {
					testTransition(transition);
				}
			});
		});
	}
);
