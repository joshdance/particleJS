/*
	Physics "engine" for ParticleJS
	Note: Per emitter.
*/

ParticleJS.Physics = function() {

	this.gravityX = 0;
	this.gravityY = 0;
	this.gravityZ = 0;

	this.windX = 0;
	this.windY = 0;
	this.windZ = 0;

	this.airResistance = 0;

	this.turbulenceRadius = 0;
	this.turbulenceSize = 0;		// affects size 0-1
	this.turbulencePosition = 0;	// affects position 0-1

	this.magnetX = 0;
	this.magnetY = 0;
	this.magnetZ = 0;
	this.magnetForce = 0;			// 0-1

	// run all particles from an emitter through the physics instance

	this.apply = function(p, ts) {

		p.px = p.x;
		p.py = p.y;

		p.vx += this.gravityX * ts;
		p.vy += this.gravityY * ts;

		p.vx *= (1 - this.airResistance);
		p.vy *= (1 - this.airResistance);

		p.x += p.vx * ts + this.windX;
		p.y += p.vy * ts + this.windY;

	};

};