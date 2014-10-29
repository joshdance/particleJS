/*
	2D Emitter class for ParticleJS
 */

ParticleJS.Emitter2D = function(w, h, options) {

	options = options || {};

	var me				= this,
		deg2rad			= 0.017453292519943295,
		pID				= 0,

		birthRate		= typeof options.birthRate === 'number' ? options.birthRate : 100,	// particles per second
		velocity		= (typeof options.velocity === 'number' ? options.velocity : 100) * 0.01,
		opacity			= typeof options.opacity === 'number' ? options.opacity : 1,
		size			= typeof options.size === 'number' ? options.size : 1,
		life			= (typeof options.life === 'number' ? options.life : 3) * 1000,
		feather			= (typeof options.feather === 'number' ? options.feather : 40) * 0.01,
		rndVelocity		= (typeof options.randomVelocity === 'number' ? options.randomVelocity : 0) * 0.01,
		rndOpacity		= (typeof options.randomOpacity === 'number' ? options.randomOpacity : 0) * 0.01,
		rndSize			= (typeof options.randomSize === 'number' ? options.randomSize : 0) * 0.01,
		spread			= typeof options.spread === 'number' ? options.spread : 360,
		spreadAngle		= typeof options.spreadAngle === 'number' ? options.spreadAngle : 0,
		spreadRad		= spread * deg2rad,
		spreadAngleRad	= spreadAngle * deg2rad,
		red				= typeof options.r === 'number' ? options.r : 255,
		green			= typeof options.g === 'number' ? options.g : 255,
		blue			= typeof options.b === 'number' ? options.b : 255,
		gradient		= options.gradient ? options.gradient : null,

		renderer		= options.renderer || null,
		preRender		= options.preRender,
		postRender		= options.postRender,

		count			= 0,

		particles		= []
		;


	// Check gradient

	if (gradient) gradient.generate();

	/*
		Create particles
	*/
	if (renderer) renderer.init(w, h, {
		size: size,
		r: red,
		g: green,
		b: blue,
		feather: feather,
		opacity: opacity,
		gradient: gradient
	});

	// first call to setup - may be called several times if size etc. changes
	if (renderer) renderer.setup(w, h, {
		size: size,
		r: red,
		g: green,
		b: blue,
		feather: feather,
		opacity: opacity,
		gradient: gradient
	});

	this.render = function(ts, diff, time, preroll) {

		var num = ((birthRate * ts) / diff + 0.5)|0,
			parts = [],
			angle = 0,
			vel = 0,
			vx = 0,
			vy = 0,
			sz = 0,
			i = 0,
			t = 0,
			o = 0,
			population = false,
			phys = this.physics,
			p;

		//TODO check if this is necessary or if it need some other limitation
		/*if (num > birthRate * ts) {
			num = birthRate * ts;
		}
		else if (birthRate && num < 1) {
			num = 1;
		}*/

		if (preRender && !preroll) renderer.preRender();

		// produce number of particles
		for(; i < num; i++) {

			angle = spreadRad * Math.random() + spreadAngleRad;

			vel = velocity - (rndVelocity * velocity * Math.random());
			sz = size - (rndSize * size * Math.random());
			o = opacity - (rndOpacity * opacity * Math.random());

			vx = vel * Math.cos(angle);
			vy = vel * Math.sin(angle);

			p = new ParticleJS.Particle();

			p.id = ++pID;
			p.x = this.x;
			p.y = this.y;
			p.vx = vx;
			p.vy = vy;
			p.sizeO = sz;
			p.size = p.sizeO * getSizeOverLife(0);
			p.sizeR = p.sizeO * .5;
			p.life = life;
			p.born = time;

			p.r = red;
			p.g = green;
			p.b = blue;
			p.opacity = o;
			p.opacityO = o;

			p.feather = feather;
			p.featherO = feather;

			parts.push(p);
		}

		// add to global array
		particles.push(parts);

		count = 0;

		// iterate to update, apply physics, render and clean up
		for(i = 0; part = particles[i++];) {

			population = false;

			for(t = 0; p = part[t++];) {

				if (p.isActive) {

					count++;

					p.updateLife(time);

					var pi = p.lifeIndex;

					p.size = p.sizeO * getSizeOverLife(pi);
					p.sizeR = p.size * 0.5;

					p.opacity = p.opacityO * getOpacityOverLife(pi);
					p.feather = p.featherO * getFeatherOverLife(pi);

					population = true;

					// calc. velocity vector based on physics and local properties of particle
					phys.apply(p, ts);
					if (!preroll) renderer.renderParticle(p);

				}	// active

			}	// t

			if (!population) {
				particles[i-1] = [];
			}

		}	// i

		if (postRender && !preroll) renderer.postRender();
	};

	function getSizeOverLife(t) {

		//t = Math.min(1, Math.max(0, t));

		var a = me.sizeOverLife,
			l = a.length,
			i = (l * t + 0.5)|0;

		return a[i] || 0;
	}

	function getOpacityOverLife(t) {

		var a = me.opacityOverLife,
			l = a.length,
			i = (l * t + 0.5)|0;

		if (i < 0) i = 0;

		return a[i] || 1;
	}

	function getFeatherOverLife(t) {

		var a = me.featherOverLife,
			l = a.length,
			i = (l * t + 0.5)|0;

		return a[i] || 1;
	}

	/*
	 Settings
	 */

	this.x = typeof options.x === 'number' ? options.x : w * 0.5;
	this.y = typeof options.y === 'number' ? options.y : h * 0.5;

	this.physics = new ParticleJS.Physics();

	this.sizeOverLife = new Float32Array([0, 0.01, 0.25, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
	this.opacityOverLife = new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.25, 0.01]);
	this.featherOverLife = new Float32Array([1]); //new Float32Array([0.01, 0.25, 0.5, 0.75, 0.8, 0.9]);

	/*
		Methods
	 */

	this.birthRate = function(brate) {

		if (arguments.length === 0) return birthRate;

		if (brate < 0) brate = 0;
		birthRate = brate;
		return this;
	};

	this.feather = function(f) {

		if (arguments.length === 0) return feather * 100;

		if (f < 0) f = 0;
		feather = f * 0.01;
		return this;
	};

	this.opacity = function(o) {

		if (arguments.length === 0) return opacity;

		if (o < 0) o = 0;
		opacity = o;
		return this;
	};


	this.velocity = function(vel) {

		if (arguments.length === 0) return velocity * 100;

		velocity = vel * 0.01;
		return this;
	};

	this.size = function(sz) {

		if (arguments.length === 0) return size;

		if (sz < 1) sz= 1;

		size = sz;
		return this;
	};

	this.spread = function(angle) {

		if (arguments.length === 0) return angle;

		spread = angle;
		spreadRad = angle * deg2rad;

		return this;
	};

	this.spreadAngle = function(angle) {

		if (arguments.length === 0) return spreadAngle;

		spreadAngle = angle;
		spreadAngleRad = angle * deg2rad;

		return this;
	};




};
