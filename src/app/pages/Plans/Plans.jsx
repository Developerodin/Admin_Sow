import { Box, Button, Card, CardContent, InputAdornment, Typography, TextField, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {  Base_url } from '../../Config/BaseUrl';
import { PlansCard } from '../../../Components/PlansCard';

export const Plans = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const [searchInput, setSearchInput] = React.useState('');
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${Base_url}plans`);
        console.log('Fetched plans:', response.data);
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans(); 
  }, []);

  const handelcreateplanClick = () => {
    navigate("createplan");
  };

  return (
    <Box>
      <Card sx={{ minHeight: "100vh" }}>
        <CardContent>
          <Box>
            <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography style={{ fontSize: "40px", fontWeight: 600, fontFamily: "sans-serif" }}>
                  Plans
                </Typography>
              </Box>

              <Box>
                <Button
                  variant="contained"
                  style={{ marginLeft: "20px", background: "#FF8604" }}
                  startIcon={<AddIcon />}
                  onClick={handelcreateplanClick}
                >
                  Create Plan
                </Button>
              </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: "20px" }}></Box>

            <Box sx={{ display: "flex", marginTop: "20px", justifyContent: "left", alignItems: "center" }}>
              <TextField
                label="Search"
                id="outlined-start-adornment"
                size='small'
                sx={{ m: 1, width: '250px' }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />

              <Button
                variant="contained"
                style={{ marginLeft: "20px", background: "black", height: "33px" }}
                startIcon={<FilterListIcon />}
              >
                A-Z
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              width: '100%',
              marginTop: '20px',
              height: { xs: 'auto', md: '70vh' },
              overflow: 'auto',
              padding: { xs: '10px', sm: '20px' },
            }}
          >
            <Grid container spacing={2}>
              {plans.map((plan) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={plan.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <PlansCard plan={plan} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
