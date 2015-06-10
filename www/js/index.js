/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var onOFF = '0';

/*************************** EXIT APP - INI ***************************/
// Long Touch to exit App
var touchduration = 300;
var timerInterval = 0;

function timer(interval){
    interval--;
    if (interval >= 0) {
        timerInterval = setTimeout(function() {
            timer(interval);
        });
    }
    else    {
        taphold();
    }
}

function touchstart() {
    alert('touchstart');
    timer(touchduration);
}

function touchend() {
    alert('touchend');
    clearTimeout(timerInterval);
}

function taphold(){
    alert("taphold");
    var txt;
    var r = confirm("¿Quieres cerrar la aplicación?");
    if (r == true) {
        navigator.app.exitApp();
    }
}

function exitApp() {
    document.getElementById("btnExit").addEventListener('touchstart', touchstart);
    document.getElementById("btnExit").addEventListener('touchend', touchend);

    if(timerInterval < touchduration){
        onOff();
    }
}

/*************************** EXIT APP - END ***************************/

/*************************** ON OFF - INI ***************************/
function onOff() {
    switch(onOFF) {
        case '0':
            document.getElementById('divNote').style.visibility = 'visible';
            document.getElementById('divPitchL').style.visibility = 'visible';
            document.getElementById('divPitchR').style.visibility = 'visible';
            onOFF = '1';
            captureAudio();
            break;
        case '1':
            document.getElementById('divNote').style.visibility = 'hidden';
            document.getElementById('divPitchL').style.visibility = 'hidden';
            document.getElementById('divPitchR').style.visibility = 'hidden';
            onOFF = '0';
            break;
    }
}
/*************************** ON OFF - INI ***************************/


/***************************************************************************/
/*************************** CAPTURE AUDIO - INI ***************************/
/***************************************************************************/
// Called when capture operation is finished
//
function captureSuccess(mediaFiles) {
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        uploadFile(mediaFiles[i]);
    }
}

// Called if something bad happens.
//
function captureError(error) {
    var msg = 'An error occurred during capture: ' + error.code;
    navigator.notification.alert(msg, null, 'Uh oh!');
}

// A button will call this function
//
function captureAudio() {
    // Launch device audio recording application,
    // allowing user to capture up to 2 audio clips
    navigator.device.capture.captureAudio(captureSuccess, captureError, {limit: 2});
}

// Upload files to server
function uploadFile(mediaFile) {
    var ft = new FileTransfer(),
        path = mediaFile.fullPath,
        name = mediaFile.name;

    ft.upload(path,
        "http://my.domain.com/upload.php",
        function(result) {
            console.log('Upload success: ' + result.responseCode);
            console.log(result.bytesSent + ' bytes sent');
        },
        function(error) {
            console.log('Error uploading file ' + path + ': ' + error.code);
        },
        { fileName: name });
}
