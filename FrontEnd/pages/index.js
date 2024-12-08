import { Typography, Box, List, ListItemButton } from "@mui/material";
import Link from "next/link";
import { AppSection, AppHeader } from "../components/common";

export default function Home() {
  return (
    <AppSection>
      <AppHeader>
        <Typography variant="h4">Home</Typography>
      </AppHeader>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <List component="nav">
          <ListItemButton>
            <Link href="/newjob">
              <Typography variant="button">New job</Typography>
            </Link>
          </ListItemButton>
          <ListItemButton>
            <Link href="/jobslist">
              <Typography variant="button">List jobs</Typography>
            </Link>
          </ListItemButton>
          <ListItemButton>
            <Link href="/applicationslist">
              <Typography variant="button">List applications</Typography>
            </Link>
          </ListItemButton>
        </List>
      </Box>
    </AppSection>
  );
}





