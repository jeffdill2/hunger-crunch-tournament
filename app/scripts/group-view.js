var GroupView = Parse.View.extend({

	template: _.template($('.group-view').text()),

	events: {
		'click .players' : 'showPlayer',
	},

	initialize: function (options) {
		$('.app-container').append(this.el);
		this.render();
		this.group = options.groupID;
		console.log(this.group);
	},

	render: function () {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	showPlayer: function () {
		var playerID = $(".players").attr("value");
		window.location = '/#group/' + this.group + '/' + playerID; 
	}
})

