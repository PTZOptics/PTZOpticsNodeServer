/*jshint esversion: 6 */
const path = require('path');
const http = require('http');
const tcpPortUsed =require('tcp-port-used');
const db = require(path.resolve(__dirname, './db.js'));
const Camera = db.Camera;

module.exports = {
    getDeviceModel,
    checkPortUse,
    createNewCameraStreamPort
};

async function checkPortUse(port) {
    return tcpPortUsed.check(port, '127.0.0.1')
        .then((inuse) => {
            return inuse;
        })
        .catch(err => {
            throw err;
        });
}

async function getDeviceModel(ip) {
    const options = {
        hostname: ip,
        path: '/cgi-bin/param.cgi?get_serial_number',
        method: 'GET'
    };
    return sendCgiReq(options)
        .then((res) => {
            const rawData = res.toString().replace(/\n/g, '').toUpperCase();
            return calcCamModel(rawData, rawData.substring(0, 1), rawData.substring(0, 2))
                .then(res => {
                    return res;
                })
                .catch(err => {
                    throw err;
                });
        })
        .catch(err => {
            throw err;
        });
}

async function calcCamModel(serial, first_letter, twoFirst_letter) {
    let model = '';
    // Check 12x
    if (["1", "A", "B", "C", "D", "N", "O"].includes(first_letter)) {
        model = "PT12X-";
        (first_letter === "1") ? model += serial.slice(3, 6) + "-XX-" + serial.slice(8, 10) + checkPoe(serial.slice(10)) : model += newSerialAnsBuilder(serial);
    }

    // Check 20x
    if (["2", "E", "F", "G", "H", "P", "Q"].includes(first_letter) && twoFirst_letter !== "PT" ) {
        model = "PT20X-";
        (first_letter === "2") ? model += serial.slice(3, 6) + "-XX-" + serial.slice(8, 10) + checkPoe(serial.slice(10)) : model += newSerialAnsBuilder(serial);
    }

    // Check 30x
    if (["W", "X", "R", "S"].includes(first_letter)) {
        model = "PT30X-" + newSerialAnsBuilder(serial);
    }

    // Check zcams
    if (["J", "U", "I", "T"].includes(first_letter)) {
        (["J", "U"].includes(first_letter)) ? model = "PT20X-ZCAM-" : model = "PTVL-ZCAM";
    }

    if ('PT' == twoFirst_letter) {
        (serial.slice(0, 4) === "PTVL") ? model = "PTVL-ZCAM-" : model = "PT20X-ZCAM-";
    }
    return [model, serial];
}

function newSerialAnsBuilder(serial) {
    let ans = '';
    switch(serial.substring(0, 1)) {
        // 12X
        case "A":
        case "B":
            ans = "SDI-XX-G2" + checkPoe(serial.slice(1));
            break;

        case "C":
        case "D":
            ans = "USB-XX-G2";
            break;

        case "N":
        case "O":
            ans = "SDI-XX-G2 POE";
            break;

        // 20X
        case "E":
        case "F":
            ans = "SDI-XX-G2" + checkPoe(serial.slice(1));
            break;

        case "G":
        case "H":
            ans = "USB-XX-G2";
            break;

        case "P":
        case "Q":
            ans = "SDI-XX-G2 POE";
            break;

        // 30X
        case "W":
        case "X":
            ans = "SDI-XX-G2 POE";
            break;

        case "R":
        case "S":
            ans = "NDI-XX-G2";
            break;
    }
    return ans;
}

function checkPoe (serialNum) {
    if (serialNum <= "B1025000") {
        return '';
    } else if (serialNum >= "B1025001" && serialNum <= "D0129000") {
        return "-POE";
    } else if(serialNum >= "D0129001") {
        return "-POE";
    }
}

async function createNewCameraStreamPort() {
    let port = 5000;
    let cameraStreamPorts;
    try {
        // Returns all saved camera stream ports
        cameraStreamPorts = await currentCameraStreamPorts();
    } catch(err) {
        throw err;
    }

    while (cameraStreamPorts.includes(port)) {
        ++port;
    }
    return port;
}

async function currentCameraStreamPorts() {
    return Camera.find().select('streamPort').lean()
        .then((cameras) => {
            return cameras.map((camera) => {
                return camera.streamPort;
            });
        })
        .catch((err) => {
            throw err;
        });
}

function sendCgiReq(options) {
    return new Promise(function(resolve, reject) {
        const req = http.request(options, (res) => {
            let rawData = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                resolve(rawData);
            });
        });
        req.on('error', function(err) {
            reject(err);
        });
        req.end();
    });
}
