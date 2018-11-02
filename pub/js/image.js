/*jshint esversion: 6 */

function whiteBalance(mode) {
    let id;
    if (mode === 'wbmode') {
        id = "wbModeSel";
    } else {
        id = "awbSel";
    }

    const payload = {
        "mode": mode,
        "option": document.getElementById(id).selectedOptions[0].value
    };
    sendCmd("/image/wb", "POST", payload)
        .then((res) => {
            alertMsg("white bal res: " + res);
        })
        .catch((err) => {
            alertMsg(err, true);
        });
}


function autoExp() {
    const payload = {
        "option": document.getElementById("aeSel").selectedOptions[0].value
    };
    sendCmd("/image/ae", "POST", payload)
        .then((res) => {
            alertMsg("auto exp res: " + res);
        })
        .catch((err) => {
            alertMsg(err, true);
        });
}

function rgain(mode, opt, pos) {
    const payload = {
        "mode": mode
    };
    if (mode === "direct") {
        payload.pos = pos;
    } else if (mode === "standard"){
        payload.option = opt;
    }
    sendCmd("/image/rgain", "POST", payload)
        .then((res) => {
            alertMsg("rgain res: " + res);
        })
        .catch((err) => {
            alertMsg(err, true);
        });
}

function bgain(mode, opt, pos) {
    const payload = {
        "mode": mode
    };
    if (mode === "direct") {
        payload.pos = pos;
    } else if (mode === "standard"){
        payload.option = opt;
    }
    sendCmd("/image/bgain", "POST", payload)
        .then((res) => {
            alertMsg("bgain res: " + res);
        })
        .catch((err) => {
            alertMsg(err, true);
        });
}

function shutter(mode, option) {
    const payload = {
        "mode": mode,
        "option": option
    };

    sendCmd("/image/shutter", "POST", payload)
        .then((res) => {
            alertMsg("shutter res: " + res);
        })
        .catch((err) => {
            alertMsg(err, true);
        });
}

function iris(mode, option) {
    const payload = {
        "mode": mode
    };

    if (mode === "direct") {
        payload.pos = pos;
    } else if (mode === "standard"){
        payload.option = option;
    }

    sendCmd("/image/iris", "POST", payload)
        .then((res) => {
            alertMsg("iris res: " + res);
        })
        .catch((err) => {
            alertMsg(err, true);
        });
}

function gain(mode, opt) {
    const payload = {
        "mode": mode,
        "option": opt
    };

    sendCmd("/image/gain", "POST", payload)
        .then((res) => {
            alertMsg("gain res: " + res);
        })
        .catch((err) => {
            alertMsg(err, true);
        });
}

function backlight(opt) {
    const payload = {
        "option": opt
    };
    sendCmd("/image/backlight", "POST", payload)
        .then((res) => {
            alertMsg("backlight res: " + res);
        })
        .catch((err) => {
            alertMsg(err, true);
        });
}

function blackWhite(opt) {
    const payload = {
        "option": opt
    };
    sendCmd("/image/bw", "POST", payload)
        .then((res) => {
            alertMsg("blackwhite res: " + res);
        })
        .catch((err) => {
            alertMsg(err, true);
        });
}

function flicker(opt) {
    const payload = {
        "option": opt
    };
    sendCmd("/image/flicker", "POST", payload)
        .then((res) => {
            alertMsg("flicker res: " + res);
        })
        .catch((err) => {
            alertMsg(err, true);
        });
}

function imgFlip(mode) {
    let opt;
    if (document.getElementById(mode).checked) {
        opt = 'on';
    } else {
        opt = 'off';
    }
    const payload = {
        "option": opt,
        "mode": mode
    };
    sendCmd("/image/imgFlip", "POST", payload)
        .then((res) => {
            alertMsg("image flip res: " + res);
        })
        .catch((err) => {
            alertMsg(err, true);
        });
}

function changeInputLabel(setting) {
    const input = document.getElementById(setting + 'Input');
    const label = document.getElementById(setting + "InputLabel");
    if (setting === 'bright') {
        label.innerHTML = "Brightness: " + input.value;
    } else {
        label.innerHTML =  setting.charAt(0).toUpperCase() + setting.slice(1) + ": " + input.value;
    }
}

function colorHue() {
    changeInputLabel('colorHue');
    const payload = {
        "pos": document.getElementById('colorHueInput').value
    };
    sendCmd("/image/colorHue", "POST", payload)
        .then((res) => {
            alertMsg("color hue res: " + res);
        })
        .catch((err) => {
            alertMsg(err, true);
        });
}

function brightness() {
    changeInputLabel('bright');
    const payload = {
        "pos": document.getElementById('brightInput').value
    };
    sendCmd("/image/bright", "POST", payload)
        .then((res) => {
            alertMsg("bright res: " + res);
        })
        .catch((err) => {
            alertMsg(err, true);
        });
}

function contrast() {
    changeInputLabel('contrast');
    const payload = {
        "pos": document.getElementById('contrastInput').value
    };
    sendCmd("/image/contrast", "POST", payload)
        .then((res) => {
            alertMsg("contrast res: " + res);
        })
        .catch((err) => {
            alertMsg(err, true);
        });
}

function saveSetting() {
    sendCmd("/image/save", "POST", {});
}
