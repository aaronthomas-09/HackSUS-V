import { Dithering } from "@paper-design/shaders-react";

const DitherBackground = () => (
  <div style={{ 
    position: "fixed", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%", 
    zIndex: -1, 
    pointerEvents: "none", 
    overflow: "hidden", 
    opacity: 0.08 
  }}>
    <Dithering
      width={typeof window !== 'undefined' ? window.innerWidth : 1280}
      height={typeof window !== 'undefined' ? window.innerHeight : 720}
      colorBack="#00000000"
      colorFront="#e71818"
      shape="warp"
      type="random"
      size={1}
      speed={0.1}
      scale={0.68}
      offsetX={0.28}
      offsetY={-0.3}
    />
  </div>
);

export default DitherBackground;
