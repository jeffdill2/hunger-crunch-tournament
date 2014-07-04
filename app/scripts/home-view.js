var HomeView = Parse.View.extend ({

	className: "home-view-container",

	events: {
		'click .submit-group-id' : 'submitGroup',
		'click .sign-up-button' : 'signUpView',
	},

	template: _.template($('.home-view').text()),

	initialize: function () {
		$('.app-container').append(this.el);
		this.render();

		startCounter();
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	submitGroup : function () {
		window.location = '/#group/' + $('.group-id').val();
	},

	signUpView: function () {
		window.location = '/#sign-up';
	},

	remove: function() {
	    stopCounter();
	    Parse.View.prototype.remove.call(this);
	}
})