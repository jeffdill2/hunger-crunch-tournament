"use strict";

var CompareGroupsView = Parse.View.extend({

	template: _.template($('.compare-groups-view-template').text()),
	addGroupTemplate: _.template($('.compare-groups-add-group-template').text()),
	//empty array that will be filled by the objects pulled from parse in this.displayAvailableGroups
	groupsToAdd: [],
	groupsToCompare: [],

	events: {
		'click .table-footer'				: 'displayAvailableGroups',
		'click .compare-group-name-search'	: 'addGroup',
		'click .remove-player-button'		: 'removeGroup',
	},

	initialize: function(options) {

		$('.app-container').append(this.el);
		this.getAvailableGroups();
		this.render();

	},

	render: function() {
		var renderedTemplate = this.template();
		this.$el.html(renderedTemplate);



		// // template for group totals to be appended into the list on group compare page
		// var compareUserGroupsTemplate = _.template($('.compare-groups-user-groups-template').text());
		// // query matching all Groups objects
		// var Groups = Parse.Object.extend("Groups");
		// var query = new Parse.Query(Groups);
		// // checking for group objects made by the current user
		// query.equalTo("orgName", Parse.User.current().attributes.username);
		// query.find({
		//   success: function(groups) {
		//     // Do something with the returned Parse.Object values
		//     for (var i = 0; i < groups.length; i++) { 
		//     	// query for all playerEvent objects
		//     	var playerEvent = Parse.Object.extend("playerEvent");
		//     	var query = new Parse.Query(playerEvent);
		//     	// gets all player event objects matching the current user's groups
		//     	query.equalTo("groupID", groups[i].attributes.groupID);

		//     	query.find({
		//     		success: function (results) {
		//     			// gets groups that have matching names of the player events being totaled
		//     			var query = new Parse.Query(Groups);
		//     			// only passes groups with members
		//     			if(results.length > 0){

		// 	    			query.equalTo("groupID", results[0].attributes.groupID);

		// 	    			query.find({
		// 	    				success: function (group) {
		// 	    					var groupSum = {
		// 	    						groupName: group[0].attributes.groupName,
		// 			    				coinSum: 0,
		// 			    				minionSum: 0
		// 			    			};
		// 			    			// adds all matching player event numbers to object being passed
		// 			    			// to the template
		// 	    					for (var i = 0; i < results.length; i++) { 
		// 	    						if(results[i].attributes.level){
		// 	    							groupSum.coinSum += results[i].attributes.level.levelCoins;
		// 	    							groupSum.minionSum += results[i].attributes.level.levelMinions;
		// 								}
		// 	    					}
		// 	    			// appends instance of group totals and group name to the template
		// 	    					$('.compare-list').append( compareUserGroupsTemplate( groupSum ) );
		// 	    					that.tableSort();
		// 	    				},
		// 	    				error: function (error) {
		// 	    					console.log(error);
		// 	    				}
		// 	    			})
		//     			}


		//     		},
		//     		error: function(error) {

		//     		}
		//     	});

		//     }
		//   },
		//   error: function(error) {
		//     alert("Error: " + error.code + " " + error.message);
		//   }
		// });
	},

	// sort function
	tableSort: function() {
		var options = {
			valueNames: ['compare-group-name', 'compare-minions-data', 'compare-coins-data', 'compare-meals-data']
		};
		var userTable = new List('compare-groups-table', options)
	},

	groupList: function() {
		var options = {
			valueNames: ['compare-group-name-search', 'valid']
		};
		var userList = new List('avaialble-group-names', options)
	},

	getAvailableGroups: function () {
		var that = this;

		var Groups = Parse.Object.extend("Groups");
		var query = new Parse.Query(Groups);
		// checking for group objects made by the current user
		query.equalTo("orgName", Parse.User.current().attributes.username);
		query.find({
			success: function(groups) {
				var i = 0;


				groups.forEach(function(groupTotals) {

					var GroupTotals = Parse.Object.extend("GroupTotals");
					var query = new Parse.Query(GroupTotals);

					query.equalTo("groupID", groupTotals.attributes.groupID);
					query.find({
						success: function(group) {

							that.groupsToAdd.push(group);
							// if all group arrays have been pushed to the this.groupsToAdd array, run a map to turn them into objects
							i >= groups.length - 1 ? that.groupsToAdd = that.groupsToAdd.map(function(obj) {
								return obj[0]
							}) : i += 1;
						},
						error: function(error) {
							console.log(error);
						}
					});
				})


			},
			error: function(error) {
				// body...
				console.log(error)
			}
		});

	},

	displayAvailableGroups: function() {
		var addListTemplate = _.template($('.compare-groups-added-group-template').text());
		$('#avaialble-group-names').html(' ');

		$('tr').last().css('border-bottom', 'none');
		var renderedTemplate = this.addGroupTemplate();
		$('table').after(renderedTemplate);
		var that = this;



		this.groupsToAdd.forEach(function(groupNames){
			$('.add-list').append(addListTemplate(groupNames.attributes));	
		})
		this.groupList();
		

	},

	displayCompareGroups: function() {
		var renderedTemplate = _.template($('.compare-groups-user-groups-template').text());

		$('.compare-list').html(' ');

		this.groupsToCompare.forEach(function(groupNames){
			$('.compare-list').append(renderedTemplate(groupNames.attributes));	
		})
		
		
	},


	addGroup: function(location) {

		var addName = location.currentTarget.innerHTML;
		var groupArr = this.groupsToAdd;

		var addedGroup = _.find(groupArr, function(group) {
			return group.get('groupName') === addName;
		})
		this.groupsToAdd = groupArr
			.filter(function(el) {
				return el.get('groupName') !== addName;
			});

		this.groupsToCompare.push(addedGroup);
		this.displayCompareGroups();		
		this.displayAvailableGroups();

	},

	removeGroup: function (location) {
		var removeName = location.currentTarget.innerHTML;
		var removeArr = this.groupsToCompare;

		var removedGroup = _.find(removeArr, function(group) {
			return group.get('groupName') === removeName;
		})
		this.groupsToCompare = removeArr
			.filter(function(el) {
				return el.get('groupName') !== removeName;
			})

		this.groupsToAdd.push(removedGroup);
		this.displayCompareGroups();		
		this.displayAvailableGroups();

		console.log('to add: ' + this.groupsToAdd)
		console.log('to compare: ' + this.groupsToCompare)

		
	},



});