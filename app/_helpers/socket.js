/*jshint esversion: 6 */

const path = require('path');
const db = require(path.resolve(__dirname, '../_helpers/db.js'));
const Camera = db.Camera;
const net = require('net');

module.exports = {
    sendCmd: _sendCmd
};

async function _sendCmd(id, cmd) {
    const camera = await Camera.findById(id);
    const buffer = Buffer.from(cmd, 'hex');

    return new Promise((resolve, reject) => {
        const socket = new net.Socket({allowHalfOpen: true});
        const conn = net.createConnection(Number(camera.port), camera.ip);
        conn.setNoDelay();
        conn.setEncoding('hex');

        conn.on('connect', () => {
            conn.write(buffer);
        });

        conn.on('error', (error) => {
            reject(error);
        });

        conn.on('data', (buf) => {
            if (conn.bytesRead >= 3) {
                conn.end();
                decode(buf.toString('hex'))
                    .then((res) => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            } else {
                reject("Unusual Camera Response: " + buf.toString('hex') + " connection bytes Read: " + conn.bytesRead);
            }
        });
    });
}

async function decode(hexStr) {
    let decoded = '';
    switch (hexStr) {
        case "9041ff":
        case "9042ff":
            decoded = "Command Accepted";
            break;
        case "9051ff":
        case "9041ff9051ff":
            decoded = "Socket1 Cmd Done";
            break;
        case "9052ff":
        case "9042ff9052ff":
            decoded = "Socket2 Cmd Done";
            break;
        case "906002ff":
            throw "Command Syntax Error";
        case "906003ff":
            throw "Command Buffer Full";
        case "906104ff":
            throw "Socket1 Cmd Cancelled";
        case "906204ff":
            throw "Socket2 Cmd Cancelled";
        case "906105ff":
        case "906205ff":
            throw "No Socket";
        case "906141ff":
            throw "Socket1 Cmd Not Executable";
        case "906241ff":
            throw "Socket2 Cmd Not Executable";
        default:
            throw "Unusual Camera Response: " + hexStr;
    }
    return decoded;
}
