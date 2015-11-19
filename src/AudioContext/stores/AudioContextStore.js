import { Store, toImmutable } from 'nuclear-js';
import randomString from 'randomstring';

export default Store({
    getInitialState() {
        return toImmutable({
            audioContext: this.initAudioContext(),
            audioNodes: {}
        });
    },

    initialize() {
        this.on(ADD_NODE, addNode);
        this.on(UPDATE_NODE, updateNode);
        this.on(DELETE_NODE, deleteNode);
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
});

/**

    TODO:
    - Seems imposible to write the audio node into an immutable data structure

 */

function addNode(state, audioNode) {
    let id = randomstring.generate(16);
    return state.setIn(['audioNodes', id], audioNode);
}

function updateNode(state, id) {
    return state.updateIn(['audioNodes', id], id);
}