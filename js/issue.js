"use strict;"

function showEditIssue() {
	$("#editModal").modal("show");
}

function showAssignModal() {
	$("#assignModal").modal("show");
}

function getSeverity() {
  let severitySelect = document.getElementById("editSeverity");
  let severity = severitySelect.options[severitySelect.selectedIndex].text;

  return severity;
}

function getPriority() {
  let prioritySelect = document.getElementById("editPriority");
  let priority = prioritySelect.options[prioritySelect.selectedIndex].text;

  return priority;
}

function submit() {
	let idIssue = document.getElementById("hiddenId").innerHTML;
	let summary = document.getElementById("editSummary").value;
	let description = document.getElementById("editDescription").value;
	let severity = getSeverity();
	let priority = getPriority();
	let fileInput = document.getElementById('uploadFile');
	let file = fileInput.files[0];
	let formData = new FormData();
	formData.append('file', file);

	let filename;
	if(file) {
		filename = file.name;
	}

	if (formData) {
		$.ajax({
			url: "/uploadFile",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				if(response == 'success') {
					console.log('File uploaded successfully!');
				} else if(response == 'fail') {
					console.log('Failed to upload file!');
				}
			}
		});

		let issueData = {
			idIssue: idIssue,
			summary: summary,
			description: description,
			severity: severity,
			priority: priority,
			file: filename
		};

		$.ajax({
			url: "/editIssue",
			type: "POST",
			dataType: "json",
			data: JSON.stringify(issueData),
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
					document.getElementById("summary").innerHTML = summary;
					document.getElementById("description").innerHTML = description
					document.getElementById("severity").innerHTML = severity;
					document.getElementById("priority").innerHTML = priority;
					$("#editModal").modal("hide");
					$("#editSuccess").fadeTo(3000, 500).slideUp(500, function(){
		               	$("#editSuccess").slideUp(500);
		            });
				} else {
					$("#editModal").modal("hide");
					$("#editFail").show();
				}

			},

			error: function() {
				console.log('process error');
				window.location.replace("/serverError");
			}
		});
	}
}

function addAttachIcon() {
  let uploadButton = document.getElementById('attach');
  uploadButton.innerHTML = 'Attach File <img src="/images/icons/attach.png" width=26 height=26>';
};

function assignAutocomplete() {
	$.ajax({
		url: "/assignReq",
		type: "POST",
		cache: false,
		timeout: 5000,
		complete: function() {
			console.log('process complete');
		},

		success: function(userList) {
			console.log(userList);
			console.log('process sucess');

			userList = JSON.parse(userList);

			$('#assign').autocomplete({
			    lookup: userList
			});
		},

		error: function() {
			console.log('process error');
			window.location.replace("/serverError");
		}
	});
}

function assign() {
	let idIssue = document.getElementById("hiddenId").innerHTML;
	let assignee = document.getElementById("assign").value;

	let assignData = {
		idIssue: idIssue,
		assignee: assignee
	};

	$.ajax({
		url: "/assignIssue",
		type: "POST",
		dataType: "json",
		data: JSON.stringify(assignData),
		contentType: "application/json",
		cache: false,
		timeout: 5000,
		complete: function() {
			console.log('process complete');
		},

		success: function(response) {
			console.log(response);
			console.log('process sucess');

			if(response == true) {
				document.getElementById("assignee").innerHTML = assignee;
				$("#assignModal").modal("hide");
				$("#editSuccess").fadeTo(3000, 500).slideUp(500, function() {
	               	$("#editSuccess").slideUp(500);
	            });
			} else {
				$("#assignModal").modal("hide");
				$("#editFail").show();
			}

		},

		error: function() {
			console.log('process error');
			window.location.replace("/serverError");
		}
	});

}

function setStatus() {
	let currentStatus = document.getElementById('status').innerText;
	let nextStatus = document.getElementById('setStatus').innerText;
	let idIssue = document.getElementById("hiddenId").innerHTML;

	let statusData = {
		idIssue: idIssue,
		nextStatus: nextStatus
	};

	$.ajax({
		url: "/issueStatus",
		type: "POST",
		dataType: "json",
		data: JSON.stringify(statusData),
		contentType: "application/json",
		cache: false,
		timeout: 5000,
		complete: function() {
			console.log('process complete');
		},

		success: function(response) {
			console.log(response);
			console.log('process sucess');

			let nextStatusElem = document.getElementById('setStatus');
			let currentStatusElem = document.getElementById('status');
			if(response == true) {
				if(nextStatus == 'IN PROGRESS') {
					nextStatusElem.innerText = 'FIX';
				} else if (nextStatus == 'FIX') {
					nextStatusElem.innerText = 'CLOSE';
				} else if (nextStatus == 'CLOSE') {
					nextStatusElem.innerText = 'REOPEN';
				} else if (nextStatus == 'REOPEN') {
					nextStatusElem.innerText = 'IN PROGRESS';
				}

				if(currentStatus == 'OPEN') {
					currentStatusElem.innerText = 'IN PROGRESS';
				} else if(currentStatus == 'IN PROGRESS') {
					currentStatusElem.innerText = 'FIXED';
				} else if(currentStatus == 'FIXED') {
					currentStatusElem.innerText = 'CLOSED';
				} else if(currentStatus == 'CLOSED') {
					currentStatusElem.innerText = 'OPEN';
				}

				$("#editSuccess").fadeTo(3000, 500).slideUp(500, function() {
	               	$("#editSuccess").slideUp(500);
	            });
			} else {
				$("#editFail").show();
			}

		},

		error: function() {
			console.log('process error');
			window.location.replace("/serverError");
		}
	});	
}

function toggleCommentSection() {
	let commentSection = document.getElementById('commentSection');

	if(commentSection.style.display == 'block') {
		commentSection.style.display = 'none';
	} else {
		commentSection.style.display = 'block';
	}

	window.location.href = "#commentSection";
}

function submitComment() {
	let comment = document.getElementById("commentBox").value;
	let idIssue = document.getElementById("hiddenId").innerHTML;

	let commentData = {
		comment: comment,
		idIssue: idIssue
	};

	$.ajax({
		url: "/issueComment",
		type: "POST",
		dataType: "json",
		data: JSON.stringify(commentData),
		contentType: "application/json",
		cache: false,
		timeout: 5000,
		complete: function() {
			console.log('process complete');
		},

		success: function(response) {
			console.log(response);
			console.log('process sucess');

			if(response.success == true) {
				document.getElementById('commentSection').style.display = 'none';
				document.getElementById('lastComment').style.display = 'block';
				document.getElementById('lastCommentTime').innerHTML = response.date;
				document.getElementById('lastCommentUser').innerHTML = response.firstname + ' ' + response.lastname;
				document.getElementById('lastCommentText').innerHTML = comment;
			} else {
				$("#editFail").show();
			}

		},

		error: function() {
			console.log('process error');
			window.location.replace("/serverError");
		}
	});
}