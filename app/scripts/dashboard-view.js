var DashboardView = Parse.View.extend ({

	events: {
		'click	.create-group-button'		: 'createGroupNav', 
		'click	.compare-groups-button'		: 'compareGroupsNav', 
		'click	.dash-group'				: 'groupNav', 
	},

	template: _.template($('.dashboard-view').text()),

	className: 'full-dashboard-container',

	initialize: function () {
		$('.app-container').append(this.el);
		this.getGroups();
		this.render();
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	getGroups: function() {
		var Groups = Parse.Object.extend("Groups");
		var query = new Parse.Query(Groups);
		// checking for group objects made by the current user
		query.equalTo("orgName", Parse.User.current().attributes.username);
		query.find({
			success: function(userGroups) {
				var renderedTemplate = _.template($('.dashboard-group-view').text())
				userGroups.forEach(function(userGroup){
					var GroupTotals = Parse.Object.extend("GroupTotals");
					var query = new Parse.Query(GroupTotals);
					// checking for GroupTotals objects for the current users groups
					query.equalTo("groupID", userGroup.attributes.groupID);
					query.find({
						success: function(groupTotal) {
							$('.dashboard-group-content').append(renderedTemplate(groupTotal[0].attributes));

						},
						error: function(error) {
							console.log(error)
						}
					})
				})
			},
			error: function(error) {
				console.log(error)
			},

		})

	},

	createGroupNav: function() {
		router.navigate('/#tournament/dashboard/create-group', {trigger: true});
	},

	compareGroupsNav: function() {
		router.navigate('/#tournament/dashboard/compare-groups', {trigger: true});		
	},

	groupNav: function(location) {
		
		var groupNav = location.currentTarget.children[0].children[0].children[1].innerHTML;
		router.navigate('/#tournament/group/' + groupNav, {trigger: true});		
	},

})