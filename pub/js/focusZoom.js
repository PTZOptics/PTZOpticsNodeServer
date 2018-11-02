/*jshint esversion: 6 */
function focusTouchEvents() {
    const opts = ['tele', 'wide'];
    opts.forEach((opt) => {
        const eleId = 'focus' + opt.charAt(0).toUpperCase() + opt.slice(1);
        const ele = document.getElementById(eleId);
        ele.addEventListener('mousedown', variableFocus);
        ele.addEventListener('mouseup', stopFocus);
        ele.addEventListener('touchstart', variableFocus);
        ele.addEventListener('touchend', stopFocus);
    });
    zoomTouchEvents();
}

function zoomTouchEvents() {
    const opts = ['tele', 'wide'];
    opts.forEach((opt) => {
        const eleId = 'zoom' + opt.charAt(0).toUpperCase() + opt.slice(1);
        const ele = document.getElementById(eleId);
        ele.addEventListener('mousedown', variableZoom);
        ele.addEventListener('mouseup', stopZoom);
        ele.addEventListener('touchstart', variableZoom);
        ele.addEventListener('touchend', stopZoom);
    });
}

function getFocusSpeed() {
    return document.getElementById('focusSpeedInput').value;
}

function getZoomSpeed() {
    return document.getElementById('zoomSpeedInput').value;
}

function stopFocus(e) {
    e.preventDefault();
    stdFocus('stop');
}

function stopZoom(e) {
    e.preventDefault();
    stdZoom('stop');
}

function variableFocus(e) {
    e.preventDefault();
    const opt = e.currentTarget.getAttribute('data-value');
    const focusSpeed = getFocusSpeed();

    const payload = {
        "mode": "variable",
        "option": opt,
        "intensity": focusSpeed
    };
    sendCmd("/ptz/focus", "POST", payload)
        .then(function(res) {
            alertMsg("variableFocus res: " + res);
        })
        .catch(function(err) {
            alertMsg(err, true);
        });
}

function directFocus(focusPos) {
    const payload = {
        "mode": "direct",
        "focusPos": focusPos
    };
    sendCmd("/ptz/focus", "POST", payload)
        .then(function(res) {
            alertMsg("directFocus res: " + res);
        })
        .catch(function(err) {
            alertMsg(err, true);
        });
}

function stdFocus(opt) {
    const payload = {
        "mode": "standard",
        "option": opt
    };
    sendCmd("/ptz/focus", "POST", payload)
        .then(function(res) {
            alertMsg("stdFocus res: " + res);
        })
        .catch(function(err) {
            alertMsg(err, true);
        });
}

function focusMode() {
    const payload = {
        "mode": "focusmode",
        "option": document.getElementById('focusModeSel').selectedOptions[0].value
    };
    sendCmd("/ptz/focus", "POST", payload)
        .then(function(res) {
            alertMsg("focusmode res: " + res);
        })
        .catch(function(err) {
            alertMsg(err, true);
        });
}

function afZone() {
    const payload = {
        "mode": "afzone",
        "option": document.getElementById('afZoneSel').selectedOptions[0].value
    };
    sendCmd("/ptz/focus", "POST", payload)
        .then(function(res) {
            alertMsg("afzone res: " + res);
        })
        .catch(function(err) {
            alertMsg(err, true);
        });
}

// **************************************** ZOOM *************************************

function variableZoom(e) {
    e.preventDefault();
    const opt = e.currentTarget.getAttribute('data-value');
    const zoomSpeed = getZoomSpeed();
    const payload = {
        "mode": "variable",
        "option": opt,
        "intensity": zoomSpeed
    };
    sendCmd("/ptz/zoom", "POST", payload)
        .then(function(res) {
            alertMsg("variableZoom res: " + res);
        })
        .catch(function(err) {
            alertMsg(err, true);
        });
}

function stdZoom(opt) {
    const payload = {
        "mode": "standard",
        "option": opt
    };
    sendCmd("/ptz/zoom", "POST", payload)
        .then(function(res) {
            alertMsg("stdZoom res: " + res);
        })
        .catch(function(err) {
            alertMsg(err, true);
        });
}

function directZoom(zoomPos) {
    const payload = {
        "mode": "direct",
        "zoomPos": zoomPos
    };
    sendCmd("/ptz/zoom", "POST", payload)
        .then(function(res) {
            alertMsg("directZoom res: " + res);
        })
        .catch(function(err) {
            alertMsg(err, true);
        });
}
