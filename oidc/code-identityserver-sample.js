// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

///////////////////////////////
// config
///////////////////////////////
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;

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
// functions for Access Token
///////////////////////////////

function getAccessToken(scope){
    settings.scope = scope;
    let mgr = new Oidc.UserManager(settings);
    console.log("Going to sign in using following configuration", settings);
    mgr.signinRedirect({useReplaceToNavigate:true}).then(function() {
        console.log("Redirecting to AdSTS...");
    }).catch(function(err) {
        console.log(err);
    });
}

if (location.search.includes("code=", 1)) {
    document.getElementById('waitText').hidden = false;
    let mgr = new Oidc.UserManager(settings);
    mgr.signinCallback(settings).then(function(user) {
        localStorage.setItem('access_token', user.access_token);
        document.getElementById('functions').hidden = false;
    }).catch(function(err) {
       console.log(err);
    });
    document.getElementById('waitText').hidden = true;
}

///////////////////////////////
// Event Handlers
///////////////////////////////
document.getElementById('getVoiceMailsToken').addEventListener("click", () => { getAccessToken("api.user.voice.voicemails");}, false);
