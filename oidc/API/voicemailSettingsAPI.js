///////////////////////////////
// functions for VoiceMails Settings
///////////////////////////////


function getGreetingContent(token, format, custom){
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/greeting?format=' + format + '&custom=' + custom;
    makeRequest(token, "GET", url)
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

function resetGreetingContent(token){
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/greeting';

    makeRequest(token, "DELETE", url).then( () => {
        log("Custom Greeting deleted")
    });             
}

function updateUserSettings(token, pin, hasCustomGreeting, isTranscriptionPermitted, enableTranscription, receiveEmailNotifications, emails, includeVoiceMail){
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/settings';
    let body = {
        "pin": pin,
        "hasCustomGreeting": hasCustomGreeting,
        "isTranscriptionPermitted": isTranscriptionPermitted,
        "enableTranscription": enableTranscription,
        "receiveEmailNotifications": receiveEmailNotifications,
        "emails": [emails],
        "includeVoiceMail": includeVoiceMail
    }

    makeRequest(token, "POST", url, body).then( () => {
        //UI changes
        log("User Settings updated");
    });            
}

function uploadGreetingContent(token){
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/greeting';
    let formData = new FormData();

    let selectedFile = document.getElementById('greetingFile').files[0];
    formData.append("greetingFile", selectedFile);    

    makeRequest(token, "POST", url, formData, true)
    .then(response => response.ok ? response : Promise.reject("Something goes wrong"))
    .then(response => { log("Custom Greeting uploaded");
    });
}

function getUserSettings(token){
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/settings';

    makeRequest(token, "GET", url)
    .then( response => response.json())
    .then( response => { log(response);
    });
}

async function getVoicemailUsage(token){
    let url = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/usage';

    let res;
    await makeRequest(token, "GET", url)
        .then( response => response.json())
        .then( response => { res = response});
    
    return res;
}
