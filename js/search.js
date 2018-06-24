"use strict;"

function search() {
	let searchText = document.getElementById('searchBar').value;

	let regex = new RegExp('^[0-9]+$');
	if(regex.test(searchText)) {
		let searchData = {
			idIssue: searchText
		};

		$.ajax({
			url: "/getIssue",
			type: "POST",
			dataType: "json",
			data: JSON.stringify(searchData),
			contentType: "application/json",
			cache: false,
			timeout: 5000,
			complete: function() {
				console.log('process complete');
			},
			success: function (response) {
				if(response) {
					window.location.replace('/ITSD-' + searchText);
				}
			}
		});
	} else if(searchText) {
		let searchData = {
			searchToken: searchText
		};
		$.ajax({
			url: "/searchIssues",
			type: "GET",
			data: searchData,
			cache: false,
			timeout: 5000,
			complete: function() {
				console.log('process complete');
			},
			success: function (response) {
				// alert(response);
				$(document.body).html(response);
			},
			error: function (xhr, status, error) {
				alert(error);
			}
		});
	} else {
		window.location.replace("/search");
	}

	
}