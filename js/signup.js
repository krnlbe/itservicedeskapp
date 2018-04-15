'user strict';

function signup() {
	let firstname = document.getElementsByName("firstname")[0].value;
	let lastname = document.getElementsByName("lastname")[0].value;
	let email = document.getElementsByName("email")[0].value;
	let username = document.getElementsByName("username")[0].value;
	let password = document.getElementsByName("pass")[0].value;
	let repeatPassword = document.getElementsByName("repeat-pass")[0].value;

	if(password != repeatPassword) {
		let errMsg = document.getElementById('wrong');
		errMsg.textContent = 'Passwords must match!';
		errMsg.style.display = 'block';
		return;
	}

	let data = {
		firstname: firstname,
		lastname: lastname,
		email: email,
		username: username,
		password: password
	}

	$.ajax({
		url: "/signupUser",
		type: "POST",
		dataType: "json",
		data: JSON.stringify(data),
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

			if(data == true) {
				window.location.replace("/");
			} else {
				document.getElementById("wrong").style.display="block";
			}
			
		},

		error: function() {
	  		console.log('process error');
		},
	});
}