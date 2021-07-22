function makeRequest(method, url, isFile, data_raw){
    let access_token = localStorage.getItem("access_token");
    let options = {
        method: method,
        headers: {
            'Authorization': `Bearer ` + access_token
        }
    };

    if(data_raw){
        if(isFile == true){
            options["body"] = data_raw;
        }else{
            options["headers"]["Content-Type"] = 'application/json';
            options["body"] = JSON.stringify(data_raw);
        }
    }

    return fetch(url, options);
}