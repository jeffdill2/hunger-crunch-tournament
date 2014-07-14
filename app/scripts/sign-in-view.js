"use strict";

var SignInView = Parse.View.extend ({


	template: _.template($('.sign-in-view').text()),

	className: "existing-user-login-container",

	events: {
		'click .sign-in-view-header span'				: 'goBack',
		'click .existing-user-login-button'				: 'userSignIn',
		'click .forgot-password-button'					: 'forgotPassword',
		'keypress .existing-user-username-input-input'	: 'enableEnter',
		'keypress .existing-user-password-input'		: 'enableEnter'
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
		$('.error-report').html('');
		var name = $('.existing-user-username-input').val();
		var pw = $('.existing-user-password-input').val();

		if (name.length > 0 && pw.length > 0) {
			Parse.User.logIn(name, pw, {
				success: function(user) {
					router.navigate('/#tournament/dashboard', {trigger:true});
				},
				error: function(user, error) {
					$('.error-report').html("Username or password is incorrect").css('margin-left','-124px');
				}
			});
		}
		else {
			$('.error-report').html("Please enter a username and password").css('margin-left','-138px');
		}
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
	},

	goBack: function () {
		router.navigate('', {trigger: true});
	}

});