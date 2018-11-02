/*jshint esversion: 6 */
function motionTouchEvents() {
    const directions = ['right', 'left', 'up', 'down'];
    directions.forEach((direction) => {
        const eleId = 'motion' + direction.charAt(0).toUpperCase() + direction.slice(1);
        const ele = document.getElementById(eleId);
        ele.addEventListener('mousedown', stdMove);
        ele.addEventListener('mouseup', stopMotion);
        ele.addEventListener('touchstart', stdMove);
        ele.addEventListener('touchend', stopMotion);
    });
}

function moveHome() {
    const payload = {mode: "home"};
    sendCmd("/ptz/motion", "POST", payload)
        .then(function(res) {
            alertMsg("home res: " + res);
        })
        .catch(function(err) {
            alertMsg(err, true);
        });
}

function stopMotion(e) {
    e.preventDefault();

    const panTiltArr = getPanTiltSpeeds();
    const payload = {
        "mode": "standard",
        "direction": "stop",
        "panSpeed": panTiltArr[0],
        "tiltSpeed": panTiltArr[1]
    };
    sendCmd("/ptz/motion", "POST", payload)
        .then(function(res) {
            alertMsg("continousMove_" + direction + " res: " + res);
        })
        .catch(function(err) {
            alertMsg(err, true);
        });
}

function stdMove(e) {
    e.preventDefault();
    const direction = e.target.getAttribute('data-value');
    const panTiltArr = getPanTiltSpeeds();

    const payload = {
        "mode": "standard",
        "direction": direction,
        "panSpeed": panTiltArr[0],
        "tiltSpeed": panTiltArr[1]
    };
    sendCmd("/ptz/motion", "POST", payload)
        .then(function(res) {
            alertMsg("continousMove_" + direction + " res: " + res);
        })
        .catch(function(err) {
            alertMsg(err, true);
        });
}

function getPanTiltSpeeds() {
    return [document.getElementById('panSpeedInput').value,  document.getElementById('tiltSpeedInput').value];
}

function moveAbsPos(pan, tilt) {
    const panTiltArr = getPanTiltSpeeds();
    const payload = {
        "mode": "absolute",
        "panSpeed": panTiltArr[0],
        "tiltSpeed": panTiltArr[1],
        "pan": pan,
        "tilt": tilt
    };
    sendCmd("/ptz/motion", "POST", payload)
        .then(function(res) {
            alertMsg("moveAbsPos res: " + res);
        })
        .catch(function(err) {
            alertMsg(err, true);
        });
}

function moveRelPos(pan, tilt) {
    const panTiltArr = getPanTiltSpeeds();
    const payload = {
        "mode": "relative",
        "panSpeed": panTiltArr[0],
        "tiltSpeed": panTiltArr[1],
        "pan": pan,
        "tilt": tilt
    };
    sendCmd("/ptz/motion", "POST", payload)
        .then(function(res) {
            alertMsg("moveRelPos res: " + res);
        })
        .catch(function(err) {
            alertMsg(err, true);
        });
}

function presets(mode, memNum) {
    const payload = {
        "mode": mode,
        "num": memNum
    };
    sendCmd("ptz/presets", "POST", payload)
        .then(function(res) {
            alertMsg("Preset res: " + res);
        })
        .catch(function(err) {
            alertMsg(err, true);
        });
}
