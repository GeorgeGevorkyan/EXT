
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

async function deleteVoiceMailRecords(token, status){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/_all?status=' + status;
    await makeRequest(token, "DELETE", url);
}

async function deleteSelectedVoicemailRecords(token, ids){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/_selected';
    let data_raw = { 
        "ids": [ids] 
    };

    await makeRequest(token, "DELETE", url, data_raw);
}

async function updateVoiceMailRecordsStatus(token, status){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/_all/_metadata';
    let body = { 
        "status": status 
    };

    await makeRequest(token, "POST", url, body);
}

async function updateSelectedVoiceMailRecordsStatus(token, status, ids){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/_selected/_metadata';
    let body = { 
        "ids": [ids],
        "status": status
    };

    await makeRequest(token, "POST", url, body);
}

async function getVoiceMailsTotal(token, status){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/_total?status=' + status;

    let res;
    await makeRequest(token, "GET", url).then((response) => response.json()).then( (response) => {
        res = response;
    });

    return res;
}

async function getVoiceMailRecord(token, id){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/' + id;
    
    let res;

    await makeRequest(token, "GET", url)
        .then((response) => response.json())
        .then((response) => res = response);
    
    return res;
}


async function getVoiceMailsTranscription(token, id){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/' + id + '/_transcript';
   
    let res;
    await makeRequest(token, "GET", url)
        .then((response) => response.json())
        .then( (response) => {
            res = response["text"];
        });
    
    return res;
}

async function getVoiceMailsContent(token, format, id){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/' + id + '/_content?format=' + format;

    let res;
    await makeRequest(token, "GET", url)
        .then(response => response.blob())
        .then(blob => {
            res = blob;
        });
    return res;
}
