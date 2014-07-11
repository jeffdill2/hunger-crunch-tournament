"use strict";

var GroupCodeView = Parse.View.extend({
	template: _.template($('.group-view-code-template').text()),
	events: {
		'click .view-group-page'	: 'goToGroupView'
	},

	initialize: function (groupID) {
		this.user = groupID;
		$('.app-container').html(this.el);
		this.render();

		$('.group-link').click(function () {
			$(this).focus().select();
		});

		$('.group-code').click(function () {
			$(this).focus().select();
		});
	},

	render: function () {
		this.user.group = this.user.group.replace(/%20/g, ' ');

		var renderedTemplate = this.template(this.user);
		this.$el.html(renderedTemplate);
	},

	goToGroupView: function () {
		router.navigate('/#tournament/group/' + this.user.group, {trigger: true});
	}

});