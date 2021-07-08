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
    .then(response => {
        for (let index = 0; index < response.length; index++) {
            const avatarElement = response[index];
            log(avatarElement['avatarId']);
            log(avatarElement['contactId']);
            let blob = avatarElement['avatar'].blob();
            let dataUrl = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = dataUrl;
            a.download = avatarId + ".png";
            a.click();
        }
    });
}

function getAvatar(avatarId){ 
     let url = 'https://api.intermedia.net/address-book/v3/avatars/'+ avatarId;
    // makeRequest("GET", url)
    //     .then((response) => response.json())
    //     .then((response) => {
    //         let blob = new Blob([response['avatar']], {type : 'image/' + 'png'});
    //         let dataUrl = window.URL.createObjectURL(blob);
    //         let a = document.createElement('a');
    //         a.href = dataUrl;
    //         a.download = avatarId + '.png';
    //         a.click();
    //     });
    let access_token = localStorage.getItem("access_token");
    let xmlHttp = new XMLHttpRequest();
    let blob;
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){ 
            blob = new Blob([xmlHttp.response], {type : 'audio/' + format});
            let dataUrl = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = dataUrl;
            a.download = id + "." + format;
            a.click();
            };
    }

    xmlHttp.open("GET", url, true); 
    xmlHttp.responseType = "arraybuffer";
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token); 
    xmlHttp.send();



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
