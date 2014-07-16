"use strict";

var GroupCodeView = Parse.View.extend({
	template: _.template($('.group-view-code-template').text()),

	events: {
		'click .view-group-page'	: 'goToGroupView'
	},

	initialize: function(groupID) {
		if (Parse.User.current()) {
			this.user = groupID;

			$('.app-container').html(this.el);
			this.render();

			$('.group-link').click(function() {
				$(this).focus().select();
			});

			$('.group-code').click(function() {
				$(this).focus().select();
			});
		} else {
			this.signIn();
		}
	},

	render: function() {
		this.user.group = this.user.group.replace(/%20/g, ' ');

		var renderedTemplate = this.template(this.user);
		this.$el.html(renderedTemplate);

		$('.group-link-box input').scrollLeft($('.group-link-box input').width());
	},

	goToGroupView: function() {
		router.navigate('/#tournament/group/' + this.user.code, {trigger: true});
	},

	signIn: function() {
		this.remove();
		router.navigate('/#tournament/sign-in');
	}
});