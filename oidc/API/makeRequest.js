function makeRequest(token, method, url, body, isFile, contentType ='application/json'){
    let options = {
        method: method,
        headers: {
            'Authorization': `Bearer ` + token
        }
    };

    if(typeof body != 'string'){
        if(isFile == true){
            options["body"] = body;
        }else if(isFile == false){
            options["headers"]["Content-Type"] = contentType;
            options["body"] = JSON.stringify(body);
        }
    }else{
        options["body"] = body;
    }

    return fetch(url, options);
}