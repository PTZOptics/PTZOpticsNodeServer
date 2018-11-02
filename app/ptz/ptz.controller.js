/*jshint esversion: 6 */
const path = require('path');
const express = require('express');
const router = express.Router();
const ptzService = require(path.resolve(__dirname, './ptz.service.js'));

module.exports = router;

router.post('/motion', _motion);
router.post('/presets', _presets);
router.post('/focus', _focus);
router.post('/zoom', _zoom);

function _presets(req, res, next) {
    ptzService.preset(req.body)
        .then((response) => res.send(response))
        .catch(err => next(err));
}

function _motion(req, res, next) {
    ptzService.motion(req.body)
        .then((response) => res.send(response))
        .catch(err => next(err));
}

function _focus(req, res, next) {
    ptzService.focus(req.body)
        .then((response) => res.send(response))
        .catch(err => next(err));
}

function _zoom(req, res, next) {
    ptzService.zoom(req.body)
        .then((response) => res.send(response))
        .catch(err => next(err));
}
