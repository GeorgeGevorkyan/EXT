async function onAuth(){
    let token = await getS2SToken(document.getElementById('client-id').value, document.getElementById('client-secret').value);
    localStorage.setItem('S2SToken', token);
    log("Token " + token);
}

document.getElementById('getS2SToken').addEventListener("click", () => { 
    onAuth();
});
