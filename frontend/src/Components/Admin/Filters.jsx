import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

const DATE_OPTIONS = [
  "total",
  "today",
  "yesterday",
  "thisWeek",
  "lastWeek",
  "last7",
  "last30",
  "last90",
  "thisMonth",
  "lastMonth",
  "thisYear",
  "yearToDate",
  "lastYear",
  "custom",
];

const Filters = ({
  owners,
  ownerId,
  setOwnerId,
  status,
  setStatus,
  STATUS_OPTIONS,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 3,
        mb: 4,
      }}
    >
      {/* Owner Filter */}
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel
          id="ownerId-label"
          sx={{
            color: "#ef6c00",
            "&.Mui-focused": { color: "#ef6c00" },
          }}
        >
          Owner ID
        </InputLabel>
        <Select
          labelId="ownerId-label"
          id="ownerId"
          value={ownerId}
          label="Owner ID"
          onChange={(e) => setOwnerId(e.target.value)}
          sx={{
            color: "#ef6c00",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ef6c00",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ef6c00",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ef6c00",
            },
          }}
        >
          <MenuItem value="">All Owners</MenuItem>
          {owners.map((owner) => (
            <MenuItem key={owner.user_id} value={owner.user_id}>
              {owner.email} (ID: {owner.user_id})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Status Filter */}
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel
          id="status-label"
          sx={{
            color: "#ef6c00",
            "&.Mui-focused": { color: "#ef6c00" },
          }}
        >
          Booking Status
        </InputLabel>
        <Select
          labelId="status-label"
          id="status"
          value={status}
          label="Booking Status"
          onChange={(e) => setStatus(e.target.value)}
          sx={{
            color: "#ef6c00",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ef6c00",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ef6c00",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ef6c00",
            },
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Filters;
