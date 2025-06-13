import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

const USERS_PER_PAGE = 15;

const AdminUser = () => {
  const theme = useTheme();

  // Use orange shades from theme.palette.orange or fallback to fixed hex values
  const orange500 = theme.palette.orange?.[500] || "#fb8c00";
  const orange600 = theme.palette.orange?.[600] || "#ef6c00";

  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async (pageNum = 1, role = roleFilter) => {
    setLoading(true);
    setError(null);
    try {
      let params = {};

      if (role === "ALL") {
        params = { limit: 1000 };
      } else {
        params = { page: pageNum, limit: USERS_PER_PAGE, role };
      }

      const res = await axiosInstance.get("/admin/users", { params });
      const data = res.data;

      setUsers(data.users);
      setTotalPages(role === "ALL" ? 1 : data.totalPages);
      setPage(role === "ALL" ? 1 : pageNum);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRoleFilter(selectedRole);
    fetchUsers(1, selectedRole);
  };

  const groupedUsers = {
    ADMIN: [],
    VENDOR: [],
    USER: [],
  };

  users.forEach((user) => {
    if (user.role in groupedUsers) {
      groupedUsers[user.role].push(user);
    } else {
      groupedUsers.USER.push(user);
    }
  });

  const renderUserCard = (user) => (
    <Card
      key={user.user_id || user.id}
      sx={{
        width: 240,
        minHeight: 160,
        flexShrink: 0,
        mx: 1,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 3,
        borderRadius: 2,
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="body2">
          <strong>Email:</strong>{" "}
          <a href={`mailto:${user.email}`} style={{ color: orange600 }}>
            {user.email}
          </a>
        </Typography>
        <Typography variant="body2" mt={1}>
          <strong>Role:</strong>{" "}
          <span
            style={{
              color:
                user.role === "ADMIN"
                  ? orange600
                  : user.role === "VENDOR"
                  ? orange500
                  : orange500,
              fontWeight: 600,
            }}
          >
            {user.role}
          </span>
        </Typography>
      </CardContent>
    </Card>
  );

  const renderUserSection = (title, roleKey, color) =>
    groupedUsers[roleKey].length > 0 && (
      <Box mb={5} key={roleKey}>
        <Typography
          variant="h6"
          mb={2}
          fontWeight="bold"
          sx={{
            position: "relative",
            pb: 1,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "40px",
              height: "3px",
              backgroundColor: color,
              borderRadius: "2px",
            },
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            p: 1,
            scrollbarColor: `${color} #ccc`,
            "&::-webkit-scrollbar": {
              height: 6,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: color,
              borderRadius: 8,
            },
          }}
        >
          {groupedUsers[roleKey].map(renderUserCard)}
        </Box>
      </Box>
    );

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={4}
        sx={{ color: orange600 }}
      >
        User Management
      </Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        gap={2}
        mb={4}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="role-filter-label">Filter by Role</InputLabel>
          <Select
            labelId="role-filter-label"
            value={roleFilter}
            label="Filter by Role"
            onChange={handleRoleChange}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="VENDOR">Vendor</MenuItem>
            <MenuItem value="USER">User</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Box textAlign="center" mt={2}>
          <CircularProgress sx={{ color: orange600 }} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && users.length === 0 && (
        <Typography textAlign="center" color="text.secondary">
          No users found.
        </Typography>
      )}

      {!loading && users.length > 0 && (
        <>
          {renderUserSection("Admins", "ADMIN", orange600)}
          {renderUserSection("Vendors", "VENDOR", orange500)}
          {renderUserSection("Users", "USER", orange500)}

          {/* Pagination */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={4}
            gap={2}
          >
            <Button
              variant="contained"
              onClick={() => page > 1 && fetchUsers(page - 1)}
              disabled={page === 1}
              sx={{
                bgcolor: orange600,
                "&:hover": { bgcolor: orange500 },
              }}
            >
              Prev
            </Button>
            <Typography>
              Page {page} of {totalPages}
            </Typography>
            <Button
              variant="contained"
              onClick={() => page < totalPages && fetchUsers(page + 1)}
              disabled={page === totalPages}
              sx={{
                bgcolor: orange600,
                "&:hover": { bgcolor: orange500 },
              }}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdminUser;
