var GroupView = Parse.View.extend({

	template: _.template($('.group-view-template').text()),

	events: {
		'click .change-group-dates'	: 'changeDatesButton',
		'focus .date-changer'		: 'changeDates',
		'click .save-dates'			: 'saveDates',
		'click .print-button'		: 'print',
		'click .player-name' 		: 'playerNav',
		'click .share-code'			: 'viewCode',
		'click .print-button'		: 'print'
	},

	className: 'group-view-container',

	initialize: function(options) {
		this.groupCode = options;

		$('.app-container').append(this.el);

		this.getGroup();
	},

	render: function() {
		// called in the success inside getGroupTotals
		var renderedTemplate = this.template(this.group.attributes);
		this.$el.html(renderedTemplate);

		$('.sort').click(function () {
			$(this).toggleClass('sorted');
		});
	},

	getGroup: function() {
		// does not work if multiple groups with same group name
		var that = this;
		var query = new Parse.Query(strGroups);

		query.include("user");
		query.equalTo("groupCode", this.groupCode.groupID);

		query.first({
			success: function(results) {
				// this looks redundant 
				that.group = results;
				that.group.attributes.startDate = moment(that.group.attributes.startDate).format("MM/DD/YY");
				that.group.attributes.endDate = moment(that.group.attributes.endDate).format("MM/DD/YY");
				that.getGroupTotals();
				that.getPlayers(that.group);
			},
			error: function(error) {
				console.log(error);
				var renderedTemplate = _.template($('.query-error-template').text());
				$('.app-container').html(renderedTemplate);
				$('.dashboard-link').click(function () {
					router.navigate('/#tournament/dashboard', {'trigger': true});
				});
			}
		});
	},

	getGroupTotals: function() {
		var that = this;
		var query = new Parse.Query(strGroupTotals);

		query.include("groupID");
		query.equalTo("groupID", this.group);

		query.first({
			success: function(groupTotal) {
				that.group.attributes.players = groupTotal.attributes.players;
				that.render();
				that.info = groupTotal;
				that.showGroupTotals(groupTotal);
			},
			error: function(error) {
				console.log(error);
			}
		});
	},

	showGroupTotals: function(groupTotal) {
		var renderedTemplate = _.template($('.group-view-group-summary-view').text());
		$('.group-summary-info').append(renderedTemplate(groupTotal.attributes));
	},

	getPlayers: function() {
		var that = this;
		var query = new Parse.Query(strScores);
		var collectQuery = new Parse.Query(strCollectibles);

		query.include('tntGrp');
		query.include('user');
		query.equalTo("tntGrp", this.group);

		collectQuery.include('user');
		collectQuery.include('tntGrp');

		collectQuery.find({
			success: function(results) {
				that.collectiblesArr = results;

				query.find({
					success: function(players) {
						var grpPlayers = [];

						players.forEach(function(player) {
							if (grpPlayers.length <= 0) {
								grpPlayers.push(player);
							}

							if (grpPlayers.length > 0) {
								grpPlayers.forEach(function(grpPlayer) {
									if (grpPlayer.attributes.OIID === player.attributes.OIID) {
										grpPlayer.attributes.minionsStomped += player.attributes.minionsStomped;
										grpPlayer.attributes.coinsCollected += player.attributes.coinsCollected;

										that.collectiblesArr.forEach(function(collectible) {
											if (player.attributes.tntGrp.attributes.groupCode === collectible.attributes.tntGrp.attributes.groupCode && player.attributes.user.attributes.username === collectible.attributes.user.attributes.username) {
												grpPlayer.attributes.collectibles = collectible.attributes.collectibles.length;
											} else {
												// grpPlayer.attributes.collectibles = 0;
											}
										});
									} else {
										var result = $.grep(grpPlayers, function(grp) {
											return grp.attributes.OIID === player.attributes.OIID;
										});

										if (result.length === 0) {
											grpPlayers.push(player);
										}
									}
								});
							}
						});

						grpPlayers.forEach(function(player) {
							if (player.attributes.collectibles === undefined) {
								player.attributes.collectibles = 0;
							}
						});

						that.showPlayers(grpPlayers);
					},
					error: function (error) {
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
			$('.player-list').append(renderedTemplate(player.attributes));
		});

		// using list.js to sort the table of data
		this.tableSort();
	},

	playerNav: function(location) {
		// will only set playerID if you click on the name itself, and not the row
		var playerID = location.currentTarget.innerHTML;

		router.navigate('/#tournament/group/'+ this.options.groupID +"/"+ playerID, {trigger: true});
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