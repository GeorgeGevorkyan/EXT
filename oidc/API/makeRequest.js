function makeRequest(token, method, url, body, isFile, contentType ='application/json'){
    let options = {
        method: method,
        headers: {
            'Authorization': `Bearer ` + token
        }
    };

    if(body){
        if(isFile == true){
            options["body"] = body;
        }else if(isFile == false){
            options["headers"]["Content-Type"] = contentType;
            options["body"] = JSON.stringify(body);
        }
    }

    return fetch(url, options);
}