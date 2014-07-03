var NoUserNavView = Parse.View.extend({

	template: _.template($('.no-user-nav-view').text()),

	initialize: function () {
		$('.nav-container').append(this.el);
		this.render();
		
	},

	render: function () {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	}
});