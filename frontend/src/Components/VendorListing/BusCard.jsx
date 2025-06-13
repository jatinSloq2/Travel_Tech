import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { orange, indigo, grey, red, yellow } from "@mui/material/colors";

const BusCard = ({ bus, routes, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const busRoutes = routes.filter((route) => route.bus === bus._id);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => setExpanded(!expanded)}
        sx={{ cursor: "pointer" }}
      >
        <Typography variant="h5" fontWeight={700} color="primary">
          {bus.name}
        </Typography>
        <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
          {expanded ? "Hide Details ▲" : "Show Details ▼"}
        </Typography>
      </Box>

      {expanded && (
        <>
          <Divider sx={{ my: 2 }} />

          <Box sx={{ color: "text.secondary", fontSize: "0.95rem", mb: 1 }}>
            <Typography>
              <strong>Operator:</strong> {bus.operator}
            </Typography>
            <Typography>
              <strong>Bus Number:</strong> {bus.busNumber}
            </Typography>
            <Typography>
              <strong>Owner ID:</strong> {bus.owner}
            </Typography>
            <Typography>
              <strong>Rating:</strong> {bus.rating} ({bus.reviewCount} reviews)
            </Typography>
            <Typography>
              <strong>Bus Type:</strong> {bus.busType?.join(", ")}
            </Typography>
            <Typography>
              <strong>Amenities:</strong> {bus.amenities?.join(", ")}
            </Typography>
            <Typography>
              <strong>Running Days:</strong> {bus.runningDays?.join(", ")}
            </Typography>
            <Typography>
              <strong>Total Seats:</strong> {bus.totalSeats}
            </Typography>
            <Typography>
              <strong>Departure Time:</strong> {bus.departureTime}
            </Typography>
            <Typography>
              <strong>Arrival Time:</strong> {bus.arrivalTime}
            </Typography>
          </Box>

          <Box display="flex" gap={2} mt={2} flexWrap="wrap">
            <Button
              variant="contained"
              onClick={() => onEdit(bus)}
              sx={{
                backgroundColor: yellow[700],
                "&:hover": { backgroundColor: yellow[800] },
                textTransform: "none",
                boxShadow: 2,
              }}
            >
              Edit Bus
            </Button>

            <Button
              variant="contained"
              onClick={() => onDelete(bus)}
              sx={{
                backgroundColor: red[600],
                "&:hover": { backgroundColor: red[700] },
                textTransform: "none",
                boxShadow: 2,
              }}
            >
              Delete Bus
            </Button>
          </Box>

          {/* Routes Section */}
          <Box mt={4}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Routes for this bus:
            </Typography>

            {busRoutes.length === 0 ? (
              <Typography color="text.secondary">
                No routes available for this bus.
              </Typography>
            ) : (
              busRoutes.map((route) => (
                <Paper
                  key={route._id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    mt: 2,
                    backgroundColor: grey[50],
                    borderRadius: 2,
                  }}
                >
                  <Typography>
                    <strong>Origin:</strong> {route.origin}
                  </Typography>
                  <Typography>
                    <strong>Destination:</strong> {route.destination}
                  </Typography>

                  <Box mt={1}>
                    <Typography fontWeight={500}>Stops:</Typography>
                    {route.stops && route.stops.length > 0 ? (
                      <List dense>
                        {route.stops.map((stop) => (
                          <ListItem key={stop._id} disableGutters>
                            <ListItemText
                              primary={`${stop.stand} — Arrival: ${stop.arrivalTime}, Departure: ${stop.departureTime}`}
                              primaryTypographyProps={{ fontSize: "0.9rem" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography color="text.secondary" fontSize="0.9rem">
                        No stops defined.
                      </Typography>
                    )}
                  </Box>
                </Paper>
              ))
            )}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default BusCard;
