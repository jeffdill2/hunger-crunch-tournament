var _ = require('underscore');

var TotalStats = Parse.Object.extend({

	className: 'TotalStats',

});

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
