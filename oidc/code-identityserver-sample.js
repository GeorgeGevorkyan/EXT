// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

document.getElementById('getVoiceMails').addEventListener("click", () =>{ getVoiceMails(0);}, false);
document.getElementById('getVoiceMailsToken').addEventListener("click", () => { getAccessToken("api.user.voice.voicemails");}, false);
document.getElementById('buttonNext').addEventListener("click", () => { getVoiceMails(++pageNumberOfVoicemails * countOnList); }, false);
document.getElementById('buttonPrev').addEventListener("click", () => { getVoiceMails((pageNumberOfVoicemails > 0 ?--pageNumberOfVoicemails:pageNumberOfVoicemails) * countOnList); }, false);
document.getElementById('updateVoiceMailRecordsStatus').addEventListener("click", () =>{ updateVoiceMailRecordsStatus(document.getElementById("updateStatus").value); }, false);
document.getElementById('deleteVoiceMailRecords').addEventListener("click", () =>{ deleteVoiceMailRecords(document.getElementById("deleteStatus").value); }, false);
document.getElementById('getVoiceMailsTotal').addEventListener("click", () =>{ getVoiceMailsTotal(document.getElementById("totalStatus").value); }, false);
document.getElementById('getVoiceMailRecord').addEventListener("click", () =>{ getVoiceMailRecord( document.getElementById("id").value); }, false);
document.getElementById('getGreetingContent').addEventListener("click", () =>{ getGreetingContent(); }, false);
document.getElementById('uploadGreetingContent').addEventListener("click", () =>{ uploadGreetingContent(); }, false);
document.getElementById('getUserSettings').addEventListener("click", () =>{ getUserSettings(); }, false);
document.getElementById('getVoicemailUsage').addEventListener("click", () =>{ getVoicemailUsage(); }, false);
document.getElementById('updateUserSettings').addEventListener("click", () =>{ updateUserSettings(document.getElementById("pin").value, document.getElementById("hasCustomGreeting").value, document.getElementById("isTranscriptionPermitted").value, document.getElementById("enableTranscription").value, document.getElementById("receiveEmailNotifications").value, document.getElementById("emails").value, document.getElementById("includeVoiceMail").value) }, false);
document.getElementById('resetGreetingContent').addEventListener("click", () =>{ resetGreetingContent(); }, false);
document.getElementById('unHiddenVoicemailFunctions').addEventListener("click", () =>{ document.getElementById('VoicemailFunctions').hidden = false; document.getElementById('VoicemailSettingsFunctions').hidden = true  }, false);
document.getElementById('unHiddenVoicemailSettingsFunctions').addEventListener("click", () =>{ document.getElementById('VoicemailFunctions').hidden = true; document.getElementById('VoicemailSettingsFunctions').hidden = false }, false);


///////////////////////////////
// config
///////////////////////////////
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;
let url = location.href.substring(0, location.href.lastIndexOf('/'));

let settings = {
    authority: localStorage.getItem('cfg-authority'),
    client_id: localStorage.getItem('cfg-clientId'),
    redirect_uri: location.href.split('?')[0],
    response_type: 'code',
    scope: '',
    acr_values : localStorage.getItem('cfg-acr'),
    login_hint: localStorage.getItem('cfg-login'),
    extraTokenParams: { acr_values: localStorage.getItem('cfg-acr') }
};

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
function updateList(){
    document.getElementById('buttonCurr').hidden = false;   
    document.getElementById('thead').hidden = false;  
    if (pageNumberOfVoicemails > 0){   
        document.getElementById('buttonPrev').hidden = false;
    }
    else{
        document.getElementById('buttonPrev').hidden = true;   
    }

    if (response["records"].length == countOnList){
        document.getElementById('buttonNext').hidden = false;
    }else{
        document.getElementById('buttonNext').hidden = true;
    }

    let myNode = document.getElementById("table");
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

function getVoiceMails(offset)
{ 
    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails?offset=' + offset + '&countOnList=5';
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            let response = JSON.parse(xmlHttp.responseText);
            //UI changes
            updateList();
         }                
    }
    xmlHttp.open("GET", theUrl, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}

function deleteVoiceMailRecords(status)
{
    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails/_all?status=' + status;
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            //UI changes
            getVoiceMails(pageNumberOfVoicemails * countOnList);
        }
    }                
    xmlHttp.open("DELETE", theUrl, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}

function deleteSelectedVoicemailRecords(ids){
    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails/_selected';
    let xmlHttp = new XMLHttpRequest();
    let data_raw = '{ "ids": [' + ids + '] }';
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            //UI changes
            getVoiceMails(pageNumberOfVoicemails * countOnList);
        }
    }                
    xmlHttp.open("DELETE", theUrl, true); 
    xmlHttp.setRequestHeader('Content-Type', 'application/json'); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send(data_raw);
}

function updateVoiceMailRecordsStatus(status){
    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails/_all/_metadata';
    let xmlHttp = new XMLHttpRequest();

    let data_raw = '{ "status": "' + status + '" }';
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            //UI changes
            getVoiceMails(pageNumberOfVoicemails * countOnList);
        }
    }                
    
    xmlHttp.open("POST", theUrl, true); 
    xmlHttp.setRequestHeader('Content-Type', 'application/json'); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send(data_raw);
}

