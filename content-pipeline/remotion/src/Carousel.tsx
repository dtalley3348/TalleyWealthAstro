import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BRAND } from "./brand";

export type CarouselSlideProps = {
  kind: "cover" | "point" | "number" | "quote" | "cta";
  eyebrow?: string;
  headline?: string;
  body?: string;
  number?: string;
  numberCaption?: string;
  quote?: string;
  attribution?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  index: number;
  total: number;
};

const FONT =
  "-apple-system, 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const PAD = 84;

const Dots: React.FC<{ index: number; total: number }> = ({ index, total }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          width: i + 1 === index ? 28 : 10,
          height: 10,
          borderRadius: 5,
          backgroundColor:
            i + 1 === index ? BRAND.gold : "rgba(233,232,230,0.3)",
        }}
      />
    ))}
  </div>
);

const Chevron: React.FC<{ show: boolean }> = ({ show }) =>
  show ? (
    <div style={{ color: BRAND.gold, fontSize: 30, fontWeight: 600 }}>
      keep going ›
    </div>
  ) : (
    <div />
  );

export const CarouselSlide: React.FC<CarouselSlideProps> = (p) => {
  const { kind, index, total } = p;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.navy,
        fontFamily: FONT,
        padding: PAD,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: BRAND.white,
      }}
    >
      {/* Top: logo + counter */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Img
          src={staticFile("needle-mark.png")}
          style={{ height: 150, width: "auto", objectFit: "contain", opacity: 0.88 }}
        />
        <span style={{ color: "rgba(233,232,230,0.5)", fontSize: 28 }}>
          {index} / {total}
        </span>
      </div>

      {/* Middle: varies by slide kind */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {kind === "number" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ color: BRAND.gold, fontSize: 150, fontWeight: 800, lineHeight: 1 }}>
              {p.number}
            </div>
            {p.numberCaption ? (
              <div style={{ color: BRAND.lightGray, fontSize: 44, marginTop: 28, lineHeight: 1.3 }}>
                {p.numberCaption}
              </div>
            ) : null}
          </div>
        ) : kind === "quote" ? (
          <div>
            <div style={{ color: BRAND.gold, fontSize: 140, lineHeight: 0.6, fontWeight: 800 }}>
              &ldquo;
            </div>
            <div style={{ color: BRAND.white, fontSize: 60, fontWeight: 500, lineHeight: 1.2, marginTop: 8 }}>
              {p.quote}
            </div>
            {p.attribution ? (
              <div style={{ color: BRAND.gold, fontSize: 32, marginTop: 32 }}>
                {p.attribution}
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            {p.eyebrow ? (
              <div
                style={{
                  color: BRAND.gold,
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                {p.eyebrow}
              </div>
            ) : (
              <div style={{ width: 84, height: 8, backgroundColor: BRAND.gold, borderRadius: 4, marginBottom: 28 }} />
            )}
            <div
              style={{
                color: BRAND.white,
                fontSize: kind === "cover" ? 86 : 66,
                lineHeight: 1.1,
                fontWeight: 800,
              }}
            >
              {p.headline}
            </div>
            {p.body ? (
              <div style={{ color: BRAND.lightGray, fontSize: 40, lineHeight: 1.35, marginTop: 32, fontWeight: 400 }}>
                {p.body}
              </div>
            ) : null}
            {kind === "cta" && (p.ctaPrimary || p.ctaSecondary) ? (
              <div style={{ marginTop: 44 }}>
                {p.ctaPrimary ? (
                  <div
                    style={{
                      display: "inline-block",
                      backgroundColor: BRAND.gold,
                      color: BRAND.navy,
                      fontSize: 38,
                      fontWeight: 700,
                      padding: "20px 36px",
                      borderRadius: 14,
                    }}
                  >
                    {p.ctaPrimary}
                  </div>
                ) : null}
                {p.ctaSecondary ? (
                  <div style={{ color: BRAND.lightGray, fontSize: 32, marginTop: 24 }}>
                    {p.ctaSecondary}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Bottom: progress dots + forward nudge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Dots index={index} total={total} />
        <Chevron show={kind !== "cta"} />
      </div>
    </AbsoluteFill>
  );
};
