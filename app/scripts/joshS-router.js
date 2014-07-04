"use strict";

var AppRouter = Parse.Router.extend({

	routes: {
		''							: 'home',
		'dashboard'					: 'dashboardView',
		'sign-in'					: 'signInView',
		'sign-up'					: 'signUpView',
		'group/:groupID'			: 'groupView',
		'group/:groupID/createGroup': 'createGroupView',
		'group/:groupID/settings'	: 'settingsView',
		'group/:groupID/:playerID'	: 'playerView',


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


	dashboardView: function() {
		this.swap( new DashboardView() );
	},

	groupView: function(groupID) {
		this.swap( new GroupView({ "groupID": groupID }) );

	},

	playerView: function(groupID, playerID) {
		this.swap( new PlayerView({ "playerID": playerID }) );
	},

	createGroupView: function(groupID) {
		this.swap( new CreateGroupView({"groupID": groupID}) );
	},

	settingsView: function(groupID) {
		this.swap( new SettingsView({"groupID": groupID}) );
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


	swap: function(view) {
		this.navCheck();

		if (this.currentView) {this.currentView.remove()};
		this.currentView = view;
	},
});