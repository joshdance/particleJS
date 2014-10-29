
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
		sprite = document.createElement('canvas'),
		cs = sprite.getContext('2d'),
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

		sprite.width = sz * scnt;
		sprite.height = hasGradient ? sz * ccnt : sz;

		cs.save();
		cs.shadowColor = "#fff"; //rgb(' + options.r + ',' + options.g + ',' + options.b + ')';

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
		else {
			cs.globalCompositeOperation = 'source-in';
			cs.fillStyle = 'rgb(' + options.r + ',' + options.g + ',' + options.b + ')';
			cs.fillRect(0, 0, sw * scnt, sw);
		}

		ctx.mozImageSmoothingEnabled =
			ctx.webkitImageSmoothingEnabled =
				ctx.imageSmoothingEnabled = false;

		//document.body.appendChild(sprite);
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

		ctx.globalAlpha = p.opacity;
		ctx.drawImage(sprite, sx, sy, sw, sw, p.x - p.sizeR, p.y - p.sizeR, p.size, p.size);
	};

	this.postRender = function() {
	};

};
