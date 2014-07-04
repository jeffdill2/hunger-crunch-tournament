var SignUpView = Parse.View.extend ({

	events: {
		'click	.new-user-creation-button'	: 'createNewUser',
	},

	template: _.template($('.sign-up-view').text()),

	className: "new-user-login-container",

	events: {
		'click .new-user-creation-button' 				: 'createParseUser',
		'focus .new-user-password-verification-input'	: 'passwordValidation'
	},

	initialize: function (options) {
		$('.app-container').append(this.el);
		this.render();
	},

	render: function () {
		var renderedTemplate = this.template;
		this.$el.html(renderedTemplate);
	},

	createParseUser: function () {
		var name = $('.new-user-username-input').val();
		var pw = $('.new-user-password-input').val();
		var emailAddy = $('.new-user-email-input').val();

		var user = new Parse.User();
		user.set("username", name);
		user.set("password", pw);
		user.set("email", emailAddy);

		user.signUp(null, {
			success: function () {
				// remove login window and show new user dashboard/welcome
				console.log('Welcome,', user.attributes.username);
				$('.header-account-options').html("<p>Welcome, " + user.attributes.username + "</p>");
				router.navigate('dashboard', {trigger:true})
			},
			error: function (user, error) {
				// display error and retry as necessary
			}
		});
	},

	passwordValidation: function () {
		$('.new-user-password-verification-input').keyup(function () {
			var pw = $('.new-user-password-input').val();
			var check = $(".new-user-password-verification-input").val();
			if(pw === check && check.length > 0) {
				$('.new-user-creation-button').attr('disabled',false);
				$(".new-user-password-verification-input").css({'background': 'rgba(255, 255, 255, 1)'});
			}
			else if (pw != check && check.length === 0) {
				$('.new-user-creation-button').attr('disabled',true);
				$(".new-user-password-verification-input").css({'background': 'rgba(255, 255, 255, 1)'});
			}
			else {
				$('.new-user-creation-button').attr('disabled',true);
				$(".new-user-password-verification-input").css({'background': 'rgba(255, 0, 0, .7)'});
			}
		});
	}

});
