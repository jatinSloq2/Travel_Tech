import React from "react";
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { orange } from "@mui/material/colors";

const FilterControls = ({ filterType, setFilterType, filterDate, setFilterDate, onReset }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      gap={2}
      mb={4}
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <FormControl
          variant="outlined"
          size="small"
          sx={{
            "& label.Mui-focused": { color: orange[800] },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: orange[800],
              },
            },
            "& .MuiSelect-icon": {
              color: orange[800],
            },
          }}
        >
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="bus">Bus</MenuItem>
            <MenuItem value="hotel">Hotel</MenuItem>
            <MenuItem value="flight">Flight</MenuItem>
            <MenuItem value="train">Train</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          variant="outlined"
          size="small"
          sx={{
            "& label.Mui-focused": { color: orange[800] },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: orange[800],
              },
            },
            "& .MuiSelect-icon": {
              color: orange[800],
            },
          }}
        >
          <InputLabel>Date</InputLabel>
          <Select
            label="Date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">All Dates</MenuItem>
            <MenuItem value="thisMonth">This Month</MenuItem>
            <MenuItem value="lastMonth">Last Month</MenuItem>
            <MenuItem value="thisYear">This Year</MenuItem>
            <MenuItem value="lastYear">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Button
        variant="text"
        size="small"
        onClick={onReset}
        sx={{
          color: orange[800],
          textTransform: "none",
          fontWeight: 500,
          mt: isMobile ? 1 : 0,
        }}
      >
        Reset Filters
      </Button>
    </Box>
  );
};

export default FilterControls;
