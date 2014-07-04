'use strict';

var CreateGroupView = Parse.View.extend ({

	template: _.template($('.create-group-view').text()),

	events: {

	},

	initialize: function (options) {
		$('.app-container').append(this.el);
		this.render();
	},

	render: function () {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	

});
