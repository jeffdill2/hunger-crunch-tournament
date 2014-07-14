"use strict";

var UserNavView = Parse.View.extend({

	events: {
		'click .dashboard-button'		: "dashboardNav",
		'click .settings-button'		: "settingsNav",
		'click .sign-out-button'		: "signOutNav",
		// 'hover .header-username'	: "showName"
	},
	tagName: "ul",

	template: _.template($('.user-nav-view').text()),
	welcomeTemplate: _.template($('.user-nav-welcome-template').text()),


	initialize: function() {
		$('.nav-container').append(this.el);
		this.user = Parse.User.current();
		this.render();
	},

	render: function() {
		var renderedTemplate = this.template();
		var that=this;
		this.$el.html(renderedTemplate);
		// regex to capitalize the first letter of the org/username including multiple words
		function toTitleCase(str)
		{
		    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}
		// if the words contains a period, it will uppercase the entire word
		function check (x) {
			if (x.indexOf(".") != -1) {
					return x.toUpperCase()
				}
			else {
				return toTitleCase(x);
			}
		}
		var name = this.user.attributes.username
		// truncate long org names
		name = check(name).substr(0, 15) + (name.length > 15 ? "..." : "");

		var navRenderedTemplate = this.welcomeTemplate({shortName:name});
		$('.header-account-options').html(navRenderedTemplate);
	},

	dashboardNav: function () {
		router.navigate('/#tournament/dashboard', {trigger: true});
	},

	settingsNav: function () {
		router.navigate('/#tournament/dashboard/settings', {trigger: true});
	},

	signOutNav: function () {
		Parse.User.logOut();
		router.navigate('/#tournament', {trigger: true});
	}
});

var NoUserNavView = Parse.View.extend({

	events: {
		'click .sign-in-button'		: "signInNav",
		'click .sign-up-button'		: "signUpNav",
	},

	tagName:'ul',

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
		router.navigate('/#tournament/sign-in', {trigger: true});
		Parse.history.loadUrl();
	},

	signUpNav: function () {
		Parse.User.logOut();
		router.navigate('/#tournament/sign-up', {trigger: true});
	},

});