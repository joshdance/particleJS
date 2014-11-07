/*
	Physics plugin for wind
 */

ParticleJS.Physics2D.Wind = function(angle, force, cellsX, cellsY) {

	angle = (typeof angle === 'number') ? angle : 0;
	force = (typeof force === 'number') ? force: 0;
	cellsX = cellsX || 32;
	cellsY = cellsY || 32;

	var	isInited = false,
		w, h,
		cellWidth,
		cellHeight,
		deg2rad	= 0.017453292519943295,
		angleRad = angle * deg2rad,
		freq = 0,
		amp = 0,
		ampVariations = 0.1,
		freqVariations = 0,
		aMap = new Float32Array(cellsX * cellsY),
		fMap = new Float32Array(cellsX * cellsY);

	this.init = function(e) {
		w = e.width;
		h = e.height;

		isInited = true;
		calcWind();

		if (e.callback) e.callback(true);
	};

	this.apply = function(p) {

		//var v = getCell(p.x, p.y);

		//p.vx += v.force * Math.cos(v.angle);
		//p.vy += v.force * Math.sin(v.angle);

		p.vx += force * Math.cos(angleRad);
		p.vy += force * Math.sin(angleRad);
	};

	function getCell(x, y) {

		var ix = (x / cellWidth )|0,
			iy = (y / cellHeight)|0,
			gi = iy * cellsY + ix;

		return {
			angle: aMap[gi],
			force: fMap[gi]
		};
	}

	function calcWind() {

		if (!isInited) return;

		var x,
			y;

		cellWidth = w / cellsX;
		cellHeight = h / cellsY;

		for(y = 0; y < cellsY; y++){
			for(x = 0; x < cellsX; x++){

				//todo calc waves (which is why we cache here...)
				var i = getCellIndex(x, y);
				aMap[i] = angleRad;
				fMap[i] = force;
			}
		}

		function getCellIndex(x, y) {
			return y * cellsY + x;
		}
	}

	this.updateFrame = function(e) {
	};

	this.windAngle = function(a) {

		if (!arguments.length) return angle;

		angle = a;
		angleRad = a * deg2rad;
		calcWind();

		return this;
	};

	this.windForce = function(f) {
		if (!arguments.length) return force;

		force = f;
		calcWind();

		return this;
	};

};
