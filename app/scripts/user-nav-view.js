"use strict";

var UserNavView = Parse.View.extend({

	events: {
		'click .dashboard-button'	: "dashboardNav", 
		'click .settings-button'	: "settingsNav", 
		'click .sign-out-button'	: "signOutNav", 
	},

	template: _.template($('.user-nav-view').text()),

	initialize: function() {
		$('.nav-container').append(this.el);
		this.render();

	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	dashboardNav: function () {
		window.location = '/#dashboard';
	},

	settingsNav: function () {
		window.location = '/#dashboard/settings';
	},

	signOutNav: function () {
		Parse.User.logOut();
		window.location = '';
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