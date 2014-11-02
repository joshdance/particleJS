/*!
 *	ParticleJS version 0.1.2 ALPHA
 *
 *	By Epistemex (c) 2014
 *	www.epistemex.com
*/

"use strict";

var ParticleJS = {};

Array.prototype.forEach = function(fn, context) {

	//if (this === void 0 || this === null || typeof fn !== 'function') throw new TypeError;

	var t = Object(this),
		len = t.length >>> 0,
		noContext = (context === void 0 || context === null);

	for (var i = 0; i < len; i++) {
		if (i in t) {
			if (noContext) {
				fn(t[i], i, t)
			} else {
				fn.call(context, t[i], i, t)
			}
		}
	}
};
