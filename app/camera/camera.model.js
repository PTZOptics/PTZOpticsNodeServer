/*jshint esversion: 6 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: Schema.Types.ObjectId,
    ip: {type: String, unique: true, required: true},
    port: {type: String, required: true},
    rtsp: {type: String, required: true},
    model: {type: String, required: true},
    serial: {type: String, required: true},
    name: {type: String, unique: true},
    streamPort: {type: Number, unique: true},
    presets: [
        {
            memNum: {type: Number, max: 127},
            name: {type: String},
            location: {
                pan: {type: String},
                tilt: {type: String},
                focus: {type: String},
                zoom: {type: String}
            }
        }
    ]
});

schema.set('toJson', {virtuals: true});
module.exports = mongoose.model('Camera', schema);
