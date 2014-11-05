
// setup, render, destroy

ParticleJS.Render.Canvas2D = function(canvas, options) {

	options = options || {};

	var ctx,
		w,
		h,
		cacheSize = 50,
		cacheSizeH = cacheSize * 0.5,
		clearOpacity = options.clearOpacity || 1,
		scnt = 30,
		sstep = 1 / scnt,
		ccnt = 32,
		scnt1 = scnt - 1,
		ccnt1 = ccnt - 1,
		sprite = document.createElement('canvas'),
		spriteHalf = document.createElement('canvas'),
		cs = sprite.getContext('2d'),
		csHalf = spriteHalf.getContext('2d');

	this.init = function(width, height) {
		ctx = canvas.getContext('2d');
		w = canvas.width = width;
		h = canvas.height = height;
	};

	this.setup = function(width, height, options) {

		var	hasGradient = (options.gradient !== null),
			i = 0,
			featherR,
			szF;

		sprite.width = cacheSize * scnt;
		sprite.height = hasGradient ? cacheSize * ccnt : cacheSize;

		if (!hasGradient) ccnt = 0;

		spriteHalf.width = sprite.width >> 1;
		spriteHalf.height = sprite.height >> 1;

		cs.save();

		cs.shadowColor = hasGradient ? "#fff" : 'rgb(' + options.r + ',' + options.g + ',' + options.b + ')';

		for(; i < scnt; i++) {

			featherR = cacheSizeH * i * sstep * 0.67;
			szF = cacheSizeH - featherR;

			cs.beginPath();
			cs.arc(-cacheSizeH, cacheSizeH, szF, 0, 2*Math.PI);
			cs.shadowOffsetX = cacheSize * (i + 1);
			cs.shadowBlur = featherR;
			cs.fill();
		}

		cs.restore();

		if (hasGradient) {

			for(i = cacheSize; i < sprite.height; i *= 2) {
				cs.drawImage(sprite, 0, 0, sprite.width, i, 0, i, sprite.width, i);
			}

			cs.globalCompositeOperation = 'source-atop';

			for(i = 0; i < ccnt; i++) {
				var c = gradient.getColor(i / ccnt);
				cs.fillStyle = 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';
				cs.fillRect(0, i * cacheSize, sprite.width, cacheSize);
			}
		}

		csHalf.drawImage(sprite, 0, 0, sprite.width, sprite.height,
								 0, 0, spriteHalf.width, spriteHalf.height);

		if (typeof ctx.imageSmoothingEnabled !== 'undefined') ctx.imageSmoothingEnabled = false;
		else if (typeof ctx.oImageSmoothingEnabled !== 'undefined') ctx.oImageSmoothingEnabled = false;
		else if (typeof ctx.mozImageSmoothingEnabled !== 'undefined') ctx.mozImageSmoothingEnabled = false;
		else if (typeof ctx.webkitImageSmoothingEnabled !== 'undefined') ctx.webkitImageSmoothingEnabled = false;

		ctx.fillStyle = 'rgba(0,0,0,' + clearOpacity + ')';
	};

	this.preRender = function() {
		if (clearOpacity < 1) {
			ctx.fillRect(0, 0, w, h);
		}
		else {
			ctx.clearRect(0, 0, w, h);
		}
	};

	this.renderParticle = function(p) {

		if (p.size < 1) return;

		var fi = (scnt1 * p.feather)|0,		// feather index
			sx = fi * cacheSize,
			ci = (ccnt1 * p.lifeIndex)|0,	// color index
			sy = ci * cacheSize;

		ctx.globalAlpha = p.opacity;

		if (p.size > cacheSizeH) {
			ctx.drawImage(sprite, sx, sy, cacheSize, cacheSize,
				p.x - p.sizeR, p.y - p.sizeR, p.size, p.size);
		}
		else {
			ctx.drawImage(spriteHalf, sx>>1, sy>>1, cacheSizeH, cacheSizeH,
				p.x - p.sizeR, p.y - p.sizeR, p.size, p.size);
		}

	};

	this.postRender = function() {
	};

	// methods for this renderer

	this.clearOpacity = function(o) {
		clearOpacity = o;
		ctx.fillStyle = 'rgba(0,0,0,' + clearOpacity + ')';
		return this;
	};
};
