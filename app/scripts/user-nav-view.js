"use strict";

var UserNavView = Parse.View.extend({

	events: {
		'click .dashboard-button'	: "dashboardNav", 
		'click .settings-button'	: "settingsNav", 
		'click .sign-out-button'	: "signOutNav", 
	},

	template: _.template($('.user-nav-view').text()),
	welcomeTemplate: _.template($('.user-nav-welcome-template').text()),


	initialize: function() {
		$('.nav-container').append(this.el);
		this.user = Parse.User.current();

		this.render();
	},

	render: function() {
		var renderedTemplate = this.template();
		this.$el.html(renderedTemplate);
		var navRenderedTemplate = this.welcomeTemplate(this.user.attributes);
		$('.header-account-options').html(navRenderedTemplate);
	},

	dashboardNav: function () {
		router.navigate('/#dashboard', {trigger: true});
	},

	settingsNav: function () {
		router.navigate('/#dashboard/settings', {trigger: true});
	},

	signOutNav: function () {
		Parse.User.logOut();
		router.navigate('', {trigger: true});
	},
});

var NoUserNavView = Parse.View.extend({

	events: {
		'click .sign-in-button'		: "signInNav", 
		'click .sign-up-button'		: "signUpNav", 
	},

	template: _.template($('.no-user-nav-view').text()),

	initialize: function () {
		$('.nav-container').append(this.el);
		this.render();
		
	},

	render: function () {
		$('.header-account-options').html('');
		
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	signInNav: function () {
		Parse.User.logOut();
		window.location = '/#sign-in';
	},

	signUpNav: function () {
		Parse.User.logOut();
		window.location = '/#sign-up';
	},

});