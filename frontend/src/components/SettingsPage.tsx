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
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);

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

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    formData.append("profilePicture", profilePictureFile);

    try {
      console.log("Uploading profile picture:", {
        fileName: profilePictureFile.name,
        fileSize: profilePictureFile.size,
        fileType: profilePictureFile.type,
      });

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:2000/api/settings/upload-profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSettings((prev) => ({
        ...prev,
        profilePicture: response.data.profilePictureUrl,
      }));
      setSuccess("Profile picture uploaded successfully");
      setProfilePictureFile(null);
    } catch (error) {
      console.error("Full profile picture upload error:", {
        error: error instanceof Error ? error.message : "Unknown error",
        response: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
            }
          : null,
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
    setProfileChanges((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Add validation for name change
    if (name === "newName") {
      setProfileChanges((prev) => ({
        ...prev,
        confirmNewName:
          prev.confirmNewName === prev.newName ? value : prev.confirmNewName,
      }));
    }

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

    // Validate name change
    if (profileChanges.newName) {
      if (profileChanges.newName !== profileChanges.confirmNewName) {
        setError("New names do not match");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const updateData: any = {};

      // Only include fields that have been changed
      if (
        profileChanges.newName &&
        profileChanges.newName === profileChanges.confirmNewName
      ) {
        updateData.name = profileChanges.newName;
      }

      if (
        profileChanges.newEmail &&
        profileChanges.newEmail === profileChanges.confirmNewEmail
      ) {
        updateData.email = profileChanges.newEmail;
      }

      // Add password change logic if needed
      if (passwords.newPassword) {
        if (passwords.newPassword !== passwords.confirmPassword) {
          setError("New passwords do not match");
          return;
        }
        updateData.currentPassword = passwords.currentPassword;
        updateData.newPassword = passwords.newPassword;
      }

      // Add additional fields from existing settings
      updateData.theme = settings.theme;
      updateData.weeklyReminder = settings.weeklyReminder;
      updateData.monthlyReminder = settings.monthlyReminder;
      updateData.emailNotification = emailNotification;

      console.log("Sending update request with data:", updateData);

      const response = await fetch(
        "http://localhost:2000/api/settings/update",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      // Log full response for debugging
      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const updatedData = await response.json();

      console.log("Updated data received:", updatedData);

      // Update local state with new data
      setSettings((prev) => ({
        ...prev,
        ...(updatedData.name && { name: updatedData.name }),
        ...(updatedData.email && { email: updatedData.email }),
      }));

      // Update localStorage with new name
      if (updatedData.name) {
        localStorage.setItem("userName", updatedData.name);
      }

      // Reset form state
      setProfileChanges({
        currentName: updatedData.name || profileChanges.currentName,
        newName: "",
        confirmNewName: "",
        currentEmail: updatedData.email || profileChanges.currentEmail,
        newEmail: "",
        confirmNewEmail: "",
      });

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess("Settings updated successfully");
    } catch (error) {
      console.error("Full settings update error:", {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
      });

      // More specific error handling
      if (error instanceof TypeError) {
        setError("Network error. Please check your internet connection.");
      } else if (error instanceof Error) {
        setError(error.message || "Failed to update settings");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        position: "fixed",
        top: 0,
        left: 0,
        p: 0,
        m: 0,
        boxSizing: "border-box",
        backgroundColor: "background.default",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "90%",
          maxWidth: 1200,
          minHeight: "80vh",
          maxHeight: "95vh",
          overflowY: "auto",
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "4px",
          },
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "background.paper",
            pt: 2,
            pb: 1,
          }}
        >
          Settings
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, position: "sticky", top: "60px", zIndex: 10 }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2, position: "sticky", top: "60px", zIndex: 10 }}
          >
            {success}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              justifyContent: "space-between",
              gap: 2,
              width: "100%",
            }}
          >
            <Box
              sx={{
                flex: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Profile Picture
              </Typography>
              <Avatar
                src={profilePicturePreview || settings.profilePicture}
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  mx: "auto",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <input
                  accept="image/*"
                  style={{ display: "none" }}
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
            </Box>
            <Box
              sx={{
                flex: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Account Settings
              </Typography>
              <TextField
                fullWidth
                label="Current Name"
                name="currentName"
                value={profileChanges.currentName}
                onChange={handleProfileChange}
                disabled
                helperText="Your current name"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="New Name"
                name="newName"
                value={profileChanges.newName}
                onChange={handleProfileChange}
                helperText="Enter your new name"
                sx={{ mb: 2 }}
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
                  sx={{ mb: 2 }}
                />
              )}
              <TextField
                fullWidth
                required
                label="Current Email"
                name="currentEmail"
                type="email"
                value={profileChanges.currentEmail}
                onChange={handleProfileChange}
                helperText="Enter your current email address"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="New Email"
                name="newEmail"
                type="email"
                value={profileChanges.newEmail}
                onChange={handleProfileChange}
                helperText="Enter your new email address"
                sx={{ mb: 2 }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              justifyContent: "space-between",
              gap: 2,
              width: "100%",
            }}
          >
            <Box
              sx={{
                flex: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
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
            <Box
              sx={{
                flex: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Password Change
              </Typography>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                sx={{ mb: 2 }}
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
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              position: "sticky",
              bottom: 0,
              zIndex: 10,
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
