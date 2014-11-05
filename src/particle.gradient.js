/*
	Gradient class for ParticleJS
 */

ParticleJS.Gradient = function() {

	this.width = 256;
	this.stops = [];
	this.cache = null;
};

ParticleJS.Gradient.prototype.addStop = function(pos, color) {

	this.stops.push({
		pos: pos,
		color: color
	});

	return this;
};

ParticleJS.Gradient.prototype.generateNew = function() {

	var w = this.width,
		canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		gradient = ctx.createLinearGradient(0, 0, w, 0),
		idata,
		buffer,
		i = 0,
		p = 0,
		c;

	canvas.width = w;
	canvas.height = 1;

	for(; c = this.stops[i++];)
		gradient.addColorStop(c.pos, c.color);

	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, w, 1);

	idata = ctx.getImageData(0, 0, w, 1);
	buffer = idata.data;

	this.cache = new Uint8Array(w * 3);

	// save RGB (TODO alpha support?)
	for(i = 0; i < buffer.length; i += 4) {
		this.cache[p++] = buffer[i];
		this.cache[p++] = buffer[i+1];
		this.cache[p++] = buffer[i+2];
	}
};

ParticleJS.Gradient.prototype.getColor = function(t) {

	t = Math.min(1, Math.max(0, t));

	var p = ((t * this.width)|0) * 3;

	return {
		r: this.cache[p],
		g: this.cache[p+1],
		b: this.cache[p+2]
	};
};
