import React from "react";

const StatusFilter = ({ statusFilter, onChange }) => (
  <div className="mb-4 flex items-center gap-4">
    <label htmlFor="status" className="font-medium">
      Filter by Status:
    </label>
    <select
      id="status"
      value={statusFilter}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2"
    >
      <option value="">All</option>
      <option value="Booked">Booked</option>
      <option value="Completed">Completed</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  </div>
);

export default StatusFilter;