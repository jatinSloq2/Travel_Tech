import React from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";

const SummaryCard = ({ title, value, loading }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      textAlign: "center",
      bgcolor: "background.paper",
      borderRadius: 2,
      boxShadow: 3,
    }}
  >
    <Typography
      variant="subtitle1"
      color="text.secondary"
      fontWeight="600"
      gutterBottom
    >
      {title}
    </Typography>

    {loading ? (
      <Typography color="text.disabled">Loading...</Typography>
    ) : (
      <Typography
        variant="h4"
        fontWeight="700"
        sx={{ color: "#ef6c00" }}  // custom orange color here
      >
        {value}
      </Typography>
    )}
  </Paper>
);

export default SummaryCard;