function updateSelectedVoiceMailRecordsStatus(status, ids){
    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails/_selected/_metadata';
    let xmlHttp = new XMLHttpRequest();

    let data_raw = '{ "ids": [' + ids + '], "status": "' + status + '" }';
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            //UI changes
            getVoiceMails(pageNumberOfVoicemails * countOnList);
        }
    }                
    xmlHttp.open("POST", theUrl, true); 
    xmlHttp.setRequestHeader('Content-Type', 'application/json'); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send(data_raw);
}

/** 
 * 
 * @status "read" or "unread".
 * @return {int} Returns current user total voicemails countOnList.
 */
function getVoiceMailsTotal(status){
    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails/_total?status=' + status;
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            let response = JSON.parse(xmlHttp.responseText);
            log(response);
        }
    }                
    xmlHttp.open("GET", theUrl, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}

function getVoiceMailRecord(id){
    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails/' + id;
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            let response = JSON.parse(xmlHttp.responseText);
            log(response);
        }
    }                
    xmlHttp.open("GET", theUrl, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}

function getVoiceMailsTranscription(id){
    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails/' + id + '/_transcript';
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            response = JSON.parse(xmlHttp.responseText);
            log("Transcript of " + id + " VoiceMails: ");
            log(response["text"]);
        }
    }

    xmlHttp.open("GET", theUrl, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}

function getVoiceMailsContent(format, id){
    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails/' + id + '/_content?format=' + format;
    let xmlHttp = new XMLHttpRequest();
    let blob;
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){ 
            blob = new Blob([xmlHttp.response], {type : 'audio/' + format});
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = id + "." + format;
            a.click();
            };
    }

    xmlHttp.open("GET", theUrl, true); 
    xmlHttp.responseType = "arraybuffer";
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}

function getGreetingContent(){
    format = 'mp3';
    let theUrl = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/greeting?format=' + format + '&custom=0';
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){ 
            blob = new Blob([xmlHttp.response], {type : 'audio/' + format});
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'greeting.' + format;
            a.click();
            };
    }

    xmlHttp.open("GET", theUrl, true); 
    xmlHttp.responseType = "arraybuffer";
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}
function resetGreetingContent()
{
    let theUrl = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/greeting';
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            log("Custom Greeting deleted")
        }
    }                
    xmlHttp.open("DELETE", theUrl, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}

///////////////////////////////
// functions for VoiceMails Settings
///////////////////////////////

function updateUserSettings(pin, hasCustomGreeting, isTranscriptionPermitted, enableTranscription, receiveEmailNotifications, emails, includeVoiceMail){
    let theUrl = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/settings';
    let xmlHttp = new XMLHttpRequest();

    let data_raw = '{"pin": ' + pin + ', "hasCustomGreeting": ' + hasCustomGreeting + ', "isTranscriptionPermitted": ' + isTranscriptionPermitted + ', "enableTranscription":' + enableTranscription +
     ', "receiveEmailNotifications": ' + receiveEmailNotifications + ', "emails": ["user1@example.org", "user2@example.com"], "includeVoiceMail": '+ includeVoiceMail + '}'
    log(data_raw);
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            //UI changes
            log("User Settings updated");
        }
    }                
    xmlHttp.open("POST", theUrl, true); 
    xmlHttp.setRequestHeader('Content-Type', 'application/json'); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send(data_raw);

}

function uploadGreetingContent(){
    let theUrl = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/greeting';
    let xmlHttp = new XMLHttpRequest();
    let formData = new FormData();
    let selectedFile = document.getElementById('greetingFile').files[0];
    formData.append("greetingFile", selectedFile);    

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            log("Custom Greeting uploaded");
        }
    }

    xmlHttp.open("POST", theUrl, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send(formData);
}

function getUserSettings(){
    let theUrl = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/settings';
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){ 
            let response = JSON.parse(xmlHttp.responseText);
            log(response);
            };
    }

    xmlHttp.open("GET", theUrl, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}

function getVoicemailUsage(){
    let theUrl = 'https://api.intermedia.net/voice/v2/users/_me/voicemail/usage';
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){ 
            let response = JSON.parse(xmlHttp.responseText);
            log(response);
            };
    }

    xmlHttp.open("GET", theUrl, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}


///////////////////////////////
// functions for Access Token
///////////////////////////////

let access_token = null;

function getAccessToken(scope){
    settings.scope = scope;
    let mgr = new Oidc.UserManager(settings);
    log("Going to sign in using following configuration", settings);
    mgr.signinRedirect({useReplaceToNavigate:true}).then(function() {
        log("Redirecting to AdSTS...");
    }).catch(function(err) {
        log(err);
    });
}

if (location.search.includes("code=", 1)) {
    let mgr = new Oidc.UserManager(settings);
    mgr.signinCallback(settings).then(function(user) {
        access_token = user.access_token;
        //localStorage.setItem('VoiceMailsToken', access_token);
    }).catch(function(err) {
        log(err);
});
}

