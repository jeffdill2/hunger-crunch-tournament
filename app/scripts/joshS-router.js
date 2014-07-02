var AppRouter = Parse.Router.extend({

	routes: {
		''							: 'home',
		'dashboard' 				: 'dashboardView',
		'group/:groupID' 			: 'groupView',
		'group/:groupID/:playerID' 	: 'playerView',
		
	},

	initialize: function () {
		this.navOptions = null;
		this.currentView = null;
	},

	home: function () {
		this.swap( new HomeView() );
		this.navCheck( new LoginView() );
	},

	navCheck: function (view) {
		if(this.navOptions) this.navOptions.remove();
		this.navOptions = view;
		this.navOptions.render();
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

	
	swap: function (view) {
		if(this.currentView) this.currentView.remove();
		this.currentView = view;
		this.currentView.render();
	},
})