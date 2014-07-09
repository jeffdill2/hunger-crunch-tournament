var _ = require('underscore');

////////////////////////////////////////////////////////////
///////////////////////////////////////// PARSE DATA CLASSES
////////////////////////////////////////////////////////////
var strScores = 'TntScore';
var strGroups = 'TntGroup';
var strCollectibles = 'TntCollectibles';
var strGroupTotals = 'GroupTotals';
var strGameTotals = 'GameTotals';

////////////////////////////////////////////////////////////
///////////////////////////////////////////// OVERALL TOTALS
////////////////////////////////////////////////////////////
Parse.Cloud.job("gameTotals", function(request, response) {
	var numTotalCoins;
	var numTotalMinions;
	var gameTotalsQuery = new Parse.Query(strGameTotals);
	var scoreDataQuery = new Parse.Query(strScores);

	gameTotalsQuery.exists('objectId');
	scoreDataQuery.exists('objectId');

	gameTotalsQuery.find({
		success: function(gameTotals) {
			gameTotals.forEach(function(gameTotal) {
				gameTotal.destroy({
					success: function() {
						response.message('Game total successfully destroyed.');
					},
					error: function() {
						response.message('Game total failed to destroy.');
					}
				});
			});

			scoreDataQuery.find({
				success: function(scoreData) {
					var objGameTotal = new Parse.Object(strGameTotals);

					numTotalCoins = scoreData.reduce(function(previous, current) {
						return previous + current.get('coinsCollected');
					}, 0);

					numTotalMinions = scoreData.reduce(function(previous, current) {
						return previous + current.get('minionsStomped');
					}, 0);

					objGameTotal.save({
						coins: numTotalCoins,
						minions: numTotalMinions
					}, {
						success: function() {
							response.success('Game totals has succeeded!');
						},
						error: function(error) {
							response.message('Game total save has failed.');
						}
					});
				},
				error: function() {
					response.message('Score data query failed.');
				}
			});
		},
		error: function() {
			response.message('Game total query failed.');
		}
	});
});

////////////////////////////////////////////////////////////
////////////////////////////////////////// GROUP AGGREGATION
////////////////////////////////////////////////////////////
// Parse.Cloud.job("groupTotals", function(request, response) {
// 	var groupsQuery = new Parse.Query('Groups');
// 	var groupTotalsQuery = new Parse.Query('GroupTotals');

// 	groupsQuery.exists('groupID');
// 	groupTotalsQuery.exists('groupID');

// 	groupTotalsQuery.find({
// 		success: function(groupTotals) {
// 			groupTotals.forEach(function(groupTotal) {
// 				groupTotal.destroy({
// 					success: function() {
// 						response.message('Group total successfully destroyed.');
// 					},
// 					error: function() {
// 						response.message('Group total failed to destroy.');
// 					}
// 				});
// 			});

// 			groupsQuery.find({
// 				success: function(groups) {
// 					var numCounter = 0;
// 					var numGroups = groups.length;

// 					groups.forEach(function(group) {
// 						var strGroupID = group.get('groupID');
// 						var strGroupName = group.get('groupName')
// 						var objGroupTotal = new Parse.Object('GroupTotals');

// 						var eventsQuery = new Parse.Query('playerEvent');
// 						eventsQuery.equalTo('groupID', strGroupID);
// 						eventsQuery.equalTo('eventType', 'levelEnd');

// 						eventsQuery.find({
// 							success: function(events) {
// 								var numCoinSum = 0;
// 								var numMinionSum = 0;

// 								events.forEach(function(playerEvent) {
// 									numCoinSum += playerEvent.attributes.level.levelCoins;
// 									numMinionSum += playerEvent.attributes.level.levelMinions;
// 								});

// 								objGroupTotal.save({
// 									groupID: strGroupID,
// 									groupName: strGroupName,
// 									coins: numCoinSum,
// 									minions: numMinionSum
// 								}, {
// 									success: function() {
// 										numCounter += 1;

// 										if (numCounter === numGroups) {
// 											response.success('Group aggregation has succeeded!');
// 										}

// 										response.message('Group total save has succeeded.');
// 									},
// 									error: function(error) {
// 										response.message('Group total save has failed.');
// 									}
// 								});

// 								response.message('Player events query has succeeded.');
// 							},
// 							error: function() {
// 								response.message('Player events query has failed.');
// 							}
// 						});
// 					});

// 					response.message('Groups query has succeeded.');
// 				},
// 				error: function() {
// 					response.message('Groups query has failed.');
// 				}
// 			});
// 		},
// 		error: function() {
// 			response.error('Group aggregation has failed.');
// 		}
// 	});
// });