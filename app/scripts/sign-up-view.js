var SignUpView = Parse.View.extend ({

	events: {
		'click	.new-user-creation-button'	: 'createNewUser',
	},

	template: _.template($('.sign-up-view').text()),

	initialize: function (options) {
		$('.nav-container').append(this.el);
		this.render();
	},

	render: function () {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	createNewUser: function () {
		var user = new Parse.User();
		user.set("username", $('.new-user-username-input').val() );
		user.set("password", $('.new-user-password-input').val());
		user.set("email", $('.new-user-email-input').val());

		user.signUp(null, {
  			success: function(user) {
  				window.location = '/#dashboard';
  			},
  			error: function(user, error) {
  			  alert("Something went wrong, email may already be taken");
  			}
		});
	},

});