var DashboardView = Parse.View.extend ({

	events: {
		'click .create-group-button'		: 'createGroupNav', 
		'click .compare-groups-button'		: 'compareGroupsNav', 
		'click .dashboard-group'			: 'groupNav'
	},

	template: _.template($('.dashboard-view').text()),

	className: 'full-dashboard-container',

	initialize: function() {
		if (Parse.User.current()) {
			$('.app-container').html(this.el);

			this.getGroups();
			this.render();
			// will queue spinning Hunger Crunch logo until data is found, or error occurs and fade out
			startLoadingAnimation();
		} else {
			this.signIn();
		}
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate());
	},

	getGroups: function() {
		var that = this;
		var query = new Parse.Query(strGroups);

		// checking for group objects made by the current user
		query.include("user");
		query.equalTo("user", Parse.User.current());

		query.find({
			success: function(userGroups) {
				console.log(userGroups);	

				if (userGroups.length > 0) {
					userGroups.forEach(function(userGroup) {
						var groupPoint = {
							__type: 'Pointer',
							className: strGroups,
							objectId: userGroup.id
						};

						var query = new Parse.Query(strGroupTotals);

						// checking for GroupTotals objects for the current users groups
						query.include("groupID");
						query.include("groupID.user");
						query.equalTo("groupID", groupPoint);

						query.find({
							success: function(groupTotal) {
								stopLoadingAnimation();
								if (groupTotal.length > 0) {
									that.showGroups(groupTotal[0].attributes);
								}
								else {
									var placeholderTemplate = _.template($('.placeholder-view').text());
									$('.dashboard-group-content').html(placeholderTemplate());
								}
							},
							error: function(error) {
								stopLoadingAnimation();
								console.log(error);
							}
						});
					});
				} else {
					// append template into DOM, remove the underling on the Groupname and remove the click event from the view
					var placeholderTemplate = _.template($('.placeholder-view').text());
					$('.dashboard-group-content').html(placeholderTemplate());

					stopLoadingAnimation();
				}
			},
			error: function(error) {
				stopLoadingAnimation();
			},
		})
	},

	showGroups: function(groupTotal) {
		var renderedTemplate = _.template($('.dashboard-group-view-template').text());
		$('.dashboard-group-content').append(renderedTemplate(groupTotal));

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
		router.navigate('/#tournament/sign-in', {trigger: true});
	}
});
