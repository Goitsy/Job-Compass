import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  TextField,
  Menu,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Pagination,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  Add,
  Close,
  MoreVert,
  Business,
  LocationOn,
  Event,
} from "@mui/icons-material";
import { ThemeContext } from "../state/ThemeContext";
import { SelectChangeEvent } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface JobApplication {
  _id: string;
  jobUrl: string;
  jobTitle: string;
  dateOfApplication: string;
  company: string;
  location: string;
  status: string;
}

const statusColors: Record<string, string> = {
  Interview: "green",
  Rejected: "red",
  "In Review": "purple",
  Applied: "blue",
};

const HomePage = () => {
  const { mode } = useContext(ThemeContext);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState<Partial<JobApplication>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [currentAppId, setCurrentAppId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("dateOfApplication");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [filteredApplications, setFilteredApplications] = useState<
    JobApplication[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);

  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applications, searchQuery, sortBy, sortOrder, page]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobapp", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const applyFilters = () => {
    let filtered = applications;

    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.sort((a, b) => {
      if (sortBy === "dateOfApplication") {
        const dateA = new Date(a.dateOfApplication).getTime();
        const dateB = new Date(b.dateOfApplication).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    const startIndex = (page - 1) * itemsPerPage;
    const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

    setFilteredApplications(paginatedData);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: SelectChangeEvent<`${string}-${string}`>) => {
    const [field, order] = e.target.value.split("-");
    setSortBy(field);
    setSortOrder(order);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const toggleForm = () => {
    setFormVisible(!formVisible);
    setFormData({});
    setEditId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, status: e.target.value });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        dateOfApplication: date.toISOString().split("T")[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/jobapp/${editId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/jobapp", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({});
      fetchApplications();
      toggleForm();
    } catch (error) {
      console.error("Error saving application:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobapp/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setMenuAnchor(event.currentTarget);
    setCurrentAppId(id);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setCurrentAppId(null);
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      if (currentAppId) {
        await axios.put(
          `http://localhost:5000/api/jobapp/update-status`,
          { id: currentAppId, status },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchApplications();
        closeMenu();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleEdit = (application: JobApplication) => {
    setFormData(application);
    setEditId(application._id);
    setFormVisible(true);
  };

  return (
    <>
      <Box
        sx={{
          p: 4,
          minWidth: "100vw",
          minHeight: "100vh",
          background:
            mode === "light"
              ? "linear-gradient(to bottom, #ffffff, #7C3AED,#ffffff)"
              : "linear-gradient(to bottom, #121212, #1f1f1f)",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Typography
          variant="h2"
          sx={{ mt: 8, color: mode === "light" ? "#121212" : "#ffffff" }}
          gutterBottom
        >
          Welcome, {userName}
        </Typography>

        <Button
          startIcon={<Add />}
          variant="contained"
          color="primary"
          onClick={toggleForm}
          sx={{ mb: 2 }}
        >
          Add Application
        </Button>

        <Box sx={{ display: "flex", gap: 2, mb: 4, mt: 5 }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">🔍</InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onChange={handleSortChange}
              label="Sort By"
            >
              <MenuItem value="dateOfApplication-asc">
                Date (Ascending)
              </MenuItem>
              <MenuItem value="dateOfApplication-desc">
                Date (Descending)
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {formVisible && (
          <Paper
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              p: 3,
              maxWidth: "400px",
              zIndex: 10,
            }}
          >
            <IconButton
              onClick={toggleForm}
              sx={{ position: "absolute", top: 10, right: 10 }}
            >
              <Close />
            </IconButton>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Job URL"
                name="jobUrl"
                value={formData.jobUrl || ""}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle || ""}
                onChange={handleChange}
                margin="normal"
              />
              <Box sx={{ marginBottom: 2 }}>
                <Typography>Date of Application</Typography>
                <DatePicker
                  selected={
                    formData.dateOfApplication
                      ? new Date(formData.dateOfApplication)
                      : null
                  }
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select a date"
                  showPopperArrow={false}
                  customInput={
                    <TextField
                      sx={{ width: 350 }}
                      fullWidth
                      label="Select Date"
                      value={formData.dateOfApplication || ""}
                      onChange={handleChange}
                    />
                  }
                />
              </Box>
              <TextField
                fullWidth
                label="Company"
                name="company"
                value={formData.company || ""}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status || ""}
                  onChange={handleStatusChange}
                  label="Status"
                  name="status"
                >
                  <MenuItem value="Interview">Interview</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                  <MenuItem value="In Review">In Review</MenuItem>
                  <MenuItem value="Applied">Applied</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                {editId ? "Update Application" : "Add Application"}
              </Button>
            </form>
          </Paper>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            width: "100%",
            mt: 10,
            overflowY: "auto",
          }}
        >
          {filteredApplications.map((app) => (
            <Paper
              key={app._id}
              sx={{
                p: 3,
                mb: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                borderRadius: "12px",
                borderLeft: `6px solid ${statusColors[app.status] || "gray"}`,
                width: "100%",
                maxWidth: "600px",
                margin: "10px 0",
                boxShadow: 3,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
                position: "relative",
              }}
            >
              {/* Job Title */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "#7C3AED",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {app.jobTitle}
              </Typography>

              {/* Company */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Business sx={{ fontSize: 18, color: "#7C3AED" }} />
                <Typography sx={{ fontWeight: "bold" }}>Company:</Typography>
                <Typography>{app.company}</Typography>
              </Box>

              {/* Location */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn sx={{ fontSize: 18, color: "#7C3AED" }} />
                <Typography sx={{ fontWeight: "bold" }}>Location:</Typography>
                <Typography>{app.location}</Typography>
              </Box>

              {/* Date Applied */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Event sx={{ fontSize: 18, color: "#7C3AED" }} />
                <Typography sx={{ fontWeight: "bold" }}>
                  Date Applied:
                </Typography>
                <Typography>
                  {new Date(app.dateOfApplication).toLocaleDateString()}
                </Typography>
              </Box>

              {/* Status */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: "bold" }}>Status:</Typography>
                <Chip
                  label={app.status}
                  sx={{
                    backgroundColor: statusColors[app.status] || "gray",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </Box>

              {/* View Job Button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  href={app.jobUrl}
                  target="_blank"
                  sx={{ mt: 1 }}
                >
                  View Job
                </Button>
              </Box>

              {/* Menu Button */}
              <IconButton
                onClick={(e) => openMenu(e, app._id)}
                sx={{ position: "absolute", top: 10, right: 10 }}
              >
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={currentAppId === app._id}
                onClose={closeMenu}
              >
                <MenuItem onClick={() => handleEdit(app)}>Edit</MenuItem>
                <MenuItem onClick={() => handleDelete(app._id)}>
                  Delete
                </MenuItem>
                {["Interview", "Rejected", "In Review", "Applied"].map(
                  (status) => (
                    <MenuItem
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                    >
                      Mark as {status}
                    </MenuItem>
                  )
                )}
              </Menu>
            </Paper>
          ))}
        </Box>

        <Pagination
          count={Math.ceil(applications.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ mt: 5, display: "flex", justifyContent: "center" }}
        />
      </Box>
    </>
  );
};

export default HomePage;
