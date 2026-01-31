import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../theme";
import { JoinersLeaversChart } from "./JoinersLeaversChart";
import { generateSmoothPath } from "./chartUtils";

// Story: stability, then Oct-Nov turnover event causes 9-10s to dip and 6-7s to rise
const defaultData = [
  { month: "Feb", high: 58, low: 20 },  // 9-10s vs 6-7s percentages
  { month: "Mar", high: 59, low: 18 },
  { month: "Apr", high: 59, low: 19 },
  { month: "May", high: 62, low: 17 },
  { month: "Jun", high: 62, low: 16 },
  { month: "Jul", high: 61, low: 18 },
  { month: "Aug", high: 58, low: 20 },
  { month: "Sep", high: 55, low: 22 },
  // Turnover event
  { month: "Oct", high: 48, low: 28 },
  { month: "Nov", high: 46, low: 31 },
  // Recovery
  { month: "Dec", high: 51, low: 25 },
  { month: "Jan", high: 55, low: 22 },
];

interface EnpsTrendsAndTurnoverCardProps {
  title?: string;
  data?: { month: string; high: number; low: number }[];
  xLabels?: string[];
  turnoverTitle?: string;
  turnoverXLabels?: string[];
  hideTitle?: boolean;
  compact?: boolean;
  embedded?: boolean; // When true, removes card styling from inner cards for nesting
}

export const EnpsTrendsAndTurnoverCard: React.FC<EnpsTrendsAndTurnoverCardProps> = ({
  title = "eNPS - Last 12 months",
  data = defaultData,
  xLabels = ["Feb", "May", "Aug", "Nov"],
  turnoverTitle = "Turnover - Last 12 months",
  turnoverXLabels = ["Feb", "May", "Aug", "Nov"],
  hideTitle = false,
  compact = false,
  embedded = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drawProgress = spring({
    frame,
    fps,
    config: theme.chart.animation.spring,
  });

  // When embedded or compact, remove card styling from inner cards
  const noCardStyle = compact || embedded;

  // Chart dimensions using theme tokens
  const chartWidth = compact ? theme.chart.compact.width : theme.chart.width;
  const chartHeight = compact ? 100 : 140;
  const padding = theme.chart.line.padding;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Scales
  const xScale = (i: number) => padding.left + (i / (data.length - 1)) * innerWidth;
  const yScale = (val: number) => padding.top + innerHeight - ((val - 10) / 60) * innerHeight;

  // Generate paths
  const highPoints = data.map((d, i) => ({ x: xScale(i), y: yScale(d.high) }));
  const lowPoints = data.map((d, i) => ({ x: xScale(i), y: yScale(d.low) }));
  const highPath = generateSmoothPath(highPoints);
  const lowPath = generateSmoothPath(lowPoints);

  const pathLength = 600;

  // Map xLabels to their indices in the data array
  const labelIndices = xLabels.map((label) => data.findIndex((d) => d.month === label)).filter((i) => i >= 0);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: compact ? 10 : 16, // Gap between cards shows message bubble bg
        fontFamily: theme.typography.fontFamily.body,
      }}
    >
      {/* eNPS Chart Card */}
      <div
        style={{
          backgroundColor: noCardStyle ? "transparent" : theme.colors.surface.main,
          borderRadius: noCardStyle ? 0 : theme.layout.borderRadius.card,
          boxShadow: noCardStyle ? "none" : theme.layout.shadow.card,
          padding: noCardStyle ? 0 : "24px 24px 32px 24px",
        }}
      >
        {/* Title + Legend */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: compact ? theme.chart.compact.title.marginBottom : theme.chart.title.marginBottom,
          }}
        >
          {!hideTitle && (
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
          )}

          {/* Legend - Vertical Stack to match other charts */}
          <div style={{ display: "flex", flexDirection: compact ? "row" : "column", gap: compact ? theme.chart.compact.legend.gap : theme.chart.legend.gap }}>
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
                9–10s
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
                6–7s
              </span>
            </div>
          </div>
        </div>

        {/* eNPS Trend Chart (2 lines) */}
        <svg width={chartWidth} height={chartHeight}>
          {/* Single grid line */}
          <line
            x1={padding.left}
            y1={yScale(40)}
            x2={chartWidth - padding.right}
            y2={yScale(40)}
            stroke={theme.colors.surface.outline}
            strokeOpacity={0.4}
            strokeWidth={1}
          />

          {/* 9-10s line (brand primary - matches Joiners) */}
          <path
            d={highPath}
            fill="none"
            stroke={theme.colors.brand.primary}
            strokeWidth={theme.chart.line.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={interpolate(drawProgress, [0, 1], [pathLength, 0])}
          />

          {/* 6-7s line (orange) */}
          <path
            d={lowPath}
            fill="none"
            stroke={theme.colors.charts.orange}
            strokeWidth={theme.chart.line.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={interpolate(drawProgress, [0, 1], [pathLength, 0])}
          />

          {/* X-axis labels */}
          {labelIndices.map((idx) => (
            <text
              key={data[idx].month}
              x={xScale(idx)}
              y={chartHeight - theme.chart.line.labelOffset}
              textAnchor="middle"
              fontFamily={theme.chart.axisLabel.fontFamily}
              fontSize={compact ? theme.chart.compact.axisLabel.fontSize : theme.chart.axisLabel.fontSize}
              fill={theme.chart.axisLabel.color}
            >
              {data[idx].month}
            </text>
          ))}
        </svg>
      </div>

      {/* Turnover Chart Card - reusing JoinersLeaversChart */}
      <JoinersLeaversChart
        title={turnoverTitle}
        xLabels={turnoverXLabels}
        compact={compact}
        embedded={embedded}
      />

      {/* Insight text */}
      <div
        style={{
          fontSize: compact ? 10 : 12,
          color: theme.colors.text.secondary,
          lineHeight: 1.5,
        }}
      >
        <span style={{ fontWeight: theme.typography.weight.medium }}>
          9–10s dip when leavers spike (Oct–Nov), while 6–7s rise.
        </span>
        <br />
        <span style={{ fontSize: compact ? 9 : 11, opacity: 0.8 }}>
          Correlation looks strong (illustrative) — worth slicing by team next. Correlation ≠ causation.
        </span>
      </div>
    </div>
  );
};
