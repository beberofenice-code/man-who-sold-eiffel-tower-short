import React from "react";
import { Composition } from "remotion";
import { EiffelShort, EIFFEL_FRAMES } from "./videos/eiffel/EiffelShort";
import { FPS } from "./videos/eiffel/story";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="EiffelShort"
      component={EiffelShort}
      durationInFrames={EIFFEL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
