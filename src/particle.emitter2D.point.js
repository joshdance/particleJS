/*
	2D Emitter class for ParticleJS
 */

ParticleJS.Emitter2D.Point = function(options) {

	options = options || {};

	var me				= this,
		w,
		h,
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

		count			= 0,			// active particles

		particles		= [],
		physics			= [],
		cleanStamp		= 0,
		cleanInt		= 1000
		;

	// Check gradient
	if (gradient) {
		if (Array.isArray(gradient)) {
			gradient = {
				cache: gradient
			};
		}
		else {
			gradient.generate();
		}
	}

	// called from scene
	this.init = function(width, height) {
		w = width;
		h = height;
		if (options.renderer) me.setRenderer(options.renderer);
	};

	/*
		Generate and render particles
	*/

	this.generateParticles = function(time, num) {

		var	parts = [],
		    angle = 0,
		    vel = 0,
		    vx = 0,
		    vy = 0,
		    sz = 0,
		    o = 0,
		    f = 0,
		    em = me,
		    ool = getOpacityOverLife(0),
		    fol = getFeatherOverLife(0),
		    sol = getSizeOverLife(0);

		// produce number of particles
		while(num--) {

			angle = spreadRad * Math.random() + spreadAngleRad;

			vel = getSpreadValue(velocity, rndVelocity);
			sz = getSpreadValue(size, rndSize);
			o = getSpreadValue(opacity, rndOpacity);
			f = getSpreadValue(feather, rndFeather);

			vx = vel * Math.cos(angle);
			vy = vel * Math.sin(angle);

			var p = new ParticleJS.Particle2D();

			p.id = ++pID;
			p.x = em.x;
			p.y = em.y;
			p.vx = vx;
			p.vy = vy;
			p.angle = angle;
			p.sizeO = sz;
			p.size = p.sizeO * sol;
			p.sizeR = p.sizeO * .5;
			p.life = life;
			p.born = time;

			p.r = red;
			p.g = green;
			p.b = blue;

			p.opacityO = o;
			p.opacity = o * ool;

			p.featherO = feather;
			p.feather = feather * fol;

			parts.push(p);
		}

		// add to global array
		particles.push(parts);

		function getSpreadValue(v, spread) {
			return v - (spread * v * Math.random());
		}

	};

	this.renderParticles = function(time, ts, diff) {

		count = 0;

		// main
		if (preRender) renderer.preRender();
		pushParticles(particles, physics);			// push particles to drawing surface
		if (postRender) renderer.postRender();

		function pushParticles(particles, physics) {

			var i = -1,
				len = particles.length,
				part,
				population;

			// iterate to update, apply physics, render and clean up
			while(++i < len) {

				part = particles[i];

				population = false;

				part.forEach(function(p) {

					p.updateLife(time);

					if (p.isActive) {

						population = true;

						count++;

						var pi = p.lifeIndex;
						p.opacity = p.opacityO * getOpacityOverLife(pi);
						p.feather = p.featherO * getFeatherOverLife(pi);
						p.size = p.sizeO * getSizeOverLife(pi);
						p.sizeR = p.size * 0.5;

						// calc. velocity vector based on physics and local properties of particle
						physics.forEach(function(phys) {
							phys.apply(p, ts);
						});

						// update position
						p.x += p.vx;
						p.y += p.vy;

						renderer.renderParticle(p);
					}

				});	// forEach

				if (!population) particles[i] = [];

			}	// i
		}

	};

	this.cleanupParticles = function(time) {

		// clean-up empty arrays. todo: find ideal time int.
		if (time - cleanInt > cleanStamp) {
			cleanStamp = time;
			// rebuild array wins over slice away: http://jsperf.com/slice-away-versus-rebuilding-array
			var tParticles = [];
			for(var i = 0, p; p = particles[i++];) if (p.length) tParticles.push(p);
			particles = tParticles;
			tParticles = null;
		}

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

		//if (i < 0) i = 0;

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

	this.x = options.x;
	this.y = options.y;

	this.sizeOverLife = new Float32Array([1]);
	this.opacityOverLife = new Float32Array([1]);
	this.featherOverLife = new Float32Array([1]);

	/*
	 Methods
	 */

	this.addPhysics = function(phys) {
		if (phys.apply) {
			physics.push(phys);
			phys.init(w, h);
		}
		return this;
	};

	this.setRenderer = function(r) {

		renderer = r;

		if (renderer) {
			// initial call to set up drawing surface
			renderer.init(w, h);

			// first call to setup - may be called several times if size etc. changes
			renderer.setup(w, h, {
				size    : 100,	// max particle size for sprite sheet
				feather : feather,
				opacity : opacity,
				r       : red,
				g       : green,
				b       : blue,
				gradient: gradient
			});
		}

		return this;
	};

	this.birthRate = function(brate) {

		if (!arguments.length) return birthRate;

		if (brate < 0) brate = 0;
		birthRate = brate;

		return this;
	};

	this.feather = function(f) {

		if (!arguments.length) return feather * 100;

		if (f < 0) f = 0;
		feather = f * 0.01;

		return this;
	};

	this.opacity = function(o) {

		if (!arguments.length) return opacity;

		if (o < 0) o = 0;
		opacity = o;

		return this;
	};

	this.life = function(l) {

		if (!arguments.length) return life * 0.001;
		life = l * 1000;

		return this;
	};

	this.velocity = function(vel) {

		if (!arguments.length) return velocity * 100;
		velocity = vel * 0.01;

		return this;
	};

	this.size = function(sz) {

		if (!arguments.length) return size;
		if (sz < 1) sz= 1;
		size = sz;

		//todo update renderer

		return this;
	};

	this.spread = function(angle) {

		if (!arguments.length) return angle;
		spread = angle;
		spreadRad = angle * deg2rad;

		return this;
	};

	this.spreadAngle = function(angle) {

		if (!arguments.length) return spreadAngle;
		spreadAngle = angle;
		spreadAngleRad = angle * deg2rad;

		return this;
	};

	this.translate = function(dx, dy, dz) {

		var i = 0,
			part;

		// iterate to update, apply physics, render and clean up
		for(; part = particles[i++];) {
			for(var t = 0, p; p = part[t++];) {
				if (p.isActive) {
					p.x += dx;
					p.y += dy;
				}
			} // t

		}	// i

		return this;
	};

	this.rotate;
	this.scale;

};
