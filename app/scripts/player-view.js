"use strict";

var PlayerView = Parse.View.extend({

	events: {
		'click .group-id-crumb'	: 'groupNav',
		'click .print-button'	: 'print'
	},

	template: _.template($('.player-view').text()),

	className: 'player-view',

	initialize: function(options) {
		console.log(options)
		$('.app-container').append(this.el);
		this.render();
		this.playerInfo = options;
		var player = options.playerID;
		var group = options.groupID;

		this.showPlayerScores();

		$('.sort').click(function () {
			$(this).toggleClass('sorted');
		});	
	},

	render: function() {
		var renderedTemplate = this.template(this.options);
		// console.log(this.options)
		this.$el.html(renderedTemplate);
		this.tableSort();
	},

	// getGroupName: function() {
	// 	var TntGroup = Parse.Object.extend("TntGroup");
	// 	var query = new Parse.Query(TntGroup);
	// 	// console.log(this.options)
	// 	// query.equalTo("groupID", this.options.groupID);
	// 	var that = this;

	// 	query.find({
	// 		success: function(group) {
	// 			console.log(group)
	// 			that.groupName = group[0].attributes.groupName;
	// 			$('.group-id-crumb').html(that.groupName.substring(0, 15) + (that.groupName.length > 15 ? "..." : ""));
	// 		},

	// 		error: function(error) {
	// 			console.log(error);
	// 		}
	// 	})
	// },

	showPlayerScores: function () {
		var renderedTemplate = _.template($('.player-view-player-stats-view').text());
		var query = new Parse.Query("TntScore");

		var that = this;
		query.find({
			success: function(events) {
				events.forEach(function(event) {
					// console.log(event.attributes)
					$('.player-stats-list').append(renderedTemplate(event.attributes))
				})
				that.getPlayerSummary(events);
			},
			error: function(error) {
				console.log(error)
			}
		})
	},

	getPlayerSummary: function (events) {
		this.playerSummary = {

			minions 	: 0,
			coins 		: 0,
			meals 		: 0,
			collectibles: 0

		};

		var that = this;
		events.forEach(function (event) {
			that.playerSummary.minions += event.attributes.minionsStomped;
			that.playerSummary.coins += event.attributes.coinsCollected;
		});

		this.showPlayerSummary(this.playerSummary);

	},

	showPlayerSummary: function (sum) {
		var renderedTemplate = _.template($('.player-view-player-summary-view').text());
		$('.player-view-summary').append(renderedTemplate(sum));
	},

	groupNav: function () {
		router.navigate('/#tournament/group/' + this.options.groupID, {trigger: true});
	},

	// sort function using list.js
	tableSort: function () {
		var options = {
			valueNames: ['level-play-data', 'level-minions-data', 'level-coins-data']
		};
		var userTable = new List('player-summary-table', options);
	},

	print: function () {
		$("header").addClass('non-print');
		$(".player-view-location-banner").removeClass('h1-flag');
		$(".player-view-nav").css('opacity', 0);

		window.print();

		$(".player-view-location-banner").addClass('h1-flag');
		$(".player-view-nav").css('opacity', 1);
		$("header").removeClass('non-print');

	}
});