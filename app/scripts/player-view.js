"use strict";

var PlayerView = Parse.View.extend({

	template: _.template($('.player-view').text()),

	events: {
		'click .print-button'	: 'print'
	},

	className: 'player-view',

	initialize: function(options) {
		$('.app-container').append(this.el);
		this.render();
		this.playerInfo = options;
		var player = options.playerID;
		var group = options.groupID;

		$('.sort').click(function () {
			$(this).toggleClass('sorted')
		})
	},

	render: function() {
		var renderedTemplate = this.template(this.options);
		this.$el.html(renderedTemplate);
		this.tableSort();
	},

	// sort function using list.js
	tableSort: function () {
		var options = {
			valueNames: ['level-play-data', 'level-minions-data', 'level-coins-data']
		};
		var userTable = new List('player-summary-table', options)
	},

	print: function () {
		$("header").addClass('non-print')
		$(".player-view-location-banner").removeClass('h1-flag')
		$(".player-view-nav").css('opacity', 0)
		
		window.print();

		$(".player-view-location-banner").addClass('h1-flag')
		$(".player-view-nav").css('opacity', 1)
		$("header").removeClass('non-print')

	}
});