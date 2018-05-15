"use strict;"

function search() {
	let searchText = document.getElementById('searchBar').value;

	let regex = new RegExp('^[0-9]+$');
	if(regex.test(searchText)) {
		let searchData = {
			idIssue: searchText
		};

		$.ajax({
			url: "/searchIssue",
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
			},
			error: function (jqXHR, textStatus, errorThrown) {

			}
	});
	} else {

	}

	
}