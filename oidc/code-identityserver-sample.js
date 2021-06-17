// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

let count = 5;
let pageNumber = 0;

document.getElementById('getVoiceMails').addEventListener("click",() =>{ getVoiceMails(0);}, false);
document.getElementById('getVoiceMailsToken').addEventListener("click",() => { getAccessToken("api.user.voice.voicemails");}, false);
document.getElementById('buttonNext').addEventListener("click", () => { getVoiceMails(++pageNumber * count); }, false);
document.getElementById('buttonPrev').addEventListener("click", () => { getVoiceMails((pageNumber > 0 ?--pageNumber:pageNumber) * count); }, false);
document.getElementById('updateVoiceMailRecordsStatus').addEventListener("click",() =>{ updateVoiceMailRecordsStatus(document.getElementById("status").value); }, false);
document.getElementById('deleteVoiceMailRecords').addEventListener("click",() =>{ deleteVoiceMailRecords(document.getElementById("deleteStatus").value); }, false);
document.getElementById('getVoiceMailsTotal').addEventListener("click",() =>{ getVoiceMailsTotal(); }, false);
document.getElementById('getVoiceMailRecord').addEventListener("click",() =>{ getVoiceMailRecord( document.getElementById("id").value); }, false);


///////////////////////////////
// config
///////////////////////////////
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;
console.log("Using oidc-client version: ", Oidc.Version);
let url = location.href.substring(0, location.href.lastIndexOf('/'));

let settings = {
    // authority: localStorage.getItem('cfg-authority'),
    // client_id: localStorage.getItem('cfg-clientId'),
    authority: "https://login.intermedia.net/user",
    client_id: "BSTHred8hUOjxvZ0lMrdQ",
    redirect_uri: location.href.split('?')[0],
    response_type: 'code',
    scope: '',
    // acr_values : localStorage.getItem('cfg-acr'),
    acr_values: "deviceId:7f8b3ae9-f073-4b1e-b5af-468cb7432ad2",
    // login_hint: localStorage.getItem('cfg-login'),
    login_hint: "MrprodUser@test.net",
    // extraTokenParams: { acr_values: localStorage.getItem('cfg-acr') }
    extraTokenParams: { acr_values: "deviceId:7f8b3ae9-f073-4b1e-b5af-468cb7432ad2" }
};

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

///////////////////////////////
// functions for VoiceMails
///////////////////////////////


function getVoiceMails(offset)
{
    document.getElementById('buttonCurr').hidden = false;   
    document.getElementById('thead').hidden = false;   
    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails?offset=' + offset + '&count=5';
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            let response = JSON.parse(xmlHttp.responseText);
            if (pageNumber > 0){   
                document.getElementById('buttonPrev').hidden = false;
            }
            else{
                document.getElementById('buttonPrev').hidden = true;   
            }
            if (response["records"].length == count){
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
             
             document.getElementById('buttonCurr').innerHTML = pageNumber + 1;
             document.getElementById('buttonPrev').innerHTML = pageNumber;
             document.getElementById('buttonNext').innerHTML = pageNumber + 2;
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
            getVoiceMails(pageNumber * count);
        }
    }                
    xmlHttp.open("DELETE", theUrl, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}

function updateVoiceMailRecordsStatus(status){
    status = document.getElementById("status").value;
    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails/_all/_metadata';
    let xmlHttp = new XMLHttpRequest();

    let data_raw = '{ "status": "' + status + '" }';
    log(data_raw);
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            //UI changes
            getVoiceMails(pageNumber * count);
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
            getVoiceMails(pageNumber * count);
        }
    }                
    xmlHttp.open("POST", theUrl, true); 
    xmlHttp.setRequestHeader('Content-Type', 'application/json'); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send(data_raw);
}

/**
 * Summary. (use period)
 *
 * Description. (use period)
 * @param {status} "read" or "unread".
 * @return {int} Returns current user total voicemails count.
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

function deleteSelectedVoicemailRecords(ids){
    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails/_selected';
    let xmlHttp = new XMLHttpRequest();
    let data_raw = '{ "ids": [' + ids + '] }';
    log(data_raw);
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            //UI changes
            getVoiceMails(pageNumber * count);
        }
    }                
    xmlHttp.open("DELETE", theUrl, true); 
    xmlHttp.setRequestHeader('Content-Type', 'application/json'); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send(data_raw);
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
let idNumber = 0;
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
    td8.appendChild(button8);
    button8.setAttribute('id', "button" + idNumber);
    document.getElementById('button' + idNumber).addEventListener("click", () => { getVoiceMailsTranscription(tr["id"]); }, false);
    idNumber++;

    let td9 = document.createElement('td');
    element.appendChild(td9);
    td9.setAttribute('id', "td" + idNumber);
    let button9 = document.createElement('button');
    td9.appendChild(button9);
    button9.setAttribute('id', "button" + idNumber);
    document.getElementById('button' + idNumber).addEventListener("click", () => {  getVoiceMailsContent(tr["id"]); }, false);
    idNumber++;

    let td10 = document.createElement('td');
    element.appendChild(td10);
    td10.setAttribute('id', "td" + idNumber);
    let button10 = document.createElement('button');
    td10.appendChild(button10);
    button10.setAttribute('id', "button" + idNumber);
    document.getElementById('button' + idNumber).addEventListener("click", () => {  deleteSelectedVoicemailRecords(tr["id"]);  }, false);
    idNumber++;

    let td11 = document.createElement('td');
    element.appendChild(td11);
    td11.setAttribute('id', "td" + idNumber);
    let button11 = document.createElement('button');
    td11.appendChild(button11);
    button11.setAttribute('id', "button" + idNumber);
    document.getElementById('button' + idNumber).addEventListener("click", () => { updateSelectedVoiceMailRecordsStatus(tr["status"] == "read"?"unread": "read", tr["id"]);  getVoiceMails(pageNumber * count); }, false);
    idNumber++;
}

function getVoiceMailsContent(id){
    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails/' + id + '/_content?format=ogg';
    let xmlHttp = new XMLHttpRequest();
    let blob;
    var context;
    var source;
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){ 
            blob = new Blob([xmlHttp.response], {type : 'audio/ogg'});
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = id + ".ogg";
            a.click();
            };
    }

    xmlHttp.open("GET", theUrl, true); 
    xmlHttp.responseType = "arraybuffer";
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}
//////////////////////////////



if (location.search.includes("code=", 1)) {
    let mgr = new Oidc.UserManager(settings);
    mgr.signinCallback(settings).then(function(user) {
        access_token = user.access_token;
        //localStorage.setItem('VoiceMailsToken', access_token);
    }).catch(function(err) {
        log(err);
});
}

