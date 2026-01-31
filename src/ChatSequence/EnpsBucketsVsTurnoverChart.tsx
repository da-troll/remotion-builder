import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../theme";

// Helper to mix two hex colors
const mixHex = (hex1: string, hex2: string, t: number): string => {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

// 12-month data with a compelling story: stability, then turnover event in Oct-Nov
type MonthPoint = {
  month: string;
  s6: number;
  s7: number;
  s8: number;
  s9: number;
  s10: number;
  joiners: number;
  leavers: number;
};

const data: MonthPoint[] = [
  { month: "Feb", s6: 8, s7: 12, s8: 22, s9: 30, s10: 28, joiners: 12, leavers: 6 },
  { month: "Mar", s6: 7, s7: 11, s8: 23, s9: 31, s10: 28, joiners: 14, leavers: 5 },
  { month: "Apr", s6: 7, s7: 12, s8: 22, s9: 32, s10: 27, joiners: 15, leavers: 7 },
  { month: "May", s6: 6, s7: 11, s8: 21, s9: 33, s10: 29, joiners: 16, leavers: 6 },
  { month: "Jun", s6: 6, s7: 10, s8: 22, s9: 34, s10: 28, joiners: 18, leavers: 5 },
  { month: "Jul", s6: 7, s7: 11, s8: 21, s9: 33, s10: 28, joiners: 14, leavers: 8 },
  { month: "Aug", s6: 8, s7: 12, s8: 22, s9: 31, s10: 27, joiners: 10, leavers: 11 },
  { month: "Sep", s6: 9, s7: 13, s8: 23, s9: 30, s10: 25, joiners: 8, leavers: 14 },
  // Turnover event: Oct-Nov
  { month: "Oct", s6: 12, s7: 16, s8: 24, s9: 26, s10: 22, joiners: 6, leavers: 22 },
  { month: "Nov", s6: 14, s7: 17, s8: 23, s9: 25, s10: 21, joiners: 5, leavers: 19 },
  // Recovery
  { month: "Dec", s6: 11, s7: 14, s8: 24, s9: 28, s10: 23, joiners: 9, leavers: 12 },
  { month: "Jan", s6: 9, s7: 13, s8: 23, s9: 29, s10: 26, joiners: 13, leavers: 8 },
];

// Colors
const lineColors = {
  s10: theme.colors.charts.purple,
  s9: theme.colors.charts.pink,
  s8: theme.colors.charts.blue,
  s7: theme.colors.charts.teal,
  s6: theme.colors.charts.orange,
};

const turnoverColors = {
  joiners: theme.colors.charts.teal,
  leavers: mixHex(theme.colors.status.onError, "#ffffff", 0.55),
};

// Compute Pearson correlation
const pearson = (x: number[], y: number[]): number => {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
  const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);
  const num = n * sumXY - sumX * sumY;
  const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  return den === 0 ? 0 : num / den;
};

// Calculate correlations
const leavers = data.map((d) => d.leavers);
const s910 = data.map((d) => d.s9 + d.s10);
const s67 = data.map((d) => d.s6 + d.s7);
const corrLeaversHigh = pearson(leavers, s910);
const corrLeaversLow = pearson(leavers, s67);

// Generate smooth SVG path from points using Catmull-Rom to Bezier conversion
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

export const EnpsBucketsVsTurnoverChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation progress
  const drawProgress = spring({
    frame,
    fps,
    config: { mass: 1, damping: 18, stiffness: 60 },
  });

  const bottomDrawProgress = spring({
    frame: frame - 8,
    fps,
    config: { mass: 1, damping: 18, stiffness: 60 },
  });

  // Chart dimensions
  const topChartWidth = 520;
  const topChartHeight = 140;
  const bottomChartHeight = 80;
  const padding = { top: 10, right: 30, bottom: 25, left: 35 };

  const innerWidth = topChartWidth - padding.left - padding.right;
  const topInnerHeight = topChartHeight - padding.top - padding.bottom;
  const bottomInnerHeight = bottomChartHeight - padding.top - padding.bottom;

  // Scales
  const xScale = (i: number) => padding.left + (i / (data.length - 1)) * innerWidth;

  // Top chart Y scale (for percentages 0-40)
  const topYScale = (val: number) =>
    padding.top + topInnerHeight - (val / 40) * topInnerHeight;

  // Bottom chart Y scale (for joiners/leavers 0-25)
  const bottomYScale = (val: number) =>
    padding.top + bottomInnerHeight - (val / 25) * bottomInnerHeight;

  // Generate paths for score lines
  const scoreKeys = ["s6", "s7", "s8", "s9", "s10"] as const;
  const scorePaths = scoreKeys.map((key) => {
    const points = data.map((d, i) => ({
      x: xScale(i),
      y: topYScale(d[key]),
    }));
    return { key, path: generateSmoothPath(points) };
  });

  // Generate paths for joiners/leavers
  const joinersPoints = data.map((d, i) => ({ x: xScale(i), y: bottomYScale(d.joiners) }));
  const leaversPoints = data.map((d, i) => ({ x: xScale(i), y: bottomYScale(d.leavers) }));
  const joinersPath = generateSmoothPath(joinersPoints);
  const leaversPath = generateSmoothPath(leaversPoints);

  const pathLength = 800;

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface.main,
        borderRadius: theme.layout.borderRadius.card,
        boxShadow: theme.layout.shadow.card,
        padding: "20px 24px 28px 24px",
        width: "100%",
        fontFamily: theme.typography.fontFamily.body,
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: theme.typography.size.body + 2,
          fontWeight: theme.typography.weight.semibold,
          color: theme.colors.text.default,
          marginBottom: 6,
        }}
      >
        eNPS Score Trends vs. Turnover
      </div>

      {/* Micro-summary */}
      <div
        style={{
          fontSize: theme.typography.size.small,
          color: theme.colors.text.secondary,
          marginBottom: 12,
          lineHeight: 1.4,
        }}
      >
        Notice how 9–10s dip when leavers spike in Oct–Nov, while 6–7s rise.
      </div>

      {/* Top Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 16px",
          marginBottom: 12,
          fontSize: 11,
          color: theme.colors.text.secondary,
        }}
      >
        {(["s10", "s9", "s8", "s7", "s6"] as const).map((key) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div
              style={{
                width: 14,
                height: 3,
                borderRadius: 2,
                backgroundColor: lineColors[key],
              }}
            />
            <span>Score {key.slice(1)}</span>
          </div>
        ))}
      </div>

      {/* Top Chart: Score Trends */}
      <svg width={topChartWidth} height={topChartHeight}>
        {/* Grid lines */}
        {[10, 20, 30].map((val) => (
          <line
            key={val}
            x1={padding.left}
            y1={topYScale(val)}
            x2={topChartWidth - padding.right}
            y2={topYScale(val)}
            stroke={theme.colors.surface.outline}
            strokeOpacity={0.4}
            strokeWidth={1}
          />
        ))}

        {/* Score lines */}
        {scorePaths.map(({ key, path }) => (
          <path
            key={key}
            d={path}
            fill="none"
            stroke={lineColors[key]}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={interpolate(drawProgress, [0, 1], [pathLength, 0])}
          />
        ))}

        {/* X-axis labels (every other month) */}
        {data.map((d, i) =>
          i % 2 === 0 ? (
            <text
              key={d.month}
              x={xScale(i)}
              y={topChartHeight - 5}
              textAnchor="middle"
              fontSize={10}
              fill={theme.colors.text.secondary}
            >
              {d.month}
            </text>
          ) : null
        )}
      </svg>

      {/* Divider */}
      <div
        style={{
          height: 1,
          backgroundColor: theme.colors.surface.outline,
          margin: "12px 0",
          opacity: 0.5,
        }}
      />

      {/* Bottom Legend */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 8,
          fontSize: 11,
          color: theme.colors.text.secondary,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 14,
              height: 3,
              borderRadius: 2,
              backgroundColor: turnoverColors.joiners,
            }}
          />
          <span>Joiners</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 14,
              height: 3,
              borderRadius: 2,
              backgroundColor: turnoverColors.leavers,
            }}
          />
          <span>Leavers</span>
        </div>
      </div>

      {/* Bottom Chart: Joiners vs Leavers */}
      <svg width={topChartWidth} height={bottomChartHeight}>
        {/* Grid line */}
        <line
          x1={padding.left}
          y1={bottomYScale(12)}
          x2={topChartWidth - padding.right}
          y2={bottomYScale(12)}
          stroke={theme.colors.surface.outline}
          strokeOpacity={0.4}
          strokeWidth={1}
        />

        {/* Joiners line */}
        <path
          d={joinersPath}
          fill="none"
          stroke={turnoverColors.joiners}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={interpolate(bottomDrawProgress, [0, 1], [pathLength, 0])}
        />

        {/* Leavers line */}
        <path
          d={leaversPath}
          fill="none"
          stroke={turnoverColors.leavers}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={interpolate(bottomDrawProgress, [0, 1], [pathLength, 0])}
        />

        {/* X-axis labels */}
        {data.map((d, i) =>
          i % 2 === 0 ? (
            <text
              key={d.month}
              x={xScale(i)}
              y={bottomChartHeight - 3}
              textAnchor="middle"
              fontSize={10}
              fill={theme.colors.text.secondary}
            >
              {d.month}
            </text>
          ) : null
        )}
      </svg>

      {/* Correlation callout */}
      <div
        style={{
          marginTop: 14,
          padding: "10px 12px",
          backgroundColor: theme.colors.surface.variant,
          borderRadius: 8,
          fontSize: 11,
          color: theme.colors.text.secondary,
          lineHeight: 1.5,
        }}
      >
        <div style={{ fontWeight: theme.typography.weight.medium, marginBottom: 4 }}>
          Correlation (illustrative)
        </div>
        <div>Leavers vs 9–10s: r = {corrLeaversHigh.toFixed(2)}</div>
        <div>Leavers vs 6–7s: r = {corrLeaversLow > 0 ? "+" : ""}{corrLeaversLow.toFixed(2)}</div>
        <div
          style={{
            marginTop: 6,
            fontStyle: "italic",
            fontSize: 10,
            opacity: 0.8,
          }}
        >
          Note: correlation ≠ causation
        </div>
      </div>
    </div>
  );
};
