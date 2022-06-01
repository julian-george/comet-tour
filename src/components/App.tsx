import { Canvas } from "@react-three/fiber";
import { FC, ReactNode, Suspense, useState } from "react";
import Scene from "./Scene";
import Guide from "./Guide";
import "./App.scss";
import { Html } from "@react-three/drei";
import TimeSlider from "./Scene/TimeSlider";

export type GuideStage = {
  title: string;
  body: ReactNode;
  interactTitle?: string;
  onInteract?: () => void;
};

export const MIN_TIME_ACCELERATION = 10;
export const MAX_TIME_ACCELERATION = 20000;

export const stages: GuideStage[] = [
  {
    title: "Welcome",
    body: (
      <div>
        Welcome to our comet tour! As we give you a tour of comet
        67P/Churyumov–Gerasimenko, feel free to zoom in and out and move the
        camera to explore the comet and its tail. <br /> Disclaimer: some
        aspects of this visualization may not be to scale. The comet tails, for
        example, are far larger and denser in reality, but those aspects have
        been scaled down to make the site easier and faster to use.
      </div>
    ),
  },
  {
    title: "What is a comet?",
    body: (
      <div>
        A comet is a chunk of mostly ice, frozen carbon dioxide, dust, and
        organic molecules that develops an atmosphere as it approaches the Sun
        [1]. Comets are characterized by their highly elongated elliptical
        orbits. The orbital period of comets can be very high: as high as 30
        million years [2]! As a result, many comets have only been seen once in
        human history [3]. When a comet’s orbit brings it near its closest point
        to the Sun in its orbit, its perihelion, the heat of the Sun causes ice
        in the comet to sublimate into gas. This releases gas and embedded dust
        in the comet, generating an atmosphere around the comet: the coma. The
        coma expands as the comet gets closer to the Sun, potentially growing to
        hundreds of thousands of kilometers in diameter [4] while the solid
        nucleus of the comet remains only a few kilometers across [5]. The
        expanded coma of the comet can form the iconic visible tails of a comet,
        potentially extending several million kilometers away from the nucleus.
        <img src="https://photojournal.jpl.nasa.gov/jpegMod/PIA17485_modest.jpg" />
        "In 1986, the European spacecraft Giotto became one of the first
        spacecraft ever to encounter and photograph the nucleus of a comet,
        passing and imaging Halley's nucleus as it receded from the sun. Data
        from Giotto's camera were used to generate this enhanced image of the
        potato shaped nucleus that measures roughly 15 km across. <br /> Every
        76 years Comet Halley returns to the inner solar system and each time
        the nucleus sheds about a 6-m deep layer of its ice and rock into space.
        This debris shed from Halley's nucleus eventually disperses into an
        orbiting trail responsible for the Orionids meteor shower, in October of
        every year, and the Eta Aquarids meteor shower every May." [7]
      </div>
    ),
  },
  {
    title: "Comet Tails",
    body: (
      <div>
        As the comet heats up as it nears the Sun during its orbit, ice on its
        surface sublimates and releases gas and trapped dust, forming an
        atmosphere. Since comets are not very massive, their gravity cannot hold
        onto this atmosphere, allowing gas and dust to escape. Comet tails are
        made up of this material that escapes the atmosphere of the comet [1].{" "}
        <br /> Comets in fact have two distinct tails: a white dust tail and a
        blueish ion tail. As gas and dust escape from the comet’s nucleus, they
        are influenced by the Sun. Ultraviolet photons from the Sun cause gas in
        the comet’s coma to become electrically charged (or ionized). Solar wind
        then carries these ions off the coma directly away from the Sun, forming
        the bluish ion tail on the side of the comet opposite the Sun [2].
        Escaped dust is also influenced by the Sun, but to a lesser degree as it
        is not ionized. Instead, radiation pressure pushes the dust away from
        the Sun forming a curved path behind the comet as it travels directed
        away from the Sun [3].
      </div>
    ),
  },
  {
    title: "Explore 67P's tail",
    body: (
      <div>
        Zoom out as far as you can and look down upon the comet. You can see the
        dense, white, dust tail, along with the thinner, light blue ion tail.
        <br />
        Next, we can use the comet's tails to locate the Sun. From the comet's
        distant perspective, the Sun appears similar to most other stars
        (appearing white from space), making it hard to locate in the
        visualization. However, using the knowledge that the solar wind propells
        the ions away from the Sun, you can use the direction of the ion tail to
        locate the Sun, which will be slightly larger than the other stars.
      </div>
    ),
  },
  {
    title: "Conclusion",
    body: (
      <div>
        Thanks for touring comet 67P with us! We hope you learned something.
        <br /> Sources:
      </div>
    ),
  },
];

const App: FC = () => {
  const [cometLoaded, setCometLoaded] = useState<boolean>(false);
  const [timeAcceleration, setTimeAcceleration] = useState<number>(
    MIN_TIME_ACCELERATION
  );
  return (
    <div className="app">
      <Canvas shadows>
        <Suspense fallback={<Html center>Loading Scene...</Html>}>
          <Scene
            cometLoaded={cometLoaded}
            setLoaded={setCometLoaded}
            timeAcceleration={timeAcceleration}
          />
        </Suspense>
      </Canvas>
      {cometLoaded && (
        <TimeSlider
          setTimeAcceleration={setTimeAcceleration}
          timeAcceleration={timeAcceleration}
          loaded={cometLoaded}
        />
      )}
      <Guide stages={stages} loaded={cometLoaded} />
    </div>
  );
};
export default App;
