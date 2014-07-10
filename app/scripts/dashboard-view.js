var DashboardView = Parse.View.extend ({

	events: {
		'click	.create-group-button'		: 'createGroupNav', 
		'click	.compare-groups-button'		: 'compareGroupsNav', 
		'click	.group-details-container'	: 'groupView', 
	},

	template: _.template($('.dashboard-view').text()),

	className: 'full-dashboard-container',

	initialize: function () {
		$('.app-container').append(this.el);
		this.render();
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	createGroupNav: function() {
		router.navigate('/#dashboard/create-group', {trigger: true});
	},

	compareGroupsNav: function() {
		router.navigate('/#dashboard/compare-groups', {trigger: true});		
	},

	groupView: function() {
		// router.navigate('/#group/123', {trigger: true});		
	},

})