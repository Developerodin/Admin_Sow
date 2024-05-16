import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { Button, TextField, FormControl, RadioGroup, Card,CardContent,FormControlLabel, Radio, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Base_url } from '../../Config/BaseUrl'; 


export const CreateRate = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    date: '', 
    time: '', 
    price:''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     console.log("Data ==>",formData);
     try {
        // Send a POST request to the backend API endpoint
        const response = await axios.post(`${Base_url}api/market_rates/`, formData);
        console.log('Response:', response.data);
        setFormData({
            name: '',
            category: '',
            date: '', 
            time: '', 
            price:''
        })
        handleBackButton();
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
              <h3 className="fw-bolder ">Create Market Rate</h3>
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
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />

<TextField
                fullWidth
                margin="normal"
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />

<TextField
type="time"
                fullWidth
                margin="normal"
            
                name="time"
                value={formData.time}
                onChange={handleInputChange}
              />

<TextField
type="date"
                fullWidth
                margin="normal"
             
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
           
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
