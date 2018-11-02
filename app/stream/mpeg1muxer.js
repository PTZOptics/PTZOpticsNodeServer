/*jshint esversion: 6 */
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const child_process = require('child_process');
const EventEmitter = require('events');
const spawn = require('cross-spawn');

class Mpeg1Muxer extends EventEmitter {

    constructor(options) {
        super(options);

        this.url = options.url;
        this.width = options.width;
        // this.stream = child_process.spawn(ffmpegPath, ['-y', '-loglevel', 'quiet', "-rtsp_transport", "tcp", "-i", this.url, '-vf', 'yadif', '-f', 'mpegts', '-r', '30',  '-codec:v', 'mpeg1video', '-codec:a', 'mp2', '-b:a', '128k', '-b:v', '4096k', '-muxdelay', '0', '-', './app/stream/stream.ts'], {
        //     detached: false
        // });
        this.stream = child_process.spawn(ffmpegPath, ['-y', '-loglevel', 'quiet', "-rtsp_transport", "tcp", "-i", this.url, '-filter:v', 'scale=1280:-1', '-f', 'mpegts', '-r', '30',  '-codec:v', 'mpeg1video', '-codec:a', 'mp2', '-b:a', '128k', '-b:v', '1500k', '-', './app/stream/stream.ts'], {
            detached: false
        });

        this.inputStreamStarted = true;
        this.stream.stdout.on('data', (data) => { return this.emit('mpeg1data', data); });
        this.stream.stderr.on('data', (data) => { return this.emit('ffmpegError', data); });
    }

    stop() {
        try {
            this.stream.stdout.removeAllListeners();
        } catch(err) {
            console.log("Muxer: " + err);
        }

        this.stream.kill();
        this.stream = undefined;
    }
}

module.exports = Mpeg1Muxer;
