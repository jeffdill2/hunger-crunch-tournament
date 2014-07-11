var GroupView = Parse.View.extend({

	template: _.template($('.group-view-template').text()),

	events: {
		'click .player-name' 		: 'showPlayer',
		'click .change-group-dates'	: 'changeDatesButton',
		'focus .date-changer'		: 'changeDates',
		'click .save-dates'			: 'saveDates'
	},

	initialize: function (options) {
		this.group = options;
		$('.app-container').append(this.el);

		console.log(this.group);

		var Group = Parse.Object.extend("Groups");
		var query = new Parse.Query(Group);
		query.equalTo("groupID", this.group.groupID);

		var that = this;
		query.first({
			success: function (results) {
				that.groupUpdate = results;
				that.groupInfo = results.attributes;
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
		var renderedTemplate = this.template(this.groupInfo);
		this.$el.html(renderedTemplate);
		// using list.js to sort the table of data
		this.tableSort();
	},

	showPlayer: function (location) {
		var playerID = location.currentTarget.innerHTML;
		router.navigate('/#tournament/group/'+this.group.groupID+"/"+playerID, {trigger: true});
	}, 
	// sort function
	tableSort: function () {
		var options = {
			valueNames: ['minions-data', 'coins-data', 'collectibles-data']
		};
		var userTable = new List('single-group-table', options)
	},

	changeDatesButton: function () {
		$('.date-changer').attr('readonly',false);
		setTimeout(function () {
			$('.date-changer').focus();
		}, 10);
		$('.change-group-dates').hide();
		$('.save-dates').show().css('display','inline-block');

	},

	changeDates: function () {
		var that = this;
		var endInput = $('.date-changer').pickadate({
			format: 'mm/dd/yy',
			min: true,
			onClose: function () {
				this.stop();
				$('.date-changer').blur().attr('readonly', true);
			},

			onStop: function () {
				$('.date-changer').attr('readonly', true);
			}
		});
		var endPicker = endInput.pickadate('picker');
	},

	saveDates: function () {

		this.groupUpdate.set({
			endDate: {
				__type: "Date",
				iso: moment($('.date-changer').val(), "MM/DD/YY").toISOString()
			}
		})
		this.groupUpdate.save({
			success: function (group) {
				$('.save-dates').hide();
				$('.change-group-dates').show().css('display','inline-block');
				alert("Group end date successfully updated!");
			},
			error: function (error) {
				console.log(error)
				$('.save-dates').hide();
				$('.change-group-dates').show().css('display','inline-block');
				alert("An error has occurred. Group end date has not been updated.");
			}
		});
	}
});

