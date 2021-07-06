
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
    let analytics_token = localStorage.getItem("analytics_token");
    let options = {
        method: method,
        headers: {
            'Authorization': `Bearer ` + analytics_token
        }
    };

    if(data_raw){
        options["headers"]["Content-Type"] = 'application/json';
        options["body"] = JSON.stringify(data_raw);
    }

    return fetch(url, options);
}

function getDetailedCalls(){
    let url = 'https://api.intermedia.net/analytics/calls/call/detail';
    let body = { 
        "chargeable" : ["yes"],
        "callAttributes": ["outbound", "answered"] 
    }
    makeRequest("POST", url, false, body)
        .then( response => response.json())
        .then( response => { log(response);
}


///////////////////////////////
// Event Handlers
///////////////////////////////
document.getElementById('getAnalyticToken').addEventListener("click", () => { getAnalyticToken();});