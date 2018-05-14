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