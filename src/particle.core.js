/*!
 *	ParticleJS version 0.1.4 ALPHA
 *	MIT license - include header
 *
 *	By Epistemex (c) 2014
 *	www.epistemex.com
*/

/*
	Test: double length array vs. two single arrays (typed arrays):
	http://jsperf.com/double-array-vs-two-arrays

 */

"use strict";

// public namespaces
var ParticleJS = {
	Physics2D: {
		Turbulence: {
			Tools: {}
		}
	},
	Render: {},
	Emitter2D: {},
	Emitter3D: {}
};

// this is faster than the built-in method
Array.prototype.forEach = function(fn, c) {

	//if (this === void 0 || this === null || typeof fn !== 'function') throw new TypeError;

	var t = Object(this),
		len = t.length >>> 0,
		nc = (c === void 0 || c === null);

	for (var i = 0; i < len; i++) {
		if (i in t) {
			if (nc) {
				fn(t[i], i, t)
			}
			else {
				fn.call(c, t[i], i, t)
			}
		}
	}
};
