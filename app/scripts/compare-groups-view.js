"use strict";

var CompareGroupsView = Parse.View.extend({

	template: _.template($('.compare-groups-view-template').text()),
	addGroupTemplate: _.template($('.compare-groups-add-group-template').text()),

	events: {
		'click .table-footer'				: 'displayAvailableGroups',
		'click .compare-group-name-search'	: 'addGroup'
	},

	initialize: function(options) {
		$('.app-container').append(this.el);
		this.render();
	},

	render: function() {
		var that = this;
		var renderedTemplate = this.template();
		this.$el.html(renderedTemplate);

		

		// template for group totals to be appended into the list on group compare page
		var compareUserGroupsTemplate = _.template($('.compare-groups-user-groups-template').text());
		// query matching all Groups objects
		var Groups = Parse.Object.extend("Groups");
		var query = new Parse.Query(Groups);
		// checking for group objects made by the current user
		query.equalTo("orgName", Parse.User.current().attributes.username);
		query.find({
		  success: function(groups) {
		    // Do something with the returned Parse.Object values
		    for (var i = 0; i < groups.length; i++) { 

		    	// query for all playerEvent objects
		    	var playerEvent = Parse.Object.extend("playerEvent");
		    	var query = new Parse.Query(playerEvent);
		    	// gets all player event objects matching the current user's groups
		    	query.equalTo("groupID", groups[i].attributes.groupID);

		    	query.find({
		    		success: function (results) {
		    			// gets groups that have matching names of the player events being totaled
		    			var query = new Parse.Query(Groups);
		    			// only passes groups with members
		    			if(results.length > 0){

			    			query.equalTo("groupID", results[0].attributes.groupID);
			    			
			    			query.find({
			    				success: function (group) {
			    					var groupSum = {
			    						groupName: group[0].attributes.groupName,
					    				coinSum: 0,
					    				minionSum: 0
					    			};
					    			// adds all matching player event numbers to object being passed
					    			// to the template
			    					for (var i = 0; i < results.length; i++) { 
			    						groupSum.coinSum += results[i].attributes.level.levelCoins;
			    						groupSum.minionSum += results[i].attributes.level.levelMinions;
			    					}
			    			// appends instance of group totals and group name to the template
			    					$('.list').append( compareUserGroupsTemplate( groupSum ) );
			    					that.tableSort();
			    				},
			    				error: function (error) {
			    					console.log(error);
			    				}
			    			})
		    			}

		    			
		    		},
		    		error: function(error) {

		    		}
		    	});
		    
		    }
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		});
	},

	// sort function
	tableSort: function () {
		var options = {
			valueNames: ['compare-group-name','compare-minions-data', 'compare-coins-data', 'compare-meals-data']
		};
		var userTable = new List('compare-groups-table', options)
	},

	groupList: function () {
		var options = {
			valueNames: ['compare-group-name-search', 'valid']
		};
		var userList = new List('avaialble-group-names', options)
	},

	displayAvailableGroups: function () {
		$('tr').last().css('border-bottom','none');
		var renderedTemplate = this.addGroupTemplate();
		$('table').after(renderedTemplate)
		this.groupList();
	}, 

	addGroup: function () {
		
	},




});