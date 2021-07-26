let baseUrl = 'https://api.intermedia.net';

///////////////////////////////
// functions for VoiceMails Settings
///////////////////////////////


async function getGreetingContent(token, format, custom){
    let url = baseUrl + '/voice/v2/users/_me/voicemail/greeting?format=' + format + '&custom=' + custom;
    let res;
    
    await makeRequest(token, "GET", url)
        .then(res => res.ok ? res : Promise.reject("Custom greeting is not found"))
        .then(response => response.blob())
        .then(blob => res = blob)
        .catch( error => {
            res = error;
        });
    return res;
}

function resetGreetingContent(token){
    let url = baseUrl + '/voice/v2/users/_me/voicemail/greeting';

    let res;
    makeRequest(token, "DELETE", url).then( (response) => {res = response});    
    return res;         
}

async function updateUserSettings(token, pin, hasCustomGreeting, isTranscriptionPermitted, enableTranscription, receiveEmailNotifications, emails, includeVoiceMail){
    let url = baseUrl + '/voice/v2/users/_me/voicemail/settings';
    let body = {
        "pin": pin,
        "hasCustomGreeting": hasCustomGreeting,
        "isTranscriptionPermitted": isTranscriptionPermitted,
        "enableTranscription": enableTranscription,
        "receiveEmailNotifications": receiveEmailNotifications,
        "emails": [emails],
        "includeVoiceMail": includeVoiceMail
    }
    let res;

    await makeRequest(token, "POST", url, body).then( (response) => { res = response; });     
    return res;       
}

async function uploadGreetingContent(token){
    let url = baseUrl + '/voice/v2/users/_me/voicemail/greeting';
    let formData = new FormData();

    let selectedFile = document.getElementById('greetingFile').files[0];
    formData.append("greetingFile", selectedFile);    

    let res;
    await makeRequest(token, "POST", url, formData, true)
        .then(response => response.ok ? response : Promise.reject("Something goes wrong"))
        .then(response => { res = response});
    return res; 
}

async function getUserSettings(token){
    let url = baseUrl + '/voice/v2/users/_me/voicemail/settings';

    let res;
    await makeRequest(token, "GET", url)
        .then( response => response.json())
        .then( response => { res = response });
    return res;
}

async function getVoicemailUsage(token){
    let url = baseUrl + '/voice/v2/users/_me/voicemail/usage';

    let res;
    await makeRequest(token, "GET", url)
        .then( response => response.json())
        .then( response => { res = response});
    
    return res;
}
