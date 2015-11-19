import { Store, toImmutable } from 'nuclear-js';

export default Store({
    getInitialState() {
        return toImmutable({audioContext: this.initAudioContext()})
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
    }
})