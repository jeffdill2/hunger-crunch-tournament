var _ = require('underscore');

var TotalStats = Parse.Object.extend({

	className: 'TotalStats',

});

// function addPlayer (pl, pt) {

// 	var test = new Parse.Object('test');
// 			test.set('player', pl );
// 			test.set('score', pt);
// 			test.save();
//  }
// // Use Parse.Cloud.define to define as many cloud functions as you want.
// // For example:
// Parse.Cloud.define("addTestPlayer", function(request, response) {
//   response.success(addPlayer('player3', 45));
// });
// var totalsLog = {};

// Parse.Cloud.define("averageScore", function(request, response) {
//   var query = new Parse.Query("test");
//   // query.equalTo("player", request.params.movie);
//   query.find({
//     success: function(results) {
//       var sum = 0;
//       for (var i = 0; i < results.length; i += 1) {
//         sum += results[i].get("score");
//       }
//       totalsLog[0] = sum / results.length;
//       response.success(totalsLog);
//     },
//     error: function() {
//       response.error("score lookup failed");
//     }
//   });
// });

// Parse.Cloud.define("totalScore", function(request, response) {
//   var query = new Parse.Query("test");
//   // query.equalTo("player", request.params.movie);
//   query.find({
//     success: function(results) {
//       var sum = 0;
//       for (var i = 0; i < results.length; i += 1) {
//         sum += results[i].get("score");
//       }
//       totalsLog[1] = sum;
//       response.success(totalsLog);
//     },
//     error: function() {
//       response.error("score lookup failed");
//     }
//   });
// });

Parse.Cloud.job("totals", function(request, response) {

var totalCoins;
var totalMinions;

  var query = new Parse.Query("playerEvent");
  query.equalTo('eventType', 'levelEnd');
  query.find({
    success: function(results) {
    	console.log(results);

		totalCoins = results.reduce(function(a,b){
			return a + b.get('level').levelCoins;
		}, 0);

		totalMinions = results.reduce(function(a,b){
			return a + b.get('level').levelMinions;
		}, 0);

      
      response.success('' + [totalCoins, totalMinions]);
    },
    error: function() {
      response.error("score lookup failed");
    }
  }).done();

var totalsLog = Parse.Object('TotalStats');
var resetTotals = new Parse.Query(TotalStats);

resetTotals.get("KEpS6v6cfg", {
  	success: function(totalsLog) {
  		console.log('totals log is' + totalsLog);
		totalsLog.set('Coins', totalCoins );
		totalsLog.set('Minions', totalMinions);
		totalsLog.save();  			},
  	error: function(object, error) {
  	  // The object was not retrieved successfully.
  	  // error is a Parse.Error with an error code and description.
  	}
	});
});

Parse.Cloud.define('collected', function(request, response) {
	var query = new Parse.Query("playerEvent");
	query.equalTo('eventType', 'collectible');
	query.find({
		success: function(results) {

			var collected = results.forEach(function (x) {
				x.get('collectible');
			});
			response.success(collected);
		},
		error: function() {
			response.error("score lookup failed");
		}
	})
});