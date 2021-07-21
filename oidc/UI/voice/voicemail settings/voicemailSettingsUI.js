function init(){
///////////////////////////////
// Event Handlers
///////////////////////////////
document.getElementById('getDefaultGreetingContentMp3').addEventListener("click", () =>{ getGreetingContent("mp3", 0); });
document.getElementById('getDefaultGreetingContentOgg').addEventListener("click", () =>{ getGreetingContent("ogg", 0); });
document.getElementById('getCustomGreetingContentMp3').addEventListener("click", () =>{ getGreetingContent("mp3", 1); });
document.getElementById('getCustomGreetingContentOgg').addEventListener("click", () =>{ getGreetingContent("ogg", 1); });
document.getElementById('uploadGreetingContent').addEventListener("click", () =>{ uploadGreetingContent(); });
document.getElementById('getUserSettings').addEventListener("click", () =>{ getUserSettings(); });
document.getElementById('getVoicemailUsage').addEventListener("click", () =>{ getVoicemailUsage(); });
document.getElementById('resetGreetingContent').addEventListener("click", () =>{ resetGreetingContent(); });
document.getElementById('updateUserSettings').addEventListener("click", () =>{ 
    updateUserSettings(document.getElementById("pin").value,
    document.getElementById("hasCustomGreeting").value, 
    document.getElementById("isTranscriptionPermitted").value, 
    document.getElementById("enableTranscription").value,
    document.getElementById("receiveEmailNotifications").value,
    document.getElementById("emails").value,
    document.getElementById("includeVoiceMail").value);
});
}