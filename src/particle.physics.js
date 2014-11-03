/*
	Physics "engine" for ParticleJS
	Note: Per emitter.
*/

ParticleJS.Physics = function() {

	this.gravityX = 0;
	this.gravityY = 0;
	this.gravityZ = 0;

	this.windX = 0;
	this.windY = 0;
	this.windZ = 0;

	this.airResistance = 0;

	this.turbulenceRadius = 0;
	this.turbulenceSize = 0;		// affects size 0-1
	this.turbulencePosition = 0;	// affects position 0-1

	this.magnetX = 400;
	this.magnetY = 300;
	this.magnetZ = 0;
	this.magnetRadius = 100;
	this.magnetRadiusSqr = 100*100;	// square (TODO calc. in future method)
	this.magnetForce = 0.25;		// -1-0-1
	this.magnetIsRelative = false;

	// run all particles from an emitter through the physics instance

	this.apply = function(p, ts) {

		//var ar = this.airResistance;
		var mi;

		p.px = p.x;
		p.py = p.y;

		p.vx += this.gravityX * ts;
		p.vy += this.gravityY * ts;

		//TODO this is broke...
		/*if (ar && p.lifeIndex >= ar) {
			p.vx *= (1 - ar);
			p.vy *= (1 - ar);
		}*/

		p.x += p.vx * ts + this.windX;
		p.y += p.vy * ts + this.windY;

		if (this.magnetForce) {
			mi = getAngleDist(this.magnetX, this.magnetY, p.x, p.y);
			if (mi.dist < this.magnetRadiusSqr) {
				p.vx -= (mi.dx / this.magnetRadius) * this.magnetForce;
				p.vy -= (mi.dy / this.magnetRadius) * this.magnetForce;
			}
		}
	};

	function getAngle(x0, y0, x1, y1) {
		var dx = (x1-x0),
			dy = (y1-y0);
		return Math.atan2(dy, dx);
	}

	function getAngleDist(x0, y0, x1, y1) {
		var dx = (x1-x0),
			dy = (y1-y0);
		return {
			angle: Math.atan2(dy, dx),
			dist : Math.abs(dx*dx + dy*dy),
			dx: dx,
			dy: dy
		}
	}

	function getAngleDistSqr(x0, y0, x1, y1) {
		var dx = (x1-x0),
			dy = (y1-y0);
		return {
			angle: Math.atan2(dy, dx),
			dist : Math.sqrt(dx*dx + dy*dy)
		}
	}

	function getDistNonSqr(x0, y0, x1, y1) {
		var dx = (x1-x0),
			dy = (y1-y0);
		return Math.abs(dx*dx + dy*dy);
	}

	function getDistSqr(x0, y0, x1, y1) {
		var dx = (x1-x0),
			dy = (y1-y0);
		return Mth.sqrt(dx*dx + dy*dy);
	}

	function getForce(magA, magB, dist) {
		var mag = magA * magB;
		return Math.sqrt((mag * mag) / dist);	// perm=4*PI
	}

	function getDiff(x0, y0, x1, y1) {
		return {
			x: x1 - x0,
			y: y1 - y0
		}
	}
};