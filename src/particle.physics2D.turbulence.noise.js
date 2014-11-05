/*
	Physics plugin for magnet (aka. attractor / repeller / jet)
 */

ParticleJS.Physics2D.Turbulence.Noise = function(cellsX, cellsY, force) {

	cellsX = cellsX||32;
	cellsY = cellsY||32;
	force = (typeof force === 'number') ? force : 0.05;

	var isInited = false,
		w, h,
		cellWidth,
		cellHeight,
		extension = 1,
		tMap = new Float32Array(cellsX * cellsY * extension),
		fMap = new Float32Array(cellsX * cellsY * extension),

		aOctaves = 2,
		fOctaves = 4,
		sVariation = 0.5,	// speed (z over time)
		dVariation = 0.1,	// offset direction
		fVariation = 0.8;	// force

	this.init = function(e) {

		w = e.width;
		h = e.height;
		cellWidth = w / cellsX;
		cellHeight = h / cellsY;

		isInited = true;

		calcGrid();

		if (e.callback) e.callback(true);
	};

	this.apply = function(p) {

		if (force) {

			var map = getCell(p.x, p.y),
				a = map.a,
				f = map.f;

			p.vx += force * Math.cos(a) * f;
			p.vy += force * Math.sin(a) * f;
		}
	};

	function getCell(x, y) {

		var ix = (x / cellWidth )|0,
			iy = (y / cellHeight)|0,
			gi = iy * cellsY + ix;

		return {
			a: tMap[gi],
			f: fMap[gi]
		};
	}

	function getCellIndex(x, y) {
		return y * cellsY + x;
	}

	// Generates one map for direction and one for force, which are used in combination
	function calcGrid() {

		if (!isInited) return;

		var	x,
			y,
			pi = Math.PI * 2,
			ro = pi * Math.random() - Math.PI,	// random offset for all
			mx = cellsX * extension,			// max x/y incl. extension
			my = cellsY * extension,
			turbulence;

		turbulence = new ParticleJS.Physics2D.Turbulence.Noise.SimplexNoise();

		for(y = 0; y < my; y++) {
			for(x = 0; x < mx; x++) {
				tMap[getCellIndex(x, y)] = turbulence.noise3D((x / mx) * aOctaves, (y / my) * aOctaves, 0) * pi + ro + pi * dVariation * Math.random();
			}
		}

		turbulence = new ParticleJS.Physics2D.Turbulence.Noise.SimplexNoise();

		for(y = 0; y < my; y++) {
			for(x = 0; x < mx; x++) {
				var n = turbulence.noise3D(x / mx * fOctaves, y / my * fOctaves, 0);
				fMap[getCellIndex(x, y)] = minMax(1 - (n * fVariation));
			}
		}

		function minMax(v) {
			return Math.max(0, Math.min(1, v));
		}
	}


	this.force = function(f) {
		force = f;
		return this;
	};

	this.generateNew = function() {
		calcGrid();
	};

	this.getMap = function() {
		return ParticleJS.Physics2D.Turbulence.Tools.getMap(
			w, h,
			cellsX, cellsY, cellWidth, cellHeight,
			tMap, fMap,
			'rgba(90, 90, 255, 0.5)'
		);
	};
};

/*
	SimplexNoise based on Stefan Gustavson public domain Java
	implementation, ported to JavaScript by wwwtyro.
	Modified and optimized by Ken "Epistemex" Fyrstenberg, 2014.
	For details refer to original paper.
 */
ParticleJS.Physics2D.Turbulence.Noise.SimplexNoise = function() {

	this.perm 	= new Uint8Array(512);

	this.grad3	= [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
		           [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
		           [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];

	// permutations x2
	for (var i = 0; i < 256; i++)
		this.perm[i] = this.perm[i + 256] = Math.random()*256;

};

ParticleJS.Physics2D.Turbulence.Noise.SimplexNoise.prototype.noise3D = function(xin, yin, zin) {

	var n0, n1, n2, n3,
		s = (xin + yin + zin) * 0.33333333333,
		i = (xin + s)|0,
		j = (yin + s)|0,
		k = (zin + s)|0,
		t = (i + j + k) * 0.16666666667,
		x0 = xin - (i - t),
		y0 = yin - (j - t),
		z0 = zin - (k - t),
		ii, jj, kk,
		gi0, gi1, gi2, gi3,
		x1, y1, z1,
		x2, y2, z2,
		x3, y3, z3,
		t0, t1, t2, t3,
		i1, j1, k1,
		i2, j2, k2,

		grad = this.grad3,
		perm = this.perm;

	if (x0 >= y0) {
		if(y0 >= z0) {
			i1 = i2 = j2 = 1;
			j1 = k1 = k2 = 0;
		} // X Y Z order
		else if(x0 >= z0) {
			i1 = i2 = k2 = 1;
			j1 = k1 = j2 = 0;
		} // X Z Y order
		else {
			i1 = j1 = j2 = 0;
			k1 = i2 = k2 = 1;
		} // Z X Y order
	}
	else {
		if (y0 < z0) {
			i1 = i2 = j1 = 0;
			k1 = j2 = k2 = 1;
		} // Z Y X order
		else if (x0 < z0) {
			i1 = k1 = i2 = 0;
			j1 = j2 = k2 = 1;
		} // Y Z X order
		else {
			i1 = k1 = k2 = 0;
			j1 = i2 = j2 = 1;
		} // Y X Z order
	}

	x1 = x0 - i1 + 0.16666666667;
	y1 = y0 - j1 + 0.16666666667;
	z1 = z0 - k1 + 0.16666666667;
	x2 = x0 - i2 + 0.33333333333;
	y2 = y0 - j2 + 0.33333333333;
	z2 = z0 - k2 + 0.33333333333;
	x3 = x0 - 0.5;
	y3 = y0 - 0.5;
	z3 = z0 - 0.5;

	ii = i & 0xff;
	jj = j & 0xff;
	kk = k & 0xff;

	gi0 = perm[ii +      perm[jj +      perm[kk]]   ] % 12;
	gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk+k1]]] % 12;
	gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk+k2]]] % 12;
	gi3 = perm[ii + 1 +  perm[jj + 1  + perm[kk+1]] ] % 12;

	t0 = 0.5 - x0*x0 - y0*y0 - z0*z0;

	n0 = n1 = n2 = n3 = 0;

	if (t0 >= 0) {
		t0 *= t0;
		n0 = t0 * t0 * dot(grad[gi0], x0, y0, z0);
	}

	t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;

	if (t1 >= 0) {
		t1 *= t1;
		n1 = t1 * t1 * dot(grad[gi1], x1, y1, z1);
	}

	t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;

	if (t2 >= 0) {
		t2 *= t2;
		n2 = t2 * t2 * dot(grad[gi2], x2, y2, z2);
	}

	t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;

	if (t3 >= 0) {
		t3 *= t3;
		n3 = t3 * t3 * dot(grad[gi3], x3, y3, z3);
	}

	return (16 * (n0 + n1 + n2 + n3) + 0.5); // [0, 1]

	function dot(g, x, y) { return g[0] * x + g[1] * y }
};
