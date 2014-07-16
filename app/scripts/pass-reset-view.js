"use strict";

var PassResetView = Parse.View.extend ({

	events: {
		'click .password-reset-view-header span'	: 'goBack',
		'click .password-reset-button'				: 'resetPassword',
	},

	template: _.template($('.reset-password-view-template').text()),

	className: 'password-reset-view-container',

	initialize: function() {
		$('.app-container').html(this.el);

		this.render();
		this.enableEnter();
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	resetPassword: function() {
		$('.error-report').html('');

		var userEmail = $('.lookup-email-input').val();

		if (userEmail.length > 0) {
			Parse.User.requestPasswordReset(userEmail, {
	  			success: function() {
	   			 	$('.error-report').html("An email has been sent to your account to reset your password").css({'margin-left':'-224px', 'margin-top': '45px', 'color': '#2FD03A'});
	  			},
	  			error: function(error) {
	  			  alert("Error: " + error.code + " " + error.message);
	  			}
			});
		} else {
			$('.error-report').html("Please enter a valid email address").css({'margin-left':'-122px', 'margin-top': '45px'});
		}
	},

	enableEnter: function() {
		// if user hits enter in email feild, it triggers the sign in
		$('.lookup-email-input').keypress(function(key) {
			if (key.which === 13) {
				$('.reset-password-button').click();
			}
		});
	},

	goBack: function() {
		router.navigate('tournament/sign-in', {trigger: true});
	}
});