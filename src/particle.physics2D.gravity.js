/*
	Physics plugin for gravity
 */

ParticleJS.Physics2D.Gravity = function(gx, gy) {

	gx = gx || 0;
	gy = gy || 0;

	var //isInited = false,
		w, h;

	this.init = function(e) {
		w = e.width;
		h = e.height;
		//isInited = true;

		if (e.callback) e.callback(true);
	};

	this.apply = function(p) {
		p.vx += gx;
		p.vy += gy;
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
