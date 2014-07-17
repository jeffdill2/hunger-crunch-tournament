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
			startLoadingAnimation();
			$('.app-container').html(this.el);

			this.getGroups();
			this.render();
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

		// query for groups that ended no later than 5 days ago


		query.equalTo("user", Parse.User.current());
		query.descending("endDate")
		query.find({
			success: function(userGroups) {
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
									var placeHolder = {
										groupName: userGroup.attributes.name
									}
									// if the group has not been populated yet, however other groups exist on the page provide the placeholder content
									var placeholderTemplate = _.template($('.existing-groups-dashboard-placeholder-template').text());
									$('.dashboard-group-content').html(placeholderTemplate(placeHolder));
								}
							},
							error: function(error) {
								stopLoadingAnimation();
								console.log(error);
							}
						});
					});
				} else {
					// if the group has not been populated yet, provide the placeholder content
					var placeholderTemplate = _.template($('.no-groups-dashboard-placeholder-template').text());
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
		var now = new Date();
		var time = (5 * 24 * 3600 * 1000)
		var fiveDaysAgo = new Date(now.getTime()-time)
		// check if group ended more than five days ago - if so, will render gray icons in dash
		if (fiveDaysAgo > groupTotal.groupID.attributes.endDate) {
			groupTotal.dateCheck = 0
		} else {
			groupTotal.dateCheck = 1
		}

		groupTotal.groupID.attributes.startDate = groupTotal.groupID.attributes.startDate.toString().substring(0,10)
		groupTotal.groupID.attributes.endDate = groupTotal.groupID.attributes.endDate.toString().substring(0,10)
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
		setTimeout(function () {
			router.navigate('/#tournament/sign-in', {trigger: true});
		}, 50)
	}
});
