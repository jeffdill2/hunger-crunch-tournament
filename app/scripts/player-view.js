"use strict";

var PlayerView = Parse.View.extend({

	events: {
		'click .group-id-crumb'	: 	'groupNav',
	},

	template: _.template($('.player-view').text()),

	initialize: function(options) {
		$('.app-container').append(this.el);
		this.render();
		this.playerInfo = options;
		var player = options.playerID;
		var group = options.groupID;

		this.getPlayerEvents();
	},

	render: function() {
		var renderedTemplate = this.template(this.options);
		// console.log(this.options)
		this.$el.html(renderedTemplate);
		this.tableSort();
		this.getGroupName();
	},

	getGroupName: function() {
		var Groups = Parse.Object.extend("Groups");
		var query = new Parse.Query(Groups);
		query.equalTo("groupID", this.options.groupID);
		var that = this;

		query.find({
			success: function(group) {
				that.groupName = group[0].attributes.groupName;
				$('.group-id-crumb').html(that.groupName)
			},

			error: function(error) {
				console.log(error);
			}
		})
	},

	getPlayerEvents: function () {
		var query = new Parse.Query("playerEvent");
		query.equalTo("userName", this.options.playerID);
		query.equalTo("eventType", "levelEnd");

		var that = this;
		query.find({
			success: function(events) {
				that.makePlayerStats(events);
				// console.log(events);
			},
			error: function(error) {
				console.log(error)
			}
		})
	},

	makePlayerStats: function (events) {
		var playerStats = [];
		var that = this;
		events.forEach(function(event) {
			that.showPlayerStats(event);
		})

		this.getPlayerSummary(events);
	},

	showPlayerStats: function (levelStat) {
		var renderedTemplate = _.template($('.player-view-player-stats-view').text());
		$('.player-stats-list').append(renderedTemplate(levelStat.attributes.level));
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
			that.playerSummary.minions += event.attributes.level.levelMinions;
			that.playerSummary.coins += event.attributes.level.levelCoins;
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
		var userTable = new List('player-summary-table', options)
	}
});