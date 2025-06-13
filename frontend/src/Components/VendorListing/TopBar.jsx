import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { orange } from "@mui/material/colors";

const TopBar = ({ onAddHotel, onAddBus }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={4}
      gap={2}
    >
      {/* Use Box with flex=1 to control width */}
      <Box flex={1}>
        <Typography variant="h4" fontWeight="bold" color="text.primary" noWrap>
          Your Hotel Listings
        </Typography>
      </Box>

      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          onClick={onAddHotel}
          sx={{
            backgroundColor: orange[800],
            "&:hover": {
              backgroundColor: orange[900],
            },
            px: 4,
            py: 1.5,
            borderRadius: 2,
            boxShadow: 3,
            textTransform: "none",
          }}
        >
          + Add Hotel
        </Button>

        <Button
          variant="contained"
          onClick={onAddBus}
          sx={{
            backgroundColor: orange[800],
            "&:hover": {
              backgroundColor: orange[900],
            },
            px: 4,
            py: 1.5,
            borderRadius: 2,
            boxShadow: 3,
            textTransform: "none",
          }}
        >
          + Add Bus
        </Button>
      </Box>
    </Box>
  );
};

export default TopBar;
