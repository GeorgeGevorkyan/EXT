///////////////////////////////
// functions for VoiceMails Settings
///////////////////////////////


function getGreetingContent(format, custom){
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/greeting?format=' + format + '&custom=' + custom;
    makeRequest("GET", url)
    .then(res => res.ok ? res : Promise.reject("Custom greeting is not found"))
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

    makeRequest("DELETE", url).then( () => {
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

    makeRequest("POST", url, false, data_raw).then( () => {
        //UI changes
        log("User Settings updated");
    });            
}

function uploadGreetingContent(){
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/greeting';
    let formData = new FormData();

    let selectedFile = document.getElementById('greetingFile').files[0];
    formData.append("greetingFile", selectedFile);    

    makeRequest("POST", url, true, formData)
    .then(response => response.ok ? response : Promise.reject("Something goes wrong"))
    .then(response => { log("Custom Greeting uploaded");
    });
}

function getUserSettings(){
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/settings';

    makeRequest("GET", url)
    .then( response => response.json())
    .then( response => { log(response);
    });
}

function getVoicemailUsage(){
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/usage';

    makeRequest("GET", url)
    .then( response => response.json())
    .then( response => { log(response);
    });
}
