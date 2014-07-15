var DashboardView = Parse.View.extend ({

	events: {
		'click .create-group-button'	: 'createGroupNav',
		'click .compare-groups-button'	: 'compareGroupsNav',
		'click .dashboard-group'		: 'groupNav',
		'click .print-button' 			: 'print'
	},

	template: _.template($('.dashboard-view').text()),

	className: 'full-dashboard-container',

	initialize: function() {
		if (Parse.User.current()) {
			$('.app-container').append(this.el);

			this.getGroups();
			this.render();

			startLoadingAnimation();
		} else {
			this.signIn();
		}
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	getGroups: function() {
		var that = this;
		var query = new Parse.Query(strGroups);

		// checking for group objects made by the current user
		query.include("user");
		query.equalTo("user", Parse.User.current());

		query.find({
			success: function(userGroups) {
				var renderedTemplate = _.template($('.dashboard-group-view-template').text());

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
								console.log('groupTotal', groupTotal);
								$('.dashboard-group-content').append(renderedTemplate(groupTotal[0].attributes));

								stopLoadingAnimation();
							},
							error: function(error) {
								console.log(error);

								stopLoadingAnimation();
							}
						});
					});
				} else {
					// if no groups are found (new account), render placeholder data
					var placeHolder = {
						name: "Your Group Name",
						groupID: "a1b2c",
						minions: 0,
						coins: 0
					};

					// append template into DOM, remove the underling on the Groupname and remove the click event from the view
					$('.dashboard-group-content').append(renderedTemplate(placeHolder));
					$('.groupname-and-code h2').css({'text-decoration':'none', 'cursor':'default'});

					delete that.events['click .dashboard-group'];
					that.delegateEvents(this.events);
				}
			},
			error: function(error) {
				console.log(error);
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

	print: function() {
		$("header").addClass('non-print');
		$(".dashboard-location").removeClass('h1-flag');
		$(".dashboard-nav").css('opacity', 0);

		window.print();

		$(".dashboard-location").addClass('h1-flag');
		$(".dashboard-nav").css('opacity', 1);
		$("header").removeClass('non-print');
	},

	signIn: function() {
		this.remove();
		router.navigate('/#tournament/sign-in');
	}
});