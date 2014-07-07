'use strict';

var CreateGroupView = Parse.View.extend({

	template: _.template($('.create-group-view').text()),

	events: {
		'click 	.new-group-creation-button': "createNewGroupID",
	},

	initialize: function(options) {
		$('.app-container').append(this.el);
		this.render();
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	populateCollection: function(collection) {

	return collection.fetch({
		success: function() {
			console.log('Data successfully retrieved');
		},
		error: function(error) {
			console.log('An error has occured - details below:');
			console.log('Error ' + error.code + " : " + error.message);
		}
	});
	},

	generateRandomGroupdID: function () {

	var strGroupID = "";
	var strCharsAvailable = "abcdefghijklmnopqrstuvwxyz";
	var numGroupIDLength = 5;

	for (var i = 0; i < numGroupIDLength; i += 1) {
		strGroupID += strCharsAvailable.charAt(Math.floor(Math.random() * strCharsAvailable.length));
	}

	return strGroupID;
	},

	createNewGroupID: function () {
	var groups = new GroupCollection();
	var strGroupID = "";

	this.populateCollection(groups).done(function() {
		var aryGroupIDs = groups.models.map(function(model) {
			return model.attributes.groupID;
		});

		while (true) {
			var bolGroupIDFound = false;

			// needed access to the method of this instance
			// resolved by using router.currentview
			strGroupID = router.currentView.generateRandomGroupdID();

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
		
		var groupName = $('.new-group-name-input').val();
		var orgName = $('.new-group-organization-input').val();

		var groupACL = new Parse.ACL(Parse.User.current());
		groupACL.setPublicReadAccess(true);
		groupACL.setPublicWriteAccess(false);
		groupACL.setRoleReadAccess('siteAdmin', true);
		groupACL.setRoleWriteAccess('siteAdmin', true);
		objGroup.setACL(groupACL);

		objGroup.save({
			groupID: strGroupID,
			startDate: {
  				__type: "Date",
  				iso: moment().toISOString()
			},
			endDate: {
				__type: "Date",
				iso: moment().add('days', 14).toISOString()
			},
			groupName: groupName,
			orgName: orgName,
		}, {
			success: function() {
				console.log('New group successfully added.');

				window.location = '/#dashboard';
			},
			error: function(error) {
				console.log('New group was not successfully saved - details below:');
				console.log('Error ' + error.code + " : " + error.message);
			}
		});
	})
	},



});