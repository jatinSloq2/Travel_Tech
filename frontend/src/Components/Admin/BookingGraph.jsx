import React from "react";
import { Typography, Box, useTheme } from "@mui/material";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const BookingGraph = ({ counts, amounts }) => {
  const theme = useTheme();

  const orange400 = theme.palette.orange?.[400] || "#fb923c";
  const orange500 = theme.palette.orange?.[500] || "#f97316";

  const data = [
    { type: "Hotel", count: counts.hotel ?? 0, amount: amounts.hotel ?? 0 },
    { type: "Bus", count: counts.bus ?? 0, amount: amounts.bus ?? 0 },
    { type: "Flight", count: counts.flight ?? 0, amount: amounts.flight ?? 0 },
    { type: "Train", count: counts.train ?? 0, amount: amounts.train ?? 0 },
  ];

  return (
    <Box sx={{ width: "100%", height: 360, mb: 5 }}>
      <Typography variant="h6" mb={2} textAlign="center">
        Booking Stats
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 40, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis
            yAxisId="left"
            label={{ value: "Count", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Amount (₹)",
              angle: -90,
              position: "insideRight",
              dx: 15,
            }}
          />
          <Tooltip />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="count"
            fill={orange400}
            name="Booking Count"
            barSize={20}
          />
          <Bar
            yAxisId="right"
            dataKey="amount"
            fill={orange500}
            name="Total Amount (₹)"
            barSize={20}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BookingGraph;
