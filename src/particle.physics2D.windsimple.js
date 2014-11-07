/*
	Physics plugin for wind (simple version)
 */

ParticleJS.Physics2D.WindSimple = function(angle, force) {

	angle = (typeof angle === 'number') ? angle : 0;
	force = (typeof force === 'number') ? force: 0;

	var	deg2rad	= 0.017453292519943295,
		angleRad = angle * deg2rad,
		cos = Math.cos(angleRad),
		sin = Math.sin(angleRad);

	this.init = function(e) {
		if (e.callback) e.callback(true);
	};

	this.apply = function(p) {
		p.vx += force * cos;
		p.vy += force * sin;
	};

	this.updateFrame = function(e) {
	};

	this.windAngle = function(a) {

		if (!arguments.length) return angle;

		angle = a;
		angleRad = a * deg2rad;

		cos = Math.cos(angleRad);
		sin = Math.sin(angleRad);

		return this;
	};

	this.windForce = function(f) {

		if (!arguments.length) return force;

		force = f;

		return this;
	};
};
