/*
	Scene class for ParticleJS
*/

ParticleJS.Scene = function(options) {

	options = options || {};

	var me				= this,
		width			= options.width || 512,							// width of scene
		height			= options.height || 256,						// height of scene
		mode			= options.mode ? options.mode : '',
		mode3D			= mode === '3D',								// mode: 0 = 2D, 1 = 3D
		frameBound		= !!options.frameBound,							// frame or time bound, def. time
		FPS				= options.FPS || 60,

		lights			= [],
		cameras			= [],

		lastTime		= performance.now()
	;

	this.emitters		= [];

	this.addCamera = function(options) {

		if (!mode3D)
			throw "Need to be in 3D mode to add a camera.";

	};

	this.addLight = function(options) {

		if (!mode3D)
			throw "Need to be in 3D mode to add a light.";

	};

	this.addEmitter = function(emitter) {

		emitter.init({
			width: width,
			height: height
		});

		this.emitters.push(emitter);
		return this;
	};

	//TODO: disabled for now
	this.preRoll = function(frames) {
		//TODO use physics directly and as frame bound (ts=1), lifeUpdate changes..
		var time = performance.now();
		for(var pre = 0; pre < frames; pre++) {
			for(var i = 0, e; e = this.emitters[i++];) {
				//e.renderParticles(1, 16.667, time, true);
			}
		}
		return this;
	};

	this.render = function() {

		var time = performance.now(),
			diff = time - lastTime,
			ts = frameBound ? 60 / FPS : diff / 16.6667;

		lastTime = time;

		for(var i = 0, e; e = this.emitters[i++];) {
			var num = ((e.birthRate() * ts) / diff + 0.5)|0;
			e.generateParticles(time, num);
			e.renderParticles(time, ts);
			e.cleanupParticles(time);
		}

		return this;
	};

};