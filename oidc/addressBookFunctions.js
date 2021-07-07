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

function getMultipleAvatars(avatarIds){ 
    let url = 'https://api.intermedia.net/address-book/v3/avatars/_search';
    let body = {
        'avatarIds' : [avatarIds]
    }
    makeRequest("POST", url)
        .then((response) => response.json())
        .then((response) => {log(response);});
}

function getAvatar(avatarId){ 
    let url = 'https://api.intermedia.net/address-book/v3/avatars/'+ avatarId;
    let body = {
        'avatarId' : avatarId
    }
    makeRequest("GET", url)
        .then((response) => response.json())
        .then((response) => {log(response);});
}

function getContacts(){ 
    let url = 'https://api.intermedia.net/address-book/v3/contacts';
    makeRequest("GET", url)
        .then((response) => response.json())
        .then((response) => {log(response);});
}

function getUserDetails(){ 
    let url = 'https://api.intermedia.net/address-book/v3/contacts/_me';
    makeRequest("GET", url)
        .then((response) => response.json())
        .then((response) => {log(response);});
}

function getContactsByJIDs(jids){ 
    let url = 'https://api.intermedia.net/address-book/v3/contacts/_search';
    let body = {
        'jids' : [jids]
    }
    makeRequest("POST", url, body)
        .then((response) => response.json())
        .then((response) => { log(response); });
}

function getSingleContact(id){ 
    let url = 'https://api.intermedia.net/address-book/v3/contacts/' + id;
    makeRequest("GET", url)
        .then((response) => response.json())
        .then((response) => {log(response);});
}








document.getElementById('getContacts').addEventListener("click", () =>{ getContacts();});
document.getElementById('getMultipleAvatars').addEventListener("click", () =>{ getMultipleAvatars(document.getElementById('avatarIds').value);});
document.getElementById('getAvatar').addEventListener("click", () =>{ getAvatar(document.getElementById('avatarId').value);});
document.getElementById('getUserDetails').addEventListener("click", () =>{ getUserDetails();});
document.getElementById('getContactsByJIDs').addEventListener("click", () =>{ getContactsByJIDs(document.getElementById('jids').value);});
document.getElementById('getSingleContact').addEventListener("click", () =>{ getSingleContact(document.getElementById('id').value);});
