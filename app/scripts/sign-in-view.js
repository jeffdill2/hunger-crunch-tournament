"use strict";

var SignInView = Parse.View.extend ({


	template: _.template($('.sign-in-view').text()),

	className: "existing-user-login-container",

	events: {
		'click .existing-user-login-button'	: 'userSignIn',
		'click	.forgot-password-button'	: 'forgotPassword', 
		 
	},

	initialize: function (options) {
		$('.app-container').append(this.el);
		this.render();
		this.enableEnter();

	},

	render: function () {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	userSignIn: function () {
		var name = $('.existing-user-username-input').val();
		var pw = $('.existing-user-password-input').val();
		Parse.User.logIn(name, pw, {
			success: function(user) {
				router.navigate('/#tournament/dashboard', {trigger:true});
			},
			error: function(user, error) {
				$('.error-report').html("Username or password is incorrect").css({'margin-bottom':'-19px'});
				console.log('user is',user);
				console.log('error is',error);
			}
		});
	},

	forgotPassword: function () {
		router.navigate('/#tournament/sign-in/pass-reset', {trigger: true});
	},

	enableEnter: function () {
			// if user hits enter in name feild, it triggers the sign in
		$('.existing-user-username-input').keypress(function (key) {
			if (key.which == 13) {
				$('.existing-user-login-button').click();
			}
		});

		// if user hits enter in password feild, it triggers the sign in
		$('.existing-user-password-input').keypress(function (key) {
			if (key.which == 13) {
				$('.existing-user-login-button').click();
			}
		});
	}

});