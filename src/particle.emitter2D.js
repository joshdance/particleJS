/*
	2D Emitter class for ParticleJS
 */

"use strict";

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
		rndFeather		= (typeof options.randomFeather === 'number' ? options.randomFeather : 0) * 0.01,
		spread			= typeof options.spread === 'number' ? options.spread : 360,
		spreadAngle		= typeof options.spreadAngle === 'number' ? options.spreadAngle : 0,
		spreadRad		= spread * deg2rad,
		spreadAngleRad	= spreadAngle * deg2rad,
		red				= typeof options.r === 'number' ? options.r : 255,
		green			= typeof options.g === 'number' ? options.g : 255,
		blue			= typeof options.b === 'number' ? options.b : 255,
		gradient		= options.gradient ? options.gradient : null,

		renderer,
		preRender		= options.preRender,
		postRender		= options.postRender,

		count			= 0,

		particles		= [],
		cleanStamp		= 0,
		cleanInt		= 1000
		;


	// Check gradient

	if (gradient) gradient.generate();

	/*
		Create particles
	*/

	this.render = function(ts, diff, time) {

		//TODO move prerolling out of here and use physics directly

		var num = ((birthRate * ts) / diff + 0.5)|0,
			parts = [],
			part,
			angle = 0,
			vel = 0,
			vx = 0,
			vy = 0,
			sz = 0,
			i = 0,
			t = 0,
			o = 0,
			f = 0,
			population = false,
			phys = this.physics,
			p;

		//TODO Use remainder which accumulates per update

		//if (num < 1) num = 1;	//TODO if true, exit instead as we will use remainder

		if (preRender) renderer.preRender();

		// produce number of particles
		for(; i < num; i++) {

			angle = spreadRad * Math.random() + spreadAngleRad;

			vel = getSpreadValue(velocity, rndVelocity);
			sz = getSpreadValue(size, rndSize);
			o = getSpreadValue(opacity, rndOpacity);
			f = getSpreadValue(feather, rndFeather);

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

			p.opacityO = o;
			p.opacity = o * getOpacityOverLife(0);

			p.featherO = feather;
			p.feather = feather * getFeatherOverLife(0);

			parts.push(p);
		}

		// add to global array
		particles.push(parts);

		count = 0;

		//TODO: encapsulate following loop into a function

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
					renderer.renderParticle(p);

				}	// active

			}	// t

			if (!population) {
				particles[i-1] = [];
			}

		}	// i

		if (postRender) renderer.postRender();

		if (time - cleanInt > cleanStamp) {
			cleanStamp = time;
			for(i = particles.length; p = particles[--i];) {
				//TODO consider building a new array instead
				if (!p.length) particles.slice(i, 1);
			}
		}
	};

	function getSpreadValue(v, spread) {
		return v - (spread * v * Math.random());
	}

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

	this.sizeOverLife = new Float32Array([1]);
	this.opacityOverLife = new Float32Array([1]);
	this.featherOverLife = new Float32Array([1]);

	/*
	 Methods
	 */

	this.setRenderer = function(r) {

		renderer = r;

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

		return this;
	};

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

	this.life = function(l) {

		if (arguments.length === 0) return life * 0.001;

		life = l * 1000;
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

	/*
		Set renderer if defined in options
	 */
	if (options.renderer) this.setRenderer(options.renderer);
};
