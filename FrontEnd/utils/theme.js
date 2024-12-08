import { createTheme } from "@mui/material";

export const theme = createTheme({
  fontFamily: ["Roboto"],
  typography: {
    h4: {
      fontWeight: 700,
      fontFamily: ["Work Sans"],
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
        },
      },
    },
  },
  palette: {
    neutral: {
      main: "#4F4F4F",
      contrastText: "#FFF",
    },
  },
});
