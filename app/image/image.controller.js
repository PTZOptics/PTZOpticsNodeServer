/*jshint esversion: 6 */
const path = require('path');
const express = require('express');
const router = express.Router();
const imageService = require(path.resolve(__dirname, './image.service.js'));
module.exports = router;

router.post('/bright', _brightness);
router.post('/contrast', _contrast);
router.post('/wb', _whiteBalance);
router.post('/rgain', _rgain);
router.post('/bgain', _bgain);
router.post('/shutter', _shutter);
router.post('/iris', _iris);
router.post('/gain', _gain);
router.post('/backLight', _backLight);
router.post('/bw', _blackWhite);
router.post('/flicker', _flicker);
router.post('/imgFlip', _imgFlip);
router.post('/colorHue', _colorHue);
router.post('/ae', _autoExp);
router.post('/save', _save);

function _brightness(req, res, next) {
    imageService.brightness(req.body)
        .then((socket) => res.json(socket))
        .catch(err => next(err));
}

function _contrast(req, res, next) {
    imageService.contrast(req.body)
        .then((socket) => res.json(socket))
        .catch(err => next(err));
}

function _whiteBalance(req, res, next) {
    imageService.whiteBalance(req.body)
        .then((socket) => res.json(socket))
        .catch(err => next(err));
}

function _rgain(req, res, next) {
    imageService.rgain(req.body)
        .then((socket) => res.json(socket))
        .catch(err => next(err));
}

function _bgain(req, res, next) {
    imageService.bgain(req.body)
        .then((socket) => res.json(socket))
        .catch(err => next(err));
}

function _shutter(req, res, next) {
    imageService.shutter(req.body)
        .then((socket) => res.json(socket))
        .catch(err => next(err));
}

function _iris(req, res, next) {
    imageService.iris(req.body)
        .then((socket) => res.json(socket))
        .catch(err => next(err));
}

function _gain(req, res, next) {
    imageService.gain(req.body)
        .then((socket) => res.json(socket))
        .catch(err => next(err));
}

function _backLight(req, res, next) {
    imageService.backLight(req.body)
        .then((socket) => res.json(socket))
        .catch(err => next(err));
}

function _blackWhite(req, res, next) {
    imageService.blackWhite(req.body)
        .then((socket) => res.json(socket))
        .catch(err => next(err));
}

function _flicker(req, res, next) {
    imageService.flicker(req.body)
        .then((socket) => res.json(socket))
        .catch(err => next(err));
}

function _imgFlip(req, res, next) {
    imageService.imgFlip(req.body)
        .then((socket) => res.json(socket))
        .catch(err => next(err));
}

function _colorHue(req, res, next) {
    imageService.colorHue(req.body)
        .then((socket) => res.json(socket))
        .catch(err => next(err));
}

function _autoExp(req, res, next) {
    imageService.ae(req.body)
        .then((socket) => res.json(socket))
        .catch(err => next(err));
}

function _save(req, res, next) {
    imageService.save(req.body.id)
        .then((socket) => res.json(socket))
        .catch(err => next(err));
}
