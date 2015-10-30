var App = App || {};
App.Paper = {};
paper.install(window);

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

    _createGainNode: function() {
        return this.context.createGain();
    },

    _createAnalyserNode: function() {
        return this.context.createAnalyser();
    },

    _connectNodes: function() {
        this.osc = this._createOSCNode('sine', 240);
        this.analyser = this._createAnalyserNode();
        this.analyser.fftSize = 2048;
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        this.gain = this._createGainNode();
        this.osc.connect(this.gain);
        this.gain.connect(this.analyser);
        // this.gain.connect(this.context.destination);
        this.analyser.connect(this.context.destination);
        this.osc.start(0);
    }
};

$(document).ready(function() {
    var canvas = $('#canvas')[0];
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight - 100;
    paper.setup(canvas);
    App.osc.init();
    // var myPath = new Path();
    // myPath.strokeColor = 'black';
    // myPath.add(new Point(0, 0));
    // myPath.add(new Point(100, 50));
    App.Paper.path = new Path();
    // Give the stroke a color
    App.Paper.path.strokeColor = 'black';
    // App.Paper.path.fillColor = 'black';
    // App.Paper.path.closed = true;
    // App.Paper.path.add(new Point(100, 100));
    // App.Paper.path.add(new Point(500, 100));
    for (var i = 0; i < App.osc.analyser.fftSize; i++) {
        var segment = App.Paper.path.add(new Point(i, 500));
    }
    App.Paper.path.smooth();

    function updatePath() {
        App.osc.analyser.getByteTimeDomainData(App.osc.frequencyData);
        // console.log(App.osc.frequencyData.length);
        for (var i = 0; i < App.osc.frequencyData.length; i++) {
            var point = App.Paper.path.segments[i].point;
            point.y = App.osc.frequencyData[i] + 80;
        }
        // App.Paper.path.position.y = 300;
        App.Paper.path.smooth();
    }
    // var start = new paper.Point(100, 100);
    // Move to start and draw a line from there
    // path.moveTo(start);
    // Note that the plus operator on Point objects does not work
    // in JavaScript. Instead, we need to call the add() function:
    // path.lineTo(start.add([ 200, -50 ]));
    // Draw the view now:
    // paper.view.draw();
    view.onFrame = function(event) {
        if (event.count % 10 === 0) {
            updatePath();
        }
        // App.osc.analyser.getByteFrequencyData(App.osc.frequencyData)
        // console.log(App.osc.frequencyData);
    }
});