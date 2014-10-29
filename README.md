ParticleJS
==========

**ParticleJS is a particle engine for JavaScript** and typically canvas,
although not limited to.

With this particle engine you can make real-time effects such as smoke, flames, dust, clouds
and explosions. You can also create fluids and ambient effects. As it uses
a plugin model for renderer you can render a particle in unlimited ways.

The engine is for real-time use, but is work in progress.

**This ALPHA version has implemented:**

- Opacity and opacity over life for each individual particle
- Feather and feather over life for each individual particle
- Color gradient for over life change for each individual particle
- Flexible over life arrays can be of any length and engine will adopt
- Particles per second birth rate
- Velocity rate
- Spread angle (z axis only for now which means it only spreads along x and y)
- Spread angle offset
- Time or frame bound (latter intended for rendering frames)
- Plugin based renderer (incl. for 2D canvas)
- Random variations and amount of it for velocity, size and opacity at birth
- Physics engine supporting gravity and wind.
- Engine support pre, post and update calls per emitter for renderer (this allow you
to share canvas and chain/use several emitters for it, as well as setting up sprite caches).
- Automatic clean-up of dead particles

**In progress:**

- Z-axis support (2.5D)
- Variation for feather at birth
- Additional velocity parameters
- Improve air resistance of physics engine
- Additional physic parameters such as magnet (attractor)
- Particle shape plugins (can be part of the renderer already though)
- Turbulence for wind (this should perhaps have been placed in below section...)
- Improve clean-up by also removing empty arrays on a "n-th" basis.
- A High-Quality mode if user wants to render frames in a no real-time scenario
- Add sliders etc. for demo (current demo runs for a limited time just as proof-of-concept)

**MAYBE... and most likely only for a web-gl renderer:**

- Scene with 3D light and camera support
- 3D Particles (in addition to the 2.5D above)
- Shaders to render particles with light and shadow
- Visual editor to create curves for "over-life" features, and:
- Visual editor to setup an emitter and particles, and to generate code for it

![snapshot from demo](http://i.imgur.com/2XahkZR.jpg)

Usage
-----

More details will be published when it goes to beta. Nothing is 100%
settled yet as some tweaks and changes may have to be made to keep it
able to run real-time.

Please see included demo and play around with the parameters in the source.

Issues
------

There are known issues with f.ex. preRolling, stopping a loop (use birth rate of 0 instead)
and some others. As the engine is in alpha there is no need at this point to
report issues as things change fast and we may add/remove features and so forth for
the next version.


License
-------

Released under [MIT license](http://choosealicense.com/licenses/mit/). You can use this class in both commercial and non-commercial projects provided that full header (minified and developer versions) is included.


Where to find us
----------------

→ Follow on [Twitter](https://twitter.com/epistemex/)

*&copy; 2014 Epistmex*

![Epistemex](http://i.imgur.com/YxO8CtB.png)
