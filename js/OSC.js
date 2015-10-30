var App = App || {};

App.osc = {
    context: null,
    osc: null,
    analyser: null,

    init: function() {
        try {
            // Fix up for prefixing
            window.AudioContext = window.AudioContext||window.webkitAudioContext;
            this.context = new AudioContext();
        } catch(e) {
            alert('Web Audio API is not supported in this browser');
        }
        this._connectNodes();
    },

    _createOSCNode: function(type, freq) {
        var osc = this.context.createOscillator();
        osc.frequency.value = freq;
        osc.type = type;
        return osc;
    },

    _createAnalyserNode: function() {
        return this.context.createAnalyser();
    },

    _connectNodes: function() {
        this.osc = this._createOSCNode('sine', 440);
        this.analyser = this._createAnalyserNode();
        this.osc.connect(this.analyser);
        this.analyser.connect(this.context.destination);
        this.osc.start(0);
    }
};