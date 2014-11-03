ParticleJS
==========

**ParticleJS is a particle engine for JavaScript** and typically canvas,
although not limited to.

With this particle engine you can make real-time effects such as smoke, flames, dust, clouds
and explosions. You can also create fluids and ambient effects. As it uses
a plugin model for renderer you can render a particle in unlimited ways.

The engine is for real-time use, but is work in progress.

**This ALPHA version has implemented:**

- Plugin based render engine (incl. for 2D canvas)
- Plugin based physics engine (wind, gravity, turbulence, magnet etc.)
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
- Time or frame bound (latter intended for rendering frames)
- Render engine supports pre-, post- and update render calls per emitter for renderer (this allow you to share drawing surface).
- Automatic clean-up of dead particles and particle arrays

**In progress:**

- Centralized sprite caching for 2D bitmap surfaces
- Z-axis support (2.5D)
- Additional velocity parameters
- Improve air resistance of physics engine
- Turbulence for wind (this should perhaps have been placed in below section...)
- A High-Quality mode if user wants to render frames in a no real-time scenario

**MAYBE... and most likely only for a web-gl renderer:**

- Scene with 3D light and camera support
- 3D Particles (in addition to the 2.5D above)
- Shaders to render particles with light and shadow
- Visual editor to create curves for "over-life" features, and:
- Visual editor to setup an emitter and particles, and to generate code for it

![snapshot 1](http://i.imgur.com/Hrdkicd.jpg)

![snapshot 2](http://i.imgur.com/2XahkZR.jpg)

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

Released under [MIT license](http://choosealicense.com/licenses/mit/). You can use this class in both commercial and non-commercial projects provided that full header (minified and developer versions) is included.


Where to find us
----------------

→ Follow on [Twitter](https://twitter.com/epistemex/)

*&copy; 2014 Epistmex*

![Epistemex](http://i.imgur.com/YxO8CtB.png)
