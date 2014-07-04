var DashboardView = Parse.View.extend ({


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

})