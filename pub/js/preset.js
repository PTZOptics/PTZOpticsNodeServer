/*jshint esversion: 6 */

function presetAction(action, eleId = 'presetInput') {
    let payload = {
        mode: action
    };
    if (action === 'speed') {
        payload.speed = document.getElementById(eleId).value;
        changePresetSpeedLabel(payload.speed);
    } else {
        animateActionBtn(action);
        payload.memNum = document.getElementById(eleId).value;
    }

    sendCmd('/ptz/presets', 'POST', payload)
        .then((res) => {
            console.log(res);
            if (action !== 'speed' && res === "Socket1 Cmd Done" || action !== 'speed' && res === "Socket2 Cmd Done") {
                stopPresetBtnAnimate(action);
            }
            alertMsg("Preset Action res: " + res + " Payload: " + payload);
        }).catch((err) => {
            alertMsg(err, true);
        });
}

function animateActionBtn(action) {
    const btn = document.getElementById(action + 'PresetBtn');
    btn.innerHTML = '<i class="fa fa-spinner fa-pulse"></i>';
}

function stopPresetBtnAnimate(action) {
    const btn = document.getElementById(action + 'PresetBtn');
    btn.innerHTML = action.charAt(0).toUpperCase() + action.slice(1);
}

function changePresetSpeedLabel(speed) {
    document.getElementById("presetSpeedLabel").innerHTML = "Preset Recall Speed: " + speed;
}
