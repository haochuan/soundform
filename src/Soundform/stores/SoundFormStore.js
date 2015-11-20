import { Store, toImmutable } from 'nuclear-js';
import {
    PLAY,
    STOP,
    CHNAGE_TYPE,
    CHNAGE_FREQ,
    DRAW_TIMEDOMAIN,
    DRAW_FREQDOMAIN
} from '../actionTypes';

export default Store({
    getInitialState() {
        this._connectNodes();
        return toImmutable({});
    },

    initialize() {
        this.on(PLAY, this._play);
        // this.on(STOP, updateNode);
        // this.on(CHANGE_FREQ, deleteNode);
        // this.on(CHANGE_TYPE, deleteNode);
    },

    _createOSCNode: function(type, freq) {
        let osc = audioContext.createOscillator();
        osc.frequency.value = freq;
        osc.type = type;
        return osc;
    },

    _createGainNode: function() {
        return audioContext.createGain();
    },

    _createAnalyserNode: function() {
        return audioContext.createAnalyser();
    },

    _connectNodes: function() {
        this.osc = this._createOSCNode('sine', 440);
        this.analyser = this._createAnalyserNode();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.3;
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount); // half of the fftSize
        this.timeData = new Uint8Array(this.analyser.frequencyBinCount); // half of the fftSize
        this.gain = this._createGainNode();
        this.osc.connect(this.gain);
        this.gain.connect(this.analyser);
        // this.gain.connect(this.context.destination);
        this.analyser.connect(audioContext.destination);
        // this.osc.start(0);
    },

    _play: function() {
        this.osc.start(0);
    }
});
