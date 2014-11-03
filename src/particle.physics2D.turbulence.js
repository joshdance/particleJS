/*
	Physics plugin for magnet (aka. attractor / repeller / jet)
 */

ParticleJS.Physics2D.Turbulence = function(cellsX, cellsY, force, type) {

	type = type||'noise';
	cellsX = cellsX||64;
	cellsY = cellsY||64;
	force = force||0.05;

	var w, h,
		cellWidth,
		cellHeight,
		grid;

	this.init = function(width, height) {
		w = width;
		h = height;
		cellWidth = w / cellsX;
		cellHeight = h / cellsY;
		calcGrid();
	};

	this.apply = function(p, ts) {

		if (force) {
			var a = getCell(p.x, p.y);
			p.vx += force * Math.cos(a) * ts;
			p.vy += force * Math.sin(a) * ts;
		}
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

	function calcGrid() {

		var	x = 0,
			y = 0,
			pi = Math.PI * 2,
			turbulence = (type === 'noise') ? simplex = new SimplexNoise() : null;

		grid = new Float32Array(cellsX * cellsY);

		for(; y < cellsY; y++) {
			for(x = 0; x < cellsX; x++) {
				grid[getCellIndex(x, y)] = turbulence.get(x / cellsX, y / cellsY) * pi;
			}
		}
	}

	function getCell(x, y) {

		var ix = (x / cellWidth)|0,
			iy = (y / cellHeight)|0,
			gi = iy * cellsY + ix;

		return grid[gi];
	}

	function getCellIndex(x, y) {
		return gi = y * cellsY + x;
	}

	this.setForce = function(f) {
		force = f;
		return this;
	};
};

/*
	SimplexNoise (Perlin) based on Stefan Gustavson public domain Java
	implementation, ported to JavaScript by wwwtyro. Modified by
	Ken "Epistemex" Fyrstenberg
 */
var SimplexNoise = function() {

	this.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
				  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
				  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];

	this.perm = new Uint8Array(512);

	for (var i = 0; i < 256; i++) {
		this.perm[i] = this.perm[i+256] = Math.random()*256;
	}

	this.F2 = 0.5*(Math.sqrt(3.0)-1.0);
	this.sqrt3 = Math.sqrt(3);
};

SimplexNoise.prototype.dot = function(g, x, y) {
	return g[0]*x + g[1]*y;
};

SimplexNoise.prototype.get = function(xin, yin) {

	var n0, n1, n2,
		s = (xin + yin) * this.F2,
		i = (xin+s)| 0,
		j = (yin+s)| 0,
		G2 = (3 - this.sqrt3)/6.0,
		t = (i + j) * G2,
		X0 = i - t,
		Y0 = j - t,
		x0 = xin - X0,
		y0 = yin - Y0,
		i1, j1,
		x1, y1, x2, y2, ii, jj, gi0, gi1, gi2, t0, t1, t2;

	if(x0 > y0) {
		i1 = 1;
		j1 = 0;
	}
	else {
		i1 = 0;
		j1 = 1;
	}

	x1 = x0 - i1 + G2;
	y1 = y0 - j1 + G2;
	x2 = x0 - 1 + 2 * G2;
	y2 = y0 - 1 + 2 * G2;
	ii = i & 255;
	jj = j & 255;
	gi0 = this.perm[ii + this.perm[jj]] % 12;
	gi1 = this.perm[ii + i1 + this.perm[jj+j1]] % 12;
	gi2 = this.perm[ii + 1 + this.perm[jj+1]] % 12;
	t0 = 0.5 - x0*x0 - y0*y0;

	if(t0 < 0)
		n0 = 0;
	else {
		t0 *= t0;
		n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);
	}

	t1 = 0.5 - x1*x1 - y1*y1;

	if(t1 < 0)
		n1 = 0;
	else {
		t1 *= t1;
		n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
	}

	t2 = 0.5 - x2*x2 - y2*y2;

	if(t2<0)
		n2 = 0;
	else {
		t2 *= t2;
		n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
	}

	return 70 * (n0 + n1 + n2);
};
