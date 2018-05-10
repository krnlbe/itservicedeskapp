"use strict";

function getSeverity() {
  let severitySelect = document.getElementById("severity");
  let severity = severitySelect.options[severitySelect.selectedIndex].text;

  return severity;
}

function getPriority() {
  let prioritySelect = document.getElementById("priority");
  let priority = prioritySelect.options[prioritySelect.selectedIndex].text;

  return priority;
}

function submit() {
  let summary = document.getElementById("summary").value;
  let description = document.getElementById("description").value;
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
  
  let errMsg = "";

  if(!summary) {
    errMsg += "<br/>The 'Summary' field is mandatory.\n";
  }

  if(!description) {
    errMsg += "<br/>The 'Description' field is mandatory.\n";
  }

  if(severity == "Severity") {
    errMsg += "<br/>The 'Severity' field is mandatory.\n";
  }

  if(priority == "Priority") {
    errMsg += "<br/>The 'Priority' field is mandatory.";
  }

  if(errMsg) {
    let errs = document.getElementById("errs");
    errs.innerHTML = errMsg;
    errs.style.display = "block";
  } else {
    if (formData) {
      $.ajax({
        url: "/uploadFile",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
          
        }
      });

      let issueData = {
        summary: summary,
        description: description,
        severity: severity,
        priority: priority,
        file: filename
      };

      $.ajax({
        url: "/logIssue",
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
            $('#successModal').modal('show');

            let btn = document.getElementById("modalOk");

            let span = document.getElementsByClassName("close")[0];

            btn.onclick = function() {
              window.location.replace("/");
            }

            span.onclick = function() {
              window.location.replace("/");
            }
          } else {
            errMsg = 'An error was encountered while sending the data to the server';

            let errs = document.getElementById("errs");
            errs.innerHTML = errMsg;
            errs.style.display = "block";
          }
          
        },

        error: function() {
            console.log('process error');
            window.location.replace("/serverError");
        }
      });
    }
  }  
}

function cancel() {
  window.location.replace("/");
}

let uploadInput = document.getElementById('uploadFile');
uploadInput.onchange = function addAttachIcon() {
  let uploadButton = document.getElementById('attach');
  uploadButton.innerHTML = 'Attach File <img src="/images/icons/attach.png" width=26 height=26>';
};