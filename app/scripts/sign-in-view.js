"use strict";

var SignInView = Parse.View.extend ({


	template: _.template($('.sign-in-view').text()),

	className: "existing-user-login-container",

	events: {
		'click .existing-user-login-button'	: 'userSignIn',
		'click	.forgot-password-button'	: 'forgotPassword', 
		'click	.reset-password-button'	: 'resetPassword', 
	},

	initialize: function (options) {
		$('.app-container').append(this.el);
		this.render();
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
				router.navigate('dashboard', {trigger:true});
			},
			error: function(user, error) {
				$('.error-report').html("Username or password is incorrect").css({'margin-bottom':'-19px'});
				console.log('user is',user);
				console.log('error is',error);
			}
		});
	},

	forgotPassword: function () {
		var resetTemplate = _.template($('.reset-password-view').text());
		this.$el.html(resetTemplate);
	},

	resetPassword: function () {
		var userEmail = $('.lookup-email-input').val();
		Parse.User.requestPasswordReset(userEmail , {
  			success: function() {
   			 // Password reset request was sent successfully
   			 router.currentView.render();
   			 alert("An email has been sent to your account to reset your password")
   			 Parse.history.loadUrl();
  			},
  			error: function(error) {
  			  // Show the error message somewhere
  			  alert("Error: " + error.code + " " + error.message);
  			}
			});
	},

});