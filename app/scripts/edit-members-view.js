"use strict";


var EditMemberView = Parse.View.extend({

	template: _.template($('.edit-members-view').text()),

	events: {
		'click .remove-group-button'	: 	'removePlayer',
	},

	initialize: function(options) {
		this.group = options;
		this.getGroup();

		if (Parse.User.current()) {
			$('.app-container').append(this.el);
			this.render();

			$('.sort').click(function () {
				$(this).toggleClass('sorted')
			})

		} 
		else {
			this.signIn();
		}
	},

	render: function() {
		var renderedTemplate = this.template();
		this.$el.html(renderedTemplate);
	},

	getGroup: function () {
		// does not work if multiple groups with same group name
		var query = new Parse.Query("TntGroup");
		query.include("user");
		query.equalTo("groupCode", this.group.groupId);
		// console.log(this.group);

		var that = this;
		query.first({
			success: function (results) {
				// console.log(results)
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

	getPlayers: function() {
		// console.log(this.group)
		var query = new Parse.Query('TntScore');
		query.include('tntGrp.attributes.user');
		query.include('user');
		query.equalTo("tntGrp", this.group);

		// console.log(this.group.attributes)
		var that = this;
		var collectQuery = new Parse.Query('TntCollectibles');
		collectQuery.include('user');
		collectQuery.include('tntGrp');
		collectQuery.find({
			success: function(results){
					that.collectiblesArr = results;
					// console.log(results)
					// console.log(that.collectiblesArr)

				query.find({
					success: function (players) { 
						var grpPlayers = [];

						players.forEach(function (player) {
							// console.log(player.attributes.tntGrp)

								if(grpPlayers.length <= 0){
									grpPlayers.push(player);
								}if(grpPlayers.length > 0){
										grpPlayers.forEach(function(grpPlayer){
											// console.log(grpPlayer.attributes)
											
											if(grpPlayer.attributes.OIID == player.attributes.OIID){
												grpPlayer.attributes.minionsStomped += player.attributes.minionsStomped;
												grpPlayer.attributes.coinsCollected += player.attributes.coinsCollected;

												that.collectiblesArr.forEach(function(collectible){
												// console.log('player ', player.attributes.user.attributes.username)
												// console.log('collectible ',  collectible.attributes.user.attributes.username)
													// console.log(collectible)
													if(player.attributes.tntGrp.attributes.groupCode == collectible.attributes.tntGrp.attributes.groupCode && player.attributes.user.attributes.username == collectible.attributes.user.attributes.username){
														grpPlayer.attributes.collectibles = collectible.attributes.collectibles.length;		
													}else{
														// grpPlayer.attributes.collectibles = 0;
													}
												})

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
						grpPlayers.forEach(function(player){
							if(player.attributes.collectibles == undefined){
								player.attributes.collectibles = 0;
							}
						})
						that.showPlayers(grpPlayers);
						// console.log(grpPlayers)
					},
					error: function (error) {
						console.log(error)
					}
				})

			},
			error: function(error){
				console.log(error);
			}
		})
	},

	showPlayers: function(players) {
		var renderedTemplate = _.template($('.edit-members-template').text());
		players.forEach(function(player){
			console.log(player.attributes)
			// console.log(player.attributes.tntGrp.attributes.user.id)
			$('.compare-list').append(renderedTemplate(player.attributes)); 	
		});
		// using list.js to sort the table of data
		this.tableSort();
	},

	removePlayer: function(location){
		var removeName = location.currentTarget.innerHTML;

		if (confirm('Are you sure you want to delete ' + removeName +' from the group? This action can not be undone.')) {
    			// Save it!
    			var query = new Parse.Query('TntScore');
    			query.include('tntGrp');
    			query.include('user');

    			query.equalTo("tntGrp", this.group);
    			query.equalTo("groupCode", this.group.groupId);

    			query.find({
    			success: function(results) {
    				results.forEach(function(result){
    					console.log(result)
    					result.set('tntGrp', null);
    					result.save();
    					history.back();
    					router.navigate('/#tournament/group/' + this.options.groupID, {trigger: true})
    				})
    			},
    			error: function(error) {
    				console.log(error)
    			}
    		})
		} else {
 	 	  // Do nothing!
		}
	},

	// sort function
	tableSort: function() {
		var options = {
			valueNames: ['compare-group-name', 'compare-minions-data', 'compare-coins-data', 'compare-meals-data']
		};
		var userTable = new List('compare-groups-table', options)
	},

	groupList: function() {
		var options = {
			valueNames: ['compare-group-name-search', 'valid']
		};
		var userList = new List('avaialble-group-names', options)
	},

	signIn:function () {
		this.remove();
		router.navigate('/#tournament/sign-in');
	}
});