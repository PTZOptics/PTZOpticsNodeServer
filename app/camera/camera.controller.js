/*jshint esversion: 6 */
const path = require('path');
const express = require('express');
const router = express.Router();
const cameraService = require(path.resolve(__dirname, './camera.service'));

router.post('/create', _create);
router.get('/cameras', getAll);
router.get('/', getById);
router.put('/', update);
router.delete('/', _delete);
router.post('/osd', _osd);
router.post('/stream', _stream);

module.exports = router;

function _create(req, res, next) {
    cameraService.create(req.body)
        .then((camera) => res.json(camera))
        .catch(err => next(err));
}

function update(req, res, next) {
    cameraService.update(req.body.id)
        .then((camera) => res.json(camera))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    cameraService.getAll()
        .then((cameras) => res.json(cameras))
        .catch(err => next(err));
}

function getById(req, res, next) {
    cameraService.getById(req.body.id)
        .then((camera) => res.json(camera))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    cameraService.delete(req.body.id)
        .then((id) => res.json(id))
        .catch(err => next(err));
}

function _osd(req, res, next) {
    cameraService.osd(req.body)
        .then((socket) => res.json(socket))
        .catch(err => next(err));
}

function _stream(req, res, next) {
    console.log("Stream Requester ip: " + req.ip);
    cameraService.stream(req.body)
        .then((streamPort) => res.json(streamPort))
        .catch(err => next(err));
}
