var PlayerView = Parse.View.extend({

	template: _.template($('.player-view').text()),

	initialize: function (options) {
		$('.app-container').append(this.el);
		this.render();
		var player = options.playerID;
		console.log(player);
	},

	render: function () {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	}
});