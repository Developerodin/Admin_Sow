import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { Button, TextField, FormControl, RadioGroup, Card,CardContent,FormControlLabel, Radio, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Base_url } from '../../Config/BaseUrl'; 


export const CreatePlan = () => {
  const [planDetails, setPlanDetails] = useState({
    name: '',
    price: '',
    features: 'basic', // Default feature
    priceType: 'monthly', // Default price type
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlanDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the backend API endpoint
      const response = await axios.post(`${Base_url}api/plans`, planDetails);
      console.log('Response:', response.data);
      // Optionally, you can redirect the user or show a success message here
    } catch (error) {
      console.error('Error submitting plan details:', error);
      // Optionally, you can show an error message to the user
    }
  };

  const handleBackButton = () => {
    window.history.back();
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ flexGrow: 1 }}>
          <div className="card-title m-0">
            <div
              onClick={handleBackButton}
              style={{
                backgroundColor: "#7265bd",
                width: "35px",
                height: "35px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                cursor: "pointer"
              }}
            >
              <ArrowBackIcon style={{ fontSize: "16px", color: "#fff" }} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "15px",
              }}
            >
              <h3 className="fw-bolder ">Create Plan</h3>
            </div>
          </div>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                width: "400px",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <TextField
                fullWidth
                margin="normal"
                label="Plan Name"
                name="name"
                value={planDetails.name}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Price"
                name="price"
                value={planDetails.price}
                onChange={handleInputChange}
              />
              <FormControl component="fieldset" sx={{ marginTop: "20px" }}>
                <RadioGroup
                  aria-label="features"
                  name="features"
                  value={planDetails.features}
                  onChange={handleInputChange}
                >
                  <FormControlLabel
                    value="basic"
                    control={<Radio />}
                    label="Basic Features"
                  />
                  <FormControlLabel
                    value="standard"
                    control={<Radio />}
                    label="Standard Features"
                  />
                  <FormControlLabel
                    value="premium"
                    control={<Radio />}
                    label="Premium Features"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl component="fieldset" sx={{ marginTop: "20px" }}>
                <RadioGroup
                  aria-label="priceType"
                  name="priceType"
                  value={planDetails.priceType}
                  onChange={handleInputChange}
                >
                  <FormControlLabel
                    value="monthly"
                    control={<Radio />}
                    label="Price Per Month"
                  />
                  <FormControlLabel
                    value="yearly"
                    control={<Radio />}
                    label="Price Per Year"
                  />
                </RadioGroup>
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Box>
            </Box>
          </form>
        </Box>

      </CardContent>
    </Card>
  );
};
