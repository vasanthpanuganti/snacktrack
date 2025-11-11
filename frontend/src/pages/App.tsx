import { CssBaseline, Container, Grid, ThemeProvider, Typography } from "@mui/material";
import { useMemo } from "react";
import Dashboard from "../components/Dashboard";
import ProfileForm from "../components/ProfileForm";
import { createTheme } from "@mui/material/styles";

const App = () => {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: {
            main: "#2e7d32"
          },
          secondary: {
            main: "#00897b"
          }
        }
      }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          DietFriend
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Personalized nutrition guidance blending lifestyle, culture, and health insights.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <ProfileForm />
          </Grid>
          <Grid item xs={12} md={8}>
            <Dashboard />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;
