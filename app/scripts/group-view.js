var GroupView = Parse.View.extend({

	template: _.template($('.group-view-template').text()),

	events: {
		'click .change-group-dates'	: 'changeDatesButton',
		'focus .date-changer'		: 'changeDates',
		'click .save-dates'			: 'saveDates',
		'click .print-button'		: 'print',
		'click .player-name' 		: 'playerNav',
		'click .share-code'			: 'viewCode',
		'click .print-button'		: 'print',
		'click .edit-group-members'	: 'editMembersNav',
	},

	className: 'group-view-container',

	initialize: function(options) {
		this.groupCode = options;

		$('.app-container').html(this.el);

		this.getGroup();
	},

	render: function() {
		// render is called in the success inside getPlayers
		var renderedTemplate = this.template(this.group.attributes);
		this.$el.html(renderedTemplate);

		$('.sort').click(function() {
			$(this).toggleClass('sorted');
		});
		// once the primary template is rendered on the page, then render the map-reduced group summary data
		this.showGroupTotals(this.groupTotal);

		this.showPlayers(this.eachPlayerTotal);
	},

	getGroup: function() {
		var that = this;
		var query = new Parse.Query(strGroups);

		query.include("user");
		query.equalTo("groupCode", this.groupCode.groupID);

		query.first({
			success: function(results) {
				if (results !== undefined) {
					that.group = results;
					that.group.attributes.startDate = moment(that.group.attributes.startDate).format("MM/DD/YY");
					that.group.attributes.endDate = moment(that.group.attributes.endDate).format("MM/DD/YY");

					that.getPlayers(that.group);
				} else {
					var renderedTemplate = _.template($('.query-error-template').text());

					$('.app-container').html(renderedTemplate);

					$('.dashboard-link').click(function() {
						router.navigate('/#tournament/dashboard', {'trigger': true});
					});
				}
			},
			error: function(error) {
				console.log(error);
				var renderedTemplate = _.template($('.query-error-template').text());
				$('.app-container').html(renderedTemplate);
				$('.dashboard-link').click(function() {
					router.navigate('/#tournament/dashboard', {'trigger': true});
				});
			}
		});
	},

	showGroupTotals: function(groupTotal) {
		var renderedTemplate = _.template($('.group-view-group-summary-view').text());
		$('.group-summary-info').append(renderedTemplate(groupTotal));
	},

	getPlayers: function() {
		var that = this;
		var query = new Parse.Query(strScores);
		var collectQuery = new Parse.Query(strCollectibles);

		query.include('tntGrp.attributes.user');
		query.include('user');
		query.ascending('OIID')
		query.limit(150);
		query.equalTo("tntGrp", this.group);

		collectQuery.include('user');
		collectQuery.include('tntGrp');
		collectQuery.equalTo("tntGrp", this.group)
		collectQuery.find({
			success: function(results) {
				that.collectiblesArr = results;

				query.find({
					success: function(groupPlayerEvents) {

						if (groupPlayerEvents.length > 0) {


						var grpPlayers = [];
						var dateCheck;
						var now = new Date();
						var time = (5 * 24 * 3600 * 1000)
						var fiveDaysAgo = new Date(now.getTime()-time)

						if (fiveDaysAgo > groupPlayerEvents[0].attributes.tntGrp.attributes.endDate) {
							grayCheck = 0;
						} else {
							grayCheck = 1;
						}
						// map all of the player events and return only their attributes
						var mappedEventAttributes = groupPlayerEvents.map(function(playerEvent){
							// console.log(playerEvent.attributes.tntGrp.attributes.endDate)
							return playerEvent.attributes
						})
						// use that mapped function and reduce all of the attributes together to get group summary values
						that.groupTotal = mappedEventAttributes.reduce(function(prevVal, nextVal){
							return {
								minionsStomped: prevVal.minionsStomped + nextVal.minionsStomped,
								coinsCollected: prevVal.coinsCollected + nextVal.coinsCollected,
								meals:0,
								OIID: prevVal.OIID === nextVal.OIID ? grpPlayers.push(prevVal.OIID) : grpPlayers.push(nextVal.OIID),
								dateCheck: grayCheck
							}
						})
						// join all like OIID's together, the length is your number of contributing group members
						var playerCount = _.union(grpPlayers);
						that.group.attributes.players = playerCount.length;

						// for each unique user name, run another map/reduce for only their values
						that.eachPlayerTotal = playerCount.map(function(playerID) {
							var userCollectibles;
							// check the results of the collectibles query, if it has length, at least one player has earned a collectible, assign appropriately
							if (that.collectiblesArr.length > 0) {
								that.collectiblesArr.forEach(function(index){
									var user = index.attributes.user.attributes.username
									if(playerID === user) {
										userCollectibles = index.attributes.collectibles.length;
									} else {
										userCollectibles = 0;
									}
								})
							} else {
								userCollectibles = 0;
							}
							return mappedEventAttributes.reduce(function(prevVal, nextVal){
								if (playerID === nextVal.OIID) {
									return {
										minionsStomped: prevVal.minionsStomped + nextVal.minionsStomped,
										coinsCollected: prevVal.coinsCollected + nextVal.coinsCollected,
										username: playerID,
										collectibles: prevVal.collectibles
									}
								}
								else {
									return {
										minionsStomped: prevVal.minionsStomped,
										coinsCollected: prevVal.coinsCollected,
										username: playerID,
										collectibles: prevVal.collectibles
									}
								}
							}, {
								minionsStomped: 0,
								coinsCollected: 0,
								username: playerID,
								collectibles: userCollectibles
							})
						})
						that.render();
						} else {
							var renderedTemplate = _.template($('.new-group-placeholder-view-template').text());
							$('.app-container').html(renderedTemplate);
						}

					},
					error: function(error) {
						console.log(error);
					}
				});
			},
			error: function(error) {
				console.log(error);
			}
		});
	},

	showPlayers: function(players) {
		var renderedTemplate = _.template($('.group-view-player-view').text());

		players.forEach(function(player){
			$('.player-list').append(renderedTemplate(player));
		});

		// using list.js to sort the table of data
		this.tableSort();
	},

	playerNav: function(location) {
		// will only set playerID if you click on the name itself, and not the row
		var playerID = location.currentTarget.innerHTML;

		router.navigate('/#tournament/group/'+ this.options.groupID +"/"+ playerID, {trigger: true});
	},

	editMembersNav: function(location) {
		// will only set playerID if you click on the name itself, and not the row
		var playerID = location.currentTarget.innerHTML;
		router.navigate('/#tournament/group/'+ this.options.groupID +"/edit-members", {trigger: true});
	},

	// sort function
	tableSort: function() {
		var options = {
			valueNames: ['minions-data', 'coins-data', 'collectibles-data']
		};

		var userTable = new List('single-group-table', options);
	},

	changeDatesButton: function() {
		$('.date-changer').attr('readonly',false);

		setTimeout(function() {
			$('.date-changer').focus();
		}, 10);

		$('.change-group-dates').hide();
		$('.save-dates').show().css('display','inline-block');
	},

	changeDates: function() {
		var that = this;

		var endInput = $('.date-changer').pickadate({
			format: 'mm/dd/yy',
			min: true,

			onClose: function() {
				this.stop();
				$('.date-changer').blur().attr('readonly', true);
			},

			onStop: function() {
				$('.date-changer').attr('readonly', true);
			}
		});

		var endPicker = endInput.pickadate('picker');
	},

	saveDates: function() {
		this.group.set({
			endDate: {
				__type: "Date",
				iso: moment($('.date-changer').val(), "MM/DD/YY").toISOString()
			}
		});

		this.group.save({
			success: function(group) {
				$('.save-dates').hide();
				$('.change-group-dates').show().css('display','inline-block');

				alert("Group end date successfully updated!");
			},
			error: function(error) {
				console.log(error);

				$('.save-dates').hide();
				$('.change-group-dates').show().css('display','inline-block');

				alert("An error has occurred. Group end date has not been updated.");
			}
		});
	},

	print: function() {
		$("header").addClass('non-print');
		$(".group-view-location-banner").removeClass('h1-flag');
		$(".group-view-options").css('opacity', 0);
		$(".group-summary-info").css('background', '#FFF');

		window.print();

		$(".group-summary-info").css('background', '#DDD');
		$(".group-view-location-banner").addClass('h1-flag');
		$(".group-view-options").css('opacity', 1);
		$("header").removeClass('non-print');
	},

	viewCode: function() {
		var groupName = this.info.attributes.groupID.attributes.name.replace(/ /g, '%20');
		var groupCode = this.info.attributes.groupID.attributes.groupCode;

		router.navigate('/#tournament/dashboard/'+groupName+'/'+groupCode, {trigger: true});
	}
});
