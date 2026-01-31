import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

interface JoinersLeaversChartProps {
  title?: string;
  compact?: boolean;
  xLabels?: string[];
  hideTitle?: boolean;
  embedded?: boolean; // When true, removes card styling (bg, shadow, radius) for nesting in another card
}

export const JoinersLeaversChart: React.FC<JoinersLeaversChartProps> = ({
  title = "Turnover - Last 12 months",
  compact = false,
  xLabels = ["Feb", "May", "Aug", "Nov"],
  hideTitle = false,
  embedded = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation: Draw the lines
  const progress = spring({
    frame,
    fps,
    config: { mass: 1, damping: 15, stiffness: 80 },
  });

  // Hand-crafted Bezier curves matching the eNPS story:
  // Leavers show moderate rise in Oct-Nov period. ViewBox is 0 0 400 220, Y inverted (lower Y = higher value)
  const joinerPath =
    "M 20 95 C 120 88, 220 85, 300 90 C 340 93, 370 90, 380 88";
  const leaverPath =
    "M 20 165 C 150 162, 250 155, 320 140 C 350 125, 370 115, 380 105";

  // Path length for dashoffset animation (approximate)
  const pathLength = 500;

  const svgWidth = compact ? 400 : 480;
  const svgHeight = compact ? 160 : 220;

  // When embedded in another card, remove card styling but keep full size
  const noCardStyle = compact || embedded;

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: noCardStyle ? "transparent" : "white",
        padding: compact ? "0" : embedded ? "0" : "24px 24px 32px 24px",
        display: "flex",
        flexDirection: "column",
        borderRadius: noCardStyle ? 0 : 16,
        boxShadow: noCardStyle ? "none" : "0 4px 20px rgba(0,0,0,0.04)",
        fontFamily: theme.typography.fontFamily.body,
      }}
    >
      {/* HEADER: Title Left, Legend Right */}
      {!hideTitle && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: compact ? 8 : 16,
          }}
        >
          <h3
            style={{
              color: theme.colors.text.secondary,
              fontWeight: theme.typography.weight.regular,
              fontSize: compact ? 14 : 18,
              margin: 0,
            }}
          >
            {title}
          </h3>

          {/* Legend - Vertical Stack */}
          <div style={{ display: "flex", flexDirection: compact ? "row" : "column", gap: compact ? 12 : 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: compact ? 4 : 8 }}>
              <div
                style={{
                  width: compact ? 12 : 16,
                  height: compact ? 3 : 4,
                  borderRadius: 4,
                  backgroundColor: theme.colors.brand.primary,
                }}
              />
              <span
                style={{
                  fontSize: compact ? 10 : 12,
                  color: theme.colors.text.secondary,
                  fontWeight: theme.typography.weight.medium,
                }}
              >
                Joiners
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: compact ? 4 : 8 }}>
              <div
                style={{
                  width: compact ? 12 : 16,
                  height: compact ? 3 : 4,
                  borderRadius: 4,
                  backgroundColor: theme.colors.charts.orange,
                }}
              />
              <span
                style={{
                  fontSize: compact ? 10 : 12,
                  color: theme.colors.text.secondary,
                  fontWeight: theme.typography.weight.medium,
                }}
              >
                Leavers
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CHART AREA */}
      <div style={{ position: "relative" }}>
        <svg
          viewBox="0 0 400 220"
          style={{ width: svgWidth, height: svgHeight, overflow: "visible" }}
        >
          {/* Line 1: Joiners (Teal) */}
          <path
            d={joinerPath}
            fill="none"
            stroke={theme.colors.brand.primary}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={interpolate(progress, [0, 1], [pathLength, 0])}
          />

          {/* Line 2: Leavers (Orange) */}
          <path
            d={leaverPath}
            fill="none"
            stroke={theme.colors.charts.orange}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={interpolate(progress, [0, 1], [pathLength, 0])}
          />

          {/* X-AXIS LABELS */}
          <g transform="translate(0, 210)">
            {xLabels.map((label, i) => {
              const xPos = 20 + (360 / (xLabels.length - 1)) * i;
              return (
                <text
                  key={label}
                  x={xPos}
                  y="0"
                  fill="#9CA3AF"
                  fontSize={compact ? 10 : 12}
                  textAnchor="middle"
                >
                  {label}
                </text>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};
