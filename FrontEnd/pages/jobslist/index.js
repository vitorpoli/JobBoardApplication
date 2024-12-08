import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import {Button,TextField,Box,Typography,TablePagination,} from "@mui/material";
import { useRouter } from "next/router";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState(""); // 'worker' or 'employee'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Pagination
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(10); 

  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/jobs"); 
        if (!response.ok) {
          throw new Error("Failed to fetch job listings");
        }
        const data = await response.json();
        setJobs(data.data);
      } catch (error) {
        console.error(error.message);
        setError("Failed to load job listings.");
      }
    };

    fetchJobs();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      setIsLoggedIn(true);
      setLoginError("");
    } catch (error) {
      setLoginError("Invalid credentials");
    }
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  const deleteItem = async (job_id) => {
    const response = await fetch(`http://localhost:3001/api/jobs/${job_id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setJobs(jobs.filter((job) => job.job_id !== job_id));
    } else {
      console.error("Error deleting job");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const currentRows = jobs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ minHeight: "100vh", position: "relative", padding: "16px" }}>
      {!userType ? (
        <Box sx={{ textAlign: "center", marginTop: "20%" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ margin: 2 }}
            onClick={() => handleUserTypeChange("worker")}
          >
            Worker
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ margin: 2 }}
            onClick={() => handleUserTypeChange("employee")}
          >
            Employee
          </Button>
        </Box>
      ) : isLoggedIn && userType === "employee" ? (

        <>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{ position: "absolute", top: "16px", right: "16px" }}
          >
            Logout
          </Button>
          <h1>Job List</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows.map((job) => (
                  <TableRow key={job.job_id}>
                    <TableCell>{job.company_name}</TableCell>
                    <TableCell>
                      {job.description.length > 50
                        ? `${job.description.substring(0, 50)}...`
                        : job.description}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteItem(job.job_id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={jobs.length} 
            page={page} 
            onPageChange={handleChangePage} 
            rowsPerPage={rowsPerPage} 
            onRowsPerPageChange={handleChangeRowsPerPage} 
          />
        </>
      ) : userType === "employee" ? (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh", 
              padding: 2,
            }}
          >
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              Login
            </Typography>
            {loginError && (
              <Typography color="error" sx={{ marginBottom: 2 }}>
                {loginError}
              </Typography>
            )}
            <form
              onSubmit={handleLogin}
              style={{ width: "100%", maxWidth: "400px" }}
            >
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2}}
              >
                Login
              </Button>
            </form>
          </Box>
        </>
      ) : (
        <>
          <h1>Job List</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows.map((job) => (
                  <TableRow key={job.job_id}>
                    <TableCell>{job.company_name}</TableCell>
                    <TableCell>
                      {job.description.length > 50
                        ? `${job.description.substring(0, 50)}...`
                        : job.description}
                    </TableCell>
                    <TableCell>
                      <Link href={`/jobslist/jobapply?job_id=${job.job_id}`}>
                        <Button variant="contained" color="primary">
                          Apply
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={jobs.length} 
            page={page} 
            onPageChange={handleChangePage} 
            rowsPerPage={rowsPerPage} 
            onRowsPerPageChange={handleChangeRowsPerPage} 
          />
        </>
      )}
    </Box>
  );
}
