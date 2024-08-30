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

export const EditRequestVendors = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    dob: "",
    Address: "",
    city: "",
    pincode: "",
    country: "",
    panNo: "",
    addharCardNo: "",
    addharAddress: ""
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
    const fetchVendorData = async () => {
      try {
        const response = await axios.get(`${Base_url}api/b2b/${id}`);
        const vendorData = response.data;
        setFormData({
          name: vendorData.name || "",
          gender: vendorData.gender || "",
          email: vendorData.email || "",
          password: vendorData.password || "",
          confirmPassword: "",
          mobile: vendorData.mobile || "",
          dob: vendorData.dob || "",
          Address: vendorData.Address || "",
          city: vendorData.city || "",
          pincode: vendorData.pincode || "",
          country: vendorData.country || "",
          panNo: vendorData.panNo || "",
          addharCardNo: vendorData.adharData.AdhharNo || "",
          addharAddress: vendorData.adharData.Address || ""
        });
        setCategory(vendorData.categories.length > 0 ? vendorData.categories[0].name : '');
        setVendorType(vendorData.registerAs || '');
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };
  
    fetchVendorData();
  }, [id]);
  
  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    
    // Append all form data fields
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
  
    formDataToSend.append("category", Category);
    formDataToSend.append("registerAs", VendorType);
  
    if (PanimageFile1) formDataToSend.append("panImageFile1", PanimageFile1);
    if (PanimageFile2) formDataToSend.append("panImageFile2", PanimageFile2);
    if (AddharimageFile1) formDataToSend.append("addharImageFile1", AddharimageFile1);
    if (AddharimageFile2) formDataToSend.append("addharImageFile2", AddharimageFile2);
  
    // Log the FormData contents for debugging
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  
    try {
      const response = await axios.put(`${Base_url}api/b2b/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 200) {
        console.log("Vendor updated successfully:", response.data);
        handelGoBack(); // Navigate back to the previous page
      } else {
        console.error("Error updating vendor:", response.statusText);
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
                  Edit vendor
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
        <InputLabel id="demo-simple-select-label"> Vendor Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={VendorType}
          label="Age"
          onChange={handleVendorTypeChange}
        >
          <MenuItem value={"Collectors"}>Scrap Collectors</MenuItem>
          <MenuItem value={"Wholesalers"}>Scrap Wholesalers</MenuItem>
          <MenuItem value={"Mediators"}>Scrap Mediators</MenuItem>
          <MenuItem value={"Factory"}>Scrap Factory</MenuItem>
          
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
                      label="Name"
                      name="name"
                      value={formData.name}
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
                      label="Gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      type="Eamil"
                      label="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      fullWidth
                      multiline
                      required
                    />
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      label="Mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  
  
                  
  
                  <Grid item xs={4}>
                    <TextField
                      label="D O B"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      label="Pan Card Number"
                      name="panNo"
                      value={formData.panNo}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      label="Addhar Card Number"
                      name="addharCardNo"
                      value={formData.addharCardNo}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  
  
                  <Grid item xs={4}>
                    <TextField
                      label="Address"
                      name="Address"
                      value={formData.Address}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      label="Pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
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
  