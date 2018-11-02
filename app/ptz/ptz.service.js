/*jshint esversion: 6 */
const path = require('path');
const db = require(path.resolve(__dirname, '../_helpers/db.js'));
const ptzHelper = require(path.resolve(__dirname, '../_helpers/ptzHelper.js'));
const socket = require(path.resolve(__dirname, '../_helpers/socket.js'));
const Camera = db.Camera;

module.exports = {
    preset: _presets,
    motion: _motion,
    focus: _focus,
    zoom: _zoom
};

async function _presets({id, mode, speed = null, memNum = null}) {
    let memCmd;

    switch(mode.toLowerCase()) {
        case 'speed':
            const recallSpeed = ptzHelper.numToHexStr(speed).padStart(2, "0");
            memCmd = "81010601" + recallSpeed + "FF";
            break;
        case 'call':
            memCmd = "8101043F02" + ptzHelper.numToHexStr(memNum).padStart(2, "0") + "FF";
            break;
        case 'set':
            memCmd = "8101043F01" + ptzHelper.numToHexStr(memNum).padStart(2, "0") + "FF";
            break;
        case 'reset':
            memCmd = "8101043F00" + ptzHelper.numToHexStr(memNum).padStart(2, "0") + "FF";
            break;
        default:
            throw "The preset mode " + mode + " is not a recognizable preset method.";
    }

    try {
        return await socket.sendCmd(id, memCmd);
    } catch(err) {
        throw err;
    }
}

async function _motion({id, mode, pan = null, tilt = null, panSpeed = null, tiltSpeed = null, direction = null}) {
    if (mode === 'absolute' || mode === 'relative' || mode === 'standard') {
        panTiltSpeedArr = ptzHelper.sanitizeSpeed(panSpeed, tiltSpeed);
        if (mode === 'absolute' || mode === 'relative') {
            pan = ptzHelper.numToHexStr(pan);
            tilt = ptzHelper.numToHexStr(tilt);
        }
    }

    let motionHex;
    switch(mode.toLowerCase()) {
        case 'home':
            motionHex = "81010604FF";
            break;
        case 'absolute':
            motionHex = "81010602" + panTiltSpeedArr[0] + panTiltSpeedArr[1] + pan + tilt +"FF";
            break;
        case 'relative':
            motionHex = "81010603" + panTiltSpeedArr[0] + panTiltSpeedArr[1] + pan + tilt +"FF";
            break;
        case 'standard':
            motionHex = "81010601" + panTiltSpeedArr[0] + panTiltSpeedArr[1] + ptzHelper.translateDirection(direction);
            break;
        case 'current':
            motionHex = "81090612FF";
            break;
        default:
            throw "The option " + mode + " is not a recognizable motion method.";
    }

    try {
        return await socket.sendCmd(id, motionHex);
    } catch(err) {
        throw err;
    }
}

async function _focus({id, mode, option = null, focusPos = null, intensity = null}) {
    let focusHex = '';
    switch(mode.toLowerCase()) {
        case 'standard':
            focusHex = "81010408";

            if (option === 'stop') {
                focusHex += "00FF";
            } else if (option === 'tele') {
                focusHex += "03FF";
            } else if (option === 'wide') {
                focusHex += "02FF";
            } else {
                throw "The focus option " + option + " is not a recognizable standard focus option";
            }
            break;
        case 'variable':
            focusHex = "81010408";
            if (option === 'tele') {
                focusHex += '3' + intensity + "FF";
            } else if (option === 'wide') {
                focusHex += '2' + intensity + "FF";
            } else {
                throw "The focus option " + option + " is not a recognizable variable focus option";
            }
            break;
        case 'direct':
            focusPos = numToHexStr(focusPos).split('').reduce((str, char) => {
                return '0' + char;
            });
            focusPos = focusPos.padStart(8, "0");
            focusHex = "81010448" + focusPos + "FF";
            break;
        case 'focusmode':
            focusHex = "810";
            if (option === 'auto') {
                focusHex += "1043802FF";
            } else if (option === 'manual') {
                focusHex += "1043803FF";
            } else if (option === 'toggle') {
                focusHex += "1043810FF";
            } else if (option === 'lock') {
                focusHex += "A046802FF";
            } else if (option === 'unlock') {
                focusHex += "A046803FF";
            } else {
                throw "The focus option " + option + " is not a recognizable focus mode option";
            }
            break;
        case 'afzone':
            focusHex = "810104AA";
            if (option === 'top') {
                focusHex += "00FF";
            } else if (option === 'center') {
                focusHex += "01FF";
            } else if (option === 'bottom') {
                focusHex += "02FF";
            } else {
                throw "The focus option " + option + " is not a recognizable auto focus-zone option";
            }
            break;
        default:
            throw "The focus mode " + mode + " is not a recognizable focus method.";
    }

    try {
        return await socket.sendCmd(id, focusHex);
    } catch(err) {
        throw err;
    }
}

async function _zoom({id, mode, option = null, zoomPos = null, intensity}) {
    let zoomHex = '';

    switch (mode) {
        case 'standard':
            zoomHex = "81010407";
            if (option === "stop") {
                zoomHex += "00FF";
            } else if (option === "tele") {
                zoomHex += "02FF";
            } else if (option === 'wide') {
                zoomHex += "03FF";
            } else {
                throw "The zoom option " + option + " is not a recognizable standard zoom option";
            }
            break;
        case 'variable':
            zoomHex = "81010407";
            if (option === 'tele') {
                zoomHex += '2' + intensity + "FF";
            } else if (option === 'wide') {
                zoomHex += '3' + intensity + "FF";
            } else {
                throw "The zoom option " + option + " is not a recognizable variable zoom option";
            }
            break;
        case 'direct':
            zoomPos = numToHexStr(zoomPos).split('').reduce((str, char) => {
                return '0' + char;
            });
            zoomPos = zoomPos.padStart(8, "0");
            zoomHex = "81010447" + zoomPos + "FF";
            break;
        default:
            throw "The zoom mode " + mode + " is not a recognizable zoom method.";
    }

    try {
        return await socket.sendCmd(id, zoomHex);
    } catch(err) {
        throw err;
    }
}
