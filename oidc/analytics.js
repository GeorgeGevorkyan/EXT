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
        log("Token " + response['access_token']);
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

function getDetailedCalls(dateFrom, dateTo, timezone, sortColumn, descending, offset, size, accountId, body){
    let url = 'https://api.intermedia.net/analytics/calls/call/detail?dateFrom=' + dateFrom +'Z&dateTo=' + dateTo + 'Z';
    let params = '';
    
    if(timezone){
        params = params + "&timezone=" + timezone;
    }
    if(sortColumn){
        params = params + "&sortColumn=" + sortColumn;
    }
    if(descending){
        params = params + "&descending=" + descending;
    }
    if(offset){
        params = params + "&offset=" + offset;
    }   
    if(size){
        params = params + "&size=" + size;
    }    
    if(accountId){
        params = params + "&accountId=" + accountId;
    }

    url = url + params;

    makeRequest("POST", url, body)
        .then( response => response.json())
        .then( response => { log(response); });
}

function getUserCalls(userIds, dateFrom, dateTo, accountId, timezone){ 
    let url = 'https://api.intermedia.net/analytics/calls/user?dateFrom=' + new Date(dateFrom).toISOString() + '&dateTo=' + new Date(dateTo).toISOString();
    let params = '';
    userIds = userIds.split(",");
    let data_raw = {
        "userIds": userIds
    }

    if(timezone){
        params = params + "&timezone=" + timezone;
    }
    if(accountId){
        params = params + "&accountId=" + accountId;
    }

    url = url + params;

    makeRequest("POST", url, data_raw)
        .then( response => response.json())
        .then( response => { log(response);});
}

function getUserFilters(dateFrom, dateTo, accountId, timezone){
    let url = 'https://api.intermedia.net/analytics/calls/user/filters?dateFrom=' + dateFrom +'Z&dateTo=' + dateTo + 'Z';
    let params = '';
    
    if(timezone){
        params = params + "&timezone=" + timezone;
    }
    if(accountId){
        params = params + "&accountId=" + accountId;
    }

    url = url + params;

    makeRequest("POST", url)
        .then( response => response.json())
        .then( response => { log(response);});
}

///////////////////////////////
// Event Handlers
///////////////////////////////
document.getElementById('getAnalyticToken').addEventListener("click", () => { getAnalyticToken();});
document.getElementById('getDetailedCalls').addEventListener("click", () => { 
    let chargeable = document.getElementById('chargeable').value;
    let bound = document.getElementById('bound').value;
    let status = document.getElementById('status').value;
    let body = {};

    if(chargeable != 'select'){
        body['chargeable'] = [chargeable];
    }
    
    if(bound != 'select' && status != 'select'){
        body['callAttributes'] =[bound, status];
    }

    getDetailedCalls(document.getElementById('dateFromDetailedCalls').value,
        document.getElementById('dateToDetailedCalls').value,
        document.getElementById('timezone').value,
        document.getElementById('sortColumn').value,
        document.getElementById('descending').value,
        document.getElementById('offset').value,
        document.getElementById('getDetailedCallsSize').value,
        document.getElementById('getDetailedCallsAccountId').value,
        body ? body : null);
});
document.getElementById('getUserCalls').addEventListener("click", () => { 
    getUserCalls(document.getElementById('userIds').value,
        document.getElementById('dateFromUserCalls').value,
        document.getElementById('dateToUserCalls').value,
        document.getElementById('getUserCallsTimezone').value,
        document.getElementById('getUserCallsAccountId').value);
});
document.getElementById('getUserFilters').addEventListener("click", () => { 
    getUserFilters(document.getElementById('dateFromUserFilters').value,
        document.getElementById('dateToUserFilters').value,
        document.getElementById('getUserFiltersTimezone').value,
        document.getElementById('getUserFiltersAccountId').value);
});