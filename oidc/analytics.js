
function getAnalyticToken(){
    let url = 'https://login.intermedia.net/user/connect/token';
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
            'grant_type': 'client_credentials',
            'client_id': document.getElementById('client-id').value,
            'client_secret': document.getElementById('client-secret').value,
            'scope': 'api.service.analytics.main'
        }
    };

    fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
        localStorage.setItem('analytics_token', response['analytics_token']);
        log(response['analytics_token']);
    })
    .catch((error) => {
        console.log(error);
    });;
}

///////////////////////////////
// Event Handlers
///////////////////////////////
document.getElementById('getAnalyticToken').addEventListener("click", () => { getAnalyticToken();});