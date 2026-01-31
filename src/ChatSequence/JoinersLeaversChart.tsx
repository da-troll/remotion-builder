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

  // Chart content dimensions
  // Use canonical width for paths (480px coordinate system), but height fits actual content
  const canonicalWidth = theme.chart.contentWidth; // 480 - paths are drawn in this coordinate system
  const displayWidth = compact ? theme.chart.compact.contentWidth : theme.chart.contentWidth;

  // Actual content height: paths end ~y=105, labels at y=150, plus ~15px for label text
  // This makes the container fit tightly around content
  const contentHeight = 165;

  // Hand-crafted Bezier curves matching the eNPS story:
  // Leavers show moderate rise in Oct-Nov period. Y inverted (lower Y = higher value)
  // Drawn for 480px canonical width, with ~20px top padding to match eNPS chart
  const joinerPath =
    "M 24 35 C 144 28, 264 25, 360 30 C 408 33, 444 30, 456 28";
  const leaverPath =
    "M 24 105 C 180 102, 300 95, 384 80 C 420 65, 444 55, 456 45";

  // Path length for dashoffset animation (approximate)
  const pathLength = 600;

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
            marginBottom: compact ? theme.chart.compact.title.marginBottom : theme.chart.title.marginBottom,
          }}
        >
          <h3
            style={{
              fontFamily: theme.chart.title.fontFamily,
              fontSize: compact ? theme.chart.compact.title.fontSize : theme.chart.title.fontSize,
              fontWeight: theme.chart.title.fontWeight,
              color: theme.chart.title.color,
              margin: 0,
            }}
          >
            {title}
          </h3>

          {/* Legend - Vertical Stack */}
          <div style={{
            display: "flex",
            flexDirection: compact ? "row" : "column",
            gap: compact ? theme.chart.compact.legend.gap : theme.chart.legend.gap
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: compact ? theme.chart.compact.legend.itemGap : theme.chart.legend.itemGap }}>
              <div
                style={{
                  width: compact ? theme.chart.compact.legend.indicator.pill.width : theme.chart.legend.indicator.pill.width,
                  height: compact ? theme.chart.compact.legend.indicator.pill.height : theme.chart.legend.indicator.pill.height,
                  borderRadius: theme.chart.legend.indicator.pill.borderRadius,
                  backgroundColor: theme.colors.brand.primary,
                }}
              />
              <span
                style={{
                  fontFamily: theme.chart.legend.fontFamily,
                  fontSize: compact ? theme.chart.compact.legend.fontSize : theme.chart.legend.fontSize,
                  fontWeight: theme.chart.legend.fontWeight,
                  color: theme.chart.legend.color,
                }}
              >
                Joiners
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: compact ? theme.chart.compact.legend.itemGap : theme.chart.legend.itemGap }}>
              <div
                style={{
                  width: compact ? theme.chart.compact.legend.indicator.pill.width : theme.chart.legend.indicator.pill.width,
                  height: compact ? theme.chart.compact.legend.indicator.pill.height : theme.chart.legend.indicator.pill.height,
                  borderRadius: theme.chart.legend.indicator.pill.borderRadius,
                  backgroundColor: theme.colors.charts.orange,
                }}
              />
              <span
                style={{
                  fontFamily: theme.chart.legend.fontFamily,
                  fontSize: compact ? theme.chart.compact.legend.fontSize : theme.chart.legend.fontSize,
                  fontWeight: theme.chart.legend.fontWeight,
                  color: theme.chart.legend.color,
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
          viewBox={`0 0 ${canonicalWidth} ${contentHeight}`}
          width={displayWidth}
          height={contentHeight * (displayWidth / canonicalWidth)}
          style={{ overflow: "visible" }}
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
          <g transform="translate(0, 150)">
            {xLabels.map((label, i) => {
              // Padding: 24 left, 24 right = 432 usable width (in canonical 480px space)
              const xPos = 24 + (432 / (xLabels.length - 1)) * i;
              return (
                <text
                  key={label}
                  x={xPos}
                  y="0"
                  fill={theme.chart.axisLabel.color}
                  fontFamily={theme.chart.axisLabel.fontFamily}
                  fontSize={theme.chart.axisLabel.fontSize}
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
