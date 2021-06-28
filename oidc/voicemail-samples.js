

///////////////////////////////
// functions for UI elements
///////////////////////////////

let idNumber = 0;
const countOnList = 5; //amount on Voicemail list
let pageNumberOfVoicemails = 0;

function createNewTr(tr){
    let element = document.createElement('tr');
    document.getElementById('table').appendChild(element);
    
    let td = document.createElement('td');
    element.appendChild(td);
    td.setAttribute('id', "td"+ idNumber);
    document.getElementById('td'+ idNumber).innerText = tr["id"];
    idNumber++;
    
    let td2 = document.createElement('td');
    element.appendChild(td2);
    td2.setAttribute('id', "td" + idNumber);
    document.getElementById('td' + idNumber).innerText = tr["sender"]["phoneNumber"];
    idNumber++;

    let td3 = document.createElement('td');
    element.appendChild(td3);
    td3.setAttribute('id', "td" + idNumber);
    document.getElementById('td' + idNumber).innerText = tr["sender"]["displayName"];
    idNumber++;

    let td4 = document.createElement('td');
    element.appendChild(td4);
    td4.setAttribute('id', "td" + idNumber);
    document.getElementById('td' + idNumber).innerText = tr["status"];
    idNumber++;

    let td5 = document.createElement('td');
    element.appendChild(td5);
    td5.setAttribute('id', "td" + idNumber);
    document.getElementById('td' + idNumber).innerText = tr["duration"];
    idNumber++;

    let td6 = document.createElement('td');
    element.appendChild(td6);
    td6.setAttribute('id', "td" + idNumber);
    document.getElementById('td' + idNumber).innerText = tr["whenCreated"];
    idNumber++;

    let td7 = document.createElement('td');
    element.appendChild(td7);
    td7.setAttribute('id', "td" + idNumber);
    document.getElementById('td' + idNumber).innerText = tr["hasText"];
    idNumber++;

    let td8 = document.createElement('td');
    element.appendChild(td8);
    td8.setAttribute('id', "td" + idNumber);
    let button8 = document.createElement('button');
    button8.innerHTML = "Transcription";
    td8.appendChild(button8);
    button8.setAttribute('id', "button" + idNumber);
    document.getElementById('button' + idNumber).addEventListener("click", () => { getVoiceMailsTranscription(tr["id"]); }, false);
    idNumber++;

    let td9 = document.createElement('td');
    element.appendChild(td9);
    td9.setAttribute('id', "td" + idNumber);
    let oggButton = document.createElement('button');
    oggButton.innerHTML = "ogg";
    td9.appendChild(oggButton);
    oggButton.setAttribute('id', "button" + idNumber);
    document.getElementById('button' + idNumber).addEventListener("click", () => {  getVoiceMailsContent("ogg", tr["id"]); }, false);
    idNumber++;
    let mp3Button = document.createElement('button');
    mp3Button.innerHTML = "mp3";
    td9.appendChild(mp3Button);
    mp3Button.setAttribute('id', "button" + idNumber);
    document.getElementById('button' + idNumber).addEventListener("click", () => {  getVoiceMailsContent("mp3", tr["id"]); }, false);
    idNumber++;

    let td10 = document.createElement('td');
    element.appendChild(td10);
    td10.setAttribute('id', "td" + idNumber);
    let button10 = document.createElement('button');
    button10.innerHTML = "Delete";
    td10.appendChild(button10);
    button10.setAttribute('id', "button" + idNumber);
    document.getElementById('button' + idNumber).addEventListener("click", () => {  deleteSelectedVoicemailRecords(tr["id"]);  }, false);
    idNumber++;

    let td11 = document.createElement('td');
    element.appendChild(td11);
    td11.setAttribute('id', "td" + idNumber);
    let button11 = document.createElement('button');
    button11.innerHTML = "Change Status";
    td11.appendChild(button11);
    button11.setAttribute('id', "button" + idNumber);
    document.getElementById('button' + idNumber).addEventListener("click", () => { updateSelectedVoiceMailRecordsStatus(tr["status"] == "read"?"unread": "read", tr["id"]);  getVoiceMails(pageNumberOfVoicemails * countOnList); }, false);
    idNumber++;
}

function updateList(response){
    let myNode = document.getElementById("table");
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

    while (myNode.childNodes.length > 2) {
        myNode.removeChild(myNode.lastChild);
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

    return fetch(url, options).then(response => response.json());
}

function getVoiceMails(offset){ 
    let url = 'https://api.intermedia.net/voice/v2/voicemails?offset=' + offset + '&count=' + countOnList;
    makeRequest("GET", url).then( json => {
        //UI changes
        log(json);
        updateList(json);
    });
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

    makeRequest("GET", url).then( (response) => {
        log(JSON.parse(response));
    });
}

function getVoiceMailRecord(id){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/' + id;
    
    makeRequest("GET", url).then( (response) => {
        log(JSON.parse(response));
    });
}

function getVoiceMailsTranscription(id){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/' + id + '/_transcript';
   
    makeRequest("GET", url).then( (response) => {
        log("Transcript of " + id + " VoiceMails: ");
        log(JSON.parse(response)["text"]);
    });
}

function getVoiceMailsContent(format, id){
    let url = 'https://api.intermedia.net/voice/v2/voicemails/' + id + '/_content?format=' + format;
    let blob;

    makeRequest("GET", url).then( (response) => {
        blob = new Blob([response.arrayBuffer()], {type : 'audio/' + format});
        let dataUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = dataUrl;
        a.download = id + "." + format;
        a.click();
    });
}

///////////////////////////////
// Event Handlers
///////////////////////////////
document.getElementById('getVoiceMails').addEventListener("click", () =>{ getVoiceMails(0);}, false);
document.getElementById('buttonNext').addEventListener("click", () => { getVoiceMails(++pageNumberOfVoicemails * countOnList); }, false);
document.getElementById('buttonPrev').addEventListener("click", () => { getVoiceMails((pageNumberOfVoicemails > 0 ?--pageNumberOfVoicemails:pageNumberOfVoicemails) * countOnList); }, false);
document.getElementById('updateVoiceMailRecordsStatus').addEventListener("click", () =>{ updateVoiceMailRecordsStatus(document.getElementById("updateStatus").value); }, false);
document.getElementById('deleteVoiceMailRecords').addEventListener("click", () =>{ deleteVoiceMailRecords(document.getElementById("deleteStatus").value); }, false);
document.getElementById('getVoiceMailsTotal').addEventListener("click", () =>{ getVoiceMailsTotal(document.getElementById("totalStatus").value); }, false);
document.getElementById('getVoiceMailRecord').addEventListener("click", () =>{ getVoiceMailRecord( document.getElementById("id").value); }, false);
