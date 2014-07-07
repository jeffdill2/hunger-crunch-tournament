"use strict";

var SettingsView = Parse.View.extend({

	events: {
		'click .edit-email' : 'changeEmail',
		'click .save-email'	: 'saveEmail',
		'click .reset-password'	: 'resetPassword',
	},

	template: _.template($('.settings-view').text()),

	initialize: function(options) {
		$('.app-container').append(this.el);
		this.render();
	},

	render: function() {
		var renderedTemplate = this.template;
		var rendered = renderedTemplate(Parse.User.current().attributes);
		this.$el.html(rendered);
	},

	changeEmail: function() {
		$('.user-email').html('<input class="new-user-email" placeholder=' + Parse.User.current().attributes.email + '></input>');
		$('.update-email').html('<button class="save-email">Save Email</button>');
		
	},

	saveEmail: function() {
		var newEmail = $('.new-user-email').val();
		var user = Parse.User.current();

  		user.set('email', newEmail);
  		user.save(null, {
  			success: function () {
  				router.currentView.render();
  			},
  			error: function () {
  				console.log('there was a problem');
  			}
  		});
  			
	},

	resetPassword: function() {
		var userEmail = Parse.User.current().attributes.email;
		Parse.User.requestPasswordReset(userEmail , {
  			success: function() {
   			 // Password reset request was sent successfully
   			 alert("An email has been sent to your account to reset your password")
  			},
  			error: function(error) {
  			  // Show the error message somewhere
  			  alert("Error: " + error.code + " " + error.message);
  			}
			});
	}
});