import { FC, Ref } from "react";
import { Color, InstancedMesh } from "three";

interface DustCloudProps {
  meshRef: Ref<InstancedMesh>;
  count: number;
  color: Color;
}

const DustCloud: FC<DustCloudProps> = ({ meshRef, count, color }) => {
  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <dodecahedronBufferGeometry attach="geometry" args={[0.2, 0]} />
        <meshBasicMaterial
          attach="material"
          color={color}
          reflectivity={10000}
        />
      </instancedMesh>
    </>
  );
};

export default DustCloud;
