var DashboardView = Parse.View.extend ({

	events: {
		'click	.create-group-button'		: 'createGroupNav',
		'click	.compare-groups-button'		: 'compareGroupsNav',
		'click	.dash-group'				: 'groupNav',
		'click .print-button' 				: 'print'
	},

	template: _.template($('.dashboard-view').text()),

	className: 'full-dashboard-container',

	initialize: function () {
		$('.app-container').append(this.el);
		this.getGroups();
		this.render();

		startLoadingAnimation();
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	getGroups: function() {
		var TntGroup = Parse.Object.extend("TntGroup");
		var query = new Parse.Query(TntGroup);
		// checking for group objects made by the current user
		query.include("user");
		// query.equalTo("user", Parse.User.current());
		query.find({
			success: function(userGroups) {
				console.log(userGroups);

				var renderedTemplate = _.template($('.dashboard-group-view').text())

				userGroups.forEach(function(userGroup){
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
					query.equalTo("groupID", groupPoint);

					query.find({
						success: function(groupTotal) {
							console.log(groupTotal);
							$('.dashboard-group-content').append(renderedTemplate(groupTotal[0].attributes));
							// $('.groupname-and-code').html(userGroups[0].attributes.name)

							stopLoadingAnimation();
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
		// console.log($(location.currentTarget).find("p")[0].innerHTML)
		var groupNav = $(location.currentTarget).find("p")[0].innerHTML;
		router.navigate('/#tournament/group/' + groupNav, {trigger: true});		
	},

	print: function () {
		$("header").addClass('non-print')
		$(".dashboard-location").removeClass('h1-flag')
		$(".dashboard-nav").css('opacity', 0)

		window.print();

		$(".dashboard-location").addClass('h1-flag')
		$(".dashboard-nav").css('opacity', 1)
		$("header").removeClass('non-print')
	}
})