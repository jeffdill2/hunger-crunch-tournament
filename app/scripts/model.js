'use strict';

Parse.initialize("4PRYxlghLlDHrL3AXef2mz3tUeiTtcfxQegE95Hc", "cBEoecDAnR0XFbrCqigPP8UVMjyvzHcavFpqZUmn");

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////// MODEL
////////////////////////////////////////////////////////////
var GroupModel = Parse.Object.extend({
	className: strGroups
});

var CounterModel = Parse.Object.extend({
	className: strCounter
});

////////////////////////////////////////////////////////////
///////////////////////////////////////////////// COLLECTION
////////////////////////////////////////////////////////////
var GroupCollection = Parse.Collection.extend({
	model: GroupModel
});

var CounterCollection = Parse.Collection.extend({
	model: CounterModel
});

////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// QUERIES
////////////////////////////////////////////////////////////
function populateCollection(collection) {
	return collection.fetch({
		success: function() {
			// console.log('Data successfully retrieved');
		},
		error: function(error) {
			console.log('An error has occured - details below:');
			console.log('Error ' + error.code + " : " + error.message);
		}
	});
}