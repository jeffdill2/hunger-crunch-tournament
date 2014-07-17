"use strict";

var AppRouter = Parse.Router.extend({

	routes: {
		''											: 'home',
		'tournament'								: 'home',
		'tournament/sign-in'						: 'signInView',
		'tournament/sign-in/pass-reset'				: 'passReset',
		'tournament/sign-up'						: 'signUpView',
		'tournament/sign-up/welcome'				: 'welcomeView',
		'tournament/group/:groupID' 				: 'groupView',
		'tournament/group/:groupID/edit-members' 	: 'editMemberView',
		'tournament/group/:groupID/:playerID' 		: 'playerView',
		'tournament/dashboard' 						: 'dashboardView',
		'tournament/dashboard/settings'				: 'settingsView',
		'tournament/dashboard/create-group'			: 'createGroupView',
		'tournament/dashboard/:groupID/:groupCode'	: 'groupViewCodeView',
		'tournament/dashboard/compare-groups'		: 'compareGroupsView',
	},

	initialize: function() {
		this.navOptions = null;
		this.currentView = null;
		this.navCheck();
	},

	home: function() {
		this.swap( new HomeView() );
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

	editMemberView: function (groupID) {
		this.swap( new EditMemberView({"groupID": groupID}) );
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
	welcomeView: function () {
		this.swap( new UserWelcome() );
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
