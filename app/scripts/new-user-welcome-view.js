'use strict';

var UserWelcome = Parse.View.extend({

	events: {
		'click .welcome-previous'				: 'previousTab',
		'click .welcome-next' 					: 'nextTab',
		'click .continue-to-dashboard-button'	: "goToDash"
	},

	template: _.template($('.new-user-welecome-template').text()),

	initialize: function() {
		$('.app-container').html(this.el);
		this.counter = 0;

		this.render();
	},

	render: function() {
		var renderedTemplate = this.template();
		this.$el.html(renderedTemplate);

		this.nextTab();

		stopLoadingAnimation();
	},

	previousTab: function() {
		var that = this;
		this.counter -= 1;

		var instructionsTemplate = _.template($('.new-user-welecome-instruction-' + that.counter + '-template').text());

		$('.welcome-container').html(instructionsTemplate);
		$(window).scrollTop($('.welcome-container').height());

		this.navButtons();
	},

	nextTab: function() {
		var that = this;
		this.counter += 1;

		var instructionsTemplate = _.template($('.new-user-welecome-instruction-' + that.counter + '-template').text());

		$('.welcome-container').html(instructionsTemplate);
		$(window).scrollTop($('.welcome-container').height());

		this.navButtons();
	},

	navButtons: function() {
		if (this.counter <= 1) {
			$('.welcome-previous').hide();
		}

		if (this.counter > 1) {
			$('.welcome-previous').show();
		}

		if (this.counter < 7) {
			$('.welcome-next').show();
		}

		if (this.counter >= 7) {
			$('.welcome-next').hide();
		}
	},
	goToDash: function() {
		startLoadingAnimation();

		router.navigate('/#tournament/dashboard', {trigger: true});
	}
});