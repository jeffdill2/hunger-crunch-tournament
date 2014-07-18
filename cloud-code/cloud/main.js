var _ = require('underscore');

////////////////////////////////////////////////////////////
///////////////////////////////////////// PARSE DATA CLASSES
////////////////////////////////////////////////////////////
var strScores = 'TntScore';
var strGroups = 'TntGroup';
var strCollectibles = 'TntCollectibles';
var strGroupTotals = 'TntGroupTotals';
var strGameTotals = 'TntGameTotals';
var strUsers = '_User';
var strCounter = 'Counter';
var strPurchases = 'Purchase';

////////////////////////////////////////////////////////////
/////////////////////////////////////////// GLOBAL FUNCTIONS
////////////////////////////////////////////////////////////
function merge(aryFirst, arySecond) {
	var len = +arySecond.length;
	var j = 0;
	var i = aryFirst.length;

	while (j < len) {
		aryFirst[i++] = arySecond[j++];
	}

	if (len !== len) {
		while (arySecond[j] !== undefined) {
			aryFirst[i++] = arySecond[j++];
		}
	}

	aryFirst.length = i;

	return aryFirst;
}

////////////////////////////////////////////////////////////
///////////////////////////////////////////// OVERALL TOTALS
////////////////////////////////////////////////////////////
Parse.Cloud.job("gameTotals", function(request, response) {
	var numTotalCoins = 0;
	var numTotalMinions = 0;
	var gameTotalsQuery = new Parse.Query(strGameTotals);
	var scoreDataQuery = new Parse.Query(strScores);
	var objGameTotal = new Parse.Object(strGameTotals);

	gameTotalsQuery.exists('objectId');
	scoreDataQuery.exists('objectId');
	scoreDataQuery.limit(1000);

	gameTotalsQuery.find().then(function(gameTotals) {
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

		return scoreDataQuery.count();
	}).then(function(count) {
		var aryCombinedScoreData = [];

		for (var i = 0; i <= count; i += 1000) {
			scoreDataQuery.skip(i);

			scoreDataQuery.find().then(function(scoreData) {
				merge(aryCombinedScoreData, scoreData);

				if (aryCombinedScoreData.length === count) {
					aryCombinedScoreData.forEach(function(score) {
						numTotalCoins += score.get('coinsCollected');
						numTotalMinions += score.get('minionsStomped');
					});

					objGameTotal.save({
						coins: numTotalCoins,
						minions: numTotalMinions
					}, {
						success: function() {
							response.success('Game totals has succeeded!');
						},
						error: function() {
							response.error('Game total save has failed.');
						}
					});
				}
			});
		}
	});
});

////////////////////////////////////////////////////////////
////////////////////////////////////////// GROUP AGGREGATION
////////////////////////////////////////////////////////////
Parse.Cloud.job("groupTotals", function(request, response) {
	var groupsQuery = new Parse.Query(strGroups);
	var groupTotalsQuery = new Parse.Query(strGroupTotals);

	groupsQuery.exists('objectId');
	groupTotalsQuery.exists('objectId');

	groupTotalsQuery.find().then(function(groupTotals) {
		groupTotals.forEach(function(groupTotal) {
			groupTotal.destroy({
				success: function() {
					response.message('Group total successfully destroyed.');
				},
				error: function() {
					response.message('Group total failed to destroy.');
				}
			});
		});

		return groupsQuery.find();

	}).then(function(groups) {
		var numCounter = 0;
		var numGroups = groups.length;

		groups.forEach(function(group) {
			var scoreDataQuery = new Parse.Query(strScores);
			var purchasesQuery = new Parse.Query(strPurchases);
			var strGroupID = group.id;
			var numTotalCoins = 0;
			var numTotalMinions = 0;
			var aryUniqueUsers = [];
			var aryPurchaseUsers = [];
			var objGroupTotal = new Parse.Object(strGroupTotals);

			var objGroupPointer = {
				__type: "Pointer",
				className: strGroups,
				objectId: strGroupID
			};

			scoreDataQuery.equalTo('tntGrp', objGroupPointer);
			scoreDataQuery.include('user');
			scoreDataQuery.limit(1000);

			scoreDataQuery.find().then(function(scoreData) {
				scoreData.forEach(function(score) {
					var strUserID = score.get('user').id;
					var bolUserFound = false;

					numTotalCoins += score.get('coinsCollected');
					numTotalMinions += score.get('minionsStomped');

					aryUniqueUsers.forEach(function(user) {
						if (user === strUserID) {
							bolUserFound = true;
						}
					});

					if (!bolUserFound) {
						var objUserPointer = {
							__type: "Pointer",
							className: strUsers,
							objectId: strUserID
						};

						aryUniqueUsers.push(strUserID);
						aryPurchaseUsers.push(objUserPointer);
					}
				});

				purchasesQuery.containedIn('user', aryPurchaseUsers);

				return purchasesQuery.find();

			}).then(function(purchaseData) {
				var numPurchaseTotal = 0;
				var numMealsTotal = 0;
				var numCostOfOneMeal = 0.5;

				purchaseData.forEach(function(purchase) {
					numPurchaseTotal += parseFloat(purchase.get('price'));
				});

				numMealsTotal = parseFloat((Math.ceil((numPurchaseTotal * numCostOfOneMeal) * 10) / 10).toFixed(1));

				objGroupTotal.save({
					groupID: objGroupPointer,
					coins: numTotalCoins,
					minions: numTotalMinions,
					players: aryUniqueUsers.length,
					meals: numMealsTotal
				}, {
					success: function() {
						numCounter += 1;

						if (numCounter === numGroups) {
							response.success('Group totals has succeeded!');
						}

						response.message('Group total save has succeeded.');
					},
					error: function() {
						response.message('Group total save has failed.');
					}
				});
			});
		});
	});
});

////////////////////////////////////////////////////////////
/////////////////////////////////////// DUMMY DATA GENERATOR
////////////////////////////////////////////////////////////
Parse.Cloud.job("generateDummyData", function(request, response) {
	var groupsQuery = new Parse.Query(strGroups);
	var scoresQuery = new Parse.Query(strScores);

	groupsQuery.exists('objectId');
	scoresQuery.exists('objectId');

	scoresQuery.find({
		success: function(scores) {
			scores.forEach(function(score) {
				score.destroy({
					success: function() {
						response.message('Scores destroy succeeded.');
					},
					error: function() {
						response.message('Scores destroy failed.');
					}
				});
			});

			groupsQuery.find({
				success: function(groups) {
					groups.forEach(function(group) {
						var strGroupID = group.id;
						var objUser = new Parse.Object(strUsers);
						var numLowerThreshold = 10;
						var numUpperThreshold = 100;
						var numRecordCount = Math.floor(Math.random() * (numUpperThreshold - numLowerThreshold + 1)) + numLowerThreshold;
						var numRandomID = Math.floor(Math.random() * 9999999999) + 1;
						var strUserID = 'User' + numRandomID.toString();

						var objGroupPointer = {
							__type: "Pointer",
							className: strGroups,
							objectId: strGroupID
						};

						objUser.save({
							username: strUserID,
							playerIOID: strUserID,
							password: strUserID
						}, {
							success: function(user) {
								var strUserObjectID = user.id;

								for (var i = 0; i <= numRecordCount; i += 1) {
									var objScore = new Parse.Object(strScores);
									var numRandomWorld = Math.floor(Math.random() * 4) + 1;
									var numRandomLevel = Math.floor(Math.random() * 12) + 1;
									var numRandomCoins = Math.floor(Math.random() * 1000) + 1;
									var numRandomMinions = Math.floor(Math.random() * 25) + 1;
									var strLevelID = "W0" + numRandomWorld + "L" + (numRandomLevel < 10 ? "0" : "") + numRandomLevel;

									var objUserPointer = {
										__type: "Pointer",
										className: strUsers,
										objectId: strUserObjectID
									}

									objScore.save({
										coinsCollected: numRandomCoins,
										levelID: strLevelID,
										minionsStomped: numRandomMinions,
										tntGrp: objGroupPointer,
										user: objUserPointer,
										OIID: strUserID
									}, {
										success: function() {
											response.message('Score save has succeeded.');
										},
										error: function() {
											response.message('Score save has failed.');
										}
									});
								}

								response.message('User save succeeded.');
							},
							error: function() {
								response.message('User save failed.');
							}
						});
					});

					response.message('Groups query succeeded.');
				},
				error: function() {
					response.message('Groups query failed.');
				}
			});

			response.message('Scores query succeeded.');
		},
		error: function() {
			response.message('Scores query failed.');
		}
	});
});