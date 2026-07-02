import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { BRAND, CAPTION } from "./brand";

export type Token = { text: string; start: number; end: number };
export type Page = { start: number; end: number; tokens: Token[] };
export type CaptionsProps = {
  videoFile: string;
  durationSec: number;
  captions: Page[];
};

export const captionsSchema = undefined; // (zod optional; kept simple)

export const Captions: React.FC<CaptionsProps> = ({ videoFile, captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Active caption page (the line currently being spoken).
  const page =
    captions.find((p) => t >= p.start && t <= p.end + 0.15) ??
    null;

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.navy }}>
      <OffthreadVideo src={staticFile(videoFile)} />

      {page && (
        <CaptionLine page={page} t={t} fps={fps} frame={frame} />
      )}
    </AbsoluteFill>
  );
};

const CaptionLine: React.FC<{
  page: Page;
  t: number;
  fps: number;
  frame: number;
}> = ({ page, t, fps, frame }) => {
  // entrance pop when the line appears
  const appearFrame = Math.round(page.start * fps);
  const pop = spring({
    frame: frame - appearFrame,
    fps,
    config: { damping: 200, stiffness: 120 },
    durationInFrames: 8,
  });
  const scale = interpolate(pop, [0, 1], [0.92, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);

  // Current word = the last token that has started (with a small lead so the
  // gold highlight lands on the word rather than a hair behind it).
  const LEAD = 0.08; // seconds
  let activeIdx = -1;
  for (let i = 0; i < page.tokens.length; i++) {
    if (page.tokens[i].start <= t + LEAD) activeIdx = i;
  }

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingLeft: 80,
        paddingRight: 80,
        paddingBottom: CAPTION.bottomOffset,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          textAlign: "center",
          fontFamily: CAPTION.fontFamily,
          fontWeight: CAPTION.fontWeight as number,
          fontSize: CAPTION.fontSize,
          lineHeight: CAPTION.lineHeight,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {page.tokens.map((tok, i) => {
          const active = i === activeIdx;
          const spoken = i < activeIdx;
          return (
            <span
              key={i}
              style={{
                color: active
                  ? CAPTION.highlightColor
                  : CAPTION.textColor,
                opacity: spoken || active ? 1 : 0.82,
                // dark stabilizing shadow so text reads over any footage
                textShadow:
                  "0 4px 18px rgba(0,0,0,0.65), 0 2px 4px rgba(0,0,0,0.9)",
                marginRight: 16,
                display: "inline-block",
              }}
            >
              {tok.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
