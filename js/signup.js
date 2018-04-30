'user strict';

function signup() {
	let firstname = document.getElementsByName("firstname")[0].value;
	let lastname = document.getElementsByName("lastname")[0].value;
	let email = document.getElementsByName("email")[0].value;
	let username = document.getElementsByName("username")[0].value;
	let password = document.getElementsByName("pass")[0].value;
	let repeatPassword = document.getElementsByName("repeat-pass")[0].value;

	let errMsg = document.getElementById('wrong');

	if(firstname == '' || lastname == '' || email == '' || username == '' || password == '') {
		errMsg.textContent = 'All fields are mandatory!';
		errMsg.style.display = 'block';
		return;
	}

	if(password != repeatPassword) {
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
		 	console.log('process complete');
		},

		success: function(data) {
			console.log(data);
			console.log('process sucess');

			if(data == true) {
				window.location.replace("/");
			} else {
				errMsg.textContent = 'User already exists!';
				errMsg.style.display = 'block';
			}
			
		},

		error: function() {
	  		console.log('process error');
		},
	});
}