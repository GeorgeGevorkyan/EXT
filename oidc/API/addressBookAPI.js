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

export function getContacts(params){ 
    let url = 'https://api.intermedia.net/address-book/v3/contacts' + params;
       
    makeRequest("GET", url)
        .then((response) => response.json())
        .then((response) => {log(response);});
}

export function getUserDetails(params){ 
    let url = 'https://api.intermedia.net/address-book/v3/contacts/_me' + params;
    makeRequest("GET", url)
        .then((response) => response.json())
        .then((response) => {log(response);});
}

export function getContactsByJIDs(jids, params){ 
    let url = 'https://api.intermedia.net/address-book/v3/contacts/_search' + params;
    let jidsArray = jids.split(",");
    let body = {
        "jids" : jidsArray
    }

    makeRequest("POST", url, body)
        .then((response) => response.json())
        .then((response) => { log(response); });
}

export function getSingleContact(id, params){ 
    let url = 'https://api.intermedia.net/address-book/v3/contacts/' + id + params;
    makeRequest("GET", url)
        .then((response) => response.json())
        .then((response) => {log(response);});
}
