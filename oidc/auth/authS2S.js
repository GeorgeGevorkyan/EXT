async function getAnalyticToken(client_id, client_secret){
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
    let token;
    await fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
        token = response['access_token'];
    })
    .catch((error) => {
        console.log(error);
    });;
    return token;
}