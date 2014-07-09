var _ = require('underscore');

////////////////////////////////////////////////////////////
///////////////////////////////////////////// OVERALL TOTALS
////////////////////////////////////////////////////////////
Parse.Cloud.job("totals", function(request, response) {
	var TotalStats = Parse.Object.extend({
		className: 'TotalStats'
	});

	var totalCoins;
	var totalMinions;

	var query = new Parse.Query("playerEvent");
	query.equalTo('eventType', 'levelEnd');

			response.message('Results: ' + [totalCoins, totalMinions]);
		},
		error: function() {
			response.message("Score lookup failed.");
		}
	}).done();

	var totalsLog = Parse.Object('TotalStats');
	var resetTotals = new Parse.Query(TotalStats);

	resetTotals.get("KEpS6v6cfg", {
		success: function(totalsLog) {
			totalsLog.set('Coins', totalCoins );
			totalsLog.set('Minions', totalMinions);
			totalsLog.save({
				success: function() {
					response.success('Score totals has successfully saved.');
				},
				error: function() {
					response.message('Saving totals to TotalStats failed.');
				}
			});
		},
		error: function(object, error) {
			response.error('error: ' + error.code + " - " + error.message);
		}
	});
});

////////////////////////////////////////////////////////////
////////////////////////////////////////// GROUP AGGREGATION
////////////////////////////////////////////////////////////
Parse.Cloud.job("groups", function(request, response) {
	var groupsQuery = new Parse.Query('Groups');
	var groupTotalsQuery = new Parse.Query('GroupTotals');

	groupsQuery.exists('groupID');
	groupTotalsQuery.exists('groupID');

	groupTotalsQuery.find({
		success: function(groupTotals) {
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

			groupsQuery.find({
				success: function(groups) {
					var numCounter = 0;
					var numGroups = groups.length;

					groups.forEach(function(group) {
						var strGroupID = group.get('groupID');
						var strGroupName = group.get('groupName')
						var objGroupTotal = new Parse.Object('GroupTotals');

						var eventsQuery = new Parse.Query('playerEvent');
						eventsQuery.equalTo('groupID', strGroupID);
						eventsQuery.equalTo('eventType', 'levelEnd');

						eventsQuery.find({
							success: function(events) {
								var numCoinSum = 0;
								var numMinionSum = 0;

								events.forEach(function(playerEvent) {
									numCoinSum += playerEvent.attributes.level.levelCoins;
									numMinionSum += playerEvent.attributes.level.levelMinions;
								});

								objGroupTotal.save({
									groupID: strGroupID,
									groupName: strGroupName,
									coins: numCoinSum,
									minions: numMinionSum
								}, {
									success: function() {
										numCounter += 1;

										if (numCounter === numGroups) {
											response.success('Group aggregation has succeeded!');
										}

										response.message('Group total save has succeeded.');
									},
									error: function(error) {
										response.message('Group total save has failed.');
									}
								});

								response.message('Player events query has succeeded.');
							},
							error: function() {
								response.message('Player events query has failed.');
							}
						});
					});

					response.message('Groups query has succeeded.');
				},
				error: function() {
					response.message('Groups query has failed.');
				}
			});
		},
		error: function() {
			response.error('Group aggregation has failed.');
		}
	});
});
