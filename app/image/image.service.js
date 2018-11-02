 /*jshint esversion: 6 */
const path = require('path');
const db = require(path.resolve(__dirname, '../_helpers/db.js'));
const ptzHelper = require(path.resolve(__dirname, '../_helpers/ptzHelper.js'));
const socket = require(path.resolve(__dirname, '../_helpers/socket.js'));
const Camera = db.Camera;

module.exports = {
    brightness: _brightness,
    contrast: _contrast,
    whiteBalance: whiteBal,
    rgain: _rgain,
    bgain: _bgain,
    shutter: _shutter,
    iris: _iris,
    gain: _gain,
    backLight: _backLight,
    blackWhite: _blackWhite,
    flicker: _flicker,
    imgFlip: _imgFlip,
    colorHue: _colorHue,
    ae: _autoExp,
    save: saveSetting
};

async function _brightness({id, pos}) {
    let brightnessHex = "810104A10000";
    let brightnessPos = ptzHelper.numToHexStr(pos).padStart(4, "0");
    brightnessHex += brightnessPos + "FF";

    try {
        return await socket.sendCmd(id, brightnessHex);
    } catch(err) {
        throw err;
    }
}

async function _contrast(contrastParams) {
    const {id, pos} = contrastParams;
    let contrastHex = "810104A20000";
    let contrastPos = ptzHelper.numToHexStr(pos).padStart(4, "0");
    contrastHex += contrastPos + 'FF';

    try {
        return await socket.sendCmd(id, contrastHex);
    } catch(err) {
        throw err;
    }
}

async function whiteBal({id, option, mode}) {
    let wbHex = "810104";

    if (mode.toLowerCase() === 'wbmode') {
        switch(option.toLowerCase()) {
            case "auto":
                wbHex += "3500FF";
                break;
            case "indoor":
                wbHex += "3501FF";
                break;
            case "outdoor":
                wbHex  += "3502FF";
                break;
            case "onepush":
                wbHex += "3503FF";
                break;
            case "manual":
                wbHex += "3505FF";
                break;
            case "onepush-trigger":
                wbHex += "1005FF";
                break;
            default:
                throw "The white balance mode " + option + " is not a recognizable white balance mode.";
        }
    } else if (mode.toLowerCase() === 'awbsenstivity') {
        switch(option.toLowerCase()) {
            case "high":
                wbHex += "A900FF";
                break;
            case "normal":
                wbHex += "A901FF";
                break;
            case "low":
                wbHex += "A902FF";
                break;
            default:
                throw "The auto white balance mode " + option + " is not a recognizable auto white balance mode.";
        }
    } else {
        throw mode + "is not a recognizable white balance method.";
    }

    try {
        return await socket.sendCmd(id, wbHex);
    } catch(err) {
        throw err;
    }

}

async function _rgain({id, mode, option = null, pos = null}) {
    let rgainHex = "810104";

    if (mode.toLowerCase() === 'standard') {
        switch (option.toLowerCase()) {
            case "reset":
                rgainHex += "0300FF";
                break;
            case "up":
                rgainHex += "0302FF";
                break;
            case "down":
                rgainHex += "0303FF";
                break;
            default:
                throw "The rgain option " + option + " is not a recognizable standard rgain option";
        }
    } else if (mode.toLowerCase() === 'direct') {
        rgainHex = "430000" + ptzHelper.numToHexStr(pos).padStart(4, "0") + "FF";
    } else {
        throw "The rgain mode " + mode + " is not a recognizable rgain method.";
    }

    try {
        return await socket.sendCmd(id, rgainHex);
    } catch(err) {
        throw err;
    }
}

