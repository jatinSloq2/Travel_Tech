import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const orange800 = "#EF6C00";

const BookingAnalytics = ({ analyticsData, loading }) => {
  const dataset = analyticsData.map((d) => ({
    date: d.date,
    bookings: d.bookings,
    revenueK: +(d.revenue / 1_000).toFixed(1),
  }));

  return (
    <div
      style={{
        maxWidth: "80rem",
        margin: "0 auto",
        backgroundColor: "white",
        borderRadius: "1rem", // rounded-xl approx 1rem
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        padding: "1.5rem",
        width: "100%",
      }}
    >
      <h2
        style={{
          fontSize: "1.125rem", // text-lg
          fontWeight: "600", // font-semibold
          color: orange800,
          marginBottom: "1rem",
        }}
      >
        Booking Analytics
      </h2>

      {loading ? (
        <div
          style={{
            height: 192, // 48 * 4 (px)
            backgroundColor: "#f3f4f6", // gray-100
            borderRadius: "0.375rem", // rounded-md
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
      ) : dataset.length ? (
        <div style={{ width: "100%", overflowX: "auto" }}>
          <BarChart
            height={320}
            dataset={dataset}
            xAxis={[
              {
                dataKey: "date",
                scaleType: "band",
                categoryGapRatio: 0.3,
                barGapRatio: 0.15,
              },
            ]}
            series={[
              {
                dataKey: "bookings",
                label: "Bookings",
                color: orange800, // set orange color for bookings bar
              },
              {
                dataKey: "revenueK",
                label: "Revenue (₹ k)",
                color: "#10b981", // keep green for revenue
              },
            ]}
            yAxis={[{ label: "Bookings / ₹ thousands" }]}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "top", horizontal: "right" },
              },
            }}
          />
        </div>
      ) : (
        <p style={{ fontSize: "0.875rem", color: "#6b7280" /* gray-500 */ }}>
          No analytics data available.
        </p>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default BookingAnalytics;
