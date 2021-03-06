"use strict";

function login() {
	let username = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	let data = {
		username: username,
		password: password
	}

	$.ajax({
		url: "/logUser",
		type: "POST",
		dataType: "json",
		data: JSON.stringify(data),
		contentType: "application/json",
		cache: false,
		timeout: 5000,
		complete: function() {
		 	console.log('process complete');
		},

		success: function(data) {
			console.log(data);
			console.log('process sucess');

			if(data == true) {
				window.location.replace("/");
			} else {
				document.getElementById("wrong").style.display="block";
			}
			
		},

		error: function() {
	  		console.log('process error');
	  		window.location.replace("/serverError");
		},
	});
}

function logout() {
	$.ajax({
		url: "/logoutUser",
		type: "POST",
		dataType: "json",
		data: "logout",
		cache: false,
		timeout: 5000,
		complete: function() {
		 	console.log('process complete');
		},

		success: function(data) {
			console.log(data);
			console.log('process sucess');
			window.location.replace("/");
		},

		error: function() {
	  		console.log('process error');
	  		window.location.replace("/serverError");
		},
	});
}