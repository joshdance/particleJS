ParticleJS
==========

**ParticleJS is a real-time particle engine for JavaScript** and typically canvas,
although not limited to.

With this particle engine you can make real-time effects such as smoke, flames, dust, clouds
and explosions. You can also create fluids and ambient effects. As it uses
a plugin model for rendering and physics you can render a particle in unlimited ways.

The engine is for real-time use, but still very early work in progress.

**This ALPHA version has implemented:**

- Plugin based render engine (incl. for 2D canvas)
- Plugin based physics engine (wind, gravity, turbulence, vortex etc.)
- Render plugins can be defined to support various particle shapes and render surfaces
- Opacity, and opacity over-life for each individual particle
- Feather, and feather over-life for each individual particle
- Size, and size over-life for each individual particle
- Solid color, or color gradient for over-life change for each individual particle
- Flexible over-life arrays can be of any length and engine will adopt
- Particles per second birth rate
- Velocity rate
- Spread angle (z axis only for now which means it only spreads along x and y)
- Spread angle offset
- Random variations and amount of it for velocity, size, feather and opacity at birth
- Time or frame bound (latter intended for rendering frames). Will adopt to current frame rate providing
as smooth as possible animation.
- Render engine supports pre-, post- and update render calls per emitter for renderer (this allow you to share drawing surface).
- Automatic clean-up of dead particles and particle arrays
- Z-order toggle (newest or oldest first)
- Global force parameter
- Animated turbulence

**In progress / evaluated:**

- Centralized sprite caching for 2D bitmap surfaces
- Z-axis support (2.5D)
- Additional velocity parameters
- Improve air resistance of physics wind engine
- A High-Quality mode if user wants to render frames in a no real-time scenario

**MAYBE... and most likely only for a web-gl renderer:**

- Scene with 3D light and camera support
- 3D Particles (in addition to the 2.5D above)
- Shaders to render particles with light and shadow
- Visual editor to create curves for "over-life" features, and:
- Visual editor to setup an emitter and particles, and to generate code for it

![Snow demo](http://i.imgur.com/P3BMlXq.png)
<sup>Realistic snow can be simulated (see demo)</sup>

![Fireworks demo](http://i.imgur.com/UvcffGW.png)
<sup>Fireworks demo. Wind resistance not yet supported but still good results (see demo)</sup>

![Audio vizualizer](http://i.imgur.com/8wEs64h.png)
<sup>A simple audio visualizer using FFT analysis to drive the single particle line emitter</sup>

![snapshot 1](http://i.imgur.com/H4DvC13.png)<br>
<sup>200 particles/s @ 2.8s life, gradient, turbulence, 2x vortexes, magnet (also vortex based ) opacity and size over life @ 60 FPS</sup>

![snapshot 2](http://i.imgur.com/RosB7NO.png)<br>
<sup>Visual representation of the turbulence grid from the turbulence noise physics plugin</sup>

![snapshot 3](http://i.imgur.com/sbAbNwR.png)<br>
<sup>Single vortex map representation with gradient radial force mapping and suction. Several can be combined.</sup>

Usage
-----

More details will be published when it goes to beta. Nothing is 100%
settled yet as some tweaks and changes may have to be made to keep it
able to run real-time.

Please see included demo and play around with the parameters in the source.

Issues
------

There are known issues. As the engine is in alpha there is no need at this point to
report issues as things change fast and we may add/remove features and so forth for
the next version.


License
-------

Dual license:

- Free license for personal and non-commercial use. Header required.
- For commercial use (any monetizing activity) you can purchase a commercial license (details TBA).


Where to find us
----------------

→ Follow on [Twitter](https://twitter.com/epistemex/)

*&copy; 2014 Epistmex*

![Epistemex](http://i.imgur.com/YxO8CtB.png)
