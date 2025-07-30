"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Invitation } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface InvitationChartProps {
  invitations: Invitation[];
}

const COLORS = ["#008080", "#e11d48", "#facc15", "#6366f1", "#06b6d4"];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const InvitationChart: React.FC<InvitationChartProps> = ({ invitations }) => {
  const now = new Date();
  const safeInvitations = invitations ?? [];

  const monthlyInvitations = new Array(12).fill(0);
  safeInvitations.forEach((inv) => {
    const createdAt = new Date(inv.createdAt);
    const month = createdAt.getMonth();
    monthlyInvitations[month]++;
  });

  const monthlyData = months.map((month, index) => ({
    month,
    invitations: monthlyInvitations[index],
  }));

  const monthlyTransactions = new Array(12).fill(0);
  safeInvitations.forEach((inv) => {
    const createdAt = new Date(inv.createdAt);
    const month = createdAt.getMonth();
    const amount = Number(inv.transaction?.amount ?? 0);
    monthlyTransactions[month] += amount;
  });

  const transactionData = months.map((month, index) => ({
    month,
    total: monthlyTransactions[index],
  }));

  let active = 0;
  let inactive = 0;
  safeInvitations.forEach((inv) => {
    const isActive =
      inv.transaction?.status.name === "SUCCESS" &&
      new Date(inv.expiresAt) > now;
    if (isActive) {
      active++;
    } else {
      inactive++;
    }
  });

  const activeData = [
    { name: "Aktif", value: active },
    { name: "Tidak Aktif", value: inactive },
  ];

  const statusMap = new Map<string, number>();
  safeInvitations.forEach((inv) => {
    const name = inv.transaction?.status.name ?? "UNKNOWN";
    statusMap.set(name, (statusMap.get(name) ?? 0) + 1);
  });

  const statusData = Array.from(statusMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  const renderDonutChart = (data: { name: string; value: number }[]) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
            paddingAngle={2}
            cornerRadius={8}
            labelLine={false}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
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
              <div className="text-xs text-gray-500">Total</div>
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
                    <div>{value} undangan</div>
                    <div>{percentage}%</div>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderLegend = (data: { name: string; value: number }[]) => (
    <div className="flex justify-center gap-4 mt-2 text-sm">
      {data.map((entry, index) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span className="text-gray-700">{entry.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Undangan per Bulan</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${value}`, "Undangan"]}
              />
              <Bar dataKey="invitations" fill="#008080" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">
            Total Transaksi per Bulan
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={transactionData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) =>
                  `Rp ${value.toLocaleString("id-ID")}`
                }
              />
              <Bar dataKey="total" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Status Transaksi</h2>
          {renderDonutChart(statusData)}
          {renderLegend(statusData)}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Aktif vs Tidak Aktif</h2>
          {renderDonutChart(activeData)}
          {renderLegend(activeData)}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationChart;
