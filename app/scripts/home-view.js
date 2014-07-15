'use strict';

var HomeView = Parse.View.extend({

	className: "home-view-container",

	events: {
		'click .sign-up-button' : 'signUpView',
	},

	template: _.template($('.home-view').text()),

	initialize: function() {
		if (Parse.User.current()) {
			this.remove();

			setTimeout(function() {
				router.navigate('tournament/dashboard', {trigger: true});
			}, 50);
		} else {
			this.numCounterUpdate = 0;

			$('.app-container').append(this.el);
			this.render();
		}
	},

	render: function() {
		var renderedTemplate = this.template;

		this.$el.html(renderedTemplate);
		this.updateCounter();
	},

	signUpView: function() {
		if (Parse.User.current()) {
			router.navigate('tournament/dashboard', {trigger: true});
		} else {
			router.navigate('tournament/sign-up', {trigger: true});
		}
	},

	remove: function() {
	    Parse.View.prototype.remove.call(this);
	},

	updateCounter: function() {
		var counterCollection = new CounterCollection();
		var that = this;

		populateCollection(counterCollection).done(function() {
			var numCounterTotal = counterCollection.models[0].attributes.total;

		 	if (numCounterTotal !== that.numCounterUpdate) {
			 	that.numCounterUpdate = numCounterTotal;

			 	var countList = numCounterTotal.toString().split('');
				var template = _.template($('.counter-total-template').text());
				var digits = $('.counter-cards').length - 1;

				countList.reverse();

		 		for (var i = 0, j = digits; i <= digits; i++, j--) {
		 			if (countList[i]) {
			 			$('.counter-cards:eq('+(j)+')').html(countList[i]+template());
		 			} else {
		 				$('.counter-cards:eq('+(j)+')').html(template());
		 			}
		 		}
			}
		});
	}
});