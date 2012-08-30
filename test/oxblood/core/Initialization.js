define([
	"OxBlood",
	"./SubClass"
], function (OxBlood, SubClass) {

	OxBlood.addCoreTests(function () {

		describe("Rosy Initialization", function () {

			describe(".setup()", function () {

				it("should setup the class if .setup() exists", function (done) {
					var testSubClass = SubClass.extend({
						setup : function () {
							this.prototype.isSetup = true;
						}
					});

					var testInstance = new testSubClass();

					expect(testInstance.isSetup).to.be.ok();
					done();

				});

			});

			describe(".init()", function () {

				it("should run on SubClass initialization", function (done) {
					var testSubClass = SubClass.extend({
						vars : {
							x : 0,
							y : 0,
							z : 0
						},

						init : function () {
							this.vars.x = 2;
							this.vars.y = 3;
							this.vars.b = 4;

							expect(this.vars.x).to.equal(2);
							expect(this.vars.y).to.equal(3);
							expect(this.vars.z).to.equal(0);
							expect(this.vars.b).to.equal(4);

							done();
						}
					});

					var testInstance = new testSubClass();

				});

			});

			describe(".__init()", function () {

				it("should run before .init()", function (done) {
					var testSubClass = SubClass.extend({
						vars : {
							hasRun : false
						},

						__init : function () {
							this.vars.hasRun = true;
							this.init();
						},

						init : function () {
							this.vars.hasRun = false;
						}
					});

					var testExtendSubClass = testSubClass.extend({
						init : function () {
							expect(this.vars.hasRun).to.be.ok();
							done();
						}
					});

					var testInstance = new testExtendSubClass();

				});

			});

		});

	});
});