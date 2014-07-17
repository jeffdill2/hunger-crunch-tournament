"use strict";

var PlayerView = Parse.View.extend({

	events: {
		'click .breadcrumb-back'		: 'goBack',
		'click .print-button'			: 'print',
		'click .remove-player-button'	: 'removePlayer',
	},

	template: _.template($('.player-view').text()),

	className: 'player-view',

	initialize: function(options) {
		$('.app-container').html(this.el);
		this.playerInfo = options;

		this.getPlayerScores();

		$('.sort').click(function() {
			$(this).toggleClass('sorted');
		});
	},

	render: function() {
		var renderedTemplate = this.template(this.options);
		this.$el.html(renderedTemplate);
	},

	getPlayerScores: function() {
		var scores = [];
		var that = this;

		this.query = new Parse.Query(strScores);
		this.query.include('user');
		this.query.include('tntGrp');
		this.query.equalTo('OIID', this.playerInfo.playerID);

		this.query.find({
			success: function(events) {
				that.options.groupName = events[0].get('tntGrp').get('name');
				that.options.userID = events[0].get('tntGrp').get('user').id;
				that.render();

				events.forEach(function(event) { ///////
					if (scores.length <= 0) {
						scores.push(event);
					} else if (scores.length > 0) {
						scores.forEach(function(score) {
							if (score.attributes.levelID.slice(-2) === event.attributes.levelID.slice(-2)) {
								score.attributes.minionsStomped += event.attributes.minionsStomped;
								score.attributes.coinsCollected += event.attributes.coinsCollected;
							} else {
								var result = $.grep(scores, function(scr) {
									return scr.attributes.levelID.slice(-2) === event.attributes.levelID.slice(-2);
								});

								if (result.length === 0) {
									scores.push(event);
								}
							}
						});
					}
				});

				that.showPlayerScores(scores);
				that.getPlayerSummary(scores);
			},
			error: function(error) {
				console.log(error);
			}
		});
	},

	showPlayerScores: function(scores) {
		var renderedTemplate = _.template($('.player-view-player-stats-view').text());

		scores.forEach(function(score) {
			$('.player-stats-list').append(renderedTemplate(score.attributes));
		});

		this.tableSort();
	},

	getPlayerSummary: function(events) {
		this.playerSummary = {
			minions 	: 0,
			coins 		: 0,
			meals 		: 0,
			collectibles: 0
		};

		var that = this;
		var collectQuery = new Parse.Query(strCollectibles);
		collectQuery.include('user');
		collectQuery.include('tntGrp');

		collectQuery.equalTo('user', events[0].attributes.user);
		collectQuery.equalTo('tntGrp', events[0].attributes.tntGrp);

		collectQuery.first({
			success: function(result) {
				if (!result) {
					that.playerSummary.collectibles = 0;
				} else {
					that.playerSummary.collectibles += result.attributes.collectibles.length;
				}

				events.forEach(function(event) {
					that.playerSummary.minions += event.attributes.minionsStomped;
					that.playerSummary.coins += event.attributes.coinsCollected;
				});

				that.showPlayerSummary(that.playerSummary);
			},
			error: function(error) {
				console.log(error);
			}
		});
	},

	showPlayerSummary: function(sum) {
		var renderedTemplate = _.template($('.player-view-player-summary-view').text());
		$('.player-view-summary').append(renderedTemplate(sum));
	},

	goBack: function() {
		router.navigate('/#tournament/group/' + this.options.groupID, {trigger: true});
	},

	// sort function using list.js
	tableSort: function() {
		var options = {
			valueNames: ['level-play-data', 'level-minions-data', 'level-coins-data']
		};

		var userTable = new List('player-summary-table', options);
	},

	print: function() {
		$("header").addClass('non-print');
		$(".player-view-location-banner").removeClass('h1-flag');
		$(".player-view-nav").css('opacity', 0);
		$("button").css('opacity', 0);
		$("img").hide();

		window.print();

		$("img").show();
		$(".player-view-location-banner").addClass('h1-flag');
		$(".player-view-nav").css('opacity', 1);
		$("button").css('opacity', 1);
		$("header").removeClass('non-print');
	},

	removePlayer: function() {
		if (confirm('Are you sure you want to delete ' + this.playerInfo.playerID +' from the group? This action can not be undone.')) {
    		this.query.find({
    			success: function(results) {
    				results.forEach(function(result) {
    					result.set('tntGrp', null);
    					result.save();

    					history.back();
    				});
    			},
    			error: function(error) {
    				console.log(error);
    			}
    		});
		}
	}
});