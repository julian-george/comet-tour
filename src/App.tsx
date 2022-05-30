import React, { FC, Suspense, useRef, useState } from "react";
import { Camera, Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import "./App.scss";
import Skybox from "./Skybox";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Comet from "./Comet";
import Sun from "./Sun";
import { Mesh, Vector3 } from "three";

// Distance from the sun at its furthest (in 100s of kilometers)
const APHELION_DIST = 8501497.39;
// Distance from the sun at its closest (in 100s of kilometers)
const PERIHELION_DIST = 1859800.73;
// Length of the full major axis (in 100s of kilometers)
const MAJOR_DIST = PERIHELION_DIST + APHELION_DIST;
// Length of the semi-minor axis (in 100s of kilometers)
const SEMIMINOR_DIST = 7952473.21;

// Revolution Period is the orbital period around the sun in seconds
const REVOLUTION_PERIOD = 20309000;
// Angular Velocity is the amount of radians the comet travels in its orbit every second
const REV_ANGULAR_VELOCITY = (2 * Math.PI) / REVOLUTION_PERIOD;

// Time it takes to make a full rotation (in seconds)
const ROTATION_PERIOD = 44655.48;
// Angular velocity of rotations (in rad/sec)
const ROT_ANGULAR_VELOCITY = (2 * Math.PI) / ROTATION_PERIOD;

//TODO: orbit animation w/ slidebar -> particles -> basic popups -> zooming? -> making realistic af
const App: FC = () => {
  const [timeAcceleration, setTimeAcceleration] = useState<number>(100);
  const sunRef = useRef<Mesh | null>(null);
  const skyboxRef = useRef<Mesh | null>(null);
  const cometRef = useRef<Mesh | null>(null);
  let trueAnomaly = 0;
  let cometRotation = 0;
  useFrame((state, delta, frame) => {
    trueAnomaly += REV_ANGULAR_VELOCITY * timeAcceleration;
    if (trueAnomaly >= 2 * Math.PI) trueAnomaly = 0;
    if (sunRef?.current) {
      let sin = Math.sin(trueAnomaly);
      sunRef.current.position.x = sin * MAJOR_DIST - PERIHELION_DIST;
      let cos = Math.cos(trueAnomaly);
      sunRef.current.position.z = cos * SEMIMINOR_DIST;
    }
    if (skyboxRef?.current) {
      skyboxRef.current.rotation.y = trueAnomaly;
    }

    cometRotation += ROT_ANGULAR_VELOCITY * timeAcceleration;
    if (cometRotation >= 2 * Math.PI) cometRotation = 0;
    if (cometRef?.current) {
      cometRef.current.rotation.y = cometRotation;
    }
  });
  return (
    <Suspense fallback={<></>}>
      <PerspectiveCamera
        makeDefault
        far={51000000}
        position={[6000, 6000, 6000]}
      />
      <OrbitControls enablePan={false} maxDistance={15000} minDistance={4000} />
      <Skybox meshRef={skyboxRef} />
      <Comet meshRef={cometRef} />
      <Sun meshRef={sunRef} />
      {/* <EffectComposer>
            <Bloom
              luminanceThreshold={0.5}
              luminanceSmoothing={0.9}
              height={300}
            />
          </EffectComposer> */}
    </Suspense>
  );
};

export default App;
