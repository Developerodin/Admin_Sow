import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,   
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Base_url } from "../../Config/BaseUrl";
import { ThemColor } from "../../Them/ThemColor";

export const EditUsers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    profileType: "",
    status: "",
    isKYCVerified: false
  });
  const [Category, setCategory] = useState('');
  const [VendorType, setVendorType] = useState('');
  const [PanimageFile1, setPanImageFile1] = useState(null);
  const [PanimageFile2, setPanImageFile2] = useState(null);
  const [AddharimageFile1, setAddharImageFile1] = useState(null);
  const [AddharimageFile2, setAddharImageFile2] = useState(null);

  const handelGoBack = () => {
    window.history.back();
  };

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const handleVendorTypeChange = (event) => {
    setVendorType(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange1 = (e) => {
    setPanImageFile1(e.target.files[0]);
  };

  const handleFileChange2 = (e) => {
    setPanImageFile2(e.target.files[0]);
  };

  const handleFileChange3 = (e) => {
    setAddharImageFile1(e.target.files[0]);
  };

  const handleFileChange4 = (e) => {
    setAddharImageFile2(e.target.files[0]);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${Base_url}b2cUser/${id}`);
        console.log("User Data Response:", response.data);
        const userData = response.data;
        
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          profileType: userData.profileType || "",
          status: userData.status || "",
          isKYCVerified: userData.isKYCVerified || false
        });

        // Set profile type if it exists
        if (userData.profileType) {
          setVendorType(userData.profileType);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, [id]);
  
  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...formData,
        profileType: VendorType // Use the selected profile type
      };

      console.log("Sending data:", dataToSend);
      const response = await axios.post(`${Base_url}b2cUser/${id}`, dataToSend);
      
      if (response.status === 200) {
        console.log("User updated successfully:", response.data);
        handelGoBack();
      } else {
        console.error("Error updating user:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
   

      
    return (
      <Box>
        <Box style={{ marginTop: "30px" }}>
          <Card>
            <CardContent>
              <Box style={{ display: "flex", alignItems: "center" }}>
                <ArrowBackIcon
                  onClick={handelGoBack}
                  style={{ marginRight: "20px", color: `${ThemColor.buttons}` }}
                />
                <Typography variant="h6" style={{ letterSpacing: 1 }}>
                  Edit User
                </Typography>
              </Box>
  
              <Box>
              {PanimageFile1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "left",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        border: "1px solid #ddd",
                        background: `url(${URL.createObjectURL(
                          PanimageFile1
                        )}) center/cover no-repeat`,
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    ></div>
                  </div>
                )}
  
                {PanimageFile2 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "left",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        border: "1px solid #ddd",
                        background: `url(${URL.createObjectURL(
                          PanimageFile2
                        )}) center/cover no-repeat`,
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    ></div>
                  </div>
                )}
  
  
                {AddharimageFile1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "left",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        border: "1px solid #ddd",
                        background: `url(${URL.createObjectURL(
                          AddharimageFile1
                        )}) center/cover no-repeat`,
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    ></div>
                  </div>
                )}
  
                 {AddharimageFile2 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "left",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        border: "1px solid #ddd",
                        background: `url(${URL.createObjectURL(
                          AddharimageFile2
                        )}) center/cover no-repeat`,
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    ></div>
                  </div>
                )}
  
  
              </Box>
              
  
              <Box style={{ marginTop: "20px" }}>
                
                <Grid container spacing={2}>
                <Grid item xs={4}>
                   <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="profile-type-label">Profile Type</InputLabel>
                      <Select
                        labelId="profile-type-label"
                        id="profile-type"
                        value={VendorType}
                        label="Profile Type"
                        onChange={handleVendorTypeChange}
                      >
                        <MenuItem value="household">Household</MenuItem>
                        <MenuItem value="office">Office</MenuItem>
                        <MenuItem value="shopkeeper">Shopkeeper</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                   <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label"> Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={Category}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={"Electronics"}>Electronics</MenuItem>
          
        </Select>
      </FormControl>
    </Box>
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>

         
  
                  {/* <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Select Category</InputLabel>
                  <Select
                    label="Select Category"
                    name="category"
                    value={Formdata.category}
                    onChange={handleInputChange}
                    required
                  >
                    {
                      categories.map((el,index)=>{
                            return  <MenuItem key={index} value={el._id}>{el.name}</MenuItem>
                      })
                    }
                   
                    
                  </Select>
                </FormControl>
              </Grid> */}
  
                  <Grid item xs={4}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  
  
                  
  
                  <Grid item xs={4}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                          labelId="status-label"
                          id="status"
                          value={formData.status}
                          label="Status"
                          name="status"
                          onChange={handleInputChange}
                        >
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
  
                 
  
                  
                </Grid>
  
               
                     <Grid container spacing={2} style={{marginTop:"20px"}}>
                     <Grid item xs={12}>
                     <Box>
                      <Typography>Uplode Pan Card Images</Typography>
                     </Box>
                 </Grid>
                     <Grid item xs={6}>
                    
                   
                     <TextField
                      type="file"
                      variant="outlined"
                      onChange={handleFileChange1}
                      fullWidth
                    />
                  </Grid>
  
                  <Grid item xs={6}>
                    
                    <TextField
                      type="file"
                      variant="outlined"
                      onChange={handleFileChange2}
                      fullWidth
                    />
                   
                  </Grid>
  
                  <Grid item xs={12}>
                     <Box>
                      <Typography>Uplode Addhar Card Images</Typography>
                     </Box>
                 </Grid>
  
                 <Grid item xs={6}>
                    
                   
                    <TextField
                     type="file"
                     variant="outlined"
                     onChange={handleFileChange3}
                     fullWidth
                   />
                 </Grid>
  
                 <Grid item xs={6}>
                   
                   <TextField
                     type="file"
                     variant="outlined"
                     onChange={handleFileChange4}
                     fullWidth
                   />
                  
                 </Grid>
  
                 <Grid item xs={12}>
                    <Box
                      style={{
                        marginTop: "40px",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="contained"
                        style={{ backgroundColor: `${ThemColor.buttons}` }}
                        onClick={handleSubmit}
                        size="large"
                      >
                        Update
                      </Button>
                    </Box>
                  </Grid>
  
                     </Grid>
  
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  };
  