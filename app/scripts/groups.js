'use strict';

Parse.initialize("KjlIhHJBGyjsDEpV4Z98GBo66QCcNGukFyTbxbGH", "Kte3zdBYCUlWK03TnW3oGdgrb0oyIzBrxKCYEibE");

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////// MODEL
////////////////////////////////////////////////////////////
var GroupModel = Parse.Object.extend({
	className: "Groups"
});

////////////////////////////////////////////////////////////
///////////////////////////////////////////////// COLLECTION
////////////////////////////////////////////////////////////
var GroupCollection = Parse.Collection.extend({
	model: GroupModel
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

function generateRandomGroupdID() {
	var strGroupID = "";
	var strCharsAvailable = "abcdefghijklmnopqrstuvwxyz";

	for (var i = 0; i < 5; i += 1) {
		strGroupID += strCharsAvailable.charAt(Math.floor(Math.random() * strCharsAvailable.length));
	}

	return strGroupID;
}

function createNewGroupID() {
	var groups = new GroupCollection();
	var strGroupID = "";

	populateCollection(groups).done(function() {
		var aryGroupIDs = groups.models.map(function(model) {
			return model.attributes.groupID;
		});

		while (true) {
			var bolGroupIDFound = false;
			strGroupID = generateRandomGroupdID();

			aryGroupIDs.forEach(function(groupID) {
				if (groupID === strGroupID) {
					bolGroupIDFound = true;
				}
			});

			if (!bolGroupIDFound) {
				break;
			}
		}

		var objGroup = new GroupModel();

		objGroup.save({
			groupID: strGroupID,
			startDate: {
  				__type: "Date",
  				iso: moment().toISOString()
			},
			endDate: {
				__type: "Date",
				iso: moment().add('days', 14).toISOString()
			}
		}, {
			success: function() {
				console.log('New group successfully added.');
			},
			error: function(error) {
				console.log('New group was not successfully saved - details below:');
				console.log('Error ' + error.code + " : " + error.message);
			}
		});
	})
}