// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


document.getElementById('getVoiceMails').addEventListener("click", GetVoiceMails, false);
document.getElementById('getVoiceMailsToken').addEventListener("click", getAccessToken("api.user.voice.voicemails"), false);
///////////////////////////////
// config
///////////////////////////////
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;
console.log("Using oidc-client version: ", Oidc.Version);
access_token = null;
var url = location.href.substring(0, location.href.lastIndexOf('/'));

var settings = {
    authority: localStorage.getItem('cfg-authority'),
    client_id: localStorage.getItem('cfg-clientId'),
    redirect_uri: location.href.split('?')[0],
    response_type: 'code',
    //scope: localStorage.getItem('cfg-scopes'),
    scope: '',
    acr_values : localStorage.getItem('cfg-acr'),
    login_hint: localStorage.getItem('cfg-login'),
    extraTokenParams: { acr_values: localStorage.getItem('cfg-acr') }
};
access_token = null;

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

function GetVoiceMails()
{
    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails?offset=0&count=100';
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            response = JSON.parse(xmlHttp.responseText);
            log("All detected VoiceMails: ");
            for (let index = 0; index < response["records"].length; index++) {
                log(response["records"][index]);
            }
        }
    }

    xmlHttp.open("GET", theUrl, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}
 
//////////////////////////////



if (location.search.includes("code=", 1)) {
    log("Response code was found in query!");
    log("Trying to exchange code for token...");
    let mgr = new Oidc.UserManager(settings);
    
    mgr.signinCallback(settings).then(function(user) {
        access_token = user.access_token;
       // localStorage.setItem('VoiceMailsToken', access_token);
    }).catch(function(err) {
        log(err);
});
}