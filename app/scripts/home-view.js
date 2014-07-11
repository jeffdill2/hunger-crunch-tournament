var HomeView = Parse.View.extend({

	className: "home-view-container",

	events: {
		'click .submit-group-id' : 'submitGroup',
		'click .sign-up-button' : 'signUpView',
	},

	template: _.template($('.home-view').text()),

	initialize: function() {
		$('.app-container').append(this.el);
		this.render();
	},

	render: function() {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
		startCounter();
	},

	submitGroup : function() {
		router.navigate('/#tournament/group/' + $('.group-id').val(), {trigger: true});
	},

	signUpView: function() {
		if (Parse.User.current()) {
			$('.sign-up-button-container .alert').remove();

			var alertTemplate = _.template($('.alert-template').text());
			var renderedTemplate = alertTemplate({message: 'No need to sign up since you\'re already signed in!'});

			$('.sign-up-button-container').append(renderedTemplate);
		} else {
			router.navigate('/#tournament/sign-up', {trigger: true});
		}
	},

	remove: function() {
	    stopCounter();
	    Parse.View.prototype.remove.call(this);
	}
});




////////////////////////////////////////////////////////////
////////////////////////////////////////////////////// MODEL
////////////////////////////////////////////////////////////
var CounterModel = Parse.Object.extend({
	className: "Counter"
});
 
////////////////////////////////////////////////////////////
///////////////////////////////////////////////// COLLECTION
////////////////////////////////////////////////////////////
var CounterCollection = Parse.Collection.extend({
	model: CounterModel
});
 
////////////////////////////////////////////////////////////
////////////////////////////////////////////// TOTAL COUNTER
////////////////////////////////////////////////////////////
var numRefreshIntervalMinutes = 1;
var myCounter;
var numCounterIntervalID;
 
function startCounter() {
	updateCounter();
 
	numCounterIntervalID = setInterval(function() {
		updateCounter();
	}, numRefreshIntervalMinutes * 60000);
}
 
function stopCounter() {
	clearInterval(numCounterIntervalID);
}
var numCounterUpdate = 0;

function updateCounter() {
	var counterCollection = new CounterCollection();
	populateCollection(counterCollection).done(function() {
	var numCounterTotal = counterCollection.models[0].attributes.total;
	
	 	if(numCounterTotal != numCounterUpdate) {
		 	numCounterUpdate = numCounterTotal;
		 	var countList = numCounterTotal.toString().split('');
		 	countList.reverse();

			var template = _.template($('.counter-total-template').text());
			var digits = $('.counter-cards').length-1;
	 		for (var i = 0, j = digits; i <= digits; i++, j--){

	 			if (countList[i]) {
		 			$('.counter-cards:eq('+(j)+')').html(countList[i]+template())
	 			}
	 			else {
	 				$('.counter-cards:eq('+(j)+')').html(template())
	 			}
	 		}
	 	}
	});
}
