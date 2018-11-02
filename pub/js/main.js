/*jshint esversion: 6 */

function sendCmd(path, method, payload = {}) {
    const server = 'http://' + document.location.hostname + ':4000';
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, server + path);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.response);
            }
        };
        xhr.onerror = function() {
            reject(xhr.response);
        };
        if (method !== "GET") {
            payload.id = getCurrentCamera().value;
            xhr.send(JSON.stringify(payload));
        } else {
            xhr.send();
        }
    });
}

function alertMsg(msg, err) {
    const msgStage = document.getElementById('msgStage');
    msgStage.style.display = "block";

    if (err) {
        msgStage.classList.add("errMsg");
        setTimeout(() => {
            msgStage.classList.remove("errMsg");
            msgStage.style.display = "none";
        }, 4000);
    } else {
        msgStage.classList.add("successMsg");
        setTimeout(() => {
            msgStage.classList.remove("successMsg");
            msgStage.style.display = "none";
        }, 4000);
    }

    msgStage.innerHTML = msg;
}

function getAllSavedCameras() {
    return new Promise((resolve, reject) => {
        resolve(sendCmd('/camera/cameras', 'GET', null));
    });
}

function getCurrentCamera() {
    const cameraSelectTag = document.getElementById('cameraList');
    return cameraSelectTag.options[cameraSelectTag.selectedIndex];
}

function optionView(view) {
    document.getElementById("options").querySelectorAll("a.active")[0].classList.remove("active", "highlight");
    document.querySelectorAll("a[value=" + view + "]")[0].classList.add("active", "highlight");

    const allOptionViews = document.getElementsByClassName('optionView');
    Array.prototype.forEach.call(allOptionViews, function(view) {
        view.style.display = "none";
    });
    document.getElementById(view).style.display = "block";
}

Array.prototype.forEach.call(document.getElementsByClassName('panTiltInput'), function(input) {
    input.addEventListener('change', changeRangeInputLabel, false);
});

function changeRangeInputLabel(e) {
    const identity = e.currentTarget.getAttribute('data-html');
    document.getElementById(identity + "SpeedLabel").innerHTML = identity.charAt(0).toUpperCase() + identity.slice(1) + " Speed: " + e.currentTarget.value;
}

function addCamera() {
    const payload = {
        name: document.getElementById('cameraNickname').value,
        ip: document.getElementById('cameraIpAddy').value,
        port: document.getElementById('cameraPort').value,
        rtsp: document.getElementById('cameraRtsp').value
    };
    sendCmd('/camera/create', 'POST', payload)
        .then(function(res) {
            const camera = JSON.parse(res);
            addCameraTag(camera);
            alertMsg("Camera Successfully Added");
        })
        .catch(err => {
            alertMsg(err);
        });
}

function toggleSideBar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    if(sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        content.classList.remove('active');
    } else {
        sidebar.classList.add('active');
        content.classList.add('active');
    }
}

function addCameraTag(camera, index = 1) {
    const optTag = document.createElement("option");
    const eleId = camera.name || camera.ip;
    optTag.dataset.streamPort = camera.streamPort;
    if (index === 0) {
        optTag.setAttribute("selected", "selected");
    }
    optTag.appendChild(document.createTextNode(eleId));
    optTag.setAttribute("value", camera._id);
    document.getElementById('cameraList').appendChild(optTag);
}

function deleteCamera() {
    const camera = getCurrentCamera();
    if(confirm("Would you like to delete " + camera.innerHTML + "?")) {
        sendCmd('/camera/', "DELETE")
            .then(() => {
                const cameraSelectTag = document.getElementById('cameraList');
                cameraSelectTag.remove(cameraSelectTag.selectedIndex);
                changeStream();
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

function reqFullScreen() {
    const doc = window.document;
    const docEl = doc.documentElement;

    const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
    } else {
        cancelFullScreen.call(doc);
    }
}
