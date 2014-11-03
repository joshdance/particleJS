/*
	Physics plugin for magnet (aka. attractor / repeller / jet)
 */

ParticleJS.Physics2D.Magnet = function(x, y, radius, force) {

	x = x||0;
	y = y||0;
	radius = radius || 100;
	force = force || 0;

	var radius2 = radius * radius,
		dia = radius * 2,
		rx1, ry1, rx2, ry2,
		w, h;

	this.init = function(width, height) {
		w = width;
		h = height;
		calcRegion();
	};

	this.apply = function(p, ts) {
		if (force && isInRegion(p.x, p.y)) {
			var mi = getAngleDist(x, y, p.x, p.y);
			if (mi.dist < radius2) {
				p.vx -= (mi.dx / dia) * force * ts;
				p.vy -= (mi.dy / dia) * force * ts;
			}
		}
	};

	this.setPosition = function(mx, my) {
		x = mx;
		y = my;
		calcRegion();
		return this;
	};

	this.setForce = function(f) {
		force = f;
		return this;
	};

	this.setRadius = function(r) {
		radius = r;
		radius2 = r * r;
		dia = r * 2;
		calcRegion();
		return this;
	};

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

	function calcRegion() {
		rx1 = Math.max(0, x - radius);
		ry1 = Math.max(0, y - radius);
		rx2 = Math.min(w, x + radius);
		ry2 = Math.min(h, y + radius);
	}

	function isInRegion(x, y) {
		return (x >= rx1 && x < rx2 && y >= ry1 && y < ry2);
	}
};
