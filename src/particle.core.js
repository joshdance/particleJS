/*!
 *	ParticleJS version 0.1.5 ALPHA
 *	MIT license - include header
 *
 *	By Epistemex (c) 2014
 *	www.epistemex.com
*/

/*
	These tests are only to get pointers and not super-accurate results.
	Its to help making a decision for what approach to take - in cases
	where there exists doubt, better tests will be constructed.

	Test: is rebuilding an array faster than splicing indexes:
	 http://jsperf.com/slice-away-versus-rebuilding-array
	  -> rebuilding (consider circular in future)

	Test: custom forEach vs. various for loops
	 http://jsperf.com/custom-foreach-vs-for-cached
	 http://jsperf.com/for-vs-foreach/240
	  -> using for-loop with cached length

	Test: double length array vs. two single arrays (typed arrays):
	 http://jsperf.com/double-array-vs-two-arrays
	  -> single arrays. In FF dbl length is faster, but singles are also
	  faster than in Chrome.. come'on Chrome, you lag behind on typed arrays!! :)

	Test: is caching random values faster than direct use:
	 http://jsperf.com/random-caching-vs-random-realtime
	 http://jsperf.com/random-vs-lookup-revisited (note: non-pre-calc'ed and float)
	  -> random() has become very fast in later versions. Unless some
	  clever replacement can be found, stick with random()

	Test: Math.sin/cos directly vs. LUT pre-calculated values
	 http://jsperf.com/math-sin-vs-lut
	 -> ...use Math.* directly - just needed to be sure!
 */

"use strict";

// public namespaces
var ParticleJS = {
	Physics2D: {
		Turbulence: {
			Tools: {}
		}
	},
	Shader2D: {},
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
