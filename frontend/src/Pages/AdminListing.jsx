import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Pagination,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import { orange } from "@mui/material/colors";

const PAGE_SIZE = 30;

const AdminListing = () => {
  const [listings, setListings] = useState({
    hotelListings: [],
    busListings: [],
    flightListings: [],
    trainListings: [],
  });
  const [filter, setFilter] = useState("hotel");
  const [ownerId, setOwnerId] = useState("");
  const [page, setPage] = useState(1);
  const [counts, setCounts] = useState({
    hotelCount: 0,
    busCount: 0,
    flightCount: 0,
    trainCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const fetchListings = useCallback(
    async (ownerIdParam, filterParam, pageParam) => {
      setLoading(true);
      setError(null);
      try {
        const queryParts = [];
        if (ownerIdParam) queryParts.push(`ownerId=${ownerIdParam}`);
        if (pageParam) queryParts.push(`page=${pageParam}`);
        const query = queryParts.length ? `?${queryParts.join("&")}` : "";

        const { data } = await axiosInstance.get(`/admin/listings${query}`);
        setListings(data);
        console.log(data);
        setCounts(data.counts);
      } catch (err) {
        setError("Failed to fetch listings");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const debouncedFetch = useCallback(
    debounce((ownerIdValue, filterValue, pageValue) => {
      fetchListings(ownerIdValue, filterValue, pageValue);
    }, 500),
    [fetchListings]
  );

  useEffect(() => {
    debouncedFetch(ownerId, filter, page);
  }, [ownerId, filter, page, debouncedFetch]);

  const getFilteredListings = () => {
    switch (filter) {
      case "hotel":
        return listings.hotelListings.map((item) => ({
          ...item,
          type: "Hotel",
        }));
      case "bus":
        return listings.busListings.map((item) => ({ ...item, type: "Bus" }));
      case "flight":
        return listings.flightListings.map((item) => ({
          ...item,
          type: "Flight",
        }));
      case "train":
        return listings.trainListings.map((item) => ({
          ...item,
          type: "Train",
        }));
      default:
        return [];
    }
  };

  const getTotalPages = () => {
    const countKey = filter + "Count";
    return Math.ceil((counts[countKey] || 0) / PAGE_SIZE);
  };

  const filteredListings = getFilteredListings();
  const totalPages = getTotalPages();

  const handleFilterChange = (event, newValue) => {
    setFilter(newValue);
    setPage(1);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Admin Listings
      </Typography>

      <Box mb={3}>
        <TextField
          label="Filter by Owner ID"
          variant="outlined"
          value={ownerId}
          onChange={(e) => {
            setOwnerId(e.target.value.trim());
            setPage(1);
          }}
          size="small"
          fullWidth
          sx={{
            maxWidth: 300,
            "& label.Mui-focused": {
              color: "#FB8C00",
            },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#FB8C00",
              },
            },
          }}
        />
      </Box>

      <Tabs
        value={filter}
        onChange={handleFilterChange}
        textColor="inherit"
        indicatorColor="secondary"
        sx={{
          mb: 4,
          "& .MuiTabs-indicator": {
            backgroundColor: orange[800],
          },
          "& .MuiTab-root": {
            color: "rgba(0,0,0,0.7)",
            "&.Mui-selected": {
              color: orange[800],
            },
          },
        }}
      >
        {["hotel", "bus", "flight", "train"].map((type) => (
          <Tab
            key={type}
            label={type.charAt(0).toUpperCase() + type.slice(1)}
            value={type}
          />
        ))}
      </Tabs>

      {loading && (
        <Box textAlign="center" my={4}>
          <CircularProgress sx={{ color: orange[800] }} />
          <Typography mt={2} color="text.secondary">
            Loading listings...
          </Typography>
        </Box>
      )}

      {error && (
        <Typography color="error" my={4} textAlign="center">
          {error}
        </Typography>
      )}

      {!loading && !error && filteredListings.length === 0 && (
        <Typography textAlign="center" color="text.secondary" mt={4}>
          No listings available.
        </Typography>
      )}

      {!loading && !error && filteredListings.length > 0 && (
        <>
          <Stack spacing={2}>
            {filteredListings.map((item) => (
              <Paper
                key={item._id}
                elevation={2}
                sx={{
                  p: 3,
                  cursor: "pointer",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6" fontWeight={600}>
                    {item.name ||
                      item.flightNumber ||
                      item.trainNumber ||
                      item.busNumber ||
                      "Listing"}
                  </Typography>
                  <Chip
                    label={item.type}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: orange[800],
                      color: orange[800],
                    }}
                  />
                </Box>

                <Box
                  mt={1}
                  color="text.secondary"
                  fontSize="0.9rem"
                  lineHeight={1.5}
                >
                  {item.type === "Hotel" && (
                    <>
                      <Typography variant="h6" fontWeight={600}></Typography>
                      <Typography
                        color="text.secondary"
                        fontSize="0.9rem"
                        mb={1}
                      >
                        {item.location || "Location not available"}
                      </Typography>

                      <Typography fontSize="0.9rem" mb={1} noWrap>
                        {item.description || "No description provided"}
                      </Typography>

                      <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                        {item.amenities?.map((amenity) => (
                          <Chip
                            key={amenity}
                            label={amenity}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: orange[800],
                              color: orange[800],
                            }}
                          />
                        ))}
                      </Stack>

                      {item.rooms?.map((room, index) => (
                        <Box
                          key={index}
                          mb={1}
                          pl={1}
                          sx={{ borderLeft: `2px solid ${orange[800]}` }}
                        >
                          <Typography variant="subtitle2" fontWeight="bold">
                            {room.roomType} - ₹
                            {room.pricePerNight.toLocaleString()}
                          </Typography>
                          <Typography fontSize="0.85rem" color="text.secondary">
                            Capacity: {room.capacity} person
                            {room.capacity > 1 ? "s" : ""}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            mt={0.5}
                          >
                            {room.amenities?.map((a) => (
                              <Chip
                                key={a}
                                label={a}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: orange[800],
                                  color: orange[800],
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      ))}

                      <Typography fontSize="0.9rem" mt={1}>
                        ⭐ {item.rating || "No rating"} ({item.reviewCount || 0}{" "}
                        reviews)
                      </Typography>

                      <Typography fontSize="0.9rem" mt={0.5}>
                        Total Rooms:{" "}
                        {item.rooms?.reduce(
                          (sum, r) => sum + (r.totalRooms || 0),
                          0
                        ) || "N/A"}
                      </Typography>

                      <Typography fontSize="0.9rem" mt={0.5}>
                        Owner ID: {item.owner || "N/A"}
                      </Typography>
                    </>
                  )}

                  {item.type === "Bus" && (
                    <>
                      <Typography>
                        <strong>Bus Number:</strong> {item.busNumber}
                      </Typography>
                      <Typography>
                        <strong>Name:</strong> {item.name}
                      </Typography>
                      <Typography>
                        <strong>Operator:</strong> {item.operator}
                      </Typography>
                      <Typography>
                        <strong>Contact:</strong> {item.phone || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Departure:</strong> {item.departureTime}{" "}
                        &nbsp;|&nbsp; <strong>Arrival:</strong>{" "}
                        {item.arrivalTime}
                      </Typography>
                      <Typography>
                        <strong>Bus Type:</strong>{" "}
                        {item.busType?.join(", ") || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Total Seats:</strong> {item.totalSeats}
                      </Typography>
                      <Typography>
                        <strong>Running Days:</strong>{" "}
                        {item.runningDays?.join(", ") || "N/A"}
                      </Typography>

                      <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                        {item.amenities?.slice(0, 6).map((amenity) => (
                          <Chip
                            key={amenity}
                            label={amenity}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: orange[800],
                              color: orange[800],
                            }}
                          />
                        ))}
                        {item.amenities && item.amenities.length > 6 && (
                          <Chip
                            label={`+${item.amenities.length - 6} more`}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: orange[800],
                              color: orange[800],
                            }}
                          />
                        )}
                      </Box>

                      <Box mt={1}>
                        <Typography>
                          <strong>Rating:</strong> {item.rating || "No ratings"}{" "}
                          &nbsp;|&nbsp; <strong>Reviews:</strong>{" "}
                          {item.reviewCount || 0}
                        </Typography>
                      </Box>
                    </>
                  )}

                  {item.type === "Flight" && (
                    <>
                      <Typography>
                        <strong>Airline:</strong> {item.airline}
                      </Typography>
                      <Typography>
                        <strong>Flight Number:</strong> {item.flightNumber}
                      </Typography>
                      <Typography>
                        <strong>Departure:</strong> {item.departureTime}{" "}
                        &nbsp;|&nbsp; <strong>Arrival:</strong>{" "}
                        {item.arrivalTime}
                      </Typography>
                      <Typography>
                        <strong>From:</strong> {item.fromAirport?.city} (
                        {item.fromAirport?.code}) &nbsp;|&nbsp;{" "}
                        <strong>To:</strong> {item.toAirport?.city} (
                        {item.toAirport?.code})
                      </Typography>
                      <Typography>
                        <strong>Operating Days:</strong>{" "}
                        {item.operatingDays?.join(", ") || "N/A"}
                      </Typography>

                      <Box mt={1}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Seat Types & Prices:
                        </Typography>
                        {item.seatTypes?.map(({ type, price }) => (
                          <Typography key={type} fontSize="0.9rem">
                            {type}: ₹{price.toLocaleString()}
                          </Typography>
                        ))}
                      </Box>

                      <Typography mt={1}>
                        <strong>Owner ID:</strong> {item.owner || "N/A"}
                      </Typography>
                    </>
                  )}

                  {item.type === "Train" && (
                    <>
                      <Typography variant="h6" fontWeight={600}>
                        {item.name} ({item.trainNumber})
                      </Typography>

                      <Typography
                        fontSize="0.9rem"
                        color="text.secondary"
                        mb={1}
                      >
                        Direction: {item.direction || "N/A"}
                      </Typography>

                      <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                        {item.operatingDays?.map((day) => (
                          <Chip
                            key={day}
                            label={day}
                            size="small"
                            sx={{
                              borderColor: orange[800],
                              color: orange[800],
                            }}
                          />
                        ))}
                      </Stack>

                      {item.route && item.route.length > 0 && (
                        <Typography fontSize="0.9rem" mb={1}>
                          Route: {item.route[0].station.city} (
                          {item.route[0].station.code}) &rarr;{" "}
                          {item.route[item.route.length - 1].station.city} (
                          {item.route[item.route.length - 1].station.code})
                        </Typography>
                      )}

                      <Box mb={1} overflow="auto">
                        <table
                          style={{ width: "100%", borderCollapse: "collapse" }}
                        >
                          <thead>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                              <th
                                style={{
                                  padding: "4px 8px",
                                  textAlign: "left",
                                }}
                              >
                                Station
                              </th>
                              <th
                                style={{
                                  padding: "4px 8px",
                                  textAlign: "left",
                                }}
                              >
                                Arrival
                              </th>
                              <th
                                style={{
                                  padding: "4px 8px",
                                  textAlign: "left",
                                }}
                              >
                                Departure
                              </th>
                              <th
                                style={{
                                  padding: "4px 8px",
                                  textAlign: "left",
                                }}
                              >
                                Day Offset
                              </th>
                              <th
                                style={{
                                  padding: "4px 8px",
                                  textAlign: "left",
                                }}
                              >
                                Distance (km)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.route.map((stop, index) => (
                              <tr
                                key={index}
                                style={{ borderBottom: "1px solid #eee" }}
                              >
                                <td style={{ padding: "4px 8px" }}>
                                  {stop.station.name} ({stop.station.code})
                                </td>
                                <td style={{ padding: "4px 8px" }}>
                                  {stop.arrivalTime || "—"}
                                </td>
                                <td style={{ padding: "4px 8px" }}>
                                  {stop.departureTime || "—"}
                                </td>
                                <td style={{ padding: "4px 8px" }}>
                                  {stop.dayOffset}
                                </td>
                                <td style={{ padding: "4px 8px" }}>
                                  {stop.distance}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Box>

                      <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                        {item.seatTypes?.map((seat) => (
                          <Chip
                            key={seat._id}
                            label={`${
                              seat.class
                            } - ₹${seat.fare.toLocaleString()} (${
                              seat.totalSeats
                            } seats)`}
                            variant="outlined"
                            size="small"
                            sx={{
                              borderColor: orange[800],
                              color: orange[800],
                            }}
                          />
                        ))}
                      </Stack>

                      <Typography fontSize="0.9rem" color="text.secondary">
                        Owner ID: {item.owner || "N/A"}
                      </Typography>
                    </>
                  )}
                </Box>
              </Paper>
            ))}
          </Stack>

          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              shape="rounded"
              showFirstButton
              showLastButton
              sx={{
                "& .Mui-selected": {
                  backgroundColor: orange[800],
                },
                "& .MuiPaginationItem-root": {
                  color: orange[800],
                },
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdminListing;
