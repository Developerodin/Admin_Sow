import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { Button, TextField, Card, CardContent, Box, MenuItem, TextareaAutosize } from '@mui/material';
import { Base_url } from '../../Config/BaseUrl'; 

export const CreateNotification = () => {
  const [b2bVendors, setB2BVendors] = useState([]);
  const [formData, setFormData] = useState({
    vendor: '',
    name: '',
    text: '',
    date: '', 
  });
  const [submittedData, setSubmittedData] = useState([]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.vendor === 'all') {
      
      const allVendorSubmissions = b2bVendors.map(vendor => ({
        ...formData,
        vendor: vendor._id, 
        vendorDetails: `${vendor.name} ${vendor.registerAs}`, 
      }));
      setSubmittedData(prevData => [...prevData, ...allVendorSubmissions]);
      console.log('Submitted Data for All Vendors:', [...submittedData, ...allVendorSubmissions]);
      
    
      // await Promise.all(allVendorSubmissions.map(async (data) => {
      //   await axios.post(`${Base_url}api/notification`, data);
      // }));

    } else {
      
      const selectedVendor = b2bVendors.find(vendor => vendor._id === formData.vendor);
      const vendorSubmission = {
        vendorId: selectedVendor._id,
        vendorName: selectedVendor.name,
        registerAs: selectedVendor.registerAs,
        name: formData.name,
        text: formData.text,
        date: formData.date,
      };
      setSubmittedData(prevData => [...prevData, vendorSubmission]);
      console.log('Submitted Data for Specific Vendor:', vendorSubmission);
      
      
    
    }

    
    setFormData({
      vendor: '',
      name: '',
      text: '',
      date: '', 
    });
  };

  const fetchB2BUser = async () => {
    try {
      const response = await axios.get(`${Base_url}b2bUser?limit=1000`);

      if (response.status === 200) {
        const fetchedB2BUsers = response.data.results; // Extract the results array
        console.log("Fetch users == >", fetchedB2BUsers);
        setB2BVendors(fetchedB2BUsers);
      } else {
        console.error('Error fetching vendors:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    fetchB2BUser();
  }, []);
  
  return (
    <Card>
      <CardContent>
        <Box sx={{ flexGrow: 1 }}>
          <div className="card-title m-0">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "15px",
              }}
            >
              <h3 className="fw-bolder ">Notification</h3>
            </div>
          </div>
        </Box>

        <Box>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Vendor"
              name="vendor"
              value={formData.vendor}
              onChange={handleInputChange}
              select
            >
              <MenuItem value="all">All</MenuItem>
              {b2bVendors.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name} {option.registerAs}
                </MenuItem>
              ))}
            </TextField>
              
            <TextField
              fullWidth
              margin="normal"
              label="Topic Name"
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

            <TextareaAutosize 
              style={{width:"100%",padding:"10px"}} 
              aria-label="Rates Text" 
              name="text"
              value={formData.text}
              onChange={handleInputChange} 
              minRows={6} 
              placeholder="Message"  
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
          </form>
        </Box>
      </CardContent>
    </Card>
  );
};
