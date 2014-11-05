/*
	Physics plugin for wind
 */

ParticleJS.Physics2D.Wind = function(wx, wy, ar) {

	wx = wx || 0;
	wy = wy || 0;
	ar = ar || 0;

	var	w, h;

	this.init = function(e) {
		w = e.width;
		h = e.height;
		if (e.callback) e.callback(true);
	};

	this.apply = function(p) {
		p.x += wx;
		p.y += wy;
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
