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

function changeFieldsStatus(){
    if(document.getElementById('getSingleContactid').checked || document.getElementById('getSingleContact_all').checked){
        document.getElementById('getSingleContactlegacyId').hidden = false;
    }else{
        document.getElementById('getSingleContactlegacyId').hidden = true;
    }
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
    
    let fields = '&fields=';
    let getContactsid = document.getElementById('getContactsid');
    if(getContactsid.checked){
        fields = fields  + getContactsid.value;
    }

    let getContactsLegacyid = document.getElementById('getContactslegacyId');
    if(getContactsLegacyid.checked){
        fields = fields  + (getContactsid.checked ? "," : '') + getContactsLegacyid.value;
    }

    let getContacts_all = document.getElementById('getContacts_all');
    if(getContacts_all.checked){
        fields = fields  + ((getContactsLegacyid.checked || getContactsid.checked) ? "," : '') + getContacts_all.value;
    }
    params = params + (fields != '&fields='? (fields): '');
    getContacts(params? ('?' + params): '');
});

document.getElementById('getUserDetails').addEventListener("click", () =>{
    let params ='';
    
    let fields = '&fields=';
    let getContactsid = document.getElementById('getUserDetailsid');
    if(getContactsid.checked){
        fields = fields  + getContactsid.value;
    }

    let getContactsLegacyid = document.getElementById('getUserDetailslegacyId');
    if(getContactsLegacyid.checked){
        fields = fields  + (getContactsid ? "," : '') + getContactsLegacyid.value;
    }

    let getContacts_all = document.getElementById('getUserDetails_all');
    if(getContacts_all.checked){
        fields = fields  + (getContactsLegacyid ? "," : '') + getContacts_all.value;
    }
    params = params + (fields != '&fields='? (fields): '');

    getUserDetails(params? ('?' + params): '');
});

document.getElementById('getContactsByJIDs').addEventListener("click", () =>{ 
    let params ='';
    
    let fields = '&fields=';
    let getContactsid = document.getElementById('getContactsByJIDsid');
    if(getContactsid.checked){
        fields = fields  + getContactsid.value;
    }

    let getContactsLegacyid = document.getElementById('getContactsByJIDslegacyId');
    if(getContactsLegacyid.checked){
        fields = fields  + (getContactsid ? "," : '') + getContactsLegacyid.value;
    }

    let getContacts_all = document.getElementById('getContactsByJIDs_all');
    if(getContacts_all.checked){
        fields = fields  + (getContactsLegacyid ? "," : '') + getContacts_all.value;
    }
    params = params + (fields != '&fields='? (fields): '');

    getContactsByJIDs(document.getElementById('jids').value, params ? ('?' + params): '');
});
document.getElementById('getSingleContact').addEventListener("click", () =>{ 
    let params = '';

    let fields = '&fields=';
    let getContactsid = document.getElementById('getSingleContactid');
    if(getContactsid.checked){
        fields = fields  + getContactsid.value;
    }

    let getContactsLegacyid = document.getElementById('getSingleContactlegacyId');
    if(getContactsLegacyid.checked){
        fields = fields  + (getContactsid ? "," : '') + getContactsLegacyid.value;
    }

    let getContacts_all = document.getElementById('getSingleContact_all');
    if(getContacts_all.checked){
        fields = fields  + (getContactsLegacyid ? "," : '') + getContacts_all.value;
    }
    params = params + (fields != '&fields='? (fields): '');

    getSingleContact(document.getElementById('id').value, params ? ('?' + params): '');
});