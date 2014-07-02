var AddUserView = Parse.View.extend ({

	template: _.template($('.add-user-view').text()),

	initialize: function () {
		$('.app-container').append(this.el);
		this.render();
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	}
})