import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  Switch,
  Button,
  Paper,
  FormControlLabel,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  IconButton,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { ThemeContext } from "../state/ThemeContext";

interface UserSettings {
  name: string;
  email: string;
  theme: "light" | "dark";
  weeklyReminder: boolean;
  monthlyReminder: boolean;
  emailNotification: boolean;
  profilePicture?: string;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { mode, toggleMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<UserSettings>({
    name: "",
    email: "",
    theme: mode as "light" | "dark",
    weeklyReminder: false,
    monthlyReminder: false,
    emailNotification: false,
    profilePicture: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileChanges, setProfileChanges] = useState({
    currentName: "",
    newName: "",
    confirmNewName: "",
    currentEmail: "",
    newEmail: "",
    confirmNewEmail: "",
  });
  const [emailNotification, setEmailNotification] = useState(
    settings?.emailNotification || false
  );
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:2000/api/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.email) {
        setSettings({
          name: data.name || "",
          email: data.email || "",
          theme: data.theme || mode,
          weeklyReminder: data.weeklyReminder || false,
          monthlyReminder: data.monthlyReminder || false,
          emailNotification: data.emailNotification || false,
          profilePicture: data.profilePicture || "",
        });
        setProfilePicturePreview(data.profilePicture || null);
        setProfileChanges((prev) => ({
          ...prev,
          currentName: data.name || "",
        }));
        setEmailNotification(data.emailNotification || false);
      } else {
        throw new Error("Invalid data received from server");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch settings"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const uploadProfilePicture = async () => {
    if (!profilePictureFile) {
      setError("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', profilePictureFile);

    try {
      console.log('Uploading profile picture:', {
        fileName: profilePictureFile.name,
        fileSize: profilePictureFile.size,
        fileType: profilePictureFile.type
      });

      const token = localStorage.getItem("token");
      const response = await axios.post(
        'http://localhost:2000/api/settings/upload-profile-picture', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSettings(prev => ({
        ...prev,
        profilePicture: response.data.profilePictureUrl
      }));
      setSuccess("Profile picture uploaded successfully");
      setProfilePictureFile(null);
    } catch (error) {
      console.error("Full profile picture upload error:", {
        error: error instanceof Error ? error.message : 'Unknown error',
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : null
      });

      setError(
        error.response?.data?.message || 
        (error instanceof Error 
          ? error.message 
          : "Failed to upload profile picture")
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (name === "weeklyReminder" || name === "monthlyReminder") {
      setSettings((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "emailNotification") {
      setEmailNotification(checked);
      setSettings((prev) => ({ ...prev, [name]: checked }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));

    // Clear any existing errors when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileChanges((prev) => ({ ...prev, [name]: value }));

    // Clear any existing errors when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = e.target.checked ? "dark" : "light";
    setSettings((prev) => ({ ...prev, theme: newTheme }));
    toggleMode();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate password if being changed
    if (passwords.newPassword || passwords.currentPassword) {
      if (passwords.newPassword !== passwords.confirmPassword) {
        setError("New passwords do not match");
        return;
      }
      if (passwords.newPassword.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
    }

    // Validate name if being changed
    if (profileChanges.newName) {
      if (profileChanges.currentName !== settings.name) {
        setError("Current name is incorrect");
        return;
      }
      if (profileChanges.newName !== profileChanges.confirmNewName) {
        setError("New names do not match");
        return;
      }
    }

    // Validate email if being changed
    if (profileChanges.newEmail) {
      // Check if current email is provided
      if (!profileChanges.currentEmail) {
        setError("Please enter your current email");
        return;
      }

      // Check if current email matches
      if (
        profileChanges.currentEmail.toLowerCase() !==
        settings.email.toLowerCase()
      ) {
        setError(
          "Current email is incorrect. Please enter your current email address correctly."
        );
        return;
      }

      // Validate new email format
      if (!/\S+@\S+\.\S+/.test(profileChanges.newEmail)) {
        setError("Please enter a valid new email address");
        return;
      }

      // Check if new email matches confirmation
      if (profileChanges.newEmail !== profileChanges.confirmNewEmail) {
        setError("New email addresses do not match");
        return;
      }

      // Check if new email is different from current
      if (
        profileChanges.newEmail.toLowerCase() === settings.email.toLowerCase()
      ) {
        setError("New email must be different from your current email");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:2000/api/settings/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: profileChanges.newName || settings.name,
            email: profileChanges.newEmail || settings.email,
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
            theme: settings.theme,
            weeklyReminder: settings.weeklyReminder,
            monthlyReminder: settings.monthlyReminder,
            emailNotification: emailNotification,
            sendChangeNotification: true,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update settings");
      }

      const data = await response.json();
      setSuccess("Settings updated successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setProfileChanges({
        currentName: "",
        newName: "",
        confirmNewName: "",
        currentEmail: "",
        newEmail: "",
        confirmNewEmail: "",
      });
      // Refresh settings after update
      fetchSettings();
    } catch (error) {
      console.error("Error updating settings:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update settings"
      );
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        padding: {
          xs: "10px", // Minimal padding for very small screens
          sm: "20px", // Slightly more padding for small screens
          md: "40px", // More padding for medium screens
          lg: "60px", // Maximum padding for large screens
          xl: "80px", // Extra padding for extra large screens
        },
        overflow: "auto", // Allow scrolling if content exceeds viewport
        boxSizing: "border-box",
        width: "100%",
        height: "100%",
        "& > *": {
          maxWidth: "100%", // Ensure child elements fit
          maxHeight: "100%", // Prevent overflow
          width: "100%",
          overflowY: "auto", // Allow individual component scrolling if needed
        },
      }}
    >
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : (
        <Paper
          elevation={3}
          sx={{
            width: {
              xs: "100%", // Full width on extra small screens
              sm: "95%", // Slightly narrower on small screens
              md: "90%", // Even narrower on medium screens
              lg: "80%", // Wider on large screens
              xl: "70%", // Narrowest on extra large screens
            },
            maxWidth: {
              xs: "100%",
              sm: "600px",
              md: "800px",
              lg: "1000px",
              xl: "1200px",
            },
            height: "auto",
            minHeight: {
              xs: "300px", // Minimum height for very small screens
              sm: "400px",
              md: "500px",
              lg: "600px",
            },
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: "1px solid rgba(0,0,0,0.1)",
            p: {
              xs: 2, // Less padding on small screens
              sm: 3,
              md: 4,
              lg: 5,
            },
            "& form": {
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr", // Single column on small screens
                md: "1fr 1fr", // Two columns on medium and larger screens
              },
              gap: {
                xs: 2,
                sm: 3,
                md: 4,
              },
              "& > *": {
                width: "100%",
                minHeight: "auto",
              },
            },
            "& .MuiTextField-root": {
              my: {
                xs: 0.5,
                sm: 1,
              },
              width: "100%",
            },
            "& .MuiTypography-h4": {
              fontSize: {
                xs: "1.3rem",
                sm: "1.5rem",
                md: "1.75rem",
                lg: "2rem",
              },
              mb: 3,
              textAlign: "center",
            },
            "& .MuiTypography-h6": {
              fontSize: {
                xs: "1rem",
                sm: "1.1rem",
                md: "1.25rem",
                lg: "1.4rem",
              },
              mb: 2,
              textAlign: "center",
            },
            "& .MuiDivider-root": {
              my: {
                xs: 1,
                sm: 2,
              },
            },
            "& .MuiFormControlLabel-root": {
              my: {
                xs: 0.5,
                sm: 1,
              },
            },
            "& .MuiButton-root": {
              mt: {
                xs: 1,
                sm: 2,
              },
              width: {
                xs: "100%", // Full width on small screens
                sm: "auto", // Auto width on larger screens
              },
            },
          }}
        >
          <Typography variant="h4">Settings</Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            mb={3}
          >
            <Avatar
              src={profilePicturePreview || settings.profilePicture}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePictureChange}
            />
            <label htmlFor="profile-picture-upload">
              <Button 
                variant="contained" 
                component="span" 
                startIcon={<PhotoCamera />}
              >
                Change Profile Picture
              </Button>
            </label>
            {profilePictureFile && (
              <Button 
                variant="outlined" 
                color="primary" 
                sx={{ mt: 1 }}
                onClick={uploadProfilePicture}
              >
                Upload Picture
              </Button>
            )}
          </Box>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Box>
              <Typography variant="h6">Profile Information</Typography>
              <TextField
                fullWidth
                label="Current Name"
                name="currentName"
                value={profileChanges.currentName}
                onChange={handleProfileChange}
                disabled
                helperText="Your current name"
              />
              <TextField
                fullWidth
                label="New Name"
                name="newName"
                value={profileChanges.newName}
                onChange={handleProfileChange}
                helperText="Enter your new name"
              />
              {profileChanges.newName && (
                <TextField
                  fullWidth
                  label="Confirm New Name"
                  name="confirmNewName"
                  value={profileChanges.confirmNewName}
                  onChange={handleProfileChange}
                  error={
                    profileChanges.confirmNewName !== "" &&
                    profileChanges.newName !== profileChanges.confirmNewName
                  }
                  helperText={
                    profileChanges.confirmNewName !== "" &&
                    profileChanges.newName !== profileChanges.confirmNewName
                      ? "New names do not match"
                      : "Confirm your new name"
                  }
                />
              )}
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6">Email Settings</Typography>
              <TextField
                fullWidth
                required
                label="Current Email"
                name="currentEmail"
                type="email"
                value={profileChanges.currentEmail}
                onChange={handleProfileChange}
                error={
                  profileChanges.currentEmail !== "" &&
                  profileChanges.currentEmail.toLowerCase() !==
                    settings.email.toLowerCase()
                }
                helperText={
                  profileChanges.currentEmail !== "" &&
                  profileChanges.currentEmail.toLowerCase() !==
                    settings.email.toLowerCase()
                    ? "This doesn't match your current email"
                    : "Enter your current email address for verification"
                }
              />
              <TextField
                fullWidth
                label="New Email"
                name="newEmail"
                type="email"
                value={profileChanges.newEmail}
                onChange={handleProfileChange}
                helperText="Enter your new email address"
              />
              {profileChanges.newEmail && (
                <TextField
                  fullWidth
                  label="Confirm New Email"
                  name="confirmNewEmail"
                  type="email"
                  value={profileChanges.confirmNewEmail}
                  onChange={handleProfileChange}
                  error={
                    profileChanges.confirmNewEmail !== "" &&
                    profileChanges.newEmail !== profileChanges.confirmNewEmail
                  }
                  helperText={
                    profileChanges.confirmNewEmail !== "" &&
                    profileChanges.newEmail !== profileChanges.confirmNewEmail
                      ? "New email addresses do not match"
                      : "Confirm your new email address"
                  }
                />
              )}
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6">Password</Typography>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
              />
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                error={
                  passwords.confirmPassword !== "" &&
                  passwords.newPassword !== passwords.confirmPassword
                }
                helperText={
                  passwords.confirmPassword !== "" &&
                  passwords.newPassword !== passwords.confirmPassword
                    ? "New passwords do not match"
                    : ""
                }
              />
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6">Preferences</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.theme === "dark"}
                    onChange={handleThemeChange}
                  />
                }
                label="Dark Theme"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.weeklyReminder}
                    onChange={handleInputChange}
                    name="weeklyReminder"
                  />
                }
                label="Weekly Reminders"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.monthlyReminder}
                    onChange={handleInputChange}
                    name="monthlyReminder"
                  />
                }
                label="Monthly Reminders"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={emailNotification}
                    onChange={handleInputChange}
                    name="emailNotification"
                  />
                }
                label="Email Notifications"
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Save Changes
            </Button>
          </form>
        </Paper>
      )}
    </Box>
  );
};

export default SettingsPage;
