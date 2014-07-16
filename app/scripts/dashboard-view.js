var DashboardView = Parse.View.extend ({

	events: {
		'click .create-group-button'		: 'createGroupNav', 
		'click .compare-groups-button'		: 'compareGroupsNav', 
		'click .dashboard-group'			: 'groupNav'
	},

	template: _.template($('.dashboard-view').text()),

	className: 'full-dashboard-container',

	initialize: function () {
		if (Parse.User.current()) {
			$('.app-container').append(this.el);
			this.getGroups();
			this.render();
			// will queue spinning Hunger Crunch logo until data is found, or error occurs and fade out
			startLoadingAnimation();
		} 
		else {
			this.signIn();
		}
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	getGroups: function() {

		var that = this;
		var TntGroup = Parse.Object.extend("TntGroup");
		var query = new Parse.Query(TntGroup);
		// checking for group objects made by the current user
		query.include("user");
		query.equalTo("user", Parse.User.current());
		query.find({
			success: function(userGroups) {
				var renderedTemplate = _.template($('.dashboard-group-view-template').text())
				if (userGroups.length > 0) {
					userGroups.forEach(function(userGroup){
					console.log (userGroup.id)
						var groupPoint = {
							__type: 'Pointer', 
							className: 'TntGroup', 
							objectId: userGroup.id
						};

						var GroupTotals = Parse.Object.extend("TntGroupTotals");
						var query = new Parse.Query(GroupTotals);
						// checking for GroupTotals objects for the current users groups
						query.include("groupID");
						query.include("groupID.user");
						console.log(groupPoint)
						query.equalTo("groupID", groupPoint);

						query.find({
							success: function(groupTotal) {
								console.log(groupTotal)
								$('.dashboard-group-content').append(renderedTemplate(groupTotal[0].attributes));

								stopLoadingAnimation();
							},
							error: function(error) {
								stopLoadingAnimation();
								console.log(error)
							}
						});
					});
				}
				else {
					// append template into DOM, remove the underling on the Groupname and remove the click event from the view
					var placeholderTemplate = _.template($('.placeholder-view').text());
					$('.dashboard-group-content').html(placeholderTemplate());
					stopLoadingAnimation();
					// delete that.events['click .dashboard-group'];
					// that.delegateEvents(this.events);
				}
			},
			error: function(error) {
				stopLoadingAnimation();
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

	signIn:function () {
		this.remove();
		router.navigate('/#tournament/sign-in');
	}
})