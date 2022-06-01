import { FC, Ref } from "react";
import { useLoader } from "@react-three/fiber";
import { BackSide, Euler, Mesh } from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";

interface SkyboxProps {
  meshRef: Ref<Mesh>;
}

const Skybox: FC<SkyboxProps> = ({ meshRef }) => {
  const spaceTexture = useLoader(TextureLoader, "/star_texture.jpeg");
  return (
    <>
      <mesh
        scale={10000000}
        position={[0, 0, 0]}
        receiveShadow={false}
        castShadow={false}
        ref={meshRef}
        rotation={new Euler(0, 0, 0)}
      >
        <sphereBufferGeometry />
        <meshBasicMaterial map={spaceTexture} side={BackSide} />
      </mesh>
    </>
  );
};

export default Skybox;
