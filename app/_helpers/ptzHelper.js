/*jshint esversion: 6 */

module.exports = {
    translateDirection,
    hexStrToNum,
    numToHexStr,
    sanitizeSpeed,
    getCurrentPos
};

function translateDirection(direction) {
    let hexStr;
    switch(direction.toLowerCase()) {
        case "stop":
            hexStr =  "0303FF";
            break;
        case "up":
            hexStr =  "0301FF";
            break;
        case "down":
            hexStr =  "0302FF";
            break;
        case "right":
            hexStr =  "0203FF";
            break;
        case "left":
            hexStr =  "0103FF";
            break;
        case "upleft":
            hexStr =  "0101FF";
            break;
        case "upright":
            hexStr =  "0201FF";
            break;
        case "downleft":
            hexStr =  "0102FF";
            break;
        case "downright":
            hexStr =  "0202FF";
            break;
        default:
            throw "The direction " + direction + " is not a valid movement direction";
    }
    return hexStr;
}

function hexStrToNum(str) {
    return parseInt(str, 16);
}

function numToHexStr(num) {
    if (num == 0) {
        return '00';
    }

    if (typeof num === 'string') {
        num = parseInt(num);
    }

    return num.toString(16).toUpperCase().split('').reduce(function(str, char) {
        return '0' + char;
    });
}

function sanitizeSpeed(pan, tilt) {
    let sanitizedPan, sanitizedTilt;

    if (pan >= 1 && pan <= 18) {
        sanitizedPan = ("0" + pan).slice(-2);
    } else {
        throw 'The pan speed value must be greater than or equal to 1 and less than or equal to 18';
    }

    if (tilt >= 1 && tilt <= 14) {
        sanitizedTilt = ("0" + pan).slice(-2);
    } else {
        throw 'The tilt speed value must be greater than or equal to 1 and less than or equal to 14';
    }

    return [sanitizedPan, sanitizedTilt];
}

async function getCurrentPos(id) {
    return numToHexStr(await socket.sendCmd(id, "81090612FF"));
}
