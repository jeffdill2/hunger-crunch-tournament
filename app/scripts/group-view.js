var GroupView = Parse.View.extend({

	template: _.template($('.group-view-template').text()),

	events: {
		'click .player-name' : 'showPlayer',
	},

	initialize: function (options) {
		this.group = options;
		$('.app-container').append(this.el);
		this.render();
	},

	render: function () {
		var renderedTemplate = this.template(this.group);
		this.$el.html(renderedTemplate);
		// using list.js to sort the table of data
		this.tableSort();
	},

	showPlayer: function () {
		var playerID = this.$(".player-name").html();
		router.navigate('group/'+this.group.groupID+"/"+playerID, {trigger: true});
	}, 
	// sort function
	tableSort: function () {
		var options = {
			valueNames: ['minions-data', 'coins-data', 'collectibles-data']
		};
		var userTable = new List('single-group-table', options)
	}
});

