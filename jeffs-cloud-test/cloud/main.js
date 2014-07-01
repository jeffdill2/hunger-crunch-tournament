var _ = require('underscore');

// var Test = Parse.Object.extend({

//  className: 'test',

// });

// function addPlayer (pl, pt) {

//  var test = new Parse.Object('test');
//          test.set('player', pl );
//          test.set('score', pt);
//          test.save();
//  }
// // Use Parse.Cloud.define to define as many cloud functions as you want.
// // For example:
// Parse.Cloud.define("addTestPlayer", function(request, response) {
//   response.success(addPlayer('player3', 45));
// });
var totalsLog = {};

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

Parse.Cloud.define("totals", function(request, response) {
  var query = new Parse.Query("playerEvent");
  query.equalTo('eventType', 'levelEnd');
  query.find({
    success: function(results) {
        console.log(results)
        totalCoins = results.reduce(function(a,b){
            return a + b.get('level').levelCoins;
        }, 0);

        // totalMinions = results.reduce(function(a,b){
        //  return a + b.level.levelMinions;
        // }, 0);


      response.success([totalCoins]);
    },
    error: function() {
      response.error("score lookup failed");
    }
  });
});

////////////////////////////////////////////////////////////
///////////// JEFF'S STUFF - TESTING CLOUD CODE INS AND OUTS
////////////////////////////////////////////////////////////
Parse.Cloud.define("hello", function(request, response) {
	var strName = request.params.name;

	if (strName) {
		response.success("Hello " + strName + "!");
	} else {
		response.error("What's yo name sucka?!");
	}
});