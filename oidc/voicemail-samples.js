///////////////////////////////
// functions for UI 
///////////////////////////////

const countOnList = 5; //amount on Voicemail list
let pageNumberOfVoicemails = 0;

function createNewTr(tr){
    let tableRow = document.createElement('tr');
    document.getElementById('table').appendChild(tableRow);
    
    let td = document.createElement('td');
    tableRow.appendChild(td);
    td.innerText = tr["id"];
    
    let td2 = document.createElement('td');
    tableRow.appendChild(td2);
    td2.innerText = tr["sender"]["phoneNumber"];

    let td3 = document.createElement('td');
    tableRow.appendChild(td3);
    td3.innerText = tr["sender"]["displayName"];

    let td4 = document.createElement('td');
    tableRow.appendChild(td4);
    td4.innerText = tr["status"];

    let td5 = document.createElement('td');
    tableRow.appendChild(td5);
    td5.innerText = tr["duration"];

    let td6 = document.createElement('td');
    tableRow.appendChild(td6);
    td6.innerText = tr["whenCreated"];

    let td7 = document.createElement('td');
    tableRow.appendChild(td7);
    td7.innerText = tr["hasText"];

    let td8 = document.createElement('td');
    tableRow.appendChild(td8);
    let button8 = document.createElement('button');
    button8.innerHTML = "Transcription";
    td8.appendChild(button8);
    button8.addEventListener("click", () => { getVoiceMailsTranscription(tr["id"]); }, false);

    let td9 = document.createElement('td');
    tableRow.appendChild(td9);
    let oggButton = document.createElement('button');
    oggButton.innerHTML = "ogg";
    td9.appendChild(oggButton);
    oggButton.addEventListener("click", () => {  getVoiceMailsContent("ogg", tr["id"]);});

    let mp3Button = document.createElement('button');
    mp3Button.innerHTML = "mp3";
    td9.appendChild(mp3Button);
    mp3Button.addEventListener("click", () => {  getVoiceMailsContent("mp3", tr["id"]);});

    let td10 = document.createElement('td');
    tableRow.appendChild(td10);
    let button10 = document.createElement('button');
    button10.innerHTML = "Delete";
    td10.appendChild(button10);
    button10.addEventListener("click", () => {  deleteSelectedVoicemailRecords(tr["id"]); });

    let td11 = document.createElement('td');
    tableRow.appendChild(td11);
    let button11 = document.createElement('button');
    button11.innerHTML = "Change Status";
    td11.appendChild(button11);
    button11.addEventListener("click", () => { updateSelectedVoiceMailRecordsStatus(tr["status"] == "read"?"unread": "read", tr["id"]);  getVoiceMails(pageNumberOfVoicemails * countOnList); });
}

function updateList(response){
    let tableNode = document.getElementById("table");
    document.getElementById('buttonCurr').hidden = false;   
    document.getElementById('thead').hidden = false;  

    if (pageNumberOfVoicemails > 0) {   
        document.getElementById('buttonPrev').hidden = false;
    } else{
        document.getElementById('buttonPrev').hidden = true;   
    }

    if (response["records"].length == countOnList) {
        document.getElementById('buttonNext').hidden = false;
    } else{
        document.getElementById('buttonNext').hidden = true;
    }

    while (tableNode.childNodes.length > 2) {
        tableNode.removeChild(tableNode.lastChild);
    }

    for (let index = 0; index < response["records"].length; index++) {
        createNewTr(response["records"][index]);
    }   
     
    document.getElementById('buttonCurr').innerHTML = pageNumberOfVoicemails + 1;
    document.getElementById('buttonPrev').innerHTML = pageNumberOfVoicemails;
    document.getElementById('buttonNext').innerHTML = pageNumberOfVoicemails + 2;
}

///////////////////////////////
// functions for VoiceMails
///////////////////////////////
function makeRequest(method, url, data_raw){
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

function getVoiceMails(offset){ 
    let url = 'https://api.intermedia.net/voice/v2/voicemails?offset=' + offset + '&count=' + countOnList;
    makeRequest("GET", url).then((response) => response.json()).then((response) => {updateList(response);});
}

function deleteVoiceMailRecords(status){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/_all?status=' + status;
    makeRequest("DELETE", url).then( () => {
        getVoiceMails(pageNumberOfVoicemails * countOnList);
    });
}

function deleteSelectedVoicemailRecords(ids){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/_selected';
    let data_raw = { 
        "ids": [ids] 
    };

    makeRequest("DELETE", url, data_raw).then( () => {
            getVoiceMails(pageNumberOfVoicemails * countOnList);
    });
}

function updateVoiceMailRecordsStatus(status){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/_all/_metadata';
    let data_raw = { 
        "status": status 
    };

    makeRequest("POST", url, data_raw).then( () => {
        //UI changes
        getVoiceMails(pageNumberOfVoicemails * countOnList);
    });
}

function updateSelectedVoiceMailRecordsStatus(status, ids){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/_selected/_metadata';
    let data_raw = { 
        "ids": [ids],
        "status": status
    };

    makeRequest("POST", url, data_raw).then( () => {
        //UI changes
        getVoiceMails(pageNumberOfVoicemails * countOnList);
    });      
}

function getVoiceMailsTotal(status){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/_total?status=' + status;

    makeRequest("GET", url).then((response) => response.json()).then( (response) => {
        log(response);
    });
}

function getVoiceMailRecord(id){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/' + id;
    
    makeRequest("GET", url).then((response) => response.json()).then( (response) => {
        log(response);
    });
}

function getVoiceMailsTranscription(id){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/' + id + '/_transcript';
   
    makeRequest("GET", url).then((response) => response.json()).then( (response) => {
        log("Transcript of " + id + " VoiceMails: ");
        log(response["text"]);
    });
}

function getVoiceMailsContent(format, id){
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

///////////////////////////////
// Event Handlers
///////////////////////////////
document.getElementById('getVoiceMails').addEventListener("click", () =>{ getVoiceMails(0);});
document.getElementById('buttonNext').addEventListener("click", () => { getVoiceMails(++pageNumberOfVoicemails * countOnList); });
document.getElementById('buttonPrev').addEventListener("click", () => { getVoiceMails((pageNumberOfVoicemails > 0 ?--pageNumberOfVoicemails:pageNumberOfVoicemails) * countOnList); });
document.getElementById('updateVoiceMailRecordsStatus').addEventListener("click", () =>{ updateVoiceMailRecordsStatus(document.getElementById("updateStatus").value); });
document.getElementById('deleteVoiceMailRecords').addEventListener("click", () =>{ deleteVoiceMailRecords(document.getElementById("deleteStatus").value); });
document.getElementById('getVoiceMailsTotal').addEventListener("click", () =>{ getVoiceMailsTotal(document.getElementById("totalStatus").value); });
document.getElementById('getVoiceMailRecord').addEventListener("click", () =>{ getVoiceMailRecord( document.getElementById("id").value); });
