import React from "react";
import {
  Box,
  Typography,
  Button,
  ListItem,
  Divider,
  Stack,
} from "@mui/material";
import { orange, red, yellow, blue } from "@mui/material/colors";
import RoomCard from "./RoomCard";

const HotelCard = ({
  hotel,
  onDeleteHotel,
  onDeleteRoom,
  navigate,
  expandedRooms,
  toggleRoom,
}) => {
  return (
    <ListItem
      sx={{
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 2,
        p: 3,
        mb: 3,
        boxShadow: 2,
        bgcolor: "background.paper",
        "&:hover": {
          boxShadow: 6,
          transition: "box-shadow 0.3s",
        },
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={3}>
        <Box flex={1}>
          <Typography variant="h5" fontWeight="bold" color={orange[900]}>
            {hotel.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontStyle="italic" mt={0.5}>
            {hotel.location}
          </Typography>
          <Typography variant="body1" color="text.primary" mt={2}>
            {hotel.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            <strong>Total Types of Rooms:</strong> {hotel.totalRooms || 0}
          </Typography>
        </Box>

        <Stack spacing={1}>
          <Button
            variant="contained"
            onClick={() => navigate(`/addroom/${hotel._id}`)}
            sx={{
              bgcolor: blue[700],
              "&:hover": { bgcolor: blue[800] },
              textTransform: "none",
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            + Add Room
          </Button>
          <Button
            variant="contained"
            onClick={() => onDeleteHotel(hotel._id)}
            sx={{
              bgcolor: red[700],
              "&:hover": { bgcolor: red[800] },
              textTransform: "none",
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            Delete Hotel
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(`/edithotel/${hotel._id}`)}
            sx={{
              bgcolor: orange[700],
              "&:hover": { bgcolor: orange[800] },
              textTransform: "none",
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            Edit
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        {(hotel.rooms || []).map((room) => (
          <RoomCard
            key={room._id}
            room={room}
            expanded={expandedRooms[room._id]}
            onToggle={() => toggleRoom(room._id)}
            onEdit={() => navigate(`/editroom/${room._id}`)}
            onDelete={() => onDeleteRoom(room._id, hotel._id)}
          />
        ))}
      </Box>
    </ListItem>
  );
};

export default HotelCard;
