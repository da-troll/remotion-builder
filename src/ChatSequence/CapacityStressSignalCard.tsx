import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../theme";
import { generateSmoothPath } from "./chartUtils";

// 12-month data showing workload sentiment dropping, sick leave rising ~4 weeks later
const capacityData = [
  { month: "Feb", workload: 72, sickLeave: 18 },
  { month: "Mar", workload: 74, sickLeave: 17 },
  { month: "Apr", workload: 73, sickLeave: 18 },
  { month: "May", workload: 71, sickLeave: 19 },
  { month: "Jun", workload: 68, sickLeave: 20 },
  { month: "Jul", workload: 65, sickLeave: 22 },
  { month: "Aug", workload: 58, sickLeave: 25 },
  { month: "Sep", workload: 52, sickLeave: 28 },
  // Stress event: workload drops sharply Oct-Nov, sick leave spikes Nov-Dec
  { month: "Oct", workload: 45, sickLeave: 32 },
  { month: "Nov", workload: 42, sickLeave: 38 },
  { month: "Dec", workload: 48, sickLeave: 35 },
  { month: "Jan", workload: 55, sickLeave: 30 },
];

interface CapacityStressSignalCardProps {
  title?: string;
  subtitle?: string;
  hideTitle?: boolean;
  compact?: boolean;
  embedded?: boolean;
}

export const CapacityStressSignalCard: React.FC<CapacityStressSignalCardProps> = ({
  title = "Capacity stress signal (Feb 25 – Jan 26)",
  subtitle = "Workload sentiment vs sick leave",
  hideTitle = false,
  compact = false,
  embedded = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stagger line drawing: line 1 first, line 2 delayed by 6 frames
  const progress1 = spring({
    frame,
    fps,
    config: theme.chart.animation.spring,
  });

  const progress2 = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: theme.chart.animation.spring,
  });

  // When embedded or compact, remove card styling
  const noCardStyle = compact || embedded;

  // Chart dimensions
  const chartWidth = compact ? theme.chart.compact.contentWidth : theme.chart.contentWidth;
  const chartHeight = compact ? 120 : 160;
  const padding = theme.chart.line.padding;
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Scales
  const xScale = (i: number) => padding.left + (i / (capacityData.length - 1)) * innerWidth;
  // Y scale: 0-100 range, inverted
  const yScale = (val: number) => padding.top + innerHeight - (val / 100) * innerHeight;

  // Generate paths
  const workloadPoints = capacityData.map((d, i) => ({ x: xScale(i), y: yScale(d.workload) }));
  const sickLeavePoints = capacityData.map((d, i) => ({ x: xScale(i), y: yScale(d.sickLeave) }));
  const workloadPath = generateSmoothPath(workloadPoints);
  const sickLeavePath = generateSmoothPath(sickLeavePoints);

  const pathLength = 600;
  const xLabels = ["Feb", "May", "Aug", "Nov"];

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: noCardStyle ? "transparent" : theme.colors.surface.main,
        borderRadius: noCardStyle ? 0 : theme.layout.borderRadius.card,
        boxShadow: noCardStyle ? "none" : theme.layout.shadow.card,
        padding: noCardStyle ? 0 : "24px 24px 32px 24px",
        fontFamily: theme.typography.fontFamily.body,
      }}
    >
      {/* Title + Subtitle */}
      {!hideTitle && (
        <div style={{ marginBottom: compact ? theme.chart.compact.title.marginBottom : theme.chart.title.marginBottom }}>
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
          <div
            style={{
              fontFamily: theme.chart.legend.fontFamily,
              fontSize: compact ? theme.chart.compact.legend.fontSize : theme.chart.legend.fontSize,
              color: theme.chart.legend.color,
              marginTop: 4,
              opacity: 0.8,
            }}
          >
            {subtitle}
          </div>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: compact ? theme.chart.compact.legend.gap : theme.chart.legend.horizontalGap,
          marginBottom: compact ? theme.chart.compact.title.marginBottom : 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: compact ? theme.chart.compact.legend.itemGap : theme.chart.legend.itemGap }}>
          <div
            style={{
              width: compact ? theme.chart.compact.legend.indicator.pill.width : theme.chart.legend.indicator.pill.width,
              height: compact ? theme.chart.compact.legend.indicator.pill.height : theme.chart.legend.indicator.pill.height,
              borderRadius: theme.chart.legend.indicator.pill.borderRadius,
              backgroundColor: theme.colors.charts.teal,
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
            Workload sentiment
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
            Sick leave index
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <svg width={chartWidth} height={chartHeight}>
        {/* Subtle grid lines */}
        {[0.33, 0.66].map((ratio, i) => {
          const y = padding.top + innerHeight * (1 - ratio);
          return (
            <line
              key={i}
              x1={padding.left}
              y1={y}
              x2={chartWidth - padding.right}
              y2={y}
              stroke={theme.colors.surface.outline}
              strokeOpacity={0.4}
              strokeWidth={1}
            />
          );
        })}

        {/* Workload sentiment line (teal) */}
        <path
          d={workloadPath}
          fill="none"
          stroke={theme.colors.charts.teal}
          strokeWidth={theme.chart.line.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={interpolate(progress1, [0, 1], [pathLength, 0])}
        />

        {/* Sick leave line (orange) - delayed */}
        <path
          d={sickLeavePath}
          fill="none"
          stroke={theme.colors.charts.orange}
          strokeWidth={theme.chart.line.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={interpolate(progress2, [0, 1], [pathLength, 0])}
        />

        {/* X-axis labels */}
        {xLabels.map((label, i) => {
          const dataIndex = i * 3;
          return (
            <text
              key={label}
              x={xScale(dataIndex)}
              y={chartHeight - theme.chart.line.labelOffset}
              textAnchor="middle"
              fontFamily={theme.chart.axisLabel.fontFamily}
              fontSize={compact ? theme.chart.compact.axisLabel.fontSize : theme.chart.axisLabel.fontSize}
              fill={theme.chart.axisLabel.color}
            >
              {label}
            </text>
          );
        })}
      </svg>

      {/* Insight text */}
      <div
        style={{
          fontFamily: theme.chart.insight.fontFamily,
          fontSize: compact ? theme.chart.compact.insight.fontSize : theme.chart.insight.fontSize,
          color: theme.chart.insight.color,
          lineHeight: theme.chart.insight.lineHeight,
          marginTop: 12,
        }}
      >
        <span style={{ fontWeight: theme.chart.insight.fontWeight }}>
          Workload drops → sick leave rises ~4 weeks later.
        </span>
        {" "}
        <span style={{ opacity: 0.8 }}>
          Vacation usage dips at the same time.
        </span>
      </div>
    </div>
  );
};
