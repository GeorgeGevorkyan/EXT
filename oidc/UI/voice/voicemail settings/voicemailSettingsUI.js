function init(){
///////////////////////////////
// Event Handlers
///////////////////////////////
document.getElementById('getDefaultGreetingContentMp3').addEventListener("click", () =>{ getGreetingContent(localStorage.getItem('access_token'), "mp3", 0); });
document.getElementById('getDefaultGreetingContentOgg').addEventListener("click", () =>{ getGreetingContent(localStorage.getItem('access_token'), "ogg", 0); });
document.getElementById('getCustomGreetingContentMp3').addEventListener("click", () =>{ getGreetingContent(localStorage.getItem('access_token'), "mp3", 1); });
document.getElementById('getCustomGreetingContentOgg').addEventListener("click", () =>{ getGreetingContent(localStorage.getItem('access_token'), "ogg", 1); });
document.getElementById('uploadGreetingContent').addEventListener("click", () =>{ uploadGreetingContent(localStorage.getItem('access_token')); });
document.getElementById('getUserSettings').addEventListener("click", () =>{ getUserSettings(localStorage.getItem('access_token')); });
document.getElementById('getVoicemailUsage').addEventListener("click", () =>{ getVoicemailUsage(localStorage.getItem('access_token')); });
document.getElementById('resetGreetingContent').addEventListener("click", () =>{ resetGreetingContent(localStorage.getItem('access_token')); });
document.getElementById('updateUserSettings').addEventListener("click", () =>{ 
    updateUserSettings(localStorage.getItem('access_token'),
    document.getElementById("pin").value,
    document.getElementById("hasCustomGreeting").value, 
    document.getElementById("isTranscriptionPermitted").value, 
    document.getElementById("enableTranscription").value,
    document.getElementById("receiveEmailNotifications").value,
    document.getElementById("emails").value,
    document.getElementById("includeVoiceMail").value);
});
}