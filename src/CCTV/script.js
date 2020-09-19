'use strict';

const recordedVideo = document.querySelector('video#feed');
const startButton = document.querySelector('button#start');
const stopButton = document.querySelector('button#stop');

let mediaRecorder;
let recordedBlobs;

startButton.addEventListener('click', async () => {
    const constraints = {
      video: {
        width: 1280, height: 720
      }
    };
    console.log('Using media constraints:', constraints);
    await init(constraints);
});

async function init(constraints) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (e) {
        console.error('navigator.getUserMedia error:', e);
    }
}

function handleSuccess(stream) {
    stopButton.disabled = false;
    console.log('getUserMedia() got stream:', stream);
    window.stream = stream;

    const liveVideo = document.querySelector('video#feed');
    liveVideo.srcObject = stream;
    startRecording();
}

function startRecording() {
    recordedBlobs = [];
    let options = {mimeType: 'video/webm; codecs=vp9'};
    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        return;
    }

    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    mediaRecorder.onstop = (event) => {
        console.log('Recorder stopped: ', event);
        console.log('Recorded Blobs: ', recordedBlobs);
    };
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    console.log('MediaRecorder started', mediaRecorder);
}

function handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    console.log('Media Recorder Stoped', mediaRecorder);
    const res = window.confirm('Do you want to download the video?');
    if(res) {
        download();
    }
    stopButton.disabled = true;
});

function download() {
    const blob = new Blob(recordedBlobs, {type: 'video/mp4'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('video');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'test.mp4';
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}