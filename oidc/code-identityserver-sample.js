// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

document.getElementById('getVoiceMails').addEventListener("click", getVoiceMails, false);
document.getElementById('getVoiceMailsTranscription').addEventListener("click", () => { getVoiceMailsTranscription();}, false);
document.getElementById('getVoiceMailsContent').addEventListener("click",() => { getVoiceMailsContent();}, false);
document.getElementById('getVoiceMailsToken').addEventListener("click",() => { getAccessToken("api.user.voice.voicemails");}, false);
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

let count = 5;
let pageNumber = 0;
function getVoiceMails(offset = 0)
{

    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails?offset=' + offset + '&count=5';
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            response = JSON.parse(xmlHttp.responseText);
            log("All detected VoiceMails: ");
            for (let index = 0; index < response["records"].length; index++) {
                createNewTr(response["records"][index]);
            }
            pageNumber++;
            let a = document.createElement("a");
            element.appendChild(a);
            td.setAttribute('id', "a"+ pageNumber);
            document.getElementById('a'+ pageNumber).innerHTML = pageNumber;
            document.getElementById('a'+ pageNumber).click = () => { getVoiceMails(pageNumber * count); };
            pageNumber++;
            
        }
    }

    xmlHttp.open("GET", theUrl, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}
function getVoiceMailsTranscription(id)
{
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
    button8.setAttribute('id', "button" + idNumber);
    td8.appendChild(button8);
    document.getElementById('button' + idNumber).click = () => { getVoiceMailsTranscription(tr["id"]); };
    idNumber++;

    let td9 = document.createElement('td');
    element.appendChild(td9);
    td9.setAttribute('id', "td" + idNumber);
    let button9 = document.createElement('button');
    button9.setAttribute('id', "button" + idNumber);
    td9.appendChild(button9);
    document.getElementById('button' + idNumber).click = () => { getVoiceMailsContent(tr["id"]); };
    idNumber++;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function getVoiceMailsContent(id){
    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails/' + id + '/_content?format=ogg';
    let xmlHttp = new XMLHttpRequest();
    let blob;
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            blob = new Blob([xmlHttp.responseText], {type : 'audio/ogg'});
            let url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "1.ogg";
            a.click();
        }
    }

    xmlHttp.open("GET", theUrl, true); 
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

