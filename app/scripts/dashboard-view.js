var DashboardView = Parse.View.extend ({

	events: {
		'click .create-group-button'		: 'createGroupNav', 
		'click .compare-groups-button'		: 'compareGroupsNav', 
		'click .dashboard-group'			: 'groupNav', 
		'click .print-button' 				: 'print'
	},

	template: _.template($('.dashboard-view').text()),

	className: 'full-dashboard-container',

	initialize: function () {
		if (Parse.User.current()) {
			$('.app-container').append(this.el);
			this.getGroups();
			this.render();
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
		var Groups = Parse.Object.extend("Groups");
		var query = new Parse.Query(Groups);
		var that = this;
		// checking for group objects made by the current user
		query.equalTo("orgName", Parse.User.current().attributes.username);
		query.find({
			success: function(userGroups) {
				var renderedTemplate = _.template($('.dashboard-group-view-template').text())
				if (userGroups.length > 0){
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
				}
				else {
					// if no groups are found (new account), render placeholder data
					var placeHolder = {
						groupName: "Your Group Name",
						groupID: "a1b2c",
						minions: 0,
						coins: 0
					}
					$('.dashboard-group-content').append(renderedTemplate(placeHolder));
						$('.groupname-and-code h2').css({'text-decoration':'none', 'cursor':'default'});
						delete that.events['click .dashboard-group'];
						that.delegateEvents(this.events);
				}
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
		console.log('how?')
		var groupNav = location.currentTarget.children[0].children[0].children[1].innerHTML;
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
	},

	signIn:function () {
		this.remove();
		router.navigate('/#tournament/sign-in');
	}
})