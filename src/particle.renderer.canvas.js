
// setup, render, destroy

ParticleJS.CanvasRenderer = function(canvas) {

	var ctx,
		w,
		h,
		scnt = 20,
		sstep = 1 / scnt,
		ccnt = 16,
		cstep = 1 / ccnt,
		sw,
		swHalf,
		sprite = document.createElement('canvas'),
		spriteHalf = document.createElement('canvas'),
		cs = sprite.getContext('2d'),
		csHalf = spriteHalf.getContext('2d'),
		lastCol = '';

	this.init = function(width, height, options) {

		ctx = canvas.getContext('2d');
		w = canvas.width = width;
		h = canvas.height = height;

	};

	this.setup = function(width, height, options) {

		var sz = options.size,
			hasGradient = (options.gradient !== null),
			i = 0,
			h = 1,
			featherR,
			szF = sz * 0.5 - featherR;

		sw = sz;
		swHalf = (sw * 0.5)|0;

		sprite.width = sz * scnt;
		sprite.height = hasGradient ? sz * ccnt : sz;

		spriteHalf.width = sprite.width * 0.5;
		spriteHalf.height = sprite.height * 0.5;

		cs.save();

		cs.shadowColor = hasGradient ? "#fff" : 'rgb(' + options.r + ',' + options.g + ',' + options.b + ')';

		for(; i < scnt; i++) {

			featherR = sz * i * sstep * 0.5;
			szF = sz * 0.5 - featherR;

			cs.beginPath();
			cs.arc(-sz * 0.5, sz * 0.5, szF, 0, 2*Math.PI);
			cs.shadowOffsetX = sz * (i + 1);
			cs.shadowBlur = featherR;
			cs.fill();
		}

		cs.restore();

		if (hasGradient) {

			for(i = sz; i < sprite.height; i *= 2) {
				cs.drawImage(sprite, 0, 0, sprite.width, i, 0, i, sprite.width, i);
			}

			cs.globalCompositeOperation = 'source-in';

			for(i = 0; i < ccnt; i++) {
				var c = gradient.getColor(i / ccnt);
				cs.fillStyle = 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';

				cs.save();
				cs.beginPath();
				cs.rect(0, i * sz, sprite.width, sz);
				cs.clip();

				cs.fillRect(0, i * sz, sprite.width, sz);
				cs.restore();
			}

		}

		csHalf.drawImage(sprite, 0, 0, sprite.width, sprite.height,
								 0, 0, spriteHalf.width, spriteHalf.height);

		ctx.mozImageSmoothingEnabled =
			ctx.webkitImageSmoothingEnabled =
				ctx.imageSmoothingEnabled = false;

	};

	this.preRender = function() {
		ctx.clearRect(0, 0, w, h);
	};

	this.renderParticle = function(p) {

		if (p.size < 0.001) return;

		var si = ((scnt * p.feather + 0.5)|0),
			sx = si * sw,
			ci = ((ccnt * p.lifeIndex + 0.5)|0),
			sy = ci * sw;

		if (sy > sprite.height) sy = 0;

		ctx.globalAlpha = p.opacity;

		if (p.size > swHalf) {
			ctx.drawImage(sprite, sx, sy, sw, sw, p.x - p.sizeR, p.y - p.sizeR, p.size, p.size);
		}
		else {
			ctx.drawImage(spriteHalf, sx>>1, sy>>1, swHalf, swHalf,
				p.x - p.sizeR, p.y - p.sizeR, p.size, p.size);
		}

	};

	this.postRender = function() {
	};

};
