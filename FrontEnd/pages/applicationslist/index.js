import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import TablePagination from "@mui/material/TablePagination";
import { useRouter } from "next/router";
import { Button, TextField, Box, Typography } from "@mui/material";

const LoginForm = ({ setLoggedIn, onLoginSuccess }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      setLoggedIn(true);
      onLoginSuccess(data.token);
    } else {
      setError(data.message);
    }
  };

  return (
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
      {error && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}

      <form
        onSubmit={handleSubmit}
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
          sx={{ marginTop: 2 }}
        >
          Login
        </Button>
      </form>
    </Box>
  );
};

export default function ApplicationsTable() {
  const [applications, setApplications] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  const fetchApplications = async (token) => {
    try {
      const response = await fetch("http://localhost:3001/api/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data.data);
      } else {
        console.error("Error fetching applications:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onLoginSuccess = (token) => {
    fetchApplications(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchApplications(token);
    } else {
      setLoading(false);
    }
  }, []);

  const deleteItem = async (application_id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3001/api/applications/${application_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setApplications((prevApplications) =>
          prevApplications.filter(
            (item) => item.application_id !== application_id
          )
        );
        console.log(`Item com ID ${application_id} deletado.`);
      } else {
        console.error("Erro ao deletar o item:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao realizar a requisição:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentRows = applications.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (


<Box sx={{ minHeight: "100vh", position: "relative", padding: "16px" }}>
  {!isLoggedIn ? (
    <LoginForm setLoggedIn={setIsLoggedIn} onLoginSuccess={onLoginSuccess} />
  ) : loading ? (
    <p>Loading...</p>
  ) : (
    <>
      <Typography variant="h4" sx={{ position: "absolute", top: "16px", left: "16px" }}>
        Application List
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
        sx={{
          position: "absolute",
          top: "16px",
          right: "16px",
        }}
      >
        Logout
      </Button>

      <Box sx={{ padding: "16px", marginTop: "150px" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRows.map((row) => (
                <TableRow key={row.application_id}>
                  <TableCell>{row.first_name}</TableCell>
                  <TableCell>{row.last_name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="delete"
                      onClick={() => deleteItem(row.application_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={applications.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </>
  )}
</Box>
  );
}
