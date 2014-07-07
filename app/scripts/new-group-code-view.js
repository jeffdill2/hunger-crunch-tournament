"use strict";

var GroupCodeView = Parse.View.extend({
	template: _.template($('.group-view-code-template').text()),
	events: {
		'click .view-group-page'	: 'goToGroupView'
	},

	initialize: function (groupID) {
		this.group = groupID.group;
		// console.log(this.group)
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
		var renderedTemplate = this.template();
		this.$el.html(renderedTemplate);
	},

	goToGroupView: function () {
		router.navigate('group/'+this.group, {trigger: true});
	}

});