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

const RecentReviewsList = ({ recentReviews, loading }) => {
  const { role } = useAuth();

  if (role === "ADMIN") return null;

  return (
    <Paper elevation={2} sx={{ p: 3, width: "100%", borderRadius: 2 }}>
      <Typography variant="h6" color="text.primary" gutterBottom>
        Recent Reviews
      </Typography>

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
      ) : recentReviews.length ? (
        <Grid container spacing={2}>
          {recentReviews.map((r, i) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
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
                    <strong>User:</strong>{" "}
                    {Array.isArray(r.travellerNames)
                      ? r.travellerNames.join(", ")
                      : r.user || "Anonymous"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Rating:</strong>{" "}
                    {r.rating ?? "N/A"}{" "}
                    <Box component="span" sx={{ color: "warning.main" }}>
                      {r.rating ? "⭐".repeat(r.rating) : "N/A"}
                    </Box>
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
                    <strong>Comment:</strong> {r.comment || "No comment"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <strong>Date:</strong> {r.date || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          No recent reviews.
        </Typography>
      )}
    </Paper>
  );
};

export default RecentReviewsList;
