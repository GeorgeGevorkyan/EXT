///////////////////////////////
// functions for VoiceMails Settings
///////////////////////////////
function makeRequest(method, url, post_type, data_raw){
    let access_token = localStorage.getItem("access_token");
    let options = {
        method: method,
        headers: {
            'Authorization': `Bearer ` + access_token
        }
    };

    if(data_raw){
        if(post_type == "file"){
            options["body"] = data_raw;
        }else{
        options["headers"]["Content-Type"] = 'application/json';
        options["body"] = JSON.stringify(data_raw);
        }
    }

    return fetch(url, options);
}

function getGreetingContent(format, custom){
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/greeting?format=' + format + '&custom=' + custom;
    makeRequest("GET", url)
    .then(response => response.blob())
    .then(blob => {
        let dataUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'greeting.' + format;
        a.click();
    })
    .catch( error => {
        log(error);
    });
}

function resetGreetingContent(){
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/greeting';

    makeRequest("DELETE", url).then(response => {
        log("Custom Greeting deleted")
    });             
}

function updateUserSettings(pin, hasCustomGreeting, isTranscriptionPermitted, enableTranscription, receiveEmailNotifications, emails, includeVoiceMail){
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/settings';
    let data_raw = {
        "pin": pin,
        "hasCustomGreeting": hasCustomGreeting,
        "isTranscriptionPermitted": isTranscriptionPermitted,
        "enableTranscription": enableTranscription,
        "receiveEmailNotifications": receiveEmailNotifications,
        "emails": [emails],
        "includeVoiceMail": includeVoiceMail
    }

    makeRequest("POST", url, data_raw).then(response => {
        //UI changes
        log("User Settings updated");
    });            
}

function uploadGreetingContent(){
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/greeting';
    let formData = new FormData();

    let selectedFile = document.getElementById('greetingFile').files[0];
    formData.append("greetingFile", selectedFile);    

    makeRequest("POST", url, formData).then(response => {
            log("Custom Greeting uploaded");
    });
}

function getUserSettings(){
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/settings';

    makeRequest("GET", url).then( response => response.json()).then( response => {
        log(response);
    });
}

function getVoicemailUsage(){
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/usage';

    makeRequest("GET", url).then( response => response.json()).then( response => {
        log(response);
    });
}

///////////////////////////////
// Event Handlers
///////////////////////////////
document.getElementById('getDefaultGreetingContentMp3').addEventListener("click", () =>{ getGreetingContent("mp3", 0); });
document.getElementById('getDefaultGreetingContentOgg').addEventListener("click", () =>{ getGreetingContent("ogg", 0); });
document.getElementById('getCustomGreetingContentMp3').addEventListener("click", () =>{ getGreetingContent("mp3", 1); });
document.getElementById('getCustomGreetingContentOgg').addEventListener("click", () =>{ getGreetingContent("ogg", 1); });
document.getElementById('uploadGreetingContent').addEventListener("click", () =>{ uploadGreetingContent(); });
document.getElementById('getUserSettings').addEventListener("click", () =>{ getUserSettings(); });
document.getElementById('getVoicemailUsage').addEventListener("click", () =>{ getVoicemailUsage(); });
document.getElementById('resetGreetingContent').addEventListener("click", () =>{ resetGreetingContent(); });
document.getElementById('updateUserSettings').addEventListener("click", () =>{ 
    updateUserSettings(document.getElementById("pin").value,
    document.getElementById("hasCustomGreeting").value, 
    document.getElementById("isTranscriptionPermitted").value, 
    document.getElementById("enableTranscription").value,
    document.getElementById("receiveEmailNotifications").value,
    document.getElementById("emails").value,
    document.getElementById("includeVoiceMail").value);
});