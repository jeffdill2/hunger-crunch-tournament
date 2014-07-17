"use strict";

var SignInView = Parse.View.extend ({

	template: _.template($('.sign-in-view').text()),

	className: "existing-user-login-container",

	events: {
		'click .breadcrumb-back'			: 'goBack',
		'click .existing-user-login-button'	: 'userSignIn',
		'click .forgot-password-button'		: 'forgotPassword'
	},

	initialize: function(options) {
		if (Parse.User.current()) {
			this.reRoute();
		}
		else {
			$('.app-container').html(this.el);
			this.render();
			stopLoadingAnimation();
		}
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);

		$('.existing-user-username-input').keypress(function(key) {
			if (key.which === 13) {
				$('.existing-user-login-button').click();
			}
		});

		// if user hits enter in password feild, it triggers the sign in
		$('.existing-user-password-input').keypress(function(key) {
			if (key.which === 13) {
				$('.existing-user-login-button').click();
			}
		});
	},

	userSignIn: function() {
		$('.error-report').html('');
		var name = $('.existing-user-username-input').val();
		var pw = $('.existing-user-password-input').val();

		if (name.length > 0 && pw.length > 0 && Parse.User.current() === null) {
			Parse.User.logIn(name, pw, {
				success: function(user) {
					router.navigate('/#tournament/dashboard', {trigger:true});
				},
				error: function(user, error) {
					$('.error-report').html("Username or password is incorrect");
				}
			});
		} else {
			$('.error-report').html("Please enter a username and password");
		}
	},

	forgotPassword: function() {
		router.navigate('/#tournament/sign-in/pass-reset', {trigger: true});
	},

	goBack: function() {
		router.navigate('', {trigger: true});
	},

	reRoute:function () {
		this.remove();
		setTimeout(function () {
			router.navigate('/#tournament/dashboard', {trigger: true});
		}, 50)
	}
});