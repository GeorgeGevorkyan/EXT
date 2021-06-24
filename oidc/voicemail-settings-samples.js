
///////////////////////////////
// functions for VoiceMails Settings
///////////////////////////////

function getGreetingContent(format, custom){
    let access_token = localStorage.getItem("access_token");
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/greeting?format=' + format + '&custom=' + custom;
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){ 
            blob = new Blob([xmlHttp.response], {type : 'audio/' + format});
            let dataUrl = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'greeting.' + format;
            a.click();
        };
    }

    xmlHttp.open("GET", url, true); 
    xmlHttp.responseType = "arraybuffer";
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}
function resetGreetingContent(){
    let access_token = localStorage.getItem("access_token");
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/greeting';
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            log("Custom Greeting deleted")
        }
    }                
    xmlHttp.open("DELETE", url, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}

function updateUserSettings(pin, hasCustomGreeting, isTranscriptionPermitted, enableTranscription, receiveEmailNotifications, emails, includeVoiceMail){
    let access_token = localStorage.getItem("access_token");
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/settings';
    let xmlHttp = new XMLHttpRequest();
    let data_raw = {
        "pin": pin,
        "hasCustomGreeting": hasCustomGreeting,
        "isTranscriptionPermitted": isTranscriptionPermitted,
        "enableTranscription": enableTranscription,
        "receiveEmailNotifications": receiveEmailNotifications,
        "emails": [emails],
        "includeVoiceMail": includeVoiceMail
    }

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            //UI changes
            log("User Settings updated");
        }
    }                
    xmlHttp.open("POST", url, true); 
    xmlHttp.setRequestHeader('Content-Type', 'application/json'); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send(JSON.stringify(data_raw));

}

function uploadGreetingContent(){
    let access_token = localStorage.getItem("access_token");
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/greeting';
    let xmlHttp = new XMLHttpRequest();
    let formData = new FormData();

    let selectedFile = document.getElementById('greetingFile').files[0];
    formData.append("greetingFile", selectedFile);    

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            log("Custom Greeting uploaded");
        }
    }

    xmlHttp.open("POST", url, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send(formData);
}

function getUserSettings(){
    let access_token = localStorage.getItem("access_token");
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/settings';
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){ 
            let response = JSON.parse(xmlHttp.responseText);
            log(response);
        };
    }

    xmlHttp.open("GET", url, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}

function getVoicemailUsage(){
    let access_token = localStorage.getItem("access_token");
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/usage';
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){ 
            let response = JSON.parse(xmlHttp.responseText);
            log(response);
        };
    }

    xmlHttp.open("GET", url, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}

///////////////////////////////
// Event Handlers
///////////////////////////////
document.getElementById('getDefaultGreetingContentMp3').addEventListener("click", () =>{ getGreetingContent("mp3", 0); }, false);
document.getElementById('getDefaultGreetingContentOgg').addEventListener("click", () =>{ getGreetingContent("ogg", 0); }, false);
document.getElementById('getCustomGreetingContentMp3').addEventListener("click", () =>{ getGreetingContent("mp3", 1); }, false);
document.getElementById('getCustomGreetingContentOgg').addEventListener("click", () =>{ getGreetingContent("ogg", 1); }, false);
document.getElementById('uploadGreetingContent').addEventListener("click", () =>{ uploadGreetingContent(); }, false);
document.getElementById('getUserSettings').addEventListener("click", () =>{ getUserSettings(); }, false);
document.getElementById('getVoicemailUsage').addEventListener("click", () =>{ getVoicemailUsage(); }, false);
document.getElementById('updateUserSettings').addEventListener("click", () =>{ updateUserSettings(document.getElementById("pin").value, document.getElementById("hasCustomGreeting").value, document.getElementById("isTranscriptionPermitted").value, document.getElementById("enableTranscription").value, document.getElementById("receiveEmailNotifications").value, document.getElementById("emails").value, document.getElementById("includeVoiceMail").value) }, false);
document.getElementById('resetGreetingContent').addEventListener("click", () =>{ resetGreetingContent(); }, false);
