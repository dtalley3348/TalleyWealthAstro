import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BRAND } from "./brand";

export type TitleCardProps = { eyebrow?: string; headline: string };

const FONT =
  "-apple-system, 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif";

export const TitleCard: React.FC<TitleCardProps> = ({ eyebrow, headline }) => (
  <AbsoluteFill
    style={{
      backgroundColor: BRAND.navy,
      fontFamily: FONT,
      padding: 96,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      overflow: "hidden",
    }}
  >
    <Img
      src={staticFile("needle-mark.png")}
      style={{
        position: "absolute",
        right: -40,
        top: 250,
        height: 780,
        width: "auto",
        objectFit: "contain",
        opacity: 0.14,
      }}
    />
    <div>
      <div style={{ width: 96, height: 8, backgroundColor: BRAND.gold, borderRadius: 4, marginBottom: 36 }} />
      {eyebrow ? (
        <div style={{ color: BRAND.gold, fontSize: 34, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 28 }}>
          {eyebrow}
        </div>
      ) : null}
      <div style={{ color: BRAND.white, fontSize: 112, lineHeight: 1.06, fontWeight: 800 }}>
        {headline}
      </div>
    </div>
    <div />
  </AbsoluteFill>
);
