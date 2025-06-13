import React from "react";
import { useAuth } from "../../Context/AuthContext";

import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  TextField,
  CircularProgress,
} from "@mui/material";

const InventoryTable = ({
  inventory,
  loading,
  inventoryDate,
  setInventoryDate,
  todayStr,
}) => {
  const { role } = useAuth();

  if (role === "ADMIN") return null;

  return (
    <Paper elevation={2} sx={{ p: 3, width: "100%", borderRadius: 2 }}>
      {/* Header with date picker */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" color="text.primary">
          Inventory on{" "}
          <Box component="span" color="primary.main">
            {inventoryDate}
          </Box>
        </Typography>

        <TextField
          type="date"
          size="small"
          value={inventoryDate}
          inputProps={{ max: todayStr() }}
          onChange={(e) => setInventoryDate(e.target.value)}
        />
      </Box>

      {/* Loading state */}
      {loading ? (
        <Box
          sx={{
            height: 96,
            bgcolor: "grey.100",
            borderRadius: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : inventory.length ? (
        <TableContainer>
          <Table aria-label="inventory table">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Booked</TableCell>
                <TableCell>Available</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {inventory.map((row, i) => (
                <TableRow key={i} hover sx={{ cursor: "default" }}>
                  <TableCell>
                    {row.roomType || row.busNumber || "N/A"}
                  </TableCell>
                  <TableCell>{row.hotelName || row.busName || "N/A"}</TableCell>
                  <TableCell>{row.total}</TableCell>
                  <TableCell>{row.booked}</TableCell>
                  <TableCell>{row.available}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No inventory data available.
        </Typography>
      )}
    </Paper>
  );
};

export default InventoryTable;
