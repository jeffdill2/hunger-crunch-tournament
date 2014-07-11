"use strict";

var PlayerView = Parse.View.extend({

	events: {
		'click .group-id-crumb'	: 'groupNav',
		'click .print-button'	: 'print'
	},

	template: _.template($('.player-view').text()),

	className: 'player-view',

	initialize: function(options) {
		$('.app-container').append(this.el);
		this.render();
		this.playerInfo = options;
		var player = options.playerID;
		var group = options.groupID;

		$('.sort').click(function () {
			$(this).toggleClass('sorted');
		});
	},

	render: function() {
		var renderedTemplate = this.template(this.options);
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
				$('.group-id-crumb').html(that.groupName.substring(0, 15) + "...");
			},

			error: function(error) {
				console.log(error);
			}
		})
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