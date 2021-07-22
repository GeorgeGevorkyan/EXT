// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

///////////////////////////////
// config
///////////////////////////////
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;

let settings = {
    authority: '',
    client_id: '',
    redirect_uri: '',
    response_type: 'code',
    scope: '',
    acr_values : '',
    login_hint: '',
    extraTokenParams: ''
};

///////////////////////////////
// functions for Access Token
///////////////////////////////
function onGetPKCEToken(){
    settings.authority = localStorage.getItem('cfg-authority');
    settings.client_id = localStorage.getItem('cfg-clientId');
    settings.acr_values = localStorage.getItem('cfg-acr');
    settings.login_hint = localStorage.getItem('cfg-login');
    settings.redirect_uri = location.href.split('?')[0];
    settings.extraTokenParams = { acr_values: localStorage.getItem('cfg-acr') }
    settings.scope = scope;
    getAccessToken(settings)
}

if (location.search.includes("code=", 1)) {
    document.getElementById('waitText').hidden = false;
    let mgr = new Oidc.UserManager(settings);
    mgr.signinCallback(settings).then(function(user) {
        localStorage.setItem('access_token', user.access_token);
        document.getElementById('APIs').hidden = false;
    }).catch(function(err) {
       console.log(err);
    });
    document.getElementById('waitText').hidden = true;
}

///////////////////////////////
// Event Handlers
///////////////////////////////
let url = location.href.split('?')[0];

function readConfig() {
    log("Current configuration:");
    log(`cfg-authority = ${localStorage.getItem('cfg-authority')}`);
    log(`cfg-clientId = ${localStorage.getItem('cfg-clientId')}`);
    log(`cfg-acr = ${localStorage.getItem('cfg-acr')}`);
    log(`cfg-login = ${localStorage.getItem('cfg-login')}`);
}
function applyConfiguration(){
    const authority = document.getElementById('authority').value;
    const clientId = document.getElementById('clientId').value;
    const deviceId = document.getElementById('deviceId').value;
    const login = document.getElementById('login').value;
    localStorage.setItem('cfg-authority', authority);
    localStorage.setItem('cfg-clientId', clientId);
    localStorage.setItem('cfg-acr', `deviceId:${deviceId}`);
    localStorage.setItem('cfg-login', login);
    readConfig();
}
function loadConfiguration(){
    document.getElementById('authority').value = localStorage.getItem('cfg-authority');
    document.getElementById('clientId').value = localStorage.getItem('cfg-clientId');
    document.getElementById('deviceId').value = localStorage.getItem('cfg-acr').substr("deviceId:".length);
    document.getElementById('login').value = localStorage.getItem('cfg-login');
}

window.onload = readConfig;

document.getElementById('getToken').addEventListener("click", () => { getAccessToken('api.user.voice.voicemails api.user.address-book');});
document.getElementById('redirectUrl').value = url.substring(0, url.lastIndexOf('/')) + '/code-identityserver-sample.html'; 
document.getElementById('submit').addEventListener("click", applyConfiguration, false);
document.getElementById('load').addEventListener("click", loadConfiguration, false);