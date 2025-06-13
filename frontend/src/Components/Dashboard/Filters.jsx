import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

const orange800 = "#EF6C00";

const Filters = ({
  type,
  setType,
  entities,
  selectedEntity,
  setSelectedEntity,
  range,
  setRange,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  loading,
  onCustomSubmit,
}) => {
  const rangeOptions = [
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
    "total",
  ];

  const entityLabel =
    type === "hotel" ? "Hotel" : type === "bus" ? "Bus" : "Entity";

  const allLabel =
    type === "hotel"
      ? "All Hotels"
      : type === "bus"
      ? "All Buses"
      : "All Entities";

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
      {/* Type Filter */}
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel sx={{ color: orange800 }}>Type</InputLabel>
        <Select
          value={type}
          label="Type"
          onChange={(e) => setType(e.target.value)}
          sx={{
            "& fieldset": { borderColor: orange800 },
            "&:hover fieldset": { borderColor: orange800 },
            "&.Mui-focused fieldset": { borderColor: orange800 },
          }}
        >
          <MenuItem value="hotel">Hotel</MenuItem>
          <MenuItem value="bus">Bus</MenuItem>
          <MenuItem value="all">All</MenuItem>
        </Select>
      </FormControl>

      {/* Entity Filter */}
      <FormControl sx={{ minWidth: 200 }} disabled={loading || !entities.length}>
        <InputLabel sx={{ color: orange800 }}>{entityLabel}</InputLabel>
        <Select
          value={selectedEntity}
          label={entityLabel}
          onChange={(e) => setSelectedEntity(e.target.value)}
          sx={{
            "& fieldset": { borderColor: orange800 },
            "&:hover fieldset": { borderColor: orange800 },
            "&.Mui-focused fieldset": { borderColor: orange800 },
          }}
        >
          <MenuItem value="all">{allLabel}</MenuItem>
          {entities.map((ent) => (
            <MenuItem key={ent._id || ent.id} value={ent._id || ent.id}>
              {ent.busNumber || ent.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Range Filter */}
      <FormControl sx={{ minWidth: 160 }}>
        <InputLabel sx={{ color: orange800 }}>Range</InputLabel>
        <Select
          value={range}
          label="Range"
          onChange={(e) => setRange(e.target.value)}
          sx={{
            "& fieldset": { borderColor: orange800 },
            "&:hover fieldset": { borderColor: orange800 },
            "&.Mui-focused fieldset": { borderColor: orange800 },
          }}
        >
          {rangeOptions.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Custom Date Range Inputs */}
      {range === "custom" && (
        <>
          <TextField
            label="Start Date"
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              minWidth: 160,
              "& label": { color: orange800 },
              "& label.Mui-focused": { color: orange800 },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: orange800 },
                "&:hover fieldset": { borderColor: orange800 },
                "&.Mui-focused fieldset": { borderColor: orange800 },
              },
            }}
          />

          <TextField
            label="End Date"
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              minWidth: 160,
              "& label": { color: orange800 },
              "& label.Mui-focused": { color: orange800 },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: orange800 },
                "&:hover fieldset": { borderColor: orange800 },
                "&.Mui-focused fieldset": { borderColor: orange800 },
              },
            }}
          />

          <Box sx={{ alignSelf: "flex-start" }}>
            <Button
              variant="contained"
              color="success"
              sx={{ minWidth: 100 }}
              onClick={() => onCustomSubmit(range, customStartDate, customEndDate)}
            >
              Apply
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Filters;
