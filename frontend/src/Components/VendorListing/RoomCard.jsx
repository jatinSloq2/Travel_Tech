import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Collapse,
  Stack,
} from "@mui/material";
import { red, yellow, blue } from "@mui/material/colors";
import AmenitiesBadge from "./AmenitiesBadge";

const RoomCard = ({ room, expanded, onToggle, onEdit, onDelete }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.300",
        bgcolor: "background.paper",
        mb: 2,
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      {/* Header - Room Type and Toggle */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ cursor: "pointer" }}
        onClick={onToggle}
      >
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          {room.roomType}
        </Typography>
        <Typography variant="body2" color={blue[700]}>
          {expanded ? "Hide Details ▲" : "Show Details ▼"}
        </Typography>
      </Box>

      {/* Collapsible Room Details */}
      <Collapse in={expanded}>
        <Box mt={2} color="text.secondary">
          <Typography variant="body2">
            <strong>Price:</strong> ₹{room.pricePerNight} / night
          </Typography>
          <Typography variant="body2">
            <strong>Capacity:</strong> {room.capacity} person(s)
          </Typography>
          <Typography variant="body2">
            <strong>Total Available:</strong> {room.totalRooms}
          </Typography>

          <Box mt={1.5}>
            <AmenitiesBadge amenities={room.amenities} />
          </Box>

          <Stack direction="row" spacing={1.5} mt={2}>
            <Button
              variant="contained"
              size="small"
              onClick={onEdit}
              sx={{
                bgcolor: yellow[700],
                "&:hover": { bgcolor: yellow[800] },
                textTransform: "none",
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={onDelete}
              sx={{
                bgcolor: red[600],
                "&:hover": { bgcolor: red[700] },
                textTransform: "none",
              }}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default RoomCard;
