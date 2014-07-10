"use strict";

var PlayerView = Parse.View.extend({

	template: _.template($('.player-view').text()),

	initialize: function(options) {
		$('.app-container').append(this.el);
		this.render();
		this.playerInfo = options;
		var player = options.playerID;
		var group = options.groupID;
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
	}
});