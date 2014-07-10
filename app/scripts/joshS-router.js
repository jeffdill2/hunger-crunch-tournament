"use strict";

var AppRouter = Parse.Router.extend({

	routes: {
		''								: 'home',
		'sign-in'						: 'signInView',
		'sign-in/pass-reset'			: 'passReset', 
		'sign-up'						: 'signUpView',
		'group/:groupID' 				: 'groupView',
		'group/:groupID/:playerID' 		: 'playerView',
		'dashboard' 					: 'dashboardView',
		'dashboard/settings'			: 'settingsView',
		'dashboard/create-group'		: 'createGroupView',
		'dashboard/:groupID/:groupCode'	: 'groupViewCodeView',
		'dashboard/compare-groups'		: 'compareGroupsView',
	},

	initialize: function() {
		this.navOptions = null;
		this.currentView = null;
		this.navCheck();

	},

	home: function() {
		this.swap( new HomeView() );
		console.log('hi there');
	},

	signUpView: function() {
		this.swap( new SignUpView() );
	},

	signInView: function() {
		this.swap( new SignInView() );
	},

	passReset: function() {
		this.swap( new PassResetView() );
	},


	dashboardView: function() {
		this.swap( new DashboardView() );
	},

	groupView: function (groupID) {
		this.swap( new GroupView({"groupID": groupID}) );
	},

	playerView: function(groupID, playerID) {
		this.swap( new PlayerView({ "playerID": playerID, "groupID": groupID }) );
	},

	createGroupView: function() {
		this.swap( new CreateGroupView() );
	},
	compareGroupsView: function() {
		this.swap( new CompareGroupsView() );
	},

	settingsView: function() {
		this.swap( new SettingsView() );
	},

	noUserNav: function() {
		if (this.navOptions) {this.navOptions.remove()};
		this.navOptions = new NoUserNavView();
	},

	userNav: function() {
		if (this.navOptions) {this.navOptions.remove()};
		this.navOptions = new UserNavView();
		this.navOptions.render();
	},

	navCheck: function() {
		if (Parse.User.current()) {
			this.userNav();
		} else {
			this.noUserNav();
		}
	},

	groupViewCodeView: function (groupID, groupCode) {
		this.swap( new GroupCodeView({'group': groupID, 'code': groupCode}));
	},

	swap: function (view) {
		this.navCheck();

		if (this.currentView) {this.currentView.remove()};
		this.currentView = view;
	},
});
