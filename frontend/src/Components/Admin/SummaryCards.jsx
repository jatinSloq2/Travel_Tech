import React from "react";
import SummaryCard from "../Dashboard/SummaryCard";

const SummaryCards = ({ counts, amounts, loading }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {/* Booking counts */}
      <SummaryCard
        title="Hotel Bookings"
        value={counts.hotel}
        loading={loading}
      />
      <SummaryCard title="Bus Bookings" value={counts.bus} loading={loading} />
      <SummaryCard
        title="Flight Bookings"
        value={counts.flight}
        loading={loading}
      />
      <SummaryCard
        title="Train Bookings"
        value={counts.train}
        loading={loading}
      />
      <SummaryCard
        title="Total Bookings"
        value={counts.total}
        loading={loading}
      />

      {/* Amounts */}
      <SummaryCard
        title="Hotel Amount (₹)"
        value={amounts.hotel.toLocaleString()}
        loading={loading}
      />
      <SummaryCard
        title="Bus Amount (₹)"
        value={amounts.bus.toLocaleString()}
        loading={loading}
      />
      <SummaryCard
        title="Flight Amount (₹)"
        value={amounts.flight.toLocaleString()}
        loading={loading}
      />
      <SummaryCard
        title="Train Amount (₹)"
        value={amounts.train.toLocaleString()}
        loading={loading}
      />
      <SummaryCard
        title="Total Amount (₹)"
        value={amounts.total.toLocaleString()}
        loading={loading}
      />
    </div>
  );
};

export default SummaryCards;
