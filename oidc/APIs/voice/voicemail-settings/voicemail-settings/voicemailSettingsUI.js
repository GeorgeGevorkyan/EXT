function init(){
    let token = localStorage.getItem('access_token');

    async function onGetGreetingContent(format, custom){
        let blob = await getGreetingContent(token, format, custom); 
        let dataUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'greeting.' + format;
        a.click();
    }

    ///////////////////////////////
    // Event Handlers
    ///////////////////////////////
    document.getElementById('getDefaultGreetingContentMp3').addEventListener("click", () =>{ 
        onGetGreetingContent("mp3", 0); 
    });

    document.getElementById('getDefaultGreetingContentOgg').addEventListener("click", () =>{
        onGetGreetingContent("ogg", 0);
    });

    document.getElementById('getCustomGreetingContentMp3').addEventListener("click", () =>{ 
        onGetGreetingContent("mp3", 1); 
    });
    document.getElementById('getCustomGreetingContentOgg').addEventListener("click", () =>{
        onGetGreetingContent("ogg", 1); 
    });

    document.getElementById('uploadGreetingContent').addEventListener("click", async () =>{ 
        let res = await uploadGreetingContent(token);
        log(res); 
    });

    document.getElementById('getUserSettings').addEventListener("click", async () =>{ 
        let res = await getUserSettings(token);
        log(res); 
    });

    document.getElementById('getVoicemailUsage').addEventListener("click",async () =>{ 
        let res = await getVoicemailUsage(token); 
        log(res);
    });

    document.getElementById('resetGreetingContent').addEventListener("click",async () =>{
        let res = await resetGreetingContent(token); 
        log(res);
    });

    document.getElementById('updateUserSettings').addEventListener("click",async () =>{ 
        let res = await updateUserSettings(token,
        document.getElementById("pin").value,
        document.getElementById("hasCustomGreeting").value, 
        document.getElementById("isTranscriptionPermitted").value, 
        document.getElementById("enableTranscription").value,
        document.getElementById("receiveEmailNotifications").value,
        document.getElementById("emails").value,
        document.getElementById("includeVoiceMail").value);

        log(res);
    });
}