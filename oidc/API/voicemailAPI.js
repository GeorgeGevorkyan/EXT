
///////////////////////////////
// functions for VoiceMails
///////////////////////////////
function makeRequest(token, method, url, data_raw){
    let access_token = localStorage.getItem("access_token");
    let options = {
        method: method,
        headers: {
            'Authorization': `Bearer ` + access_token
        }
    };

    if(data_raw){
        options["headers"]["Content-Type"] = 'application/json';
        options["body"] = JSON.stringify(data_raw);
    }

    return fetch(url, options);
}

function getVoiceMails(token, offset){ 
    let url = 'https://api.intermedia.net/voice/v2/voicemails?offset=' + offset + '&count=' + countOnList;
    makeRequest(token, "GET", url).then((response) => response.json()).then((response) => {updateList(response);});
}

function deleteVoiceMailRecords(token, status){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/_all?status=' + status;
    makeRequest(token, "DELETE", url).then( () => {
        getVoiceMails(pageNumberOfVoicemails * countOnList);
    });
}

function deleteSelectedVoicemailRecords(token, ids){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/_selected';
    let data_raw = { 
        "ids": [ids] 
    };

    makeRequest(token, "DELETE", url, data_raw).then( () => {
            getVoiceMails(pageNumberOfVoicemails * countOnList);
    });
}

function updateVoiceMailRecordsStatus(token, status){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/_all/_metadata';
    let data_raw = { 
        "status": status 
    };

    makeRequest(token, "POST", url, data_raw).then( () => {
        //UI changes
        getVoiceMails(pageNumberOfVoicemails * countOnList);
    });
}

function updateSelectedVoiceMailRecordsStatus(token, status, ids){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/_selected/_metadata';
    let data_raw = { 
        "ids": [ids],
        "status": status
    };

    makeRequest(token, "POST", url, data_raw).then( () => {
        //UI changes
        getVoiceMails(pageNumberOfVoicemails * countOnList);
    });      
}

function getVoiceMailsTotal(token, status){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/_total?status=' + status;

    makeRequest(token, "GET", url).then((response) => response.json()).then( (response) => {
        log(response);
    });
}

function getVoiceMailRecord(token, id){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/' + id;
    
    makeRequest(token, "GET", url).then((response) => response.json()).then( (response) => {
        log(response);
    });
}

function getVoiceMailsTranscription(token, id){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/' + id + '/_transcript';
   
    makeRequest(token, "GET", url).then((response) => response.json()).then( (response) => {
        log("Transcript of " + id + " VoiceMails: ");
        log(response["text"]);
    });
}

function getVoiceMailsContent(token, format, id){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/' + id + '/_content?format=' + format;

    makeRequest("GET", url)
        .then(response => response.blob())
        .then(blob => {
        let dataUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = dataUrl;
        a.download = id + "." + format;
        a.click();});
}
