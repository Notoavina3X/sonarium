import { useEffect } from "react";
import {
  Hero,
  Intro,
  Join,
  Layer,
  Stat,
  Topic,
  Visual,
} from "@/components/about-page";

const About = () => {
  useEffect(() => {
    const initialize = async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();
    };
    initialize().catch(() =>
      console.error("Cannot initialize LocomotiveScroll")
    );
  }, []);

  return (
    <div className="layout" data-scroll-container>
      {/* Header section is waiting: Explore, Contact, Join */}
      <Hero />
      <Intro />
      <Stat />
      <Layer />
      <Topic />
      <Visual />
      <Join />
    </div>
  );
};

export default About;
