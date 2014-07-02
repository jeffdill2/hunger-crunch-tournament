var GroupView = Parse.View.extend({

	template: _.template($('.group-view').text()),

	initialize: function (options) {
		$('.app-container').append(this.el);
		this.render();
		var group = options.groupID;
		console.log(group);
	},

	render: function () {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	}
})