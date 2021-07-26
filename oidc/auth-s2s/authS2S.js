async function getS2SToken(client_id, client_secret){
    let url = 'https://login.intermedia.net/user/connect/token';
    let token;
    let body = 
        'grant_type=client_credentials'+
        '&client_id=' + client_id + 
        '&client_secret=' + client_secret;
        '&scope=api.service.analytics.main';

    await makeRequest(undefined, 'POST', url, body, false, 'application/x-www-form-urlencoded')
        .then((response) => response.json())
        .then((response) => {
            token = response['access_token'];
        })
        .catch((error) => {
            console.log(error);
        });;
    return token;
}