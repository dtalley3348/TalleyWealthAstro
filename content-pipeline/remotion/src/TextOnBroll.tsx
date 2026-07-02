import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { BRAND } from "./brand";

export type TextOnBrollProps = {
  videoFile: string;
  line: string;
  durationSec: number;
  audioBedFile?: string | null;
  audioVolume?: number;
};

const FONT =
  "-apple-system, 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif";

export const TextOnBroll: React.FC<TextOnBrollProps> = ({ videoFile, line, audioBedFile, audioVolume = 0.08 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame: frame - 6, fps, config: { damping: 200 }, durationInFrames: 14 });
  const opacity = interpolate(appear, [0, 1], [0, 1]);
  const lift = interpolate(appear, [0, 1], [24, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.navy }}>
      <OffthreadVideo
        src={staticFile(videoFile)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        muted
      />
      {audioBedFile ? <Audio src={staticFile(audioBedFile)} loop volume={audioVolume} /> : null}

      {/* Legibility scrim: darken toward the bottom where the text sits. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(36,52,69,0.92) 0%, rgba(36,52,69,0.6) 32%, rgba(36,52,69,0) 60%)",
        }}
      />

      {/* Needle mark, quiet, top-left. */}
      <Img
        src={staticFile("needle-mark.png")}
        style={{ position: "absolute", top: 84, left: 84, height: 130, width: "auto", opacity: 0.88 }}
      />

      {/* The line. */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: 84,
          paddingBottom: 220,
        }}
      >
        <div
          style={{
            opacity,
            transform: `translateY(${lift}px)`,
            color: BRAND.white,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 76,
            lineHeight: 1.12,
            textShadow: "0 4px 24px rgba(0,0,0,0.55)",
          }}
        >
          {line}
        </div>
        <div style={{ width: 96, height: 8, backgroundColor: BRAND.gold, borderRadius: 4, marginTop: 36, opacity }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
