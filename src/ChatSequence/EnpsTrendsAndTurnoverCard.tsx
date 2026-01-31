import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../theme";
import { JoinersLeaversChart } from "./JoinersLeaversChart";

// Story: stability, then Oct-Nov turnover event causes 9-10s to dip and 6-7s to rise
const data = [
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

// Generate smooth SVG path from points
const generateSmoothPath = (
  points: { x: number; y: number }[],
  tension: number = 0.3
): string => {
  if (points.length < 2) return "";
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1.x + ((p2.x - p0.x) * tension) / 3;
    const cp1y = p1.y + ((p2.y - p0.y) * tension) / 3;
    const cp2x = p2.x - ((p3.x - p1.x) * tension) / 3;
    const cp2y = p2.y - ((p3.y - p1.y) * tension) / 3;
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return path;
};

export const EnpsTrendsAndTurnoverCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drawProgress = spring({
    frame,
    fps,
    config: { mass: 1, damping: 18, stiffness: 60 },
  });

  // Chart dimensions (width from theme, height flexible for content)
  const chartWidth = theme.chart.width;
  const chartHeight = 140;
  const padding = { top: 10, right: 20, bottom: 25, left: 30 };
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

  // X-axis labels (show only 4) - matches turnover chart: Feb, May, Aug, Nov
  const labelIndices = [0, 3, 6, 9];

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 16, // Gap between cards shows message bubble bg
        fontFamily: theme.typography.fontFamily.body,
      }}
    >
      {/* eNPS Chart Card */}
      <div
        style={{
          backgroundColor: theme.colors.surface.main,
          borderRadius: theme.layout.borderRadius.card,
          boxShadow: theme.layout.shadow.card,
          padding: "24px 24px 32px 24px",
        }}
      >
        {/* Title + Legend */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: theme.chart.title.marginBottom,
          }}
        >
          <h3
            style={{
              fontFamily: theme.chart.title.fontFamily,
              fontSize: theme.chart.title.fontSize,
              fontWeight: theme.chart.title.fontWeight,
              color: theme.chart.title.color,
              margin: 0,
            }}
          >
            eNPS - Last 12 months
          </h3>

          {/* Legend - Vertical Stack to match other charts */}
          <div style={{ display: "flex", flexDirection: "column", gap: theme.chart.legend.gap }}>
            <div style={{ display: "flex", alignItems: "center", gap: theme.chart.legend.itemGap }}>
              <div
                style={{
                  width: theme.chart.legend.indicator.pill.width,
                  height: theme.chart.legend.indicator.pill.height,
                  borderRadius: theme.chart.legend.indicator.pill.borderRadius,
                  backgroundColor: theme.colors.brand.primary,
                }}
              />
              <span
                style={{
                  fontFamily: theme.chart.legend.fontFamily,
                  fontSize: theme.chart.legend.fontSize,
                  fontWeight: theme.chart.legend.fontWeight,
                  color: theme.chart.legend.color,
                }}
              >
                9–10s
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: theme.chart.legend.itemGap }}>
              <div
                style={{
                  width: theme.chart.legend.indicator.pill.width,
                  height: theme.chart.legend.indicator.pill.height,
                  borderRadius: theme.chart.legend.indicator.pill.borderRadius,
                  backgroundColor: theme.colors.charts.orange,
                }}
              />
              <span
                style={{
                  fontFamily: theme.chart.legend.fontFamily,
                  fontSize: theme.chart.legend.fontSize,
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
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={interpolate(drawProgress, [0, 1], [pathLength, 0])}
          />

          {/* 6-7s line (orange) */}
          <path
            d={lowPath}
            fill="none"
            stroke={theme.colors.charts.orange}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={interpolate(drawProgress, [0, 1], [pathLength, 0])}
          />

          {/* X-axis labels */}
          {labelIndices.map((idx) => (
            <text
              key={data[idx].month}
              x={xScale(idx)}
              y={chartHeight - 5}
              textAnchor="middle"
              fontFamily={theme.chart.axisLabel.fontFamily}
              fontSize={theme.chart.axisLabel.fontSize}
              fill={theme.chart.axisLabel.color}
            >
              {data[idx].month}
            </text>
          ))}
        </svg>
      </div>

      {/* Turnover Chart Card - reusing JoinersLeaversChart */}
      <JoinersLeaversChart
        title="Turnover - Last 12 months"
        xLabels={["Feb", "May", "Aug", "Nov"]}
      />

      {/* Insight text */}
      <div
        style={{
          fontSize: 12,
          color: theme.colors.text.secondary,
          lineHeight: 1.5,
        }}
      >
        <span style={{ fontWeight: theme.typography.weight.medium }}>
          9–10s dip when leavers spike (Oct–Nov), while 6–7s rise.
        </span>
        <br />
        <span style={{ fontSize: 11, opacity: 0.8 }}>
          Correlation looks strong (illustrative) — worth slicing by team next. Correlation ≠ causation.
        </span>
      </div>
    </div>
  );
};
