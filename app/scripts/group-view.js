var GroupView = Parse.View.extend({

	template: _.template($('.group-view-template').text()),

	events: {
		'click .change-group-dates'	: 'changeDatesButton',
		'focus .date-changer'		: 'changeDates',
		'click .save-dates'			: 'saveDates',
		'click .player-name' 		: 'playerNav',
		'click .print-button'		: 'print'
	},

	className: 'group-view-container',

	initialize: function (options) {
		// console.log(options)
		this.group = options;
		$('.app-container').append(this.el);

		this.getGroup();	
	},

	render: function () {
		// called in the success inside getGroup
		// console.log(this.groupInfo)

		var renderedTemplate = this.template(this.groupInfo);
		this.$el.html(renderedTemplate);
		
		this.getGroupTotals();

	},

	getGroup: function () {
		// does not work if multiple groups with same group name
		var query = new Parse.Query("TntGroup");
		query.include("user");
		query.equalTo("groupCode", this.group.groupID);
		// console.log(this.group);

		var that = this;
		query.first({
			success: function (results) {
				that.group = results;
				that.groupUpdate = results;
				that.groupInfo = results.attributes;
				that.groupInfo.startDate = moment(that.groupInfo.startDate).format("MM/DD/YY");
				that.groupInfo.endDate = moment(that.groupInfo.endDate).format("MM/DD/YY");
				that.render();
				that.getPlayers(that.group);

				$('.sort').click(function () {
					$(this).toggleClass('sorted')
				})
			},	
			error: function (error) {
				console.log(error)
			}
		});

	},

	getGroupTotals: function() {
		var query = new Parse.Query("TntGroupTotals");
		query.include("groupID");
		query.equalTo("groupID", this.group);
		// console.log(this.group.attributes)

		var that = this;
		query.first({
			success: function(groupTotal) {
				// console.log(groupTotal);

				that.showGroupTotals(groupTotal);
			},
			error: function (error) {
				console.log(error)

			}
		})
	},

	showGroupTotals: function (groupTotal) {
		var renderedTemplate = _.template($('.group-view-group-summary-view').text());
		$('.group-summary-info').append(renderedTemplate(groupTotal.attributes)); 
	},

	getPlayers: function () {
		var collectQuery = new Parse.Query('TntCollectibles');
		collectQuery.include('user');
		
		// console.log(this.group)
		var query = new Parse.Query('TntScore');
		query.include('TntGrp');
		query.include('user');
		query.include('TntCollectibles');
		query.equalTo("tntGrp", this.group);
		// console.log(this.group)

		var that = this;
		query.find({
			success: function (players) {
				var grpPlayers = [];

				players.forEach(function (player) {
					// console.log(player.attributes)
						if(grpPlayers.length <= 0){
							grpPlayers.push(player);
						}if(grpPlayers.length > 0){
								grpPlayers.forEach(function(grpPlayer){
									// console.log(grpPlayer.attributes)
									
									if(grpPlayer.attributes.OIID == player.attributes.OIID){
										grpPlayer.attributes.minionsStomped += player.attributes.minionsStomped;
										grpPlayer.attributes.coinsCollected += player.attributes.coinsCollected;
										grpPlayer.attributes.collectibles = 0;	
									}else{
										var result = $.grep(grpPlayers, function(grp){ 
											return grp.attributes.OIID == player.attributes.OIID; 
										});
										if(result.length == 0){
											
										// console.log(player.attributes)
										grpPlayers.push(player);
										}

									}
								})
								
						}
				})

				that.showPlayers(grpPlayers);
				console.log(grpPlayers)
			},
			error: function (error) {
				console.log(error)
			}
		})
	},

	showPlayers: function(players) {
		var renderedTemplate = _.template($('.group-view-player-view').text());
		players.forEach(function(player){
			// console.log(player.attributes)
			$('.player-list').append(renderedTemplate(player.attributes)); 	
		});
		// using list.js to sort the table of data
		this.tableSort();
	},


	playerNav: function (location) {
		// will only set playerID if you click on the name itself, and not the row 	
		var playerID = location.currentTarget.innerHTML;
		console.log(this.options)
		router.navigate('/#tournament/group/'+ this.options.groupID +"/"+ playerID, {trigger: true});
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
	},

	print: function () {
		$("header").addClass('non-print')
		$(".group-view-location-banner").removeClass('h1-flag')
		$(".group-view-options").css('opacity', 0)

		window.print();
		
		$(".group-view-location-banner").addClass('h1-flag')
		$(".group-view-options").css('opacity', 1)
		$("header").removeClass('non-print')
	}
});

