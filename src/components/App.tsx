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
    title: "Introduction",
    body: (
      <div>
        Welcome to our comet tour! As we give you a tour of comet
        67P/Churyumov–Gerasimenko, feel free to zoom in and out and move the
        camera to explore the comet and its tail. <br />
        <br /> Disclaimer: some aspects of this visualization may not be 100%
        realistic. The comet tails, for example, are far larger, denser, and
        brighter in reality, but those aspects have been scaled down to make the
        site easier and faster to use.
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
        hundreds of thousands of kilometers in diameter [2] while the solid
        nucleus of the comet remains only a few kilometers across [4]. The
        expanded coma of the comet can form the iconic visible tails of a comet,
        potentially extending several million kilometers away from the nucleus.
        As of 5/20/2022, 3,743 comets have been identified [5].
        <img
          src="https://photojournal.jpl.nasa.gov/jpegMod/PIA17485_modest.jpg"
          alt="Halley's Comet, its nucleus clearly visible with a bright tail shooting out."
        />
        “In 1986, the European spacecraft Giotto became one of the first
        spacecraft ever to encounter and photograph the nucleus of a comet,
        passing and imaging Halley's nucleus as it receded from the sun. Data
        from Giotto's camera were used to generate this enhanced image of the
        potato shaped nucleus that measures roughly 15 km across. Every 76 years
        Comet Halley returns to the inner solar system and each time the nucleus
        sheds about a 6-m deep layer of its ice and rock into space. This debris
        shed from Halley's nucleus eventually disperses into an orbiting trail
        responsible for the Orionids meteor shower, in October of every year,
        and the Eta Aquarids meteor shower every May.” [6]
      </div>
    ),
  },
  {
    title: "Comet Tails",
    body: (
      <div>
        As the comet heats up as it nears the Sun during its orbit, ice on its
        surface sublimates and releases gas and trapped dust. The sublimation of
        comet ices does not happen uniformly, but rather happens sporadically in
        short-lived narrow jets of gas. We were unable to model this behavior in
        our visualization, but it shows that comets' surfaces are more dynamic
        than one might think! The Rosetta mission to Comet 67P found that more
        than 99% of the surface of Comet 67P is inactive at any given time while
        vents releasing jets of sublimated gas are only a few meters in diameter
        and only last a few minutes [1]. This sublimated gas forms an atmosphere
        potentially hundreds of thousands of kilometers in diameter [2]. It is
        this atmosphere as opposed to the small and dark nucleus which is
        visible from Earth when comets pass.
        <br />
        <br />
        Since comets are not very massive, their gravity cannot hold onto this
        atmosphere, allowing gas and dust to escape. Comet tails are made up of
        this material that escapes the atmosphere of the comet [3]. <br />
        <br />
        Comets in fact have two distinct tails: a white dust tail and a blueish
        ion tail. As gas and dust escape from the comet’s nucleus, they are
        influenced by the Sun. Ultraviolet photons from the Sun cause gas in the
        comet’s coma to become electrically charged (or ionized). Solar wind
        then carries these ions off the coma directly away from the Sun, forming
        the bluish ion tail on the side of the comet opposite the Sun. Escaped
        dust is also influenced by the Sun, but to a lesser degree as it is not
        ionized. Instead, radiation pressure pushes the dust away from the Sun
        forming a curved path behind the comet as it travels directed away from
        the Sun [4].
        <img
          src="https://astronomy.swin.edu.au/cms/cpg15x/albums/userpics/cometarydusttail2.jpg"
          alt="A blue ion tail coming straight off of a comet with a denser white dust tail coming off in a curve."
        />
        “The broad, yellow dust tail is the most visually spectacular part of a
        comet. It is more curved than the blue ion tail, as the dust particles
        ejected from the coma retain more of their original momentum. Credit:
        Robert Jones“ [5]
        <img
          src="https://spaceplace.nasa.gov/comets/en/anatomy-of-a-comet.en.jpg"
          alt="Comet diagram depicting the tails, nucleus, and coma, among other comet features."
        />
        “This diagram shows the anatomy of a comet. Credit: NASA/JPL-Caltech“[6]
        <img
          src="https://spaceplace.nasa.gov/comets/en/comet-tails.en.jpg"
          alt="Diagram depicting direction of comet's tail in different parts of its orbit."
        />
        “A comet has two tails that get longer the closer it gets to the Sun.
        Both tails are always directed away from the Sun. The ion tail (blue)
        always points directly away from the Sun, while the dust tail (yellow)
        points away from the Sun in a slightly different direction than the ion
        tail. Credit: NASA/JPL-Caltech“ [7]
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
    title: "Comet Composition",
    body: (
      <div>
        Comets are thought to be composed primarily of water ice mixed with
        other ices, silicate grains, and dust. This proposal of comet
        composition is known as the “dirty snowball”. Analysis using dust
        detectors has found that comet dust contains primitive hydrocarbons and
        silicates [1]. Specifically, NASA’s Stardust mission collected particles
        from Comet Wild 2 that contain hydrocarbons [2]. <br />
        <br /> The Rosetta mission to Comet 67P also found that the surface of
        the comet contained hydrocarbons, sulfides, and iron-nickel grains [1],
        demonstrating that organic molecules may be common in space. In
        addition, Rosetta found through isotopic analysis of the water ejected
        by Comet 67P that its isotopic signature differs from the water
        typically found on Earth, indicating that water from comets did not
        significantly contribute to the abundance of water on Earth [1]. <br />
        <br /> However, Rosetta was able to find through isotopic analysis that
        comets did contribute significantly to the presence of Xenon on Earth
        [3]. The Rosetta mission was able to approach Comet 67P up close and
        even deployed a lander spacecraft onto the surface of 67P’s oblong
        nucleus which consisted of two distinct nodes. Interestingly, Rosetta
        found that Comet 67P’s volume consists of approximately 80% empty space.
        As a result, it is thought that Comet 67P was built up through numerous
        gentle collisions between smaller cometesimals [3]. This also explains
        the low density of comets which contributes to the dust and gas escaping
        comet atmospheres.
        <img
          src="https://photojournal.jpl.nasa.gov/jpegMod/PIA19867_modest.jpg"
          alt="Jet of gas venting out of comet 67P"
        />
        “A short-lived outburst from comet 67P/Churyumov-Gerasimenko was
        captured by Rosetta's OSIRIS narrow-angle camera on July 29, 2015. The
        image at left was taken at 13:06 Greenwich Mean Time (GMT) (6:06 a.m.
        PDT), and does not show any visible signs of the jet. It is very strong
        in the middle image captured at 13:24 GMT (6:24 a.m. PDT). Residual
        traces of activity are only very faintly visible in the final image
        taken at 13:42 GMT (6:42 a.m. PDT). The images were taken from a
        distance of 116 miles (186 kilometers) from the center of the comet. The
        jet is estimated to have a minimum speed of 33 feet per second (10
        meters per second) and originates from a location on the comet's
        neck.”[4]
        <img
          src="https://photojournal.jpl.nasa.gov/jpegMod/PIA19687_modest.jpg"
          alt="Comet 67P with the gas being exuded from it."
        />
        “This image, by the Rosetta navigation camera, was taken from a distance
        of about 53 miles (86 kilometers) from the center of Comet
        67P/Churyumov-Gerasimenko on March 14, 2015. The image has a resolution
        of 24 feet (7 meters) per pixel and is cropped and processed to bring
        out the details of the comet's activity.” [5]
      </div>
    ),
  },
  {
    title: "Explore 67P's Structure",
    body: (
      <div>
        Nested deep in the gas cloud surrounding comet 67P, you can find its
        nucleus. If you zoom in close enough, you'll see the 3D model, which is
        based off of data from the Rosetta spacecraft. You can observe its
        unique lobed structure, along with the texture of its surface. Notice
        how the texture of one side of the comet is noticeably darker and less
        detailed. This is because that side wasn't imaged during Rosetta's close
        pass, so its texture from images taken further away.
      </div>
    ),
  },
  {
    title: "Comet Origins",
    body: (
      <div>
        Comets can be divided into two categories: short-period comets (which
        have a period less than 200 years) and long-period comets (which can
        have a period of as high as 30 million years) [1]. The distinction
        between these groups of comets is valuable due to their differing origin
        locations. Short-period comets originate from the Kuiper Belt, a disc of
        icy bodies located beyond Neptune, whereas long-period comets originate
        from the Oort Cloud, a spherical shell of icy bodies located at around
        100,000 AU away from the Sun.
        <br />
        <br />
        This difference in origin location results in a difference in period and
        other orbital properties. Generally, short-period comets have
        inclinations much closer to 0° than long-period comets [2]. Comets are
        believed to hail from these two locations because comets in the Kuiper
        belt can have their orbits disturbed by Neptune and comets in the Oort
        Cloud, which lies on the edge of the Sun’s gravitational sphere of
        influence, can have their orbits disturbed by nearby stars which can
        cause them to plunge into the inner solar system. Bodies existing
        between the Kuiper Belt and the Oort Cloud do not have their orbits
        disturbed by neighboring stars or Neptune and therefore do not cause
        comets to plunge into the inner solar system.
        <br />
        <br />
        When a comet plunges into the inner solar system, it may fall under the
        influence of a planet’s gravity, in which case it may be ejected from
        the solar system, break up and plunge into the planet, or enter a
        shorter period orbit. Otherwise, it will proceed to lose mass during
        each of its orbits until it is no more [3].
        <br />
        <br />
        Since the Kuiper Belt contains bodies that were present in the
        protoplanetary disc during the formation of the Solar System, studying
        comets hailing from the Kuiper Belt can give insight into how the Solar
        System developed. Likewise, comets hailing from the Oort Cloud can give
        insight on the state of the Solar System far from the Sun’s
        gravitational influence.
        <img
          src="https://lasp.colorado.edu/outerplanets/images_kbos/big/oortcloud.jpg"
          alt="Diagram of the Kuiper belt and the distant Oort cloud"
        />
        This image depicts the varying typical inclinations between short-period
        and long-period comets in the Kuiper Belt and Oort Cloud
        respectively.[4]
      </div>
    ),
  },
  {
    title: "Explore 67P's Orbit",
    body: (
      <div>
        To get a general idea of 67P's orbit, turn up the time acceleration and
        watch 67P's sped up orbit. Observe how the celestial sphere changes
        around 67P and how the sun's size and apparent position changes due to
        the comet's elongated orbit.
      </div>
    ),
  },
  {
    title: "Conclusion",
    body: (
      <div>
        Thanks for touring comet 67P with us! We hope you learned something.
        <br />
        <br />
        <a
          href="https://docs.google.com/document/d/15N_tlesnjBny-kEfQKGALlG4XqRUUlWg7S_oeTbZqog/edit?usp=sharing"
          target="_blank"
          rel="noreferrer"
        >
          Click here for our sources
        </a>
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
