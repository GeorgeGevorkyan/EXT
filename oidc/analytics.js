
function getAnalyticToken(){
    let url = 'https://login.intermedia.net/user/connect/token';
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
            'grant_type=client_credentials'+
            '&client_id=' + document.getElementById('client-id').value +
            '&client_secret=' + document.getElementById('client-secret').value +
            '&scope=api.service.analytics.main'
    };

    fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
        localStorage.setItem('analytics_token', response['access_token']);
    })
    .catch((error) => {
        console.log(error);
    });;
}

///////////////////////////////
// functions for Analytics
///////////////////////////////
function makeRequest(method, url, data_raw){
    let access_token = localStorage.getItem("access_token");
    let options = {
        method: method,
        headers: {
            'Authorization': `Bearer ` + access_token
        }
    };

    if(data_raw){
        options["headers"]["Content-Type"] = 'application/json';
        options["body"] = JSON.stringify(data_raw);
    }

    return fetch(url, options);
}

///////////////////////////////
// Event Handlers
///////////////////////////////
document.getElementById('getAnalyticToken').addEventListener("click", () => { getAnalyticToken();});