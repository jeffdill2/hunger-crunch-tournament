var DashboardView = Parse.View.extend ({

	events: {
		'click .create-group-button'		: 'createGroupNav', 
		'click .compare-groups-button'		: 'compareGroupsNav', 
		'click .group-details-container'	: 'groupView',
		'click .print-button' 				: 'print'
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
		router.navigate('/#group/123', {trigger: true});		
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