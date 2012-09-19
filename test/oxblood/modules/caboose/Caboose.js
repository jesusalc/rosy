define(

	[
		"OxBlood",
		"rosy/base/Class",
		"rosy/modules/Module",
		"rosy/modules/caboose/Caboose"
	],

	function (OxBlood, Class, Module, Caboose) {

		/*global describe, expect, it, before, beforeEach, after, afterEach */

		"use strict";

		OxBlood.addModuleTests(function () {

			describe("Module: Caboose", function () {

				describe("Caboose", function () {

					it("Caboose should be an object", function () {
						expect(Caboose).to.be.an("object");
					});

					describe("animationDuration", function () {
						var obj = Caboose.animationDuration;

						it("should return an object", function () {
							expect(obj).to.be.an("object");
						});

						it("should report value as a Number", function () {
							expect(obj.value).to.be.a("number");
							expect(obj.value).to.eql(0.75);
						});

						it("should report correct time unit", function () {
							expect(obj.unit).to.eql("s");
						});

						it("should report original CSS value", function () {
							expect(obj.toString()).to.be.a("string");
							expect(obj.toString()).to.eql("0.75s");
						});

					});

					describe("animationEasing", function () {
						var obj = Caboose.animationEasing;

						it("should return an object", function () {
							expect(obj).to.be.an("object");
						});

						it("should report value as an Array", function () {
							expect(obj.value).to.be.a("array");
							expect(obj.value).to.have.length(4);
							expect(obj.value).to.eql(["0.23", "1", "0.32", "1"]);
						});

						it("should not report a time unit", function () {
							expect(obj.unit).to.not.be.ok();
						});

						it("should report original CSS value", function () {
							expect(obj.toString()).to.be.a("string");
							expect(obj.toString()).to.eql("cubic-bezier(0.23, 1, 0.32, 1)");
						});

					});

					describe("animationDelay", function () {
						var obj = Caboose.animationDelay;

						it("should return an object", function () {
							expect(obj).to.be.an("object");
						});

						it("should report value as a Number", function () {
							expect(obj.value).to.be.a("number");
							expect(obj.value).to.eql(0.1875);
						});

						it("should report correct time unit", function () {
							expect(obj.unit).to.eql("s");
						});

						it("should report original CSS value", function () {
							expect(obj.toString()).to.be.a("string");
							expect(obj.toString()).to.eql("0.1875s");
						});

					});

				});

			});

		});
	}
);
