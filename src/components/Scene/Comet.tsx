import { FC, Ref, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Euler, Mesh, TextureLoader } from "three";
import degToRad from "../../util/degToRad";

// Angle between orbital axis and rotation axis in radians
const AXIAL_TILT = degToRad(52);

interface CometProps {
  meshRef: Ref<Mesh>;
  setLoaded: (newValue: boolean) => void;
}

const Comet: FC<CometProps> = ({ meshRef, setLoaded }) => {
  const initialRotation = useMemo(() => new Euler(0, 0, -AXIAL_TILT), []);
  const cometObj = useLoader(
    OBJLoader,
    // "https://comet-obj.s3.us-east-2.amazonaws.com/comet_67p.obj"
    "./comet_67p.obj"
  );
  const cometMap = useLoader(TextureLoader, "./comet_texture.jpg");
  const geometry = useMemo(() => {
    let g;

    cometObj.traverse((c) => {
      if (c.type === "Mesh") {
        g = (c as Mesh).geometry;
        setLoaded(true);
      }
    });
    return g;
  }, [cometObj, setLoaded]);
  return (
    <mesh
      geometry={geometry}
      rotation={initialRotation}
      ref={meshRef}
      // castShadow
    >
      <meshPhongMaterial map={cometMap} />
    </mesh>
  );
};

export default Comet;
