import React from "react";
import { Composition } from "remotion";
import { Captions } from "./Captions";
import type { CaptionsProps } from "./Captions";
import { CarouselSlide } from "./Carousel";
import type { CarouselSlideProps } from "./Carousel";
import { TextOnBroll } from "./TextOnBroll";
import type { TextOnBrollProps } from "./TextOnBroll";
import { TitleCard } from "./TitleCard";
import type { TitleCardProps } from "./TitleCard";
import { SmartCover } from "./SmartCover";
import type { SmartCoverProps } from "./SmartCover";

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Captions"
        component={Captions}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={300}
        defaultProps={
          {
            videoFile: "input.mp4",
            durationSec: 10,
            captions: [],
          } as CaptionsProps
        }
        calculateMetadata={({ props }) => {
          const dur = (props as CaptionsProps).durationSec || 10;
          return {
            durationInFrames: Math.max(1, Math.round(dur * FPS)),
            fps: FPS,
            width: WIDTH,
            height: HEIGHT,
          };
        }}
      />

      {/* 4:5 carousel slide, rendered one PNG at a time via `remotion still`. */}
      <Composition
        id="CarouselSlide"
        component={CarouselSlide}
        width={1080}
        height={1350}
        fps={FPS}
        durationInFrames={1}
        defaultProps={
          {
            kind: "cover",
            eyebrow: "Retirement Planning",
            headline: "Headline goes here",
            body: "",
            index: 1,
            total: 8,
          } as CarouselSlideProps
        }
      />

      {/* Text-on-b-roll short: a line over a b-roll segment. */}
      <Composition
        id="TextOnBroll"
        component={TextOnBroll}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={210}
        defaultProps={
          {
            videoFile: "broll-input.mp4",
            line: "The plan should tell your investments what to do.",
            durationSec: 7,
            audioBedFile: null,
            audioVolume: 0.08,
          } as TextOnBrollProps
        }
        calculateMetadata={({ props }) => {
          const dur = (props as TextOnBrollProps).durationSec || 7;
          return { durationInFrames: Math.max(1, Math.round(dur * FPS)), fps: FPS, width: WIDTH, height: HEIGHT };
        }}
      />

      {/* Optional title-card cover (rendered as a still). */}
      <Composition
        id="TitleCard"
        component={TitleCard}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={1}
        defaultProps={
          {
            eyebrow: "Retirement Planning",
            headline: "Your number isn't the same as feeling secure.",
          } as TitleCardProps
        }
      />

      <Composition
        id="SmartCover"
        component={SmartCover}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={1}
        defaultProps={
          {
            imageFile: "smart-cover-source.jpg",
            headline: "Your number isn't the same as feeling secure.",
            eyebrow: "Talley Wealth",
          } as SmartCoverProps
        }
      />
    </>
  );
};
