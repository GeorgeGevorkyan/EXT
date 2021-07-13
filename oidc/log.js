function log() {
    Array.prototype.forEach.call(arguments, function(msg) {
        if (msg instanceof Error){
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById('out').innerHTML += msg + '\r\n';
    });
}

function clear(){
    document.getElementById('out').innerHTML = '' + '\r\n';
}

document.getElementById('clearLog').addEventListener("click", () => { clear(); });