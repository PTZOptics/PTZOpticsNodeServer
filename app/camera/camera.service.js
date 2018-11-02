/*jshint esversion: 6 */
const path = require('path');
const Stream = require('../stream/videoStream');
const db = require(path.resolve(__dirname, '../_helpers/db.js'));
const mongoose = require('mongoose');
const cameraHelper = require(path.resolve(__dirname, '../_helpers/cameraHelper.js'));
const socket = require(path.resolve(__dirname, '../_helpers/socket.js'));
const Camera = db.Camera;

module.exports = {
    create: _create,
    getAll: _getAll,
    getById: _getById,
    update: _update,
    delete: _delete,
    osd: _osd,
    stream: _stream
};

async function _getAll() {
    try {
        return await Camera.find().lean();
    } catch(err) {
        throw err;
    }
}

async function _getById(id) {
    try {
        return await Camera.findById(id).lean();
    } catch(err) {
        throw err;
    }
}

async function _create(cameraParams) {
    if (await Camera.findOne({ip: cameraParams.ip})) {
        throw 'There is already a camera with ip ' + cameraParams.ip;
    } else {
        const modelSerialArr = await cameraHelper.getDeviceModel(cameraParams.ip);
        const camId = new mongoose.Types.ObjectId();
        const streamPort = await cameraHelper.createNewCameraStreamPort();
        return new Camera({
            ...cameraParams,
            _id: camId,
            model: modelSerialArr[0],
            serial: modelSerialArr[1],
            streamPort: streamPort
        })
        .save()
        .then((camera) => {
            return camera.toObject();
        }).catch((err) => {
            throw err;
        });
    }
}

async function _update(cameraParams) {
    try {
        return await Camera.findByIdAndUpdate(cameraParams._id, cameraParams, {new: true}).save();
    } catch(err) {
        throw err;
    }
}

async function _delete(id) {
    try {
        return await Camera.findOneAndDelete(id);
    } catch(err) {
        throw err;
    }
}

async function _osd({id, option}) {
    let osdHex = "8101";
    switch(option.toLowerCase()) {
        case "openToggle":
            osdHex += "043F025FFF";
            break;
        case "up":
            osdHex += "06010E0E0301FF";
            break;
        case "down":
            osdHex += "06010E0E0302FF";
            break;
        case "left":
            osdHex += "06010E0E0103FF";
            break;
        case "right":
            osdHex += "06010E0E0203FF";
            break;
        case "enter":
            osdHex += "060605FF";
            break;
        case "return":
            osdHex += "060604FF";
            break;
        default:
            throw "The OSD option " + option + " is not a recognizable OSD option.";
    }
    return await socket.sendCmd(id, osdHex);
}

async function _stream({id, width = 1920, height = 1080}) {
    const camera = await Camera.findById(id).lean();

    // In case a seperate user wants to reach same camera stream
    let inUse;
    try {
        inUse = await cameraHelper.checkPortUse(camera.streamPort);
    } catch(err) {
        throw err;
    }

    if (!inUse) {
        const stream = new Stream({
            name: camera.name || "stream: " + camera.rtsp,
            url: 'rtsp://' + camera.rtsp,
            port: camera.streamPort,
            width: width,
            height: height
        });
        stream.start();
    }
    return camera.streamPort;
}
