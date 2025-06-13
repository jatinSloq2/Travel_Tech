import React from "react";

const Top10Entities = ({
  entities,
  title,
  bookingsKey = "bookings",
  revenueKey = "totalAmount",
  reviewKey = "avgReview",
  currency = "INR",
}) => {
  if (!entities || entities.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-gray-600">
        No {title.toLowerCase()} data available.
      </div>
    );
  }

  const sortedByBookings = [...entities]
    .sort((a, b) => (b[bookingsKey] || 0) - (a[bookingsKey] || 0))
    .slice(0, 10);

  const sortedByRevenue = [...entities]
    .sort((a, b) => (b[revenueKey] || 0) - (a[revenueKey] || 0))
    .slice(0, 10);

  const sortedByReview = [...entities]
    .sort((a, b) => (b[reviewKey] || 0) - (a[reviewKey] || 0))
    .slice(0, 10);

  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(num);

  return (
    <div className="space-y-10 max-w-6xl mx-auto p-6 font-sans">
      <h2 className="text-2xl font-semibold mb-6 text-center">Top 10 {title} Overview</h2>

      <section>
        <h3 className="text-xl font-semibold mb-4">Top 10 {title} by Bookings</h3>
        <ol className="list-decimal list-inside space-y-2">
          {sortedByBookings.map((item, i) => (
            <li key={item.id || item._id || i} className="flex justify-between border-b border-gray-200 py-2">
              <span>{item.name || item.operator || "Unnamed"}</span>
              <span className="font-semibold">{item[bookingsKey] || 0} bookings</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">Top 10 {title} by Total Revenue</h3>
        <ol className="list-decimal list-inside space-y-2">
          {sortedByRevenue.map((item, i) => (
            <li key={item.id || item._id || i} className="flex justify-between border-b border-gray-200 py-2">
              <span>{item.name || item.operator || "Unnamed"}</span>
              <span className="font-semibold">{formatCurrency(item[revenueKey] || 0)}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">Top 10 {title} by Average Review</h3>
        <ol className="list-decimal list-inside space-y-2">
          {sortedByReview.map((item, i) => (
            <li key={item.id || item._id || i} className="flex justify-between border-b border-gray-200 py-2">
              <span>{item.name || item.operator || "Unnamed"}</span>
              <span className="font-semibold">{(item[reviewKey] || 0).toFixed(2)} ⭐</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default Top10Entities;
