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
    makeRequest("GET", url)
        .then((response) => {
            log(response.clone().json());
            return response['avatar'].blob();
        })
        .then((response) => {
            let blob = new Blob([response['avatar']], {type : 'image/' + 'png'});
            let dataUrl = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = dataUrl;
            a.download = avatarId + '.png';
            a.click();
        });
} 

function getContacts(params){ 
    let url = 'https://api.intermedia.net/address-book/v3/contacts' + params;
       
    makeRequest("GET", url)
        .then((response) => response.json())
        .then((response) => {log(response);});
}

function getUserDetails(params){ 
    let url = 'https://api.intermedia.net/address-book/v3/contacts/_me' + params;
    makeRequest("GET", url)
        .then((response) => response.json())
        .then((response) => {log(response);});
}

function getContactsByJIDs(jids, params){ 
    let url = 'https://api.intermedia.net/address-book/v3/contacts/_search' + params;
    let jidsArray = jids.split(",");
    let body = {
        "jids" : jidsArray
    }

    makeRequest("POST", url, body)
        .then((response) => response.json())
        .then((response) => { log(response); });
}

function getSingleContact(id, params){ 
    let url = 'https://api.intermedia.net/address-book/v3/contacts/' + id + params;
    makeRequest("GET", url)
        .then((response) => response.json())
        .then((response) => {log(response);});
}








document.getElementById('getContacts').addEventListener("click", () =>{ 
    let params ='';
    if(document.getElementById('query').value){
        params = params + "&query=" + document.getElementById('query').value;
    }
       
    if(document.getElementById('phone').value){
        params = params + "&phone=" + document.getElementById('phone').value;
    }
       
    if(document.getElementById('scope').value){
        params = params + "&scope=" + document.getElementById('scope').value;
    }
    
    let getContactsid = document.getElementById('getContactsid');
    if(getContactsid.checked){
        params = params + "&fields=" + getContactsid.value;
    }

    let getContactsLegacyid = document.getElementById('getContactsLegacyid');
    if(getContactsLegacyid.checked){
        params = params + (getContactsid ? "," : null) + getContactsLegacyid.value;
    }

    let getContacts_all = document.getElementById('getContacts_all');
    if(getContacts_all.checked){
        params = params + (getContactsLegacyid ? "," : null) + getContacts_all.value;
    }

    getContacts(params? ('?' + params): null);
});


document.getElementById('getUserDetails').addEventListener("click", () =>{
    let params;
    
    let getUserDetailsid = document.getElementById('getUserDetailsid');
    if(getUserDetailsid.checked){
        params = params + "&fields=" + getUserDetailsid.value;
    }

    let getUserDetailsLegacyid = document.getElementById('getUserDetailsLegacyid');
    if(getUserDetailsLegacyid.checked){
        params = params + (getUserDetailsid ? "," : null) + getUserDetailsLegacyid.value;
    }

    let getUserDetails_all = document.getElementById('getUserDetails_all');
    if(getUserDetails_all.checked){
        params = params + (getUserDetailsLegacyid ? "," : null) + getUserDetails_all.value;
    }


    getUserDetails(params? ('?' + params): null);
    });

document.getElementById('getContactsByJIDs').addEventListener("click", () =>{ 
    let params;
    
    let getContactsByJIDsid = document.getElementById('getContactsByJIDsid');
    if(getContactsByJIDsid.checked){
        params = params + "&fields=" + getContactsByJIDsid.value;
    }

    let getContactsByJIDsLegacyid = document.getElementById('getContactsByJIDsLegacyid');
    if(getContactsByJIDsLegacyid.checked){
        params = params + (getContactsByJIDsid ? "," : null) + getContactsByJIDsLegacyid.value;
    }

    let getUserDetails_all = document.getElementById('getUserDetails_all');
    if(getUserDetails_all.checked){
        params = params + (getContactsByJIDsLegacyid ? "," : null) + getUserDetails_all.value;
    }

    getContactsByJIDs(document.getElementById('jids').value, params ? ('?' + params): null);
});
document.getElementById('getSingleContact').addEventListener("click", () =>{ 
    let params;

    let getSingleContactid = document.getElementById('getSingleContactid');
    if(getSingleContactid.checked){
        params = params + "&fields=" + getSingleContactid.value;
    }

    let getSingleContactLegacyid = document.getElementById('getSingleContactLegacyid');
    if(getSingleContactLegacyid.checked){
        params = params + (getSingleContactid ? "," : null) + getSingleContactLegacyid.value;
    }

    let getSingleContact_all = document.getElementById('getSingleContact_all');
    if(getSingleContact_all.checked){
        params = params + (getSingleContactLegacyid ? "," : null) + getSingleContact_all.value;
    }

    getSingleContact(document.getElementById('id').value, params ? ('?' + params): null);
});