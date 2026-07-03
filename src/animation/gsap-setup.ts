import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  Flip,
  ScrambleTextPlugin,
  MotionPathPlugin,
  Observer,
);
