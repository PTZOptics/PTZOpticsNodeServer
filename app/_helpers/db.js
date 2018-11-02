/*jshint esversion: 6 */
const path = require('path');
const config = require(path.resolve(__dirname, '../config.json'));
const mongoose = require('mongoose');

mongoose.connect(config.connectionString, {useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
    Camera: require('../camera/camera.model')
};
