"use client";

import { Guest } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import React, { useMemo, useState } from "react";

const COLORS = {
  hadir: "#10b981",
  tidakHadir: "#ef4444",
  belumKonfirmasi: "#9ca3af",
};

type AttendancePieChartProps = {
  data: Guest[];
  isFetching?: boolean;
};
const AttendancePieChart: React.FC<AttendancePieChartProps> = ({
  data,
  isFetching,
}) => {
  const [showSliceLabels, setShowSliceLabels] = useState(false);

  const { chartData, total } = useMemo(() => {
    let hadir = 0;
    let tidakHadir = 0;
    let belumKonfirmasi = 0;

    for (const guest of data) {
      if (guest.isAttending === true) {
        hadir++;
      } else if (guest.isAttending === false && guest.totalGuests === 0) {
        tidakHadir++;
      } else {
        belumKonfirmasi++;
      }
    }

    const total = hadir + tidakHadir + belumKonfirmasi;

    return {
      total,
      chartData: [
        { name: "Hadir", value: hadir, color: COLORS.hadir },
        { name: "Tidak Hadir", value: tidakHadir, color: COLORS.tidakHadir },
        {
          name: "Belum Konfirmasi",
          value: belumKonfirmasi,
          color: COLORS.belumKonfirmasi,
        },
      ],
    };
  }, [data]);

  if (isFetching) {
    return (
      <div className="relative w-full max-w-xs mx-auto animate-pulse">
        <div className="w-full h-[260px] flex items-center justify-center">
          <div className="w-40 h-40 rounded-full bg-gray-300" />
        </div>
        <div className="flex justify-center mt-3 gap-4 text-sm">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <div className="w-16 h-3 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full max-w-xs mx-auto">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              paddingAngle={2}
              cornerRadius={8}
              labelLine={false}
              isAnimationActive={true}
              onAnimationEnd={() => setShowSliceLabels(true)}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>

            <foreignObject
              x="0"
              y="0"
              width="100%"
              height="100%"
              className="pointer-events-none"
            >
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="text-base font-semibold text-gray-800">
                  {total}
                </div>
                <div className="text-xs text-gray-500">Total Tamu</div>
              </div>
            </foreignObject>

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const { name, value } = payload[0].payload;
                  const percentage =
                    total > 0 ? ((value / total) * 100).toFixed(1) : "0";
                  return (
                    <div
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                        fontSize: "0.875rem",
                        color: "#1f2937",
                      }}
                    >
                      <div className="font-medium">{name}</div>
                      <div>{value} orang</div>
                      <div>{percentage}%</div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {showSliceLabels && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <svg width="100%" height="100%" className="w-full h-full">
              <g transform="translate(160,120)">
                {chartData.map((entry, index) => {
                  const totalValue = chartData.reduce(
                    (sum, item) => sum + item.value,
                    0
                  );
                  const angle =
                    (chartData
                      .slice(0, index)
                      .reduce((sum, d) => sum + d.value, 0) +
                      entry.value / 2) /
                    totalValue;

                  const radian = 2 * Math.PI * angle;
                  const radius = 65;
                  const x = radius * Math.cos(-radian);
                  const y = radius * Math.sin(-radian);

                  return (
                    <text
                      key={entry.name}
                      x={x}
                      y={y}
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={12}
                      fontWeight={600}
                      style={{
                        opacity: 0,
                        animation: `fadeIn 0.3s forwards`,
                        animationDelay: `${2 + index * 0.5}s`,
                      }}
                    >
                      {entry.value}
                    </text>
                  );
                })}
              </g>
            </svg>
          </div>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
      <div className="flex justify-center gap-4 text-sm">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">{entry.name}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default AttendancePieChart;
