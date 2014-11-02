/*
	Particle class for ParticleJS
*/

//todo: consider using typed array to represent particle. more clumsy but likely more perf.
ParticleJS.Particle = function() {

	this.id				= 0;

	this.x				= 0;
	this.y				= 0;
	this.z				= 0;
	this.px				= 0;
	this.py				= 0;
	this.pz				= 0;
	this.vx				= 0;
	this.vy				= 0;
	this.vz				= 0;
	this.velocity		= 0;
	this.spreadAngle	= 0;

	this.r				= 255;
	this.g				= 255;
	this.b				= 255;
	this.size			= 0;
	this.sizeR			= 0;				// size radius
	this.sizeO			= 0;				// original size
	this.opacity		= 1;				// 0-1
	this.opacityO		= 1;				// 0-1
	this.feather		= 0;				// 0-1
	this.featherO		= 0;				// 0-1

	this.born			= 0;				// timestamp
	this.life			= 0;				// in milliseconds
	this.lifeIndex		= 0;				// for size/opacity over time, 0-1

	this.isActive		= true;
};

ParticleJS.Particle.prototype.updateLife = function(time) {

	var lived = time - this.born,
		lifeSpan = this.life - lived;

	this.lifeIndex = Math.max(0, Math.min(lived / this.life, 1));
	this.isActive = (lifeSpan > 0);

};
