/*jshint esversion: 6 */
let player;

function changeStream() {
    player.destroy();
    startStream();
}

function startStream() {
    const canvas = document.getElementById('streamStage');
    const payload = {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };

    sendCmd('/camera/stream', 'POST', payload).then((camera) => {
        const streamPort = JSON.parse(camera);
        player = new JSMpeg.Player('ws://' + document.location.hostname + ':' + streamPort, {canvas:canvas});
    });
}
