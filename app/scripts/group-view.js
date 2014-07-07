var GroupView = Parse.View.extend({

	template: _.template($('.group-view-template').text()),

	events: {
		'click .player-name' : 'showPlayer',
	},

	initialize: function (options) {
		this.group = options;
		$('.app-container').append(this.el);

		var Group = Parse.Object.extend("Groups");
		var query = new Parse.Query(Group);
		var spacedGroupName = this.group.groupID.replace(/%20/g, ' ');
		query.equalTo("groupName", spacedGroupName);

		var that = this;
		query.find({
			success: function (results) {
				that.groupInfo = results[0].attributes;
				that.groupInfo.startDate = moment(that.groupInfo.startDate).format("MM/DD/YY");
				that.groupInfo.endDate = moment(that.groupInfo.endDate).format("MM/DD/YY");
				that.render();
			},	
			error: function (error) {
				console.log(error)
			}
		});
	},

	render: function () {
				console.log(this.groupInfo)
		var renderedTemplate = this.template(this.groupInfo);
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

