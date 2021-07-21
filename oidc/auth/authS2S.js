function getAnalyticToken(client_id, client_secret){
    let url = 'https://login.intermedia.net/user/connect/token';
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
            'grant_type=client_credentials'+
            '&client_id=' + client_id +
            '&client_secret=' + client_secret +
            '&scope=api.service.analytics.main'
    };

    fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
        //localStorage.setItem('analytics_token', response['access_token']);
        log("Token " + response['access_token']);
        return response['access_token'];
    })
    .catch((error) => {
        console.log(error);
    });;
}