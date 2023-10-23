## Summary

This is a small static webapp made for @chenmasterandrew and I's final astronomy project. It's a rudimentary comet simulation made with THREE.js, and more specifically three-fiber and three-drei. We imported a model of a real comet nucleus (Comet 67P, photographed by the Rosetta spacecraft) and simulated its trails and its orbit accordingly.

[![Alt text](comet-tour.gif)]

## Running locally

All that is needed to run locally is to clone this repo and run yarn start. There is one exception: in `src/components/Scene/Comet.tsx`, the imported model url will be invalid initially. Either uncomment out the provided s3 link and use that, or download the `comet.67p.obj` file from the s3 link and place it in the `public` directory. This app was designed so that aspects of the simulation could be tweaked easily, so feel free to alter some of the parameters (the all-caps constants at the top of files like `components/Scene/index.tsx`) and see what you get!
