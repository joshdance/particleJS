
// setup, render, destroy

ParticleJS.Shader2D.Canvas = function(canvas, options) {

	options = options || {};

	var ctx,
		w,
		h,
		spriteSize = 50,
		spriteHalfSize = spriteSize * 0.5,
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

	this.init = function(e) {

		var	hasGradient = (e.gradient !== null),
			i = 0,
			featherR,
			szF;

		w = canvas.width = e.width;
		h = canvas.height = e.height;
		ctx = canvas.getContext('2d');

		sprite.width = spriteSize * scnt;
		sprite.height = hasGradient ? spriteSize * ccnt : spriteSize;

		if (!hasGradient) ccnt = 0;

		spriteHalf.width = sprite.width >> 1;
		spriteHalf.height = sprite.height >> 1;

		cs.save();

		cs.shadowColor = hasGradient ? "#fff" : 'rgb(' + e.r + ',' + e.g + ',' + e.b + ')';

		for(; i < scnt; i++) {

			featherR = spriteHalfSize * i * sstep * 0.67;
			szF = spriteHalfSize - featherR;

			cs.beginPath();
			cs.arc(-spriteHalfSize, spriteHalfSize, szF, 0, 2*Math.PI);
			cs.shadowOffsetX = spriteSize * (i + 1);
			cs.shadowBlur = featherR;
			cs.fill();
		}

		cs.restore();

		if (hasGradient) {

			for(i = spriteSize; i < sprite.height; i *= 2) {
				cs.drawImage(sprite, 0, 0, sprite.width, i, 0, i, sprite.width, i);
			}

			cs.globalCompositeOperation = 'source-atop';

			for(i = 0; i < ccnt; i++) {
				var c = gradient.getColor(i / ccnt);
				cs.fillStyle = 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';
				cs.fillRect(0, i * spriteSize, sprite.width, spriteSize);
			}
		}

		csHalf.drawImage(sprite, 0, 0, sprite.width, sprite.height,
								 0, 0, spriteHalf.width, spriteHalf.height);

		if (typeof ctx.imageSmoothingEnabled !== 'undefined') ctx.imageSmoothingEnabled = false;
		else if (typeof ctx.oImageSmoothingEnabled !== 'undefined') ctx.oImageSmoothingEnabled = false;
		else if (typeof ctx.mozImageSmoothingEnabled !== 'undefined') ctx.mozImageSmoothingEnabled = false;
		else if (typeof ctx.webkitImageSmoothingEnabled !== 'undefined') ctx.webkitImageSmoothingEnabled = false;

		ctx.fillStyle = 'rgba(0,0,0,' + clearOpacity + ')';

		e.callback(true);
	};

	this.preRender = function() {
		clearOpacity === 1 ? ctx.clearRect(0, 0, w, h) : ctx.fillRect(0, 0, w, h);
	};

	this.renderParticle = function(p) {

		var fi = (scnt1 * p.feather)|0,		// feather index
			sx = fi * spriteSize,
			ci = (ccnt1 * p.lifeIndex)|0,	// color index
			sy = ci * spriteSize;

		ctx.globalAlpha = p.opacity;

		if (p.size > spriteHalfSize) {
			ctx.drawImage(sprite, sx, sy, spriteSize, spriteSize,
				p.x - p.sizeR, p.y - p.sizeR, p.size, p.size);
		}
		else {
			ctx.drawImage(spriteHalf, sx>>1, sy>>1, spriteHalfSize, spriteHalfSize,
				p.x - p.sizeR, p.y - p.sizeR, p.size, p.size);
		}

	};

	this.postRender = function(e) {
		var fs = ctx.fillStyle;
		ctx.fillStyle = '#fff';
		ctx.globalAlpha = 1;
		ctx.fillText(e.count, 10, 10);
		ctx.fillStyle = fs;
	};

	// methods for this renderer

	this.clearOpacity = function(o) {
		clearOpacity = o;
		ctx.fillStyle = 'rgba(0,0,0,' + clearOpacity + ')';
		return this;
	};
};
