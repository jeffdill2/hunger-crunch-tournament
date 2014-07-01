"use strict";

Parse.initialize("KjlIhHJBGyjsDEpV4Z98GBo66QCcNGukFyTbxbGH", "Kte3zdBYCUlWK03TnW3oGdgrb0oyIzBrxKCYEibE");

/////////////////////////////////////////////////////
/// Admin User Creation /////////////////////////////
/////////////////////////////////////////////////////


function createParseUser () {
	var name = $('.new-user-username-input').val();
	var pw = $('.new-user-password-input').val();
	var emailAddy = $('.new-user-email-input').val();

	var user = new Parse.User();
	user.set("username", name);
	user.set("password", pw);
	user.set("email", emailAddy);

	user.signUp(null, {
		success: function (user) {
			// remove login window and show new user dashboard/welcome
			console.log('Welcome,', user);
			$('body').html("<p>Welcome, " + user.username + "</p>");
			$('.new-user-login-container').hide();
		},
		error: function (user, error) {
			// display error and retry as necessary
		}
	});
}

function passwordValidation () {
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

$('.new-user-creation-button').click(function () {
	createParseUser();
});

$('.new-user-password-verification-input').focus(function () {
	passwordValidation();
});