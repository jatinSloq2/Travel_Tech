import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Avatar,
  Stack,
  Button,
  Modal,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../Context/AuthContext";
import axiosInstance from "../utils/axiosInstance";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 520,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 5,
};

const Profile = () => {
  const { user, loading, setUser } = useAuth();

  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");  // Added email state

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrorMessage("");
  };

  // Simple email validation regex
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSave = async () => {
  setErrorMessage("");
  if (!isValidEmail(email)) {
    setErrorMessage("Please enter a valid email address.");
    return;
  }
  try {
    const response = await axiosInstance.put("/user/update/profile", {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });

    setUser(response.data);
    setOpen(false);
    setSnackbarOpen(true);
  } catch (error) {
    setErrorMessage(error.response?.data?.message || "Failed to update profile.");

    // Reset form inputs to last saved user values on error
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setPhone(user?.phone || "");
    setEmail(user?.email || "");
  }
};

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress color="warning" size={36} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box textAlign="center" mt={6}>
        <Typography variant="h6" color="error">
          Failed to load user profile.
        </Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto" mt={8} px={3}>
      <Paper elevation={6} sx={{ p: 5, position: "relative", borderRadius: 3, transition: "box-shadow 0.3s ease-in-out", "&:hover": { boxShadow: 12 } }}>
        <Stack direction="column" spacing={3} alignItems="center">
          <Box position="relative" display="inline-block">
            <Avatar
              sx={{
                bgcolor: "orange.800",
                width: 100,
                height: 100,
                fontSize: 44,
                userSelect: "none",
              }}
            >
              {firstName?.charAt(0).toUpperCase()}
            </Avatar>
            <IconButton
              aria-label="edit profile"
              size="small"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "background.paper",
                border: "1.5px solid",
                borderColor: "orange.900",
                "&:hover": { bgcolor: "orange.100" },
              }}
              onClick={handleOpen}
            >
              <EditIcon sx={{ fontSize: 22, color: "orange.800" }} />
            </IconButton>
          </Box>

          <Typography variant="h4" fontWeight="bold" letterSpacing={0.5}>
            {firstName} {lastName}
          </Typography>

          <Stack spacing={2} width="100%" maxWidth={450}>
            <Typography variant="body1" color="text.secondary" noWrap>
              <strong>Email:</strong> {email || "Not provided"}
            </Typography>
            <Typography variant="body1" color="text.secondary" noWrap>
              <strong>Phone:</strong> {phone || "Not provided"}
            </Typography>
            <Typography variant="body1" color="text.secondary" noWrap>
              <strong>Role:</strong> {user.role || "User"}
            </Typography>
            <Typography variant="body1" color="text.secondary" noWrap>
              <strong>Total Bookings:</strong> {user.totalBookings ?? 0}
            </Typography>
          </Stack>

          <Button
            variant="contained"
            color="warning"
            sx={{ textTransform: "none", mt: 3, width: "160px", fontWeight: 600 }}
            onClick={handleOpen}
          >
            Edit Profile
          </Button>
        </Stack>
      </Paper>

      <Modal open={open} onClose={handleClose} aria-labelledby="edit-profile-modal">
        <Box sx={styleModal}>
          <Typography variant="h5" mb={4} fontWeight="medium" textAlign="center" id="edit-profile-modal">
            Edit Profile
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="First Name"
              placeholder={user?.first_name || "Enter first name"}
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoFocus
              inputProps={{ maxLength: 30 }}
            />
            <TextField
              label="Last Name"
              placeholder={user?.last_name || "Enter last name"}
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              inputProps={{ maxLength: 30 }}
            />
            <TextField
              label="Phone Number"
              type="tel"
              placeholder={user?.phone || "+91-xxxxxxxxxx"}
              fullWidth
              value={phone}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[+\d]*$/.test(val)) setPhone(val);
              }}
              helperText="Include country code if applicable"
              inputProps={{ maxLength: 15 }}
            />
            <TextField
              label="Email Address"
              type="email"
              placeholder={user?.email || "Enter email address"}
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputProps={{ maxLength: 50 }}
              error={email && !isValidEmail(email)}
              helperText={email && !isValidEmail(email) ? "Invalid email format" : ""}
            />

            <Divider />

            {errorMessage && (
              <Typography color="error" mt={1} textAlign="center" fontWeight="medium">
                {errorMessage}
              </Typography>
            )}
          </Stack>

          <Box mt={5} display="flex" justifyContent="flex-end" gap={3}>
            <Button variant="outlined" onClick={handleClose} sx={{ minWidth: 100, fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleSave}
              disabled={!firstName.trim() || !phone.trim() || !isValidEmail(email)}
              sx={{ minWidth: 100, fontWeight: 600 }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
