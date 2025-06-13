import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { green } from "@mui/material/colors";

const AmenitiesBadge = ({ amenities }) => {
  if (!amenities || amenities.length === 0) return null;

  return (
    <Box>
      <Typography variant="body2" fontWeight={600} gutterBottom>
        Amenities:
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {amenities.map((a, i) => (
          <Chip
            key={i}
            label={a}
            size="small"
            sx={{
              backgroundColor: green[100],
              color: green[800],
              fontWeight: 500,
              borderRadius: 999,
              px: 1.5,
              py: 0.5,
              boxShadow: 1,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AmenitiesBadge;
