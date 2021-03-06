import { Html } from "@react-three/drei";
import { FC } from "react";

interface LoaderProps {
  modelName: string;
}

const Loader: FC<LoaderProps> = ({ modelName }) => {
  return (
    <Html center>
      <div
        style={{
          zIndex: 10,
          color: "white",
          width: 240,
          maxWidth: "100%",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        <div>{modelName} Model Loading...</div>
        <br />
        {modelName === "Comet" && (
          <div style={{ userSelect: "none" }}>
            This model's file size is very large. Depending on your internet
            speed, it may take several minutes to download.
          </div>
        )}
      </div>
    </Html>
  );
};

export default Loader;
