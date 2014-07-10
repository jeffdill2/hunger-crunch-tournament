var HomeView = Parse.View.extend({

	className: "home-view-container",

	events: {
		'click .submit-group-id' : 'submitGroup',
		'click .sign-up-button' : 'signUpView',
	},

	template: _.template($('.home-view').text()),

	initialize: function() {
		$('.app-container').append(this.el);
		this.render();
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	submitGroup : function() {
		router.navigate('/#group/' + $('.group-id').val(), {trigger: true});
	},

	signUpView: function() {
		if (Parse.User.current()) {
			$('.sign-up-button-container .alert').remove();

			var alertTemplate = _.template($('.alert-template').text());
			var renderedTemplate = alertTemplate({message: 'No need to sign up since you\'re already signed in!'});

			$('.sign-up-button-container').append(renderedTemplate);
		} else {
			router.navigate('/#sign-up', {trigger: true});
		}
	}
});