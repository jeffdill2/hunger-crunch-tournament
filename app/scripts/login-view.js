var LoginView = Parse.View.extend ({

	template: _.template($('.login-view').text()),

	initialize: function (options) {
		$('.nav-container').append(this.el);
		this.render();
	},

	render: function () {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	}

});