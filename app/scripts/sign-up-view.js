"use strict";

var SignUpView = Parse.View.extend({

	template: _.template($('.sign-up-view').text()),

	errorTemplate: _.template($('.sign-up-view-errors-template').text()),

	className: "new-user-sign-up-container",

	events: {
		'click .breadcrumb-back'						: 'goBack',
		'click .sign-up-view-content button'			: 'createParseUser',
		'keyup .new-user-password-verification-input'	: 'passwordValidation',
		'keyup .new-user-password-input'				: 'passwordValidation',
		'click .recover-account'						: 'accountRecovery'
	},

	initialize: function(options) {
		$('.app-container').html(this.el);

		this.render();
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);

		$('.new-user-username-input').keypress(function(key) {
			if (key.which === 13) {
				$('.new-user-creation-button').click();
			}
		});

		// if user hits enter in password feild, it triggers the sign in
		$('.new-user-password-input').keypress(function(key) {
			if (key.which === 13) {
				$('.new-user-creation-button').click();
			}
		});

		// if user hits enter in email feild, it triggers the sign in
		$('.new-user-email-input').keypress(function(key) {
			if (key.which === 13) {
				$('.new-user-creation-button').click();
			}
		});

		// if user hits enter in email feild, it triggers the sign in
		$('.new-user-password-verification-input').keypress(function(key) {
			if (key.which === 13) {
				$('.new-user-creation-button').click();
			}
		});
	},

	createParseUser: function() {
		var name = $('.new-user-username-input').val();
		var pw = $('.new-user-password-input').val();
		var emailAddy = $('.new-user-email-input').val();
		var check = $(".new-user-password-verification-input").val();
		var that = this;
		var user = new Parse.User();

		$('.error-report').html('');
		$('.error-report-email').html('');
		$('.error-report-first-password').html('');
		$('.error-report-confirm-password').html('');
		$('.error-report-sign-up').html('');

		user.set("username", name);
		user.set("password", pw);
		user.set("email", emailAddy);
		user.set("userAccess", "GroupAdmin");

		if (name.length <= 0) {
			$('.error-report').html("Please enter a name for your organization");
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
			startLoadingAnimation();

			user.signUp(null, {
				success: function() {
					// remove login window and show new user dashboard/welcome
					$('.header-account-options').html("<p>Welcome, " + user.attributes.username + "</p>");

					router.navigate('/#tournament/sign-up/welcome', {trigger: true});
				},
				error: function(user, error) {
					var renderedTemplate = that.errorTemplate(error);

					$('.error-report-email').html('');
					$('.error-report-sign-up').html('');

					if (error.code === 203) {
						// email address already taken
						$('.error-report-sign-up').html(renderedTemplate);
						$('.new-user-email-input').val('').focus();
						$('.button').css({'opacity': '.1', 'cursor': 'not-allowed'});
					} else if (error.code === 202) {
						// username already taken
						$('.error-report-sign-up').html(renderedTemplate);
						$('.new-user-username-input').val('').focus();
						$('.button').css({'opacity': '.1', 'cursor': 'not-allowed'});
					} else if (error.code === 125) {
						$('.error-report-email').html("Please enter a valid email address for your organization");
						$('.new-user-email-input').val('').focus();
						$('.button').css({'opacity': '.1', 'cursor': 'not-allowed'});
					}

					stopLoadingAnimation();
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
		} else if (pw === "" && check === "") {
			$(".new-user-password-verification-input").css({
				'background': 'rgba(255, 255, 255, 1)'
			});
		} else {
			$(".new-user-password-verification-input").css({
				'background': 'rgba(255, 0, 0, .7)'
			});
		}
	},

	enableButtonCheck: function() {
		var name = $('.new-user-username-input').val();
		var pw = $('.new-user-password-input').val();
		var emailAddy = $('.new-user-email-input').val();
		var check = $(".new-user-password-verification-input").val();

		if ((pw === check && check.length > 0) && name.length > 0 && emailAddy.length > 0) {
			$('.button').css({'opacity': '1', 'cursor': 'pointer'});
		} else {
			$('.button').css({'opacity': '.1', 'cursor': 'not-allowed'});
		}
	},

	accountRecovery: function() {
		router.navigate('/#tournament/sign-in/pass-reset', {trigger: true});
	},

	goBack: function() {
		router.navigate('', {trigger: true});
	}
});