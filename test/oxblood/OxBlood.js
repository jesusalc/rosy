define([
	"test/lib/trim",
	"test/lib/expect",
	"test/lib/mocha/mocha"
], function () {
	mocha.setup({
		ui: "bdd",
		ignoreLeaks: true
	});

	return {
		tests : {
			core : [],
			modules : []
		},

		addCoreTests : function (tests) {
			this.tests.core.push(tests);
		},

		addModuleTests : function (tests) {
			this.tests.modules.push(tests);
		},

		registerTests : function () {
			var tests = this.tests;
			var key, test, i, j;

			for (key in tests) {
				test = tests[key].sort();

				for (i = 0, j = test.length; i < j; i++) {
					test[i]();
				}
			}
		}
	};
});