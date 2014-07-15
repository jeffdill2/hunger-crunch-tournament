'use strict';

// jeffs parse server
// Parse.initialize("KjlIhHJBGyjsDEpV4Z98GBo66QCcNGukFyTbxbGH", "Kte3zdBYCUlWK03TnW3oGdgrb0oyIzBrxKCYEibE");


// dev parse server
Parse.initialize("4PRYxlghLlDHrL3AXef2mz3tUeiTtcfxQegE95Hc", "cBEoecDAnR0XFbrCqigPP8UVMjyvzHcavFpqZUmn");

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////// MODEL
////////////////////////////////////////////////////////////
var GroupModel = Parse.Object.extend({
	className: "TntGroup"
});

var CounterModel = Parse.Object.extend({
	className: "Counter"
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
			console.log('Data successfully retrieved');
		},
		error: function(error) {
			console.log('An error has occured - details below:');
			console.log('Error ' + error.code + " : " + error.message);
		}
	});
}