var HomeView = Parse.View.extend ({

	events: {
		'click .create-new-user' : 'newUser',
		'click .submit-group-id' : 'submitGroup',
	},

	template: _.template($('.home-view').text()),

	initialize: function () {
		$('.app-container').append(this.el);
		this.render();
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	newUser : function () {
		window.location = '/#addUser';
	},

	submitGroup : function () {
		window.location = '/#group/' + $('.group-id').val();
	}
})