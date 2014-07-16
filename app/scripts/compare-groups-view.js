"use strict";

var CompareGroupsView = Parse.View.extend({

	template: _.template($('.compare-groups-view-template').text()),
	addGroupTemplate: _.template($('.compare-groups-add-group-template').text()),
	//empty array that will be filled by the objects pulled from parse in this.displayAvailableGroups

	events: {
		'click .table-footer'			: 'displayAvailableGroups',
		'click .compare-group-item'		: 'addGroup',
		'click .remove-group-button'	: 'removeGroup',
		'click .print'					: 'printTable'
	},

	initialize: function(options) {
		if (Parse.User.current()) {
			$('.app-container').append(this.el);

			this.getAvailableGroups();
			this.render();

			// make sure arrays are empty on view call
			this.groupsToAdd = [];
			this.groupsToCompare = [];

			$('.sort').click(function() {
				$(this).toggleClass('sorted');
			});
		} else {
			this.signIn();
		}
	},

	render: function() {
		var renderedTemplate = this.template();
		this.$el.html(renderedTemplate);
	},

	// sort function
	tableSort: function() {
		var options = {
			valueNames: ['compare-group-name', 'compare-minions-data', 'compare-coins-data', 'compare-meals-data']
		};

		var userTable = new List('compare-groups-table', options);
	},

	groupList: function() {
		var options = {
			valueNames: ['compare-group-name-search', 'valid']
		};

		var userList = new List('avaialble-group-names', options);
	},

	getAvailableGroups: function() {
		var that = this;
		var query = new Parse.Query(strGroups);

		// checking for group objects made by the current user
		query.include('user');
		query.equalTo("user", Parse.User.current());

		query.find({
			success: function(groups) {
				var i = 0;

				groups.forEach(function(groupTotals) {
					var query = new Parse.Query(strGroupTotals);

					query.include("groupID");
					query.equalTo("groupID", groupTotals);

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
				console.log(error);
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

		if (this.groupsToAdd.length <= 0) {
			var placeholderTemplate = _.template($('.placeholder-view').text());

			$('.add-list').html(placeholderTemplate());
		} else {
			this.groupsToAdd.forEach(function(groupNames) {
				$('.add-list').append(addListTemplate(groupNames.attributes));
			});
		}

		this.groupList();
	},

	displayCompareGroups: function() {
		var renderedTemplate = _.template($('.compare-groups-user-groups-template').text());

		$('.compare-list').html(' ');

		this.groupsToCompare.forEach(function(groupNames) {
			$('.compare-list').append(renderedTemplate(groupNames.attributes));
		});

		this.tableSort();
	},

	addGroup: function(location) {
		var addName = location.currentTarget.children.item("h3").innerHTML;
		var groupArr = this.groupsToAdd;

		var addedGroup = _.find(groupArr, function(group) {
			return group.get('groupID').get('name') === addName;
		});

		this.groupsToAdd = groupArr
			.filter(function(el) {
				return el.get('groupID').get('name') !== addName;
			});

		this.groupsToCompare.push(addedGroup);
		this.displayCompareGroups();
		this.displayAvailableGroups();
	},

	removeGroup: function(location) {
		var removeName = location.currentTarget.innerHTML;
		var removeArr = this.groupsToCompare;

		var removedGroup = _.find(removeArr, function(group) {
			return group.get('groupID').get('name') === removeName;
		});

		this.groupsToCompare = removeArr
			.filter(function(el) {
				return el.get('groupID').get('name') !== removeName;
			});

		this.groupsToAdd.push(removedGroup);
		this.displayCompareGroups();
		this.displayAvailableGroups();
	},

	printTable: function() {
		$("header").addClass('non-print');
		$(".compare-groups-header-content").addClass('non-print');
		$(".compare-groups-content tfoot").addClass('non-print');
		$(".compare-groups-content button").addClass('non-print');
		$("#avaialble-group-names").addClass('non-print');

		window.print();

		$("header").removeClass('non-print');
		$(".compare-groups-header-content").removeClass('non-print');
		$(".compare-groups-content tfoot").removeClass('non-print');
		$(".compare-groups-content button").removeClass('non-print');
		$("#avaialble-group-names").removeClass('non-print');
	},

	signIn: function() {
		this.remove();
		router.navigate('/#tournament/sign-in');
	}
});