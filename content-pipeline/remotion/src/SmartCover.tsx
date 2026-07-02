import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BRAND } from "./brand";

export type SmartCoverProps = {
  imageFile: string;
  headline: string;
  eyebrow?: string;
};

const FONT =
  "-apple-system, 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif";

export const SmartCover: React.FC<SmartCoverProps> = ({
  imageFile,
  headline,
  eyebrow = "Talley Wealth",
}) => (
  <AbsoluteFill style={{ backgroundColor: BRAND.navy, fontFamily: FONT }}>
    <Img
      src={staticFile(imageFile)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to top, rgba(27,39,51,0.88) 0%, rgba(27,39,51,0.55) 35%, rgba(27,39,51,0.05) 70%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 76,
        right: 76,
        bottom: 180,
      }}
    >
      <div
        style={{
          width: 86,
          height: 8,
          backgroundColor: BRAND.gold,
          borderRadius: 4,
          marginBottom: 28,
        }}
      />
      <div
        style={{
          color: BRAND.gold,
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 20,
          textShadow: "0 3px 14px rgba(0,0,0,0.5)",
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          color: BRAND.white,
          fontSize: 78,
          lineHeight: 1.08,
          fontWeight: 850,
          textShadow: "0 5px 28px rgba(0,0,0,0.75)",
        }}
      >
        {headline}
      </div>
    </div>
  </AbsoluteFill>
);
