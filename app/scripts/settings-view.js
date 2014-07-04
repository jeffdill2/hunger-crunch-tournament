"use strict";

var SettingsView = Parse.View.extend({

	template: _.template($('.settings-view').text()),

	initialize: function(options) {
		$('.app-container').append(this.el);
		this.render();
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	}
});