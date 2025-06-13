import React from "react";
import { useAuth } from "../../Context/AuthContext";

import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

const UpcomingBookingsList = ({ upcomingBookings, loading }) => {
  const { role } = useAuth();

  if (role === "ADMIN") return null;

  return (
    <Paper elevation={2} sx={{ p: 3, width: "100%", borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" color="text.primary">
          Upcoming Bookings
        </Typography>
      </Box>

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
      ) : upcomingBookings.length ? (
        <Grid container spacing={1}>
          {upcomingBookings.map((b, i) => (
            <Grid item xs={6} sm={3} md={3} key={i}>
              <Card
                variant="outlined"
                sx={{
                  bgcolor: "grey.50",
                  "&:hover": { bgcolor: "grey.100", transition: "0.3s" },
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>
                      {b.guestName
                        ? "Guest"
                        : Array.isArray(b.travellerNames) && b.travellerNames.length > 1
                        ? "Passengers"
                        : "Passenger"}
                      :
                    </strong>{" "}
                    {b.guestName ||
                      (Array.isArray(b.travellerNames)
                        ? b.travellerNames.join(", ")
                        : b.travellerNames) ||
                      "N/A"}
                  </Typography>

                  {/* HOTEL INFO */}
                  {b.hotelName && (
                    <>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Hotel:</strong> {b.hotelName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Check-in:</strong> {b.checkIn}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Room Type:</strong> {b.roomType}
                      </Typography>
                      {b.nights !== undefined && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Stay:</strong> {b.nights}
                        </Typography>
                      )}
                    </>
                  )}

                  {/* BUS INFO */}
                  {b.busName && (
                    <>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Bus:</strong> {b.busName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Bus Number:</strong> {b.busNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Departure:</strong> {b.journeyDate}
                      </Typography>
                    </>
                  )}

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Amount:</strong> ₹{b.amount ?? "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          No upcoming bookings.
        </Typography>
      )}
    </Paper>
  );
};

export default UpcomingBookingsList;
