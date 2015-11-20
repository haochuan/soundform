import { Store, toImmutable } from 'nuclear-js';
import randomString from 'randomstring';

const audioContext = initAudioContext();

export default Store({
    getInitialState() {
        return toImmutable({});
    },

    initialize() {
        this.on(PLAY, play);
        this.on(STOP, updateNode);
        this.on(CHANGE_FREQ, deleteNode);
        this.on(CHANGE_TYPE, deleteNode);
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

    _createOSCNode: function(audioContext, type, freq) {
        let osc = audioContext.createOscillator();
        osc.frequency.value = freq;
        osc.type = type;
        return osc;
    },

    _createGainNode: function(audioContext) {
        return audioContext.createGain();
    },

    _createAnalyserNode: function(audioContext) {
        return audioContext.createAnalyser();
    },

    _connectNodes: function(audioContext) {
        this.osc = this._createOSCNode('triangle', 240);
        this.analyser = this._createAnalyserNode();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.3;
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount); // half of the fftSize
        this.timeData = new Uint8Array(this.analyser.frequencyBinCount); // half of the fftSize
        this.gain = this._createGainNode();
        this.osc.connect(this.gain);
        this.gain.connect(this.analyser);
        // this.gain.connect(this.context.destination);
        this.analyser.connect(this.context.destination);
        // this.osc.start(0);
    }
});

function initAudioContext() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        let audioContext = new AudioContext();
    } catch(e) {
        alert('Web Audio API is not supported in this browser');
    }
    return audioContext;
}

function play() {

}