async function _bgain({id, mode, option = null, pos = null}) {
    let bgainHex = "810104";

    if (mode.toLowerCase() === 'standard') {
        switch (option.toLowerCase()) {
            case "reset":
                bgainHex += "0400FF";
                break;
            case "up":
                bgainHex += "0402FF";
                break;
            case "down":
                bgainHex += "0403FF";
                break;
            default:
                throw "The bgain option " + option + " is not a recognizable standard bgain option";
        }
    } else if (mode.toLowerCase() === 'direct') {
        rgainHex = "430000" + ptzHelper.numToHexStr(pos).padStart(4, "0") + "FF";
    } else {
        throw "The bgain mode " + mode + " is not a recognizable bgain method.";
    }

    try {
        return await socket.sendCmd(id, bgainHex);
    } catch(err) {
        throw err;
    }
}

async function _shutter({id, option, mode}) {
    let shutterHex = "8101040A";
    if (mode.toLowerCase() === 'standard') {
        switch (option.toLowerCase()) {
            case "reset":
                shutterHex += "00FF";
                break;
            case "up":
                shutterHex += "02FF";
                break;
            case "down":
                shutterHex += "03FF";
                break;
            default:
                throw "The shutter option " + option + " is not a recognizable standard shutter option";
        }
    } else if (mode.toLowerCase() === 'direct') {
        shutterHex += "0000";
        switch (option) {
            case "1/30":
                shutterHex += "0001FF";
                break;
            case "1/60":
                shutterHex += "0002FF";
                break;
            case "1/90":
                shutterHex += "0003FF";
                break;
            case "1/100":
                shutterHex += "0004FF";
                break;
            case "1/125":
                shutterHex += "0005FF";
                break;
            case "1/180":
                shutterHex += "0006FF";
                break;
            case "1/250":
                shutterHex += "0007FF";
                break;
            case "1/350":
                shutterHex += "0008FF";
                break;
            case "1/500":
                shutterHex += "0009FF";
                break;
            case "1/725":
                shutterHex += "000AFF";
                break;
            case "1/1000":
                shutterHex += "000BFF";
                break;
            case "1/1500":
                shutterHex += "000CFF";
                break;
            case "1/2000":
                shutterHex += "000DFF";
                break;
            case "1/3000":
                shutterHex += "000EFF";
                break;
            case "1/4000":
                shutterHex += "000FFF";
                break;
            case "1/6000":
                shutterHex += "0100FF";
                break;
            case "1/10000":
                shutterHex += "0101FF";
                break;
            default:
                throw "The shutter option " + option + " is not a recognizable direct shutter option";
        }
    } else {
        throw "The shutter mode " + mode + " is not a recognizable shutter mode";
    }

    try {
        return await socket.sendCmd(id, shutterHex);
    } catch(err) {
        throw err;
    }
    console.log("reached end");
}

async function _iris({id, mode, option}) {
    let irisHex = "8101040B";

    if (mode.toLowerCase() === 'standard') {
        switch (option.toLowerCase()) {
            case "reset":
                irisHex += "00FF";
                break;
            case "up":
                irisHex += "02FF";
                break;
            case "down":
                irisHex += "03FF";
                break;
            default:
                throw "The iris option " + option + " is not a recognizable standard iris option";
        }
    } else if (mode.toLowerCase() === 'direct') {
        irisHex += "0000";
        switch (option.toLowerCase()) {
            case "close":
                irisHex += "0000FF";
                break;
            case "f11":
                irisHex += "0006FF";
                break;
            case "f9.6":
                irisHex += "0007FF";
                break;
            case "f8.0":
                irisHex += "0008FF";
                break;
            case "f6.8":
                irisHex += "0009FF";
                break;
            case "f5.6":
                irisHex += "000AFF";
                break;
            case "f4.8":
                irisHex += "000BFF";
                break;
            case "f4.0":
                irisHex += "000CFF";
                break;
            case "f3.4":
                irisHex += "000DFF";
                break;
            case "f2.8":
                irisHex += "000EFF";
                break;
            case "f2.0":
                irisHex += "0100FF";
                break;
            case "f1.8":
                irisHex += "0200FF";
                break;
            default:
                throw "The iris direct option " + option + " is not a recognizable option";
        }
    } else {
        throw "The iris option " + option + " is not a recognizable direct iris option";
    }

    try {
        return await socket.sendCmd(id, irisHex);
    } catch(err) {
        throw err;
    }
}

async function _gain({id, mode, option = null, pos = null}) {
    let gainHex = "8101040C";
    if (mode.toLowerCase() === "standard") {
        switch(option.toLowerCase()) {
            case "reset":
                gainHex += "00FF";
                break;
            case "up":
                gainHex += "02FF";
                break;
            case "down":
                gainHex += "03FF";
                break;
            default:
                throw "The gain option " + option + " is not a recognizable standard gain option";
        }
    } else if (mode === "direct") {
        gainHex += "0000" + ptzHelper.numToHexStr(pos).padStart(4, "0") + "FF";
    } else {
        throw "The gain mode " + mode + " is not a recognizable gain mode";
    }

    try {
        return await socket.sendCmd(id, gainHex);
    } catch(err) {
        throw err;
    }
}

async function _backLight({id, option}) {
    let backlightHex = "81010433";
    if (option.toLowerCase() === 'on') {
        backlightHex += "02FF";
    } else if (option.toLowerCase() === 'off') {
        backlightHex += "03FF";
    } else {
        throw "The back light option " + option + " is not a recognizable back light option";
    }

    try {
        return await socket.sendCmd(id, backlightHex);
    } catch(err) {
        throw err;
    }
}

async function _blackWhite({id, option}) {
    let bwHex = "81010463";

    if (option.toLowerCase() === 'on') {
        bwHex += "04FF";
    } else if (option.toLowerCase() === 'off') {
        bwHex += "00FF";
    } else {
        throw "The back light option " + option + " is not a recognizable back light option";
    }

    try {
        return await socket.sendCmd(id, bwHex);
    } catch(err) {
        throw err;
    }
}

async function _flicker({id, option}) {
    let flickerHex = "810104230";
    switch(option.toLowerCase()) {
        case "off":
            flickerHex += "0FF";
            break;
        case "50hz":
            flickerHex += "1FF";
            break;
        case "60hz":
            flickerHex += "2FF";
            break;
        default:
            throw "The flicker option " + option + " is not a recognizable standard flicker option";
    }

    try {
        return await socket.sendCmd(id, flickerHex);
    } catch(err) {
        throw err;
    }
}

async function _imgFlip({id, mode, option}) {
    let imgFlipHex = "810104";

    if (mode.toLowerCase() === 'lr') {
        imgFlipHex += '61';
    } else if (mode.toLowerCase() === 'pf') {
        imgFlipHex += '66';
    } else {
        throw "The image flip mode " + mode + " is not a recognizable image flip mode";
    }

    if (option.toLowerCase() === 'off') {
        imgFlipHex += '03FF';
    } else if (option.toLowerCase() === 'on') {
        imgFlipHex += '02FF';
    } else {
        throw "The image flip option " + option + " is not a recognizable image flip option";
    }

    try {
        return await socket.sendCmd(id, imgFlipHex);
    } catch(err) {
        throw err;
    }
}

async function _colorHue({id, pos}) {
    let colorHueHex = '8101044F';
    let colorHuePos = ptzHelper.numToHexStr(pos).padStart(8, "0");
    colorHueHex += colorHuePos + "FF";

    try {
        return await socket.sendCmd(id, colorHueHex);
    } catch(err) {
        throw err;
    }
}

async function _autoExp({id, option}) {
    let aeHex = '81010439';

    switch (option.toLowerCase()) {
        case "fullauto":
            aeHex += '00FF';
            break;
        case "manual":
            aeHex += '03FF';
            break;
        case "shutter":
            aeHex += '0AFF';
            break;
        case "iris":
            aeHex += '0BFF';
            break;
        case "bright":
            aeHex += '0DFF';
            break;
        default:
            throw "The autoexp option " + option + " is not a recognizable autoexp option";
    }

    try {
        return await socket.sendCmd(id, aeHex);
    } catch(err) {
        throw err;
    }
}

async function saveSetting(id) {
    try {
        return await socket.sendCmd(id, "81010604FF");
    } catch(err) {
        throw err;
    }
}
