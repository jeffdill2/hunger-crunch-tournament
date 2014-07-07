"use strict";

var SettingsView = Parse.View.extend({

	events: {
		'click .edit-email' : 'changeEmail',
		'click .save-email'	: 'saveEmail'
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
  			
	}
});