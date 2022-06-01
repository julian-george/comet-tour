import { FC, useCallback, useMemo, useState } from "react";
import { GuideStage } from "../App";
import "./index.scss";

interface GuideProps {
  stages: GuideStage[];
  loaded: boolean;
  // currStage: number;
  // setCurrStage: React.Dispatch<React.SetStateAction<number>>;
}

const Guide: FC<GuideProps> = ({ stages, loaded }) => {
  const [currStage, setCurrStage] = useState<number>(0);
  const displayedStage = useMemo(() => stages[currStage], [currStage, stages]);
  const nextStage = useCallback(
    () =>
      loaded && setCurrStage((prev) => Math.min(prev + 1, stages.length - 1)),
    [setCurrStage, loaded, stages]
  );
  const prevStage = useCallback(
    () => loaded && setCurrStage((prev) => Math.max(prev - 1, 0)),
    [setCurrStage, loaded]
  );
  return (
    <div id="guide">
      <h2 id="guide-title" style={{ marginBottom: 0 }}>
        {displayedStage.title}
      </h2>
      <h4 style={{ margin: "8px 0", fontWeight: "normal" }}>
        {currStage + 1}/{stages.length}
      </h4>
      <div id="guide-body">
        {displayedStage.body}
        {!loaded && (
          <div>
            <br />
            Please wait for the comet to load before continuing.
          </div>
        )}
      </div>
      {displayedStage?.interactTitle && (
        <button>{displayedStage.interactTitle}</button>
      )}
      <div id="nav-button-row">
        {currStage > 0 && (
          <button
            style={{ position: "absolute" }}
            onClick={prevStage}
            disabled={!loaded}
          >
            Back
          </button>
        )}
        {currStage < stages.length - 1 && (
          <button
            onClick={nextStage}
            style={{ marginLeft: "calc(100% - 64px)" }}
            disabled={!loaded}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Guide;
