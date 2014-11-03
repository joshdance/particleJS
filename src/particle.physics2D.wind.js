/*
	Physics plugin for wind
 */

ParticleJS.Physics2D.Wind = function(wx, wy, ar) {

	wx = wx || 0;
	wy = wy || 0;
	ar = ar || 0;

	var	w, h;

	this.init = function(width, height) {
		w = width;
		h = height;
	};

	this.apply = function(p, ts) {
		p.x += wx * ts;
		p.y += wy * ts;
	};

	this.setX = function(x) {
		wx = x;
		return this;
	};

	this.setY = function(y) {
		wy = y;
		return this;
	};

};
