import { FC, Ref, Suspense, useMemo } from "react";
import { useFrame, useGraph, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Euler, Mesh, TextureLoader } from "three";
import degToRad from "./util/degToRad";

// Angle between orbital axis and rotation axis in radians
const AXIAL_TILT = degToRad(52);

interface CometProps {
  meshRef: Ref<Mesh>;
}

const Comet: FC<CometProps> = ({ meshRef }) => {
  const cometObj = useLoader(
    OBJLoader,
    "https://comet-obj.s3.us-east-2.amazonaws.com/comet_67p.obj"
  );
  const cometMap = useLoader(TextureLoader, "./comet_texture.jpg");
  const geometry = useMemo(() => {
    let g;
    cometObj.traverse((c) => {
      console.log(c.type);
      if (c.type === "Mesh") g = (c as Mesh).geometry;
    });
    return g;
  }, [cometObj]);
  return (
    <mesh
      geometry={geometry}
      rotation={new Euler(0, 0, -AXIAL_TILT)}
      ref={meshRef}
    >
      <meshPhongMaterial map={cometMap} />
    </mesh>
  );
};

export default Comet;
