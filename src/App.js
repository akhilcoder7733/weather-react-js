import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  CardActions,
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import { PulseLoader } from 'react-spinners'; // Import PulseLoader

const WeatherCard = styled(Card)({
  marginTop: '20px',
  padding: '20px',
  maxWidth: '400px',
  margin: '0 auto',
  textAlign: 'center',
});

const MainBox = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
}));

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const fetchWeatherData = async () => {
    if (!city) {
      alert('Please enter a city name');
      return;
    }
  
    setLoading(true); // Set loading to true
    const apiKey = 'a04b66e09f2f2535124c04cb12f3ba85';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
  
    if (response.ok) {
      const timezoneUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const timezoneResponse = await fetch(timezoneUrl);
      const timezoneData = await timezoneResponse.json();
      const timezoneOffset = timezoneData.timezone;
  
      const currentTime = new Date(Date.now() + timezoneOffset * 1000).toLocaleTimeString();
  
      setWeather({ ...data, currentTime });
      handleOpenDialog();
    } else {
      alert('City not found. Please enter a valid city name');
    }
  
    setLoading(false); // Set loading to false
  };
  

  const resetWeatherData = () => {
    setCity('');
    setWeather(null);
  };

  return (
    <MainBox>
      <Typography variant="h4" gutterBottom>
        Weather App
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter a city name to get the current weather information
      </Typography>
      <Box sx={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", }}>
        <TextField
          label="Enter City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <SearchIcon onClick={fetchWeatherData} style={{ fontSize: "42px", marginBottom: "16px" }} />
      </Box>


      <Button onClick={resetWeatherData} variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
        Reset
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <WeatherCard>
          <CardContent>
            <Typography variant="h6">{weather?.name}</Typography>
            <Typography variant="body1">{weather?.weather[0].description}</Typography>
            <Typography variant="body1">{weather?.main.temp}°C</Typography>
            <Typography variant="body1">Humidity: {weather?.main.humidity}%</Typography>
            <Typography variant="body1">Current Time: {new Date().toLocaleTimeString()}</Typography>
            <Typography variant="body1">Climate: {weather?.weather[0].main}</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Wind Speed</TableCell>
                    <TableCell>Sunrise</TableCell>
                    <TableCell>Sunset</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{weather?.wind.speed} m/s</TableCell>
                    <TableCell>{new Date(weather?.sys.sunrise * 1000).toLocaleTimeString()}</TableCell>
                    <TableCell>{new Date(weather?.sys.sunset * 1000).toLocaleTimeString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          <CardActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </CardActions>
        </WeatherCard>
      </Dialog>
      {loading && <PulseLoader color="green" loading={loading} />}
    </MainBox>
  );
};

export default App;