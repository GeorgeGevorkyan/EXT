function getAccessToken(settings){
    let mgr = new Oidc.UserManager(settings);
    console.log("Going to sign in using following configuration", settings);
    mgr.signinRedirect({useReplaceToNavigate:true}).then(function() {
        console.log("Redirecting to AdSTS...");
    }).catch(function(err) {
        console.log(err);
    });
}

