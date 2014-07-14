"use strict";

var SignUpView = Parse.View.extend({

	template: _.template($('.sign-up-view').text()),
	errorTemplate: _.template($('.sign-up-view-errors-template').text()),

	className: "new-user-login-container",

	events: {
		'click .sign-up-view-header span'				: 'goBack',
		'click .sign-up-view-content button'			: 'createParseUser',
		'keyup .new-user-password-verification-input'	: 'passwordValidation',
		'keyup .new-user-password-input'				: 'passwordValidation',
		'keyup input'									: 'enableButtonCheck',
		'click .recover-account'						: 'accountRecovery'
	},

	initialize: function(options) {
		$('.app-container').append(this.el);
		this.render();
		this.enableEnter();
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	createParseUser: function() {
		var name = $('.new-user-username-input').val();
		var pw = $('.new-user-password-input').val();
		var emailAddy = $('.new-user-email-input').val();
		var check = $(".new-user-password-verification-input").val();
		var that = this;
		$('.error-report').html('');
		$('.error-report-email').html('');
		$('.error-report-first-password').html('');
		$('.error-report-confirm-password').html('');
		$('.error-report-sign-up').html('');

		var user = new Parse.User();
		user.set("username", name);
		user.set("password", pw);
		user.set("email", emailAddy);
		user.set("userAccess", "GroupAdmin");

		if (name.length <= 0) {
			$('.error-report').html("Please enter a name for your organization").css('margin-left','-151px');
		}

		if (emailAddy.length <= 0) {
			$('.error-report-email').html("Please enter a valid email address for your organization");
		}

		if (pw === '' && check === '') {
			$('.error-report-first-password').html("Please provide a password");
		}

		if (pw !== check) {
			$('.error-report-confirm-password').html("Please make sure your password matches");
		}

		if (name.length > 0 && emailAddy.length > 0 && (pw === check && check.length > 0 )) {
			user.signUp(null, {
				success: function() {
					// remove login window and show new user dashboard/welcome
					console.log('Welcome,', user.attributes.username);
					$('.header-account-options').html("<p>Welcome, " + user.attributes.username + "</p>");
					router.navigate('/#tournament/dashboard', {trigger: true});
				},
				error: function(user, error) {
					var renderedTemplate = that.errorTemplate(error);
					if (error.code === 203) {
						$('.error-report-sign-up').html(renderedTemplate).css('margin-left', '-240px');
					}
					else if (error.code === 202) {
						$('.error-report-sign-up').html(renderedTemplate).css('margin-left', '-240px');
					}
					console.log(error)
				}
			});
		}
	},

	passwordValidation: function() {
		var pw = $('.new-user-password-input').val();
		var check = $(".new-user-password-verification-input").val();
		if (pw === check && check.length > 0) {
			$(".new-user-password-verification-input").css({
				'background': 'rgba(255, 255, 255, 1)'
			});

		} else if (pw !== check && check.length === 0) {
			$(".new-user-password-verification-input").css({
				'background': 'rgba(255, 255, 255, 1)'
			});
		}
		else if (pw === "" && check === "") {
			$(".new-user-password-verification-input").css({
				'background': 'rgba(255, 255, 255, 1)'
			});
		} else {
			$(".new-user-password-verification-input").css({
				'background': 'rgba(255, 0, 0, .7)'
			});
		}
	},

	enableEnter: function () {
		// if user hits enter in username feild, it triggers the sign in
		$('.new-user-username-input').keypress(function (key) {
			if (key.which == 13) {
				$('.new-user-creation-button').click();
			}
		});
		
			// if user hits enter in password feild, it triggers the sign in
		$('.new-user-password-input').keypress(function (key) {
			if (key.which == 13) {
				$('.new-user-creation-button').click();
			}
		});

			// if user hits enter in email feild, it triggers the sign in
		$('.new-user-email-input').keypress(function (key) {
			if (key.which == 13) {
				$('.new-user-creation-button').click();
			}
		});
			// if user hits enter in email feild, it triggers the sign in
		$('.new-user-password-verification-input').keypress(function (key) {
			if (key.which == 13) {
				$('.new-user-creation-button').click();
			}
		});
	},

	enableButtonCheck: function () {
		var name = $('.new-user-username-input').val();
		var pw = $('.new-user-password-input').val();
		var emailAddy = $('.new-user-email-input').val();
		var check = $(".new-user-password-verification-input").val();

		if ((pw === check && check.length > 0) && name.length > 0 && emailAddy.length > 0) {
			$('.sign-up-view-content button').addClass('button');
			$('.sign-up-view-content button').removeClass('new-user-creation-button');
		}
		else {
			$('.sign-up-view-content button').addClass('new-user-creation-button');
			$('.sign-up-view-content button').removeClass('button');
		}
	},

	accountRecovery: function () {
		router.navigate('/#tournament/sign-in/pass-reset', {trigger: true});
	},

	goBack: function () {
		router.navigate('', {trigger: true});
	}

});