import React from 'react';

(function initAudioContext() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
    } catch(e) {
        alert('Web Audio API is not supported in this browser');
    }
})();
// import Soundfrom from 'Soundform/';
let ai = 1;

