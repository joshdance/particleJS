/*
	MapObject for Physics plugins
 */

/**
 * Returns a map object which contains maps for angles and force for
 * a grid. The object handles quantization and initialization and more.
 * This object is used by the physics plugins as a optional convenient
 * tool.
 *
 * @param w
 * @param h
 * @param cellsX
 * @param cellsY
 * @constructor
 */
ParticleJS.Tools.GridObject = function(w, h, cellsX, cellsY) {

	this.width = w;
	this.height = h;
	this.cellsX = cellsX;
	this.cellsY = cellsY;
	this.cellWidth = w / cellsX;
	this.cellHeight = h / cellsY;
	this.aMap = new Float32Array(cellsX * cellsY);
	this.fMap = new Float32Array(cellsX * cellsY);
};

/**
 * Iterates through each map cell, invokes the provided function with
 * current cell x and y position. This is used to initialize a map.
 *
 * @param {function} func - callback function for each cell
 */
ParticleJS.Tools.GridObject.prototype.forEach = function(func) {

	var x,
		y = 0,
		cellsX = this.cellsX,
		cellsY = this.cellsY;

	for(; y < cellsY; y++) {
		for(x = 0; x < cellsX; x++) {
			func(x, y);
		}
	}
};

/**
 * Returns index in map based on cell x and y indexes.
 *
 * @param {number} x - cell index x
 * @param {number} y - cell index y
 * @returns {number}
 */
ParticleJS.Tools.GridObject.prototype.getCellIndex = function(x, y) {
	return y * this.cellsY + x;
};

/**
 * Get a cell value based on pixel position x and y. The position is
 * quantized internally to the cell x and y position. Returns an object
 * with angle in radians and force.
 *
 * @param {number} x - pixel position x
 * @param {number} y - pixel position y
 * @returns {{angle: {number}, force: {number}}}
 */
ParticleJS.Tools.GridObject.prototype.getCell = function(x, y) {

	var gi = this.getCellIndexFromXY(x, y);

	return {
		angle: this.aMap[gi],
		force: this.fMap[gi]
	};

};

/**
 * Set a cell value based on pixel position x and y. The position is
 * quantized internally to the cell x and y position. Sets angle in
 * radians and force.
 *
 * @param {number} x - pixel position x
 * @param {number} y - pixel position y
 * @param {number} aVal - angle in radians or null
 * @param {number} fVal - force (normalized) or null
 */
ParticleJS.Tools.GridObject.prototype.setCell = function(x, y, aVal, fVal) {

	var gi = this.getCellIndexFromXY(x, y);

	if (aVal !== null) this.aMap[gi] = aVal;
	if (fVal !== null) this.fMap[gi] = fVal;

};

/**
 * Converts a pixel position into a map index.
 *
 * @param {number} x - pixel position x
 * @param {number} y - pixel position y
 * @returns {number}
 */
ParticleJS.Tools.GridObject.prototype.getCellIndexFromXY = function(x, y) {

	var ix = (x / this.cellWidth )|0,
		iy = (y / this.cellHeight)|0;

	return iy * this.cellsY + ix;
};

/**
 * Returns an object for cell at index i with angle in radians and force.
 * A map is cells X * cells Y.
 *
 * @param {number} i - index of map
 * @returns {{angle: *, force: *}}
 */
ParticleJS.Tools.GridObject.prototype.getCellAtIndex = function(i) {
	return {
		angle: this.aMap[i],
		force: this.fMap[i]
	};
};

/**
 * Set angle and force value at map index i. A map is cells X * cells Y.
 *
 * @param {number} i - map index
 * @param {number} aVal - angle value (radians)
 * @param {number} fVal - force value
 */
ParticleJS.Tools.GridObject.prototype.setCellAtIndex = function(i, aVal, fVal) {
	if (aVal !== null) this.aMap[i] = aVal;
	if (fVal !== null) this.fMap[i] = fVal;
};

/**
 * Set a new value at cell x/y with angle and force values.
 *
 * @param {number} cx - cell index x
 * @param {number} cy - cell index y
 * @param {number} aVal - angle value or null (radians)
 * @param {number} fVal - force value or null
 */
ParticleJS.Tools.GridObject.prototype.setCellAtXY = function(cx, cy, aVal, fVal) {
	var i = this.getCellIndex(cx, cy);
	if (aVal !== null) this.aMap[i] = aVal;
	if (fVal !== null) this.fMap[i] = fVal;
};

/**
 * Clears the maps and initializes with value 0.
 * Also needs to be called if grid size is changed.
 */
ParticleJS.Tools.GridObject.prototype.clear = function() {
	this.aMap = new Float32Array(this.cellsX * this.cellsY);
	this.fMap = new Float32Array(this.cellsX * this.cellsY);
};

/**
 * Gets distance from cell index cx/cy to pixel position x/y. The cell
 * index is converted to pixel position internally. Returns an object
 * with angle in radians and force.
 *
 * @param {number} cx - source cell index x
 * @param {number} cy - source cell index y
 * @param {number} x - target pixel position x
 * @param {number} y - target pixel position y
 * @returns {{angle: number, dist: number}}
 */
ParticleJS.Tools.GridObject.prototype.getAngleDist = function(cx, cy, x, y) {

	var dx = x - cx * this.cellWidth,
		dy = y - cy * this.cellHeight;

	return {
		angle: Math.atan2(dy, dx),
		dist : Math.abs(dx*dx + dy*dy)
	}
};

/**
 * Returns an object with current setup and map content. This can be
 * manipulated or stored externally and set again using setMapObj().
 * The main purpose is to store data that are otherwise random such as
 * turbulence.
 *
 * @returns {{width: {number}, height: {number}, cellsX: {number}, cellsY: {number}, aMap: Float32Array, fMap: Float32Array}}
 */
ParticleJS.Tools.GridObject.prototype.getMapObj = function() {

	// clone maps
	var aMap = new Float32Array(this.aMap),
		fMap = new Float32Array(this.fMap);

	return {
		width: this.width,
		height: this.height,
		cellsX: this.cellsX,
		cellsY: this.cellsY,
		aMap: aMap,
		fMap: fMap
	}
};

/**
 * Sets a map object and overrides internal values.
 *
 * @param {object} mapObj - a map object
 */
ParticleJS.Tools.GridObject.prototype.setMapObj = function(mapObj) {

	if (mapObj.cellsX < 1 || mapObj.cellsY < 1 ||
		mapObj.width < 1 || mapObj.height < 1 ||
		mapObj.cellsX * mapObj.cellsY !== mapObj.aMap.length ||
		mapObj.cellsX * mapObj.cellsY !== mapObj.fMap.length) {
		throw "Not a correctly initialized map object.";
	}

	this.width = mapObj.width;
	this.height = mapObj.height;
	this.cellsX = mapObj.cellsX;
	this.cellsY = mapObj.cellsY;
	this.cellWidth = this.width / this.cellsX;
	this.cellHeight = this.height / this.cellsY;
	this.aMap = mapObj.aMap;
	this.fMap = mapObj.fMap;
};
