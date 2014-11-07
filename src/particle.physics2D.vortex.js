/*
	Physics plugin for magnet (aka. attractor / repeller / jet)
 */

ParticleJS.Physics2D.Vortex = function(cx, cy, radius, cellsX, cellsY, force) {

	cx = cx||0;
	cy = cy||0;
	radius = (typeof radius === 'number') ? radius : 100;
	cellsX = cellsX||32;
	cellsY = cellsY||32;
	force = (typeof force === 'number') ? force : 0.5;

	var isInited = false,
		grid,

		suction	= 0.75,		// suction towards center, 0=none, 1 = 90deg, -1 = -90deg
		aVariation = 1,		// angle
		sVariation = 0.5,	// speed
		direction = -1,		// direction
		fVariation = 0.5,	// force
		innerForce = 1,		// radial gradient
		outerForce = 0.05,
		maxSpeed = 1;

	this.init = function(e) {

		grid = new ParticleJS.Tools.GridObject(e.width, e.height, cellsX, cellsY);

		isInited = true;

		calcGrid();

		if (e.callback) e.callback(true);
	};

	this.apply = function(p) {

		if (isInited && force && radius) {

			var v = grid.getCell(p.x, p.y),
				a = v.angle,
				f = v.force;	// radial gradient force

			p.vx += force * f * Math.cos(a);
			p.vy += force * f * Math.sin(a);
		}
	};

	this.updateFrame = function(e) {
	};

	function calcGrid() {

		if (!isInited) return;

		var	r2 = radius * radius,
			   tangent = 0.25 * direction * Math.PI * 2,
			   suck = -tangent * suction;

		// reset all to 0
		grid.clear();

		grid.forEach(function(x, y) {

			var v = grid.getAngleDist(x, y, cx, cy);

			if (v.dist <= r2) {
				grid.setCellAtXY(x, y,
					v.angle + tangent + suck,
					innerForce + (outerForce - innerForce) * (v.dist / r2));
			}
		});
	}

	function getCellIndex(x, y) {
		return y * cellsY + x;
	}

	this.direction = function(d) {

		//todo untested

		if (!arguments.length) return direction < 0 ? 'cw' : 'ccw';

		var tmpDirection = d === 'cw' ? -1 : 1;
		if (tmpDirection === direction) return this;	// skip recalc

		direction = tmpDirection;
		calcGrid();
		return this;
	};

	this.radius = function(r) {
		if (!arguments.length) return radius;
		radius = r;
		calcGrid();
		return this;
	};

	this.force = function(f) {
		if (!arguments.length) return force;
		force = f;
		calcGrid();
		return this;
	};

	this.forceGradient = function(fo, fi) {

		//todo untested

		if (!arguments.length) return {
			outer: outerForce,
			inner: innerForce
		};

		if (typeof fo === 'object') {
			outerForce = fo.outer;
			innerForce = fo.inner;
		}
		else {
			outerForce = fo;
			innerForce = fi;
		}

		calcGrid();

		return this;
	};

	this.suction = function(s) {
		if (!arguments.length) return suction;

		suction = s;
		calcGrid();

		return this;
	};

	this.settings = function(options) {

		//todo untested

		if (!arguments.length) return {
			x: cx,
			y: cy,
			radius: radius,
			cellsX: cellsX,
			cellsY: cellsY,
			force: force,
			innerForce: innerForce,
			outerForce: outerForce,
			suction: suction
		};

		cx = options.x||cy;
		cy = options.y||cx;
		radius = (typeof options.radius === 'number') ? options.radius : radius;
		cellsX = options.cellsX||cellsX;
		cellsY = options.cellsY||cellsY;
		force = (typeof options.force === 'number') ? options.force : force;
		suction = (typeof options.suction === 'number') ? options.suction : suction;
		outerForce = (typeof options.outerForce === 'number') ? options.outerForce : outerForce;
		innerForce = (typeof options.innerForce === 'number') ? options.innerForce : innerForce;

		calcGrid();

		return this;
	};

	this.generate = function() {
		calcGrid();
		return this;
	};

	this.getMapImage = function() {

		return ParticleJS.Tools.getMapImage(
			w, h,
			cellsX, cellsY, cellWidth, cellHeight,
			tMap, fMap,
			'rgba(230, 200, 90, 1)'
		);

	};
};

