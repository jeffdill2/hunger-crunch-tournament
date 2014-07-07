"use strict";

var CompareGroupsView = Parse.View.extend({

	template: _.template($('.compare-groups-view').text()),

	initialize: function(options) {
		$('.app-container').append(this.el);
		this.render();
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	}
});