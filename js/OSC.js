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
        this.osc = this._createOSCNode('triangle', 240);
        this.analyser = this._createAnalyserNode();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.3;
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount); // half of the fftSize
        this.gain = this._createGainNode();
        this.osc.connect(this.gain);
        this.gain.connect(this.analyser);
        // this.gain.connect(this.context.destination);
        this.analyser.connect(this.context.destination);
        // this.osc.start(0);
    }
};

function respondCanvas() {
    var timeDomainCanvas = $('#timeDomainCanvas')
    timeDomainCanvas.attr('width', timeDomainCanvas.parent().width());
    timeDomainCanvas.attr('height', timeDomainCanvas.parent().height());
}

function resetTimeDomainCanvas() {
    var timeDomaincanvas = $('#timeDomainCanvas')[0];
    var fixedWidth = timeDomaincanvas.width / (App.osc.analyser.fftSize / 2);
    for (var i = 0; i < App.osc.analyser.fftSize / 2; i++) {
        var point = App.Paper.path.segments[i].point;
        // point.x = point.x / 2;
        point.y = 300 / 4;
    }
    App.Paper.path.smooth();
}

$(document).ready(function() {
    App.osc.init();
    respondCanvas();
    $(window).resize(respondCanvas);
    var timeDomaincanvas = $('#timeDomainCanvas')[0];
    // canvas.width  = window.innerWidth;
    // canvas.height = 300;
    paper.setup(timeDomaincanvas);
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
    var fixedWidth = timeDomaincanvas.width / (App.osc.analyser.fftSize / 2);
    for (var i = 0; i < App.osc.analyser.fftSize / 2; i++) {
        var segment = App.Paper.path.add(new Point(i * fixedWidth, 300 / 4));
    }
    App.Paper.path.smooth();

    function updatePath() {
        App.osc.analyser.getByteTimeDomainData(App.osc.frequencyData);
        // var fixedWidth = window.innerWidth / App.osc.frequencyData.length;
        // console.log(App.osc.frequencyData.length);
        for (var i = 0; i < App.osc.frequencyData.length; i++) {
            var point = App.Paper.path.segments[i].point;
            // point.x = point.x / 2;
            point.y = App.osc.frequencyData[i] / 2;
        }
        // App.Paper.path.position.y = 300;
        // App.Paper.path.smooth();
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
        if (event.count % 4 === 0) {
            updatePath();
        }
        // App.osc.analyser.getByteFrequencyData(App.osc.frequencyData)
        // console.log(App.osc.frequencyData);
    }
    $('#switch').click(function(e) {
        if ($(this).prop('checked')) {
            var type = $('input[name="type"]:checked').val();
            if (type) {
                App.osc.osc.type = type;
                var f = $('#freq').val();
                App.osc.osc.frequency.value = f;
                App.osc.osc.start(0);
            } else {
                alert('Please select the oscillator type first!');
            }
        } else {
            App.osc.osc.stop(0);
            App.osc.init();
        }
    });
    $('input[name="type"]').on('change', function(e) {
        var type = $(this).filter(function(index) {
            return $(this).prop('checked');
        }).val();
        App.osc.osc.type = type;
    });

    $('#freq').on('change', function(e) {
        var f = $(this).val();
        console.log(f);
        App.osc.osc.frequency.value = f;
    });
});