"use strict";

function login() {
	let username = document.getElementById("username").value;
	let password = document.getElementById("password").value;

	$.ajax({
		url: "/logUser",
		type: "POST",
		dataType: "json",
		data: {
		    username: username,
		    password: password
		},
		contentType: "application/json",
		cache: false,
		timeout: 5000,
		complete: function() {
		  //called when complete
		 	console.log('process complete');
		},

		success: function(data) {
			console.log(data);
			console.log('process sucess');
			window.location.replace("/");
		},

		error: function() {
	  		console.log('process error');
		},
	});
}