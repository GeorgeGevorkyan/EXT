let baseUrl = 'https://api.intermedia.net';


function makeRequest(token, method, url, data_raw){
    let options = {
        method: method,
        headers: {
            'Authorization': `Bearer ` + token
        }
    };

    if(data_raw){
        options["headers"]["Content-Type"] = 'application/json';
        options["body"] = JSON.stringify(data_raw);
    }

    return fetch(url, options);
}

function getContacts(token, params){ 
    let url = baseUrl + '/address-book/v3/contacts' + params;
       
    makeRequest(token, "GET", url)
        .then((response) => response.json())
        .then((response) => {log(response);});
}

function getUserDetails(token, params){ 
    let url = baseUrl + '/address-book/v3/contacts/_me' + params;
    makeRequest(token, "GET", url)
        .then((response) => response.json())
        .then((response) => {log(response);});
}

function getContactsByJIDs(token, jids, params){ 
    let url = baseUrl + '/address-book/v3/contacts/_search' + params;
    let jidsArray = jids.split(",");
    let body = {
        "jids" : jidsArray
    }

    makeRequest(token, "POST", url, body)
        .then((response) => response.json())
        .then((response) => { log(response); });
}

function getSingleContact(token, id, params){ 
    let url = baseUrl + '/address-book/v3/contacts/' + id + params;
    makeRequest(token, "GET", url)
        .then((response) => response.json())
        .then((response) => {log(response);});
}
