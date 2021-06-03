// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


document.getElementById('getVoiceMails').addEventListener("click",GetVoiceMails,false);
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
    scope: localStorage.getItem('cfg-scopes'),
    automaticSilentRenew:false,
    validateSubOnSilentRenew: false,
    monitorAnonymousSession : false,
    filterProtocolClaims: false,
    monitorSession: false,
    loadUserInfo: false,
    revokeAccessTokenOnSignout : true,
    acr_values : localStorage.getItem('cfg-acr'),
    login_hint: localStorage.getItem('cfg-login'),
    extraTokenParams: { acr_values: localStorage.getItem('cfg-acr') }
};
var mgr = new Oidc.UserManager(settings);
access_token = null;
///////////////////////////////
// events
///////////////////////////////
// mgr.events.addAccessTokenExpiring(function () {
//     console.log("token expiring");
//     log("token expiring");

//     // maybe do this code manually if automaticSilentRenew doesn't work for you
//     mgr.signinSilent().then(function(user) {
//         log("silent renew success", user);
//     }).catch(function(e) {
//         log("silent renew error", e.message);
//     })
// });

// mgr.events.addAccessTokenExpired(function () {
//     console.log("token expired");
//     log("token expired");
// });

// mgr.events.addSilentRenewError(function (e) {
//     console.log("silent renew error", e.message);
//     log("silent renew error", e.message);
// });

// mgr.events.addUserLoaded(function (user) {
//     console.log("user loaded", user);
//     mgr.getUser().then(function(){
//        console.log("getUser loaded user after userLoaded event fired"); 
//     });
// });

// mgr.events.addUserUnloaded(function (e) {
//     console.log("user unloaded");
// });

// mgr.events.addUserSignedIn(function (e) {
//     log("user logged in to the token server");
// });
// mgr.events.addUserSignedOut(function (e) {
//     log("user logged out of the token server");
// });

function startSigninMainWindow() {
    mgr.signinRedirect({useReplaceToNavigate:true}).then(function() {
        log("Redirecting to AdSTS...");
    }).catch(function(err) {
        log(err);
    });
}

function GetVoiceMails()
{
    let theUrl = 'https://api.intermedia.net/voice/v2/voicemails?offset=0&count=100';
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            log(xmlHttp.responseText);
    }
  
    xmlHttp.open("GET", theUrl, true); 
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();
}

function endSigninMainWindow() {
    log("Trying to exchange code for token...");
    mgr.signinCallback(settings).then(function(user) {
        log("signed in", user);
        access_token = user.access_token;
        log("Decoded access_token:", jwt_decode(user.access_token))
    }).catch(function(err) {
        log(err);
    });
}

if (location.search.includes("code=", 1)) {
    log("Response code was found in query!");
    endSigninMainWindow();
} else {
    log("Going to sign in using following configuration", settings);
    startSigninMainWindow();
}

