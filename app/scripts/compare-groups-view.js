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