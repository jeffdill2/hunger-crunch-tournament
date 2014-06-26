"use strict";

Parse.initialize("KjlIhHJBGyjsDEpV4Z98GBo66QCcNGukFyTbxbGH", "Kte3zdBYCUlWK03TnW3oGdgrb0oyIzBrxKCYEibE");

///////////////////////////////////////////////////////////
/// Model/Object //////////////////////////////////////////
///////////////////////////////////////////////////////////
// 	defaults: {
// 		// objectID: "", // unique object id assigned by parse to each post
// 		groupID: "", // reference to actual group being contributed to
// 		playerIOID: "", // unique gamecenter ID sent with player object 
// 		eventType: "", // string identifier for what sort of information is being sent - levelEnd, Purchase, Collectible+LevelEnd
// 		// not every event will require a full data send to parse as this computation will be done on the back end
// 		// Purchase Event unique information 
// 		txn: {
// 			txnID: 0 // unique numeric transaction ID
// 			txnAmount: 0 // numeric purchase/txn amount
// 		}, 	
// 		// txnTotal: 0, // cumulative total of purchases made to be presented as meals provided/not a direct dollar ratio
// 		// Collectible Event unique info
// 		collectible: 0, // array, or unique numberID of collectible acquired
// 		// Level End Event information 
// 		level: {
// 			levelNumber: 0, // numeric level used as a deliniator for score
// 			levelMinions: 0, // numeric amount of minions smashed in a level
// 			levelCoins: 0 // numeric amount of coins collected per level
// 		}
// 	}


var eventObject = Parse.Object.extend({
	className: "playerEvent"
});

// purchase
$('.purchase-event-button').click(function () {
	var userAmount = parseInt($('.purchase-data-unique-id-amount').val());
	var groupAmount = parseInt($('.purchase-data-unique-group-amount').val());
	var eventAmount = parseInt($('.purchase-data-amount-select').val());

	for (var i = 0; i < eventAmount; i+=1) {
		var event = new eventObject();
		event.set({
			groupID: "grp#"+(Math.floor(Math.random()*groupAmount)+1), // create a groupID within a range and random assortment
			playerIOID: "player"+(Math.floor(Math.random()*userAmount)+1), // create a userID of player#, where the number can be 1-the number of requested unique ids
			eventType: "purchase",
			txn: {
				txnID: Date.now(), // create a random transaction ID by using unix time
				txnAmount: Math.round((Math.random()*35+0.99)*100)/100
			},
		});
		// console.log(event.attributes);
		event.save().done(function () {
			console.log('I saved!');
		});
	}
});


// collectible
$('.collectible-event-button').click(function () {
	var userAmount = parseInt($('.collectible-data-unique-id-amount').val());
	var groupAmount = parseInt($('.collectible-data-unique-group-amount').val());
	var eventAmount = parseInt($('.collectible-data-amount-select').val());
	for (var i = 0; i < eventAmount; i+=1) {

		var event = new eventObject();
		event.set({
			groupID: "grp#"+(Math.floor(Math.random()*groupAmount)+1), // create a groupID within a range and random assortment
			playerIOID: "player"+(Math.floor(Math.random()*userAmount)+1), // create a userID of player#, where the number can be 1-the number of requested unique ids
			eventType: "collectible",
			collectible: Math.floor(Math.random()*27)+1 // provide a random one of the 27 different collectibles 
		});
		// console.log(event.attributes);
		event.save().done(function () {
			console.log('I saved!');
		});
	}
});

// levelEnd
$('.level-end-event-button').click(function () {
	var userAmount = parseInt($('.level-end-data-unique-id-amount').val());
	var groupAmount = parseInt($('.level-end-data-unique-group-amount').val());
	var eventAmount = parseInt($('.level-end-amount-select').val());
	
	for(var i = 0; i < eventAmount; i+=1) {

		var event = new eventObject();
		event.set({
			groupID: "grp#"+(Math.floor(Math.random()*groupAmount)+1), // create a groupID within a range and random assortment
			playerIOID: "player"+(Math.floor(Math.random()*userAmount)+1), // create a userID of player#, where the number can be 1-the number of requested unique ids
			eventType: "levelEnd",
			level: {
				levelNumber: Math.floor(Math.random()*6)+1, //random levelNumber between 1-6
				levelMinions: Math.floor(Math.random()*100), // random minionStomped value between 0 and 99
				levelCoins: Math.floor(Math.random()*400) // random levelCoin value between 0 and 399
			}
		});
		// console.log(event.attributes);
		event.save().done(function () {
			console.log('I saved!');
		});
	}
});


// 27 unique collectibles
// 20 unique levels