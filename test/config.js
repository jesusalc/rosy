require.config({
	paths : {
		"core" : "../test/core",
		"models" : "../test/models",
		"routing" : "../test/routing"
	}
});

require([
	"core/Initialization",
	"core/Notifications",
	"core/PseudoEvents",
	"core/ExternalLibs",
	"core/Inheritance",
	"core/Destruction",
	"core/Timers",
	"core/Scope",
	"models/Model",
	"routing/Routing"
], function () {

});
