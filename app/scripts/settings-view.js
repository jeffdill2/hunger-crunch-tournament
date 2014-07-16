// "use strict";

var SettingsView = Parse.View.extend({

	events: {
		'click .edit-email' 			: 'changeEmail',
		'click .save-email'				: 'saveEmail',
		'click .reset-password'			: 'resetPassword',
		'click .return-to-dashboard'	: 'returnToDashboard'
	},

	template: _.template($('.settings-view').text()),

	initialize: function(options) {
		if (Parse.User.current()) {
			$('.app-container').append(this.el);

			this.render();
			this.enableEnter();
		} else {
			this.signIn();
		}
	},

	render: function() {
		var renderedTemplate = this.template;
		var rendered = renderedTemplate(Parse.User.current().attributes);

		this.$el.html(rendered);
	},

	changeEmail: function() {
		var email = $('.user-email').attr('placeholder');
		$('.settings-content span').html('');
		$('.user-email').attr({'readonly': false,'placeholder': ''}).focus().attr('value',email).css('color', '#6D6E71')
		$('.save-email').show().css('display','block');
		$('.edit-email').hide();
	},

	saveEmail: function() {
		var newEmail = $('.user-email').val();
		var user = Parse.User.current();

		$('.settings-content span').html('');

  		user.set('email', newEmail);
  		user.save(null, {
  			success: function () {
  				$('.user-email').attr({'readonly': true, 'placeholder':newEmail}).css('color', '#939598');
  				$('.edit-email').show().css('display','block');
  				$('.save-email').hide();
  				$('.settings-content span').text("Successfully updated!").css('color','#2FD03A');
  			},
  			error: function() {
  				console.log('there was a problem');
  				$('.settings-content span').text("Connection Error. Please try again.").css('color','#EF5455');
  			}
  		});
	},

	resetPassword: function() {
		var userEmail = Parse.User.current().attributes.email;
		var that = this;
		Parse.User.requestPasswordReset(userEmail, {
  			success: function() {
   			 // Password reset request was sent successfully
				$('.settings-content span').html('')
				$('.password-reset-confirmation').html("A link has been sent to your provided email address. Please click the link and follow the instructions to reset your account password").css('color','#2FD03A');
				$('.reset-password').hide();
				$('.return-to-dashboard').css('display', 'block');
  			},
  			error: function(error) {
  			  // Show the error message underneath the reset button
				$('.password-reset-confirmation').html("There has been an error and your password has not been reset. Please refresh the page and try again.").css('color','#EF5455');
  			}
		});
	},

	enableEnter: function() {
		// if user hits enter in email feild, it triggers the sign in
		$('.user-email').keypress(function(key) {
			if (key.which === 13) {
				$('.save-email').click();
			}
		});
	},

	signIn: function() {
		this.remove();
		router.navigate('/#tournament/sign-in');
	},

	returnToDashboard: function () {
		router.navigate('/#tournament/dashboard', {trigger: true});
	}
});