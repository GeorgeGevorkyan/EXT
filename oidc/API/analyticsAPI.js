///////////////////////////////
// functions for Analytics
///////////////////////////////
function makeRequest(token, method, url, data_raw){
    let analytics_token = token;
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

function getDetailedCalls(token, dateFrom, dateTo, timezone, sortColumn, descending, offset, size, accountId, body){
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

    makeRequest(token, "POST", url, body)
        .then( response => response.json())
        .then( response => { log(response); });
}

function getUserCalls(token, userIds, dateFrom, dateTo, accountId, timezone){ 
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

    makeRequest(token, "POST", url, data_raw)
        .then( response => response.json())
        .then( response => { log(response);});
}

function getUserFilters(token, dateFrom, dateTo, accountId, timezone){
    let url = 'https://api.intermedia.net/analytics/calls/user/filters?dateFrom=' + dateFrom +'Z&dateTo=' + dateTo + 'Z';
    let params = '';
    
    if(timezone){
        params = params + "&timezone=" + timezone;
    }
    if(accountId){
        params = params + "&accountId=" + accountId;
    }

    url = url + params;

    makeRequest(token, "POST", url)
        .then( response => response.json())
        .then( response => { log(response);});
}

