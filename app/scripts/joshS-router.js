var AppRouter = Parse.Router.extend({

	routes: {
		''							: 'home',
		'dashboard' 				: 'dashboardView',
		'sign-in'					: 'signInView',
		'sign-up'					: 'signUpView',
		'group/:groupID' 			: 'groupView',
		'group/:groupID/:playerID' 	: 'playerView',
		
	},

	initialize: function () {
		this.navOptions = null;
		this.currentView = null;
	},

	home: function () {
		this.swap( new HomeView() );
	},

	signUpView: function () {
		this.swap( new SignUpView() );
	},

	signInView: function () {
		this.swap( new SignInView() );
	},


	dashboardView: function () {
		this.swap( new DashboardView() );
	},

	groupView: function (groupID) {
		this.swap( new GroupView({"groupID": groupID}) );

	},

	playerView: function (groupID, playerID) {
		console.log(groupID);
		console.log(playerID);
		this.swap( new PlayerView({"playerID": playerID}) );
	},

	navCheck: function () {
		
	},
	
	swap: function (view) {
		if(this.currentView) this.currentView.remove();
		this.currentView = view;
		this.currentView.render();
		this.navCheck();
	},
})