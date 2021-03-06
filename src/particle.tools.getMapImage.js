/*
	Tools for turbulence physics plugins
 */

ParticleJS.Tools.getMapImage = function(w, h, cellsX, cellsY, cellWidth, cellHeight, tMap, fMap, color, bg) {

	var canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		x,
		y = 0;

	canvas.width = w;
	canvas.height = h;

	if (bg) ctx.fillStyle = bg;
	ctx.fillRect(0, 0, w, h);
	ctx.strokeStyle = color || '#fff';

	for(; y < cellsY; y++) {
		for(x = 0; x < cellsX; x++) {

			var i = getCellIndex(x, y),
				a = tMap[i],
				f = fMap[i],
				r = cellWidth*0.5,
				rf = r * f;

			ctx.setTransform(1, 0, 0, 1, x*cellWidth + r, y*cellHeight + cellHeight*0.5);
			ctx.rotate(a);

			ctx.moveTo(-rf, 0);
			ctx.lineTo(rf, 0);
			ctx.rect(rf, -1, 2, 2);
		}
	}

	ctx.stroke();

	return canvas;

	function getCellIndex(x, y) {
		return gi = y * cellsY + x;
	}

};

