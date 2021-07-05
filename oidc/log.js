function log() {
    Array.prototype.forEach.call(outName, function(msg) {
        if (msg instanceof Error){
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById(outName).innerHTML += msg + '\r\n';
    });
}
