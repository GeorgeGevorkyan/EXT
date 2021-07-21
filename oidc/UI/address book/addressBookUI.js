function init(){
    
///////////////////////////////
// functions for UI 
///////////////////////////////
function changeFieldsStatus(id, legacyId, _all){
    if(id.checked || _all.checked){
        legacyId.disabled = false;
    }else{
        legacyId.disabled = true;
        legacyId.checked = false;
    }
}

///////////////////////////////
// Event Handlers
///////////////////////////////
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

document.getElementById('getContactsid').addEventListener("click", () =>{
   let id = document.getElementById('getContactsid');
   let legacyId = document.getElementById('getContactslegacyId');
   let _all = document.getElementById('getContacts_all');

   changeFieldsStatus(id, legacyId, _all);
});

document.getElementById('getContacts_all').addEventListener("click", () =>{
    let id = document.getElementById('getContactsid');
    let legacyId = document.getElementById('getContactslegacyId');
    let _all = document.getElementById('getContacts_all');
 
    changeFieldsStatus(id, legacyId, _all);
});

document.getElementById('getUserDetailsid').addEventListener("click", () =>{
    let id = document.getElementById('getUserDetailsid');
    let legacyId = document.getElementById('getUserDetailslegacyId');
    let _all = document.getElementById('getUserDetails_all');
    
    changeFieldsStatus(id, legacyId, _all);
});

document.getElementById('getUserDetails_all').addEventListener("click", () =>{
    let id = document.getElementById('getUserDetailsid');
    let legacyId = document.getElementById('getUserDetailslegacyId');
    let _all = document.getElementById('getUserDetails_all');
    
    changeFieldsStatus(id, legacyId, _all);
});

document.getElementById('getContactsByJIDsid').addEventListener("click", () =>{
    let id = document.getElementById('getContactsByJIDsid');
    let legacyId = document.getElementById('getContactsByJIDslegacyId');
    let _all = document.getElementById('getContactsByJIDs_all');
    
    changeFieldsStatus(id, legacyId, _all);
});

document.getElementById('getContactsByJIDs_all').addEventListener("click", () =>{
    let id = document.getElementById('getContactsByJIDsid');
    let legacyId = document.getElementById('getContactsByJIDslegacyId');
    let _all = document.getElementById('getContactsByJIDs_all');
    
    changeFieldsStatus(id, legacyId, _all);
});

document.getElementById('getSingleContactid').addEventListener("click", () =>{
    let id = document.getElementById('getSingleContactid');
    let legacyId = document.getElementById('getSingleContactlegacyId');
    let _all = document.getElementById('getSingleContact_all');
    
    changeFieldsStatus(id, legacyId, _all);
});

document.getElementById('getSingleContact_all').addEventListener("click", () =>{
    let id = document.getElementById('getSingleContactid');
    let legacyId = document.getElementById('getSingleContactlegacyId');
    let _all = document.getElementById('getSingleContact_all');
    
    changeFieldsStatus(id, legacyId, _all);
});
}