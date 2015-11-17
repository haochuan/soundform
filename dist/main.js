/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var App = App || {};

	App.osc = {
	    context: null,
	    osc: null,
	    analyser: null,

	    init: function () {
	        try {
	            // Fix up for prefixing
	            window.AudioContext = window.AudioContext || window.webkitAudioContext;
	            this.context = new AudioContext();
	        } catch (e) {
	            alert('Web Audio API is not supported in this browser');
	        }
	        this._connectNodes();
	    },

	    _createOSCNode: function (type, freq) {
	        var osc = this.context.createOscillator();
	        osc.frequency.value = freq;
	        osc.type = type;
	        return osc;
	    },

	    _createGainNode: function () {
	        return this.context.createGain();
	    },

	    _createAnalyserNode: function () {
	        return this.context.createAnalyser();
	    },

	    _connectNodes: function () {
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
	};
	/**
	 * Adjust the canvas width and height based on its parent
	 */
	function respondCanvas() {
	    var timeDomainCanvas = $('#timeDomainCanvas');
	    var freqDomainCanvas = $('#freqDomainCanvas');
	    timeDomainCanvas.attr('width', timeDomainCanvas.parent().width());
	    timeDomainCanvas.attr('height', timeDomainCanvas.parent().height());
	    freqDomainCanvas.attr('width', freqDomainCanvas.parent().width());
	    freqDomainCanvas.attr('height', freqDomainCanvas.parent().height());
	}
	/**
	 * Update the time domain canvas
	 */
	function drawTimeDomain() {
	    var timeDomainCanvas = document.getElementById('timeDomainCanvas');
	    var HEIGHT = timeDomainCanvas.height;
	    var WIDTH = timeDomainCanvas.width;
	    var timeDomainCanvasContext = timeDomainCanvas.getContext('2d');
	    timeDomainCanvasContext.clearRect(0, 0, WIDTH, HEIGHT); // clear the current canvas
	    App.osc.analyser.getByteTimeDomainData(App.osc.timeData);
	    for (var i = 0; i < App.osc.timeData.length; i++) {
	        var value = App.osc.timeData[i];
	        var percent = value / 512;
	        var height = HEIGHT * percent;
	        var offset = HEIGHT - height - 1;
	        var barWidth = WIDTH / App.osc.analyser.frequencyBinCount;
	        timeDomainCanvasContext.fillStyle = 'black';
	        timeDomainCanvasContext.fillRect(i * barWidth, offset, 1, 1);
	    }
	}

	/**
	 * Update the frequency domain canvas
	 */
	function drawFreqDomain() {
	    var freqDomainCanvas = document.getElementById('freqDomainCanvas');
	    var HEIGHT = freqDomainCanvas.height;
	    var WIDTH = freqDomainCanvas.width;
	    var freqDomainCanvasContext = freqDomainCanvas.getContext('2d');
	    freqDomainCanvasContext.clearRect(0, 0, WIDTH, HEIGHT); // clear the current canvas
	    App.osc.analyser.getByteFrequencyData(App.osc.frequencyData);
	    for (var i = 0; i < App.osc.frequencyData.length; i++) {
	        var value = App.osc.frequencyData[i];
	        var percent = value / 512;
	        var height = HEIGHT * percent;
	        var offset = HEIGHT - height - 1;
	        var barWidth = WIDTH / App.osc.analyser.frequencyBinCount;
	        var hue = i / App.osc.analyser.frequencyBinCount * 360;
	        freqDomainCanvasContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
	        freqDomainCanvasContext.fillRect(i * barWidth, offset, barWidth, height);
	    }
	}

	$(document).ready(function () {
	    App.osc.init();
	    respondCanvas();
	    $(window).resize(respondCanvas);
	    updateCanvas();

	    function updateCanvas() {
	        requestAnimationFrame(updateCanvas);
	        drawTimeDomain();
	        drawFreqDomain();
	    }

	    $('#switch').click(function (e) {
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
	    $('input[name="type"]').on('change', function (e) {
	        var type = $(this).filter(function (index) {
	            return $(this).prop('checked');
	        }).val();
	        App.osc.osc.type = type;
	    });

	    $('#freq').on('change', function (e) {
	        var f = $(this).val();
	        App.osc.osc.frequency.value = f;
	    });
	});

/***/ }
/******/ ]);