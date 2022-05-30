import { FC, Ref } from "react";
import { Vector3, Color, Mesh } from "three";

// Diameter of the sun (in 100s of kilometers)
const SUN_DIAMETER = 13927;
// Color of the sun model. Yellow for now, but would actually be white in space
const SUN_COLOR = new Color(0xffdd00);

interface SunProps {
  meshRef: Ref<Mesh>;
}

const Sun: FC<SunProps> = ({ meshRef }) => {
  return (
    <>
      <mesh scale={SUN_DIAMETER} ref={meshRef} position={new Vector3(0, 0, 0)}>
        <sphereBufferGeometry />
        <meshPhongMaterial emissive={SUN_COLOR} />\
        <pointLight
          intensity={0.25}
          castShadow={true}
          color="white"
          power={5}
        />
      </mesh>
    </>
  );
};

export default Sun;
