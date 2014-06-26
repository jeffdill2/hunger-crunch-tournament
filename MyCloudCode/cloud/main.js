var Test = Parse.Object.extend({

	className: 'test',

});

function addPlayer (pl, pt) {

	var test = new Parse.Object('test');
			test.set('player', pl );
			test.set('score', pt);
			test.save();
 }
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("addTestPlayer", function(request, response) {
  response.success(addPlayer('player3', 45));
});

Parse.Cloud.define("averageScore", function(request, response) {
  var query = new Parse.Query("test");
  // query.equalTo("player", request.params.movie);
  query.find({
    success: function(results) {
      var sum = 0;
      for (var i = 0; i < results.length; i += 1) {
        sum += results[i].get("score");
      }
      response.success(sum / results.length);
    },
    error: function() {
      response.error("score lookup failed");
    }
  });
});

Parse.Cloud.define("totalScore", function(request, response) {
  var query = new Parse.Query("test");
  // query.equalTo("player", request.params.movie);
  query.find({
    success: function(results) {
      var sum = 0;
      for (var i = 0; i < results.length; i += 1) {
        sum += results[i].get("score");
      }
      response.success(sum);
    },
    error: function() {
      response.error("score lookup failed");
    }
  });
});