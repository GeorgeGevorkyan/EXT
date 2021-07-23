
///////////////////////////////
// functions for VoiceMails
///////////////////////////////

async function getVoiceMails(token, offset, countOnList){ 
    let url = 'https://api.intermedia.net/voice/v2/voicemails?offset=' + offset + '&count=' + countOnList;
    let res;
    await makeRequest(token, "GET", url)
        .then((response) => response.json())
        .then((response) => { res = response });
    return res;
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
    let body = { 
        "status": status 
    };

    makeRequest(token, "POST", url, body).then( () => {
        //UI changes
        getVoiceMails(pageNumberOfVoicemails * countOnList);
    });
}

function updateSelectedVoiceMailRecordsStatus(token, status, ids){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/_selected/_metadata';
    let body = { 
        "ids": [ids],
        "status": status
    };

    makeRequest(token, "POST", url, body).then( () => {
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

    makeRequest(token, "GET", url)
        .then(response => response.blob())
        .then(blob => {
        let dataUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = dataUrl;
        a.download = id + "." + format;
        a.click();});
}
