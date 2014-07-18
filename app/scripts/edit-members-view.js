"use strict";


var EditMemberView = Parse.View.extend({

	template: _.template($('.edit-members-view').text()),

	events: {
		'click .breadcrumb-back'		: 'goBack',
		'click .remove-group-button'	: 'removePlayer',
	},

	initialize: function(options) {
		console.log(options)
		this.group = options;
		this.getGroup();
		if (Parse.User.current()) {
			$('.app-container').append(this.el);
			this.render();

			$('.sort').click(function() {
				$(this).toggleClass('sorted');
			});
		} else {
			this.signIn();
		}
	},

	render: function() {
		var renderedTemplate = this.template(this.options);
		this.$el.html(renderedTemplate);
	},

	getGroup: function() {
		// does not work if multiple groups with same group name
		var that = this;
		var query = new Parse.Query(strGroups);

		query.include("user");
		query.equalTo("groupCode", this.group.groupID);

		query.first({
			success: function(results) {
				that.group = results;
				that.groupUpdate = results;
				that.groupInfo = results.attributes;
				that.options.name = results.attributes.name
				that.groupInfo.startDate = moment(that.groupInfo.startDate).format("MM/DD/YY");
				that.groupInfo.endDate = moment(that.groupInfo.endDate).format("MM/DD/YY");
				that.render();
				that.getPlayers(that.group);

				$('.sort').click(function() {
					$(this).toggleClass('sorted');
				});
			},
			error: function(error) {
				console.log(error);
			}
		});
	},

	getPlayers: function() {
		var that = this;
		var query = new Parse.Query(strScores);
		var collectQuery = new Parse.Query(strCollectibles);

		query.include('tntGrp.attributes.user');
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
											console.log(collectible)
											console.log(player)
											if (collectible.attributes.tntGrp !== undefined && player.attributes.user !== undefined && player.attributes !== undefined && collectible.attributes !== undefined){
												if (player.attributes.tntGrp.attributes.groupCode === collectible.attributes.tntGrp.attributes.groupCode && player.attributes.user.attributes.username === collectible.attributes.user.attributes.username) {
													grpPlayer.attributes.collectibles = collectible.attributes.collectibles.length;
												}
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
		var renderedTemplate = _.template($('.edit-members-template').text());

		players.forEach(function(player) {
			$('.compare-list').append(renderedTemplate(player.attributes));
		});

		// using list.js to sort the table of data
		this.tableSort();
	},

	removePlayer: function(location) {
		var removeName = location.currentTarget.innerHTML;
		var that = this;
		if (confirm('Are you sure you want to delete ' + removeName +' from the group? This action can not be undone.')) {
    		var query = new Parse.Query(strScores);

    		query.include('tntGrp');
    		query.include('user');
    		query.equalTo("tntGrp", this.group);
    		query.equalTo("groupCode", this.group.groupID);

    		query.find({
    			success: function(results) {
    				results.forEach(function(result) {
    					result.set('tntGrp', null);
    					result.save();

    					router.navigate('/#tournament/group/' + that.group.groupID, {trigger: true})
    				});
    			},
    			error: function(error) {
    				console.log(error);
    			}
    		});
		}
	},

	// sort function
	tableSort: function() {
		var options = {
			valueNames: ['compare-group-name', 'compare-minions-data', 'compare-coins-data', 'compare-meals-data']
		};

		var userTable = new List('compare-groups-table', options);
	},

	groupList: function() {
		var options = {
			valueNames: ['compare-group-name-search', 'valid']
		};

		var userList = new List('avaialble-group-names', options);
	},

	goBack: function() {
		router.navigate('/#tournament/group/' + this.options.groupID, {trigger: true});
	},

	signIn:function() {
		this.remove();
		router.navigate('/#tournament/sign-in');
	}
});