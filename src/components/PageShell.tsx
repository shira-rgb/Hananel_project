import type { CSSProperties, ReactNode } from "react";
import { Space } from "antd";
import { PALETTE, NEUTRAL_PALETTE, type Business, type Palette } from "../utils/palette";

interface PageShellProps {
  business?: Business | "neutral";
  title: string;
  subtitle?: string;
  eyebrow?: string;
  kpis?: { label: string; value: number | string; highlight?: boolean }[];
  actions?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
  maxWidth?: number | string;
}

const resolvePalette = (business?: Business | "neutral"): Palette => {
  if (!business || business === "neutral") return NEUTRAL_PALETTE;
  return PALETTE[business];
};

export function PageShell({
  business = "neutral",
  title,
  subtitle,
  eyebrow,
  kpis,
  actions,
  toolbar,
  children,
  maxWidth = 1640,
}: PageShellProps) {
  const palette = resolvePalette(business);

  const shellStyle: CSSProperties & Record<string, string | number> = {
    padding: "8px 8px 32px",
    maxWidth,
    margin: "0 auto",
    "--shell-primary": palette.primary,
    "--shell-chip": palette.chip,
    "--shell-soft": palette.soft,
    "--shell-border": palette.border,
    "--shell-deep": palette.deep,
    "--shell-accent": palette.accent,
  };

  return (
    <div className="page-shell" style={shellStyle}>
      <div
        style={{
          background: `linear-gradient(255deg, ${palette.deep} 0%, ${palette.primary} 35%, ${palette.chip} 75%, ${palette.accent} 100%)`,
          borderRadius: 24,
          padding: "28px 32px",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 18px 50px -20px ${palette.primary}80`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            insetInlineStart: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
            filter: "blur(2px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            insetInlineEnd: -40,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div style={{ minWidth: 200 }}>
            <div
              style={{
                fontSize: 12,
                opacity: 0.95,
                letterSpacing: 1,
                textTransform: "uppercase",
                textShadow: "0 1px 2px rgba(0,0,0,0.25)",
              }}
            >
              {palette.icon} {eyebrow || palette.label}
            </div>
            <h1
              style={{
                margin: "8px 0 4px",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: -0.5,
                color: "#fff",
                textShadow: "0 2px 6px rgba(0,0,0,0.28)",
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <div
                style={{
                  fontSize: 13,
                  color: "#fff",
                  opacity: 0.95,
                  maxWidth: 620,
                  textShadow: "0 1px 3px rgba(0,0,0,0.22)",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
          <Space size={12} wrap>
            {kpis?.map((k) => <HeroPill key={k.label} {...k} />)}
            {actions}
          </Space>
        </div>
      </div>

      {toolbar && (
        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {toolbar}
        </div>
      )}

      <div style={{ marginTop: toolbar ? 14 : 18 }}>{children}</div>
    </div>
  );
}

function HeroPill({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: highlight
          ? "rgba(34,197,94,0.20)"
          : "rgba(255,255,255,0.18)",
        backdropFilter: "blur(10px)",
        padding: "12px 18px",
        borderRadius: 14,
        border: `1px solid ${
          highlight ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.22)"
        }`,
        minWidth: 110,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <div style={{ fontSize: 11, opacity: 0.88, fontWeight: 500 }}>{label}</div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: -0.5,
        }}
      >
        {typeof value === "number" ? value.toLocaleString("he-IL") : value}
      </div>
    </div>
  );
}
