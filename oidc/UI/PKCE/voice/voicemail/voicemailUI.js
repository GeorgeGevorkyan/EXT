function init(){
///////////////////////////////
// functions for UI 
///////////////////////////////

const countOnList = 5; //amount on Voicemail list
let pageNumberOfVoicemails = 0;

function createNewTr(tr){
    let token = localStorage.getItem('access_token');
    let tableRow = document.createElement('tr');
    document.getElementById('table').appendChild(tableRow);
    
    let td = document.createElement('td');
    tableRow.appendChild(td);
    td.innerText = tr["id"];
    
    let td2 = document.createElement('td');
    tableRow.appendChild(td2);
    td2.innerText = tr["sender"]["phoneNumber"];

    let td3 = document.createElement('td');
    tableRow.appendChild(td3);
    td3.innerText = tr["sender"]["displayName"];

    let td4 = document.createElement('td');
    tableRow.appendChild(td4);
    td4.innerText = tr["status"];

    let td5 = document.createElement('td');
    tableRow.appendChild(td5);
    td5.innerText = tr["duration"];

    let td6 = document.createElement('td');
    tableRow.appendChild(td6);
    let date = new Date(tr["whenCreated"]);
    td6.innerText = date.getMonth() + 1 + '/' + date.getDay()  + '/' +  date.getFullYear() + ', ' + date.getHours()  + ':' +  date.getMinutes();

    let td7 = document.createElement('td');
    tableRow.appendChild(td7);
    td7.innerText = tr["hasText"];

    let td8 = document.createElement('td');
    tableRow.appendChild(td8);
    let button8 = document.createElement('button');
    button8.innerHTML = "Transcription";
    td8.appendChild(button8);
    button8.addEventListener("click", () => { getVoiceMailsTranscription(token, tr["id"]); }, false);

    let td9 = document.createElement('td');
    tableRow.appendChild(td9);
    let oggButton = document.createElement('button');
    oggButton.innerHTML = "ogg";
    td9.appendChild(oggButton);
    oggButton.addEventListener("click", () => {  onGetVoiceMailsContent(token, "ogg", tr["id"]);});

    let mp3Button = document.createElement('button');
    mp3Button.innerHTML = "mp3";
    td9.appendChild(mp3Button);
    mp3Button.addEventListener("click", () => {  onGetVoiceMailsContent(token, "mp3", tr["id"]);});

    let td10 = document.createElement('td');
    tableRow.appendChild(td10);
    let button10 = document.createElement('button');
    button10.innerHTML = "Delete";
    td10.appendChild(button10);
    button10.addEventListener("click", () => {  deleteSelectedVoicemailRecords(token, tr["id"]); onGetVoiceMails(pageNumberOfVoicemails); });

    let td11 = document.createElement('td');
    tableRow.appendChild(td11);
    let button11 = document.createElement('button');
    button11.innerHTML = "Change Status";
    td11.appendChild(button11);
    button11.addEventListener("click", () => { updateSelectedVoiceMailRecordsStatus(token, tr["status"] == "read"? "unread": "read", tr["id"]); onGetVoiceMails(pageNumberOfVoicemails); });
}

function updateList(response){
    let tableNode = document.getElementById("table");
    document.getElementById('buttonCurr').hidden = false;   
    document.getElementById('thead').hidden = false;  

    if (pageNumberOfVoicemails > 0) {   
        document.getElementById('buttonPrev').hidden = false;
    } else{
        document.getElementById('buttonPrev').hidden = true;   
    }

    if (response["records"].length == countOnList) {
        document.getElementById('buttonNext').hidden = false;
    } else{
        document.getElementById('buttonNext').hidden = true;
    }

    while (tableNode.childNodes.length > 2) {
        tableNode.removeChild(tableNode.lastChild);
    }

    for (let index = 0; index < response["records"].length; index++) {
        createNewTr(response["records"][index]);
    }   
     
    document.getElementById('buttonCurr').innerHTML = pageNumberOfVoicemails + 1;
    document.getElementById('buttonPrev').innerHTML = pageNumberOfVoicemails;
    document.getElementById('buttonNext').innerHTML = pageNumberOfVoicemails + 2;
}

async function onGetVoiceMails(offset){
    let res = await getVoiceMails(localStorage.getItem('access_token'), offset, countOnList);
    updateList(res);
}

async function onGetVoiceMailsContent(token, format, id){
    let blob = await getVoiceMailsContent(token, format, id);

    let dataUrl = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = dataUrl;
    a.download = id + "." + format;
    a.click();
}

///////////////////////////////
// Event Handlers
///////////////////////////////
document.getElementById('getVoiceMails').addEventListener("click", () =>{ 
    onGetVoiceMails(0);
});

document.getElementById('buttonNext').addEventListener("click", () => {
    onGetVoiceMails(++pageNumberOfVoicemails * countOnList);
});

document.getElementById('buttonPrev').addEventListener("click", () => { 
    onGetVoiceMails((pageNumberOfVoicemails > 0 ?--pageNumberOfVoicemails:pageNumberOfVoicemails) * countOnList);
});

document.getElementById('updateVoiceMailRecordsStatus').addEventListener("click", async () =>{ 
    await updateVoiceMailRecordsStatus(localStorage.getItem('access_token'), document.getElementById("updateStatus").value);
    onGetVoiceMails(pageNumberOfVoicemails);
});

document.getElementById('deleteVoiceMailRecords').addEventListener("click", async () =>{ 
    await deleteVoiceMailRecords(localStorage.getItem('access_token'), document.getElementById("deleteStatus").value); 
    onGetVoiceMails(pageNumberOfVoicemails);
});

document.getElementById('getVoiceMailsTotal').addEventListener("click", async () =>{ 
    let res = await getVoiceMailsTotal(localStorage.getItem('access_token'), document.getElementById("totalStatus").value); 
    log(res);
});

document.getElementById('getVoiceMailRecord').addEventListener("click", async () =>{ 
    let res = await getVoiceMailRecord(localStorage.getItem('access_token'), document.getElementById("id").value);
    log(res);
});

}