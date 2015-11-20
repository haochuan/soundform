import React, { Component } from 'react';
import ControlPanel from 'ControlPanel';

export class Soundform extends Component {
    constructor() {
        this.audioContext = initAudioContext();
    },

    initAudioContext() {
        try {
            // Fix up for prefixing
            window.AudioContext = window.AudioContext||window.webkitAudioContext;
            let audioContext = new AudioContext();
        } catch(e) {
            alert('Web Audio API is not supported in this browser');
        }
        return audioContext;
    },

    render() {
        return {
            <ControlPanel />
        }
    }
};