'use strict';

var CreateGroupView = Parse.View.extend({

	template: _.template($('.create-group-view-template').text()),
	className: "create-group-container",
	events: {
		'click .new-group-creation-button'	: "createNewGroupID",
		'click .start-date-picker'			: "startDatePicker",
		'focus .start-date-picker'			: "startDatePicker",
		'click .end-date-picker'			: "endDatePicker",
		'focus .end-date-picker'			: "endDatePicker",
	},

	initialize: function(options) {
		$('.app-container').append(this.el);
		this.render();
	},

	render: function() {
		var that = this;

		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
		this.startDatePicker();
		this.endDatePicker();

		this.startPicker.on('set', function (event) {
				if (event.select) {
					that.endPicker.set('min', that.startPicker.get('select'));
				}
		})
		this.endPicker.on('set', function (event) {
				if (event.select) {
					that.startPicker.set('max', that.endPicker.get('select'));
				}
		})
	},

	startDatePicker: function () {
		var that = this;

		var startInput = $('.start-date-picker').pickadate({
			format: 'ddd mmmm dd, yyyy',
			container: '.start-date-container',

			onClose: function () {
				this.stop();
			},

			onStop: function () {
				$('.start-date-picker').attr('readonly', true);
			}
		});
		this.startPicker = startInput.pickadate('picker');
		setTimeout(function () {
			if ( that.endPicker.get('value') ) {
				that.startPicker.set('max', that.endPicker.get('select'));
			}
		},50);
	},

	endDatePicker: function () {
		var that = this;
		var endInput = $('.end-date-picker').pickadate({
			format: 'ddd mmmm dd, yyyy',
			container: '.end-date-container',
			min: true,
			onClose: function () {
				this.stop();
			},

			onStop: function () {
				$('.end-date-picker').attr('readonly', true);
			}
		});
		this.endPicker = endInput.pickadate('picker');

		if ( this.startPicker.get('value') ) {
			that.endPicker.set('min', that.startPicker.get('select'));
		}
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

		populateCollection(groups).done(function() {
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
			var orgName = Parse.User.current().attributes.username;

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
	  				iso: moment($('.new-group-start-date-input').val(), "dd MMMM DD, YYYY").toISOString()
				},

				endDate: {
					__type: "Date",
					iso: moment($('.new-group-end-date-input').val(), "dd MMMM DD, YYYY").toISOString()
				},
				groupName: groupName,
				orgName: orgName,
			}, {
				success: function(group) {
					console.log(group)
					var groupName = group.attributes.groupName.replace(/ /g, '%20');
					var uniqueID = group.attributes.groupID;
					router.navigate('/#dashboard/'+groupName+'/'+uniqueID, {trigger: true});
				},
				error: function(error) {
					console.log('New group was not successfully saved - details below:');
					console.log('Error ' + error.code + " : " + error.message);
				}
			});
		})
	}
});