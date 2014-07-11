"use strict";

var PassResetView = Parse.View.extend ({

	events: {
		'click .reset-password-button'	: 	'resetPassword',
	},

	template: _.template($('.reset-password-view').text()),

	initialize: function() {
		$('.app-container').append(this.el);
		this.render();
		this.enableEnter();
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	resetPassword: function () {
		var userEmail = $('.lookup-email-input').val();
		Parse.User.requestPasswordReset(userEmail , {
  			success: function() {
   			 // Password reset request was sent successfully
   			 router.currentView.render();
   			 alert("An email has been sent to your account to reset your password")
   			 router.navigate('/#tournament/sign-in', {trigger: true});
  			},
  			error: function(error) {
  			  // Show the error message somewhere
  			  alert("Error: " + error.code + " " + error.message);
  			}
			});
	},

	enableEnter: function () {
			// if user hits enter in email feild, it triggers the sign in
		$('.lookup-email-input').keypress(function (key) {
			if (key.which == 13) {
				$('.reset-password-button').click();
			}
		});

	}

});