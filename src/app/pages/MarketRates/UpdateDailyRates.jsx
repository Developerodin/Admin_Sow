import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { Button, TextField, FormControl, RadioGroup, Card,CardContent,FormControlLabel, Radio, Box, InputLabel, Select, MenuItem, TextareaAutosize } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Base_url } from '../../Config/BaseUrl'; 


export const UpdateDailyRates = () => {
  const [formData, setFormData] = useState({
    name:'',
    text: '',
    date: '', 
  });

  const [CategoriesData, setCategoriesData] = useState([]);

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
        const response = await axios.post(`${Base_url}daily_rates/`, formData);
        console.log('Response:', response.data);
        setFormData({
            name:'',
            text: '',
            date: '', 
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
              <h3 className="fw-bolder ">Update Daily Rate</h3>
            </div>
          </div>
        </Box>

        <Box
         
        >
          <form onSubmit={handleSubmit}>
          <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={formData.name}
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

            

<TextareaAutosize style={{width:"100%",padding:"10px"}} aria-label="Rates Text" name="text"
                value={formData.text}
                onChange={handleInputChange} minRows={6} placeholder="Rates Text" />
           


           
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
           
          </form>
        </Box>

      </CardContent>
    </Card>
  );
};
