var AppRouter = Parse.Router.extend({

	routes: {
		''					: 'home',
		'addUser' 			: 'addUser',
		'group/:groupID' 	: 'groupView',
		'dashboard' 		: 'dashboard',
		
	},

	initialize: function () {
		this.currentView = null;
	},

	home: function () {
		this.swap( new HomeView() )
	},

	addUser: function () {
		this.swap( new AddUserView() )
	},

	groupView: function (groupID) {
		this.swap( new GroupView({"groupID": groupID}) )

	},

	swap: function (view) {
		if(this.currentView) this.currentView.remove();
		this.currentView = view;
		this.currentView.render();
	},
})