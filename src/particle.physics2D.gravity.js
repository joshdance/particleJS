/*
	Physics plugin for gravity
 */

ParticleJS.Physics2D.Gravity = function(gx, gy) {

	gx = gx || 0;
	gy = gy || 0;

	var	w, h;

	this.init = function(width, height) {
		w = width;
		h = height;
	};

	this.apply = function(p, ts) {
		p.vx += gx * ts;
		p.vy += gy * ts;
	};

	this.setX = function(x) {
		gx = x;
		return this;
	};

	this.setY = function(y) {
		gy = y;
		return this;
	};

};
