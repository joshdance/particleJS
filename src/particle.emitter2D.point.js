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
		globalForce		= typeof options.globalForce === 'number' ? options.globalForce : 1,

		opacity			= typeof options.opacity === 'number' ? options.opacity : 1,
		size			= typeof options.size === 'number' ? options.size : 1,
		life			= (typeof options.life === 'number' ? options.life : 3) * 1000,
		feather			= (typeof options.feather === 'number' ? options.feather : 0.4),
		maxParticles	= (typeof options.maxParticles === 'number' ? options.maxParticles : 32000),

		rndVelocity		= (typeof options.randomVelocity === 'number' ? options.randomVelocity : 0),
		rndOpacity		= (typeof options.randomOpacity === 'number' ? options.randomOpacity : 0),
		rndSize			= (typeof options.randomSize === 'number' ? options.randomSize : 0),
		rndFeather		= (typeof options.randomFeather === 'number' ? options.randomFeather : 0),

		spread			= typeof options.spread === 'number' ? options.spread : 360,
		spreadAngle		= typeof options.spreadAngle === 'number' ? options.spreadAngle : 0,
		spreadRad		= spread * deg2rad,
		spreadAngleRad	= spreadAngle * deg2rad,
		red				= typeof options.r === 'number' ? options.r : 255,
		green			= typeof options.g === 'number' ? options.g : 255,
		blue			= typeof options.b === 'number' ? options.b : 255,
		gradient		= options.gradient ? options.gradient : null,
		rndColor		= options.randomColor || false,

		shader,
		preRender		= options.preRender,
		postRender		= options.postRender,

		count			= 0,			// active particles
		reverseZ		= false,		// render order

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
	this.init = function(e) {
		w = e.width;
		h = e.height;
		if (options.shader) me.setShader(options.shader);
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
		    ool = getOverLifeValue(this.opacityOverLife, 0),
		    fol = getOverLifeValue(this.featherOverLife, 0),
		    sol = getOverLifeValue(this.sizeOverLife, 0);

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
			p.sizeR = p.sizeO * 0.5;
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

		//return parts.length;
	};

	this.renderParticles = function(time, ts) {

		count = 0;

		// main
		if (preRender) shader.preRender();

		pushParticles(particles, physics);			// push particles to drawing surface

		if (postRender) shader.postRender({
			count: count,
			total: pID
		});

		// update physics plugins if they are animate-able
		for(var i = 0, l = physics.length; i < l; i++)
			physics[i].updateFrame({
				count: count
			});

		function pushParticles(particles, physics) {

			var i = 0,
				t,
				part,
				p,
				em = me,
				population,
				factor = ts * globalForce;

			// iterate to update, apply physics, render and clean up

			if (reverseZ) {

				i = particles.length - 1;

				for(; part = particles[i]; i--) {

					population = false;

					for(t = part.length - 1; p = part[t]; t--) {
						if (count < maxParticles) updateParticle(em, factor, p);
					}

					if (!population) particles[i] = [];
				}

			}
			else {

				for(; part = particles[i]; i++) {

					for(t = 0; p = part[t]; t++) {
						if (count < maxParticles) updateParticle(em, factor, p);
					}

					if (!population) particles[i] = [];
				}
			}

			function updateParticle(em, factor, p) {

				p.updateLife(time);

				if (p.isActive) {

					population = true;
					count++;

					var li = p.lifeIndex;

					p.opacity = p.opacityO * getOverLifeValue(em.opacityOverLife, li);
					p.feather = p.featherO * getOverLifeValue(em.featherOverLife, li);
					p.size = p.sizeO * getOverLifeValue(em.sizeOverLife, li);
					p.sizeR = p.size * 0.5;

					// calc. velocity vector based on physics and local properties of particle
					for(var m = 0, phl = physics.length; m < phl; m++)
						physics[m].apply(p);

					p.px = p.x;										// update previous position
					p.py = p.y;

					p.x += p.vx * factor;							// update new position
					p.y += p.vy * factor;

					p.angle = getAngle(p.px, p.py, p.x, p.y);		// update current angle

					if (p.size >= 1 && p.opacity)
						shader.renderParticle(p);
				}
			}

			function getAngle(x0, y0, x1, y1) {
				var dx = x1 - x0,
					dy = y1 - y0;
				return Math.atan2(dy, dx);
			}

		} // pushParticles()

	}; // renderParticles()

	this.cleanupParticles = function(time) {

		// clean-up empty arrays. todo: try to find factor-based ideal time int.
		if (time - cleanInt > cleanStamp) {

			cleanStamp = time;

			// rebuild array wins over slice away:
			// http://jsperf.com/slice-away-versus-rebuilding-array
			var tmpParticles = [];

			particles.forEach(function(part) {
				if (part.length) tmpParticles.push(part);
			});

			particles = tmpParticles;
		}

	};

	function getOverLifeValue(arr, t) {

		var	l = arr.length - 1,
			i = (l * t)|0;

		return arr[i] || 0;
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

	this.addPhysics = function(phys, callback) {

		if (phys.init && phys.apply) {

			physics.push(phys);

			phys.init({
				width: w,
				height: h,
				callback: callback
			});
		}

		return this;
	};

	this.setShader = function(r, callback) {

		if (r && r.init) {

			shader = r;

			// initial call to set up drawing surface and cache
			shader.init({
				width   : w,
				height  : h,
				r       : red,
				g       : green,
				b       : blue,
				gradient: gradient,
				rndColor: rndColor,
				callback: function(state) {
					if (!state) throw "Fatal: Could not init renderer.";
					if (callback) callback(true);
				}
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

		if (!arguments.length) return feather;

		if (f < 0) f = 0;
		else if (f > 1) f = 1;

		feather = f;

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

		if (sz < 1) sz = 1;
		size = sz;

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

	this.globalForce = function(gf) {

		if (!arguments.length) return globalForce;

		globalForce = gf;

		return this;
	};

	this.translate = function(dx, dy) {

		// iterate to update, apply physics, render and clean up
		for(var i = 0, part; part = particles[i++];) {
			for(var t = 0, p; p = part[t++];) {
				if (p.isActive) {
					p.x += dx;
					p.y += dy;
				}
			}
		}

		return this;
	};

	this.rotate = null;
	this.scale = null;

	this.reverseZ = function(state) {
		if (!arguments.length) return reverseZ;
		if (typeof state === 'boolean') reverseZ = state;
		return this;
	};

	//todo untested
	this.clear = function(brate) {
		particles = [];
		if (typeof brate === 'number') this.birthRate(brate);
		return this;
	};

	this.preRender = function(state) {
		if (!arguments.length) return preRender;
		if (typeof state === 'boolean') preRender = state;
		return this;
	};

	this.postRender = function(state) {
		if (!arguments.length) return postRender;
		if (typeof state === 'boolean') postRender = state;
		return this;
	};

};
