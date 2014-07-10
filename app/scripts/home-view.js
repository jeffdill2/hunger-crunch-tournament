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
		router.navigate('/#group/' + $('.group-id').val(), {trigger: true});
	},

	signUpView: function () {
		if(Parse.User.current()){
			router.navigate('/#dashboard' + $('.group-id').val(), {trigger: true});
			
		}else{
			router.navigate('/#sign-up' + $('.group-id').val(), {trigger: true});
		}
	},

	remove: function() {
	    stopCounter();
	    Parse.View.prototype.remove.call(this);
	}
});