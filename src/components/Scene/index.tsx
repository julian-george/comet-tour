import { FC, Suspense, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import "./index.scss";
import Skybox from "./Skybox";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Comet from "./Comet";
import Sun from "./Sun";
import { Color, InstancedMesh, Mesh, Object3D, Vector3 } from "three";
import DustCloud from "./DustCloud";
import { absRange, randomRange } from "../../util/random";
import Loader from "./Loader";

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

// Number of particles in the dust cloud
const DUST_PARTICLE_NUM = 100000;
// Number of particles in the ion cloud
const ION_PARTICLE_NUM = 65000;
// Radius (from the center of the comet) that the dust particles can originate from
const DUST_CLOUD_RADIUS = 60000;
// Radius that the ion particles can originate from
const ION_CLOUD_RADIUS = 35000;
// The maximum amount of frames that a particle travels for before being respawned around the comet
const MAX_TAIL_TIME = 25000;
// Probability that at each step a particle will "decay", being respawned at the comet.
// Helps make the tail taper off instead of maintaining a consistent density
const DECAY_PROBABILITY = 0.00001;
// Range of random displacement when particles are spawned - prevents cloud from being perfectly spherical
const CLOUD_NOISE = 100;
// Maximum speed a cloud particle can travel
const MAX_PARTICLE_SPEED = 100000;

// Initial distance of the camera from the comet
const DEFAULT_CAMERA_DIST = 20000;
// Maximum distance the user can zoom from the comet
const MAX_ZOOM = 1500000;

interface SceneProps {
  cometLoaded: boolean;
  setLoaded: (newValue: boolean) => void;
  timeAcceleration: number;
}

//TODO: orbit animation w/ slidebar -> particles -> basic popups -> zooming? -> making realistic af
const Scene: FC<SceneProps> = ({
  cometLoaded,
  setLoaded,
  timeAcceleration,
}) => {
  const controlRef = useRef<any>(null);
  const sunRef = useRef<Mesh | null>(null);
  const skyboxRef = useRef<Mesh | null>(null);
  const cometRef = useRef<Mesh | null>(null);
  const dustCloudRef = useRef<InstancedMesh | null>(null);
  const ionCloudRef = useRef<InstancedMesh | null>(null);
  let trueAnomaly = 0;
  let cometRotation = 0;
  const dummy = useMemo(() => {
    const obj = new Object3D();
    obj.rotation.set(0, 0, 0);
    return obj;
  }, []);
  // Generate some random positions, speed factors and timings
  const dustParticles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < DUST_PARTICLE_NUM; i++) {
      const time = randomRange(0, MAX_TAIL_TIME / (timeAcceleration / 100));
      const speed = Math.min(
        randomRange(4 * timeAcceleration, 6 * timeAcceleration),
        MAX_PARTICLE_SPEED
      );
      const x = absRange(DUST_CLOUD_RADIUS) + absRange(CLOUD_NOISE);
      const y =
        absRange(Math.sqrt(DUST_CLOUD_RADIUS ** 2 - x ** 2)) +
        absRange(CLOUD_NOISE);
      const z =
        absRange(Math.sqrt(DUST_CLOUD_RADIUS ** 2 - x ** 2 - y ** 2)) +
        absRange(CLOUD_NOISE);
      const exitVector = new Vector3(
        absRange(Math.PI / 16),
        absRange(Math.PI / 16),
        absRange(Math.PI / 16)
      );
      temp.push({ time, speed, x, y, z, exitVector });
    }
    return temp;
  }, [timeAcceleration]);
  const ionParticles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < ION_PARTICLE_NUM; i++) {
      const time = randomRange(0, MAX_TAIL_TIME / (timeAcceleration / 100));
      const speed = Math.min(
        randomRange(9 * timeAcceleration, 14 * timeAcceleration),
        MAX_PARTICLE_SPEED
      );
      const x = absRange(ION_CLOUD_RADIUS) + absRange(CLOUD_NOISE);
      const y =
        absRange(Math.sqrt(ION_CLOUD_RADIUS ** 2 - x ** 2)) +
        absRange(CLOUD_NOISE);
      const z =
        absRange(Math.sqrt(ION_CLOUD_RADIUS ** 2 - x ** 2 - y ** 2)) +
        absRange(CLOUD_NOISE);
      const exitVector = new Vector3(
        absRange(Math.PI / 24),
        absRange(Math.PI / 24),
        absRange(Math.PI / 24)
      );
      temp.push({ time, speed, x, y, z, exitVector });
    }
    return temp;
  }, [timeAcceleration]);
  useFrame((state, delta, frame) => {
    if (!cometLoaded) return;
    trueAnomaly += REV_ANGULAR_VELOCITY * timeAcceleration;
    if (trueAnomaly >= 2 * Math.PI) trueAnomaly = 0;

    let cameraDist = DEFAULT_CAMERA_DIST;
    if (controlRef?.current) {
      cameraDist = controlRef.current.getDistance();
    }

    if (sunRef?.current) {
      let sin = Math.sin(trueAnomaly);
      sunRef.current.position.x =
        ((sin + 1) * MAJOR_DIST) / 2 - PERIHELION_DIST;
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
    const particleSize = Math.max(
      (cameraDist - DEFAULT_CAMERA_DIST) / 250,
      100
    );

    const dustTrailAngle =
      (trueAnomaly + Math.PI / 2 + Math.PI / 6) % (2 * Math.PI);
    const dustXMagnitude = Math.sin(dustTrailAngle);
    const dustZMagnitude = Math.cos(dustTrailAngle);
    if (dustCloudRef?.current) {
      dustParticles.forEach((particle, i) => {
        const { x, y, z, speed, exitVector, time } = particle;
        let newX = x + speed * time * (dustXMagnitude + exitVector.x);
        let newY = y + speed * time * exitVector.y;
        let newZ = z + speed * time * (dustZMagnitude + exitVector.z);

        if (
          time >= MAX_TAIL_TIME / (timeAcceleration / 100) ||
          Math.random() < DECAY_PROBABILITY
        ) {
          particle.time = 0;
          particle.x = absRange(DUST_CLOUD_RADIUS) + absRange(CLOUD_NOISE);
          particle.y =
            absRange(Math.sqrt(DUST_CLOUD_RADIUS ** 2 - particle.x ** 2)) +
            absRange(CLOUD_NOISE);
          particle.z =
            absRange(
              Math.sqrt(
                DUST_CLOUD_RADIUS ** 2 - particle.x ** 2 - particle.y ** 2
              )
            ) + absRange(CLOUD_NOISE);
          particle.exitVector = new Vector3(
            absRange(Math.PI / 16),
            absRange(Math.PI / 16),
            absRange(Math.PI / 16)
          );
        }

        particle.time += 1;

        dummy.position.set(newX, newY, newZ);
        const size = randomRange(0.5 * particleSize, particleSize);
        dummy.scale.set(size, size, size);
        dummy.updateMatrix();
        if (dustCloudRef?.current)
          dustCloudRef.current.setMatrixAt(i, dummy.matrix);
      });
      dustCloudRef.current.instanceMatrix.needsUpdate = true;
    }
    const maxIonTrailAngle = (dustTrailAngle + Math.PI / 5) % (Math.PI * 2);
    const maxIonXMagnitude = Math.sin(maxIonTrailAngle);
    const maxIonZMagnitude = Math.cos(maxIonTrailAngle);

    if (ionCloudRef?.current) {
      ionParticles.forEach((particle, i) => {
        const { x, y, z, speed, exitVector, time } = particle;
        const adjustedVector = new Vector3(
          maxIonXMagnitude,
          0,
          maxIonZMagnitude
        ).add(exitVector);
        let newX = x + speed * time * adjustedVector.x;
        let newY = y + speed * time * adjustedVector.y;
        let newZ = z + speed * time * adjustedVector.z;

        if (
          time >= MAX_TAIL_TIME / (timeAcceleration / 100) ||
          Math.random() < DECAY_PROBABILITY
        ) {
          particle.time = 0;
          particle.x = absRange(ION_CLOUD_RADIUS) + absRange(CLOUD_NOISE);
          particle.y =
            absRange(Math.sqrt(ION_CLOUD_RADIUS ** 2 - particle.x ** 2)) +
            absRange(CLOUD_NOISE);
          particle.z =
            absRange(
              Math.sqrt(
                ION_CLOUD_RADIUS ** 2 - particle.x ** 2 - particle.y ** 2
              )
            ) + absRange(CLOUD_NOISE);
          particle.exitVector = new Vector3(
            absRange(Math.PI / 24),
            absRange(Math.PI / 24),
            absRange(Math.PI / 24)
          );
        }

        particle.time += 1;

        dummy.position.set(newX, newY, newZ);
        const size = randomRange(0.25 * particleSize, 0.75 * particleSize);

        dummy.scale.set(size, size, size);
        dummy.updateMatrix();
        if (ionCloudRef?.current)
          ionCloudRef.current.setMatrixAt(i, dummy.matrix);
      });
      ionCloudRef.current.instanceMatrix.needsUpdate = true;
    }
  });
  return (
    <>
      <PerspectiveCamera
        makeDefault
        far={51000000}
        position={[
          DEFAULT_CAMERA_DIST,
          DEFAULT_CAMERA_DIST,
          DEFAULT_CAMERA_DIST,
        ]}
      />
      <OrbitControls
        ref={controlRef}
        enablePan={false}
        maxDistance={MAX_ZOOM}
        minDistance={4000}
      />
      <Skybox meshRef={skyboxRef} />
      <Suspense fallback={<Loader modelName="Comet" />}>
        <Comet meshRef={cometRef} setLoaded={setLoaded} />
      </Suspense>
      <Sun meshRef={sunRef} />
      <DustCloud
        meshRef={dustCloudRef}
        count={DUST_PARTICLE_NUM}
        color={new Color(0xdddddd)}
      />
      <DustCloud
        meshRef={ionCloudRef}
        count={ION_PARTICLE_NUM}
        color={new Color(0x8888ff)}
      />
    </>
  );
};

export default Scene;
