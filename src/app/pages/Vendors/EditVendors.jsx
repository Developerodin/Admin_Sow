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

export const EditVendors = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    businessName: "",
    registerAs: "",
    status: false,
    active: false,
    isKYCVerified: false,
    referralCode: ""
  });

  const [PanimageFile1, setPanImageFile1] = useState(null);
  const [PanimageFile2, setPanImageFile2] = useState(null);
  const [AddharimageFile1, setAddharImageFile1] = useState(null);
  const [AddharimageFile2, setAddharImageFile2] = useState(null);

  const handelGoBack = () => {
    window.history.back();
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
        const response = await axios.get(`${Base_url}b2bUser/${id}`);
        console.log("Vendor Data Response:", response.data);
        const vendorData = response.data;
        
        setFormData({
          name: vendorData.name || "",
          email: vendorData.email || "",
          phoneNumber: vendorData.phoneNumber || "",
          businessName: vendorData.businessName || "",
          registerAs: vendorData.registerAs || "",
          status: vendorData.status || false,
          active: vendorData.active || false,
          isKYCVerified: vendorData.isKYCVerified || false,
          referralCode: vendorData.referralCode || ""
        });
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
  
    if (PanimageFile1) formDataToSend.append("panImageFile1", PanimageFile1);
    if (PanimageFile2) formDataToSend.append("panImageFile2", PanimageFile2);
    if (AddharimageFile1) formDataToSend.append("addharImageFile1", AddharimageFile1);
    if (AddharimageFile2) formDataToSend.append("addharImageFile2", AddharimageFile2);
  
    try {
      console.log("Sending data:", formData);
      const response = await axios.put(`${Base_url}b2bUser/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 200) {
        console.log("Vendor updated successfully:", response.data);
        handelGoBack();
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
                Edit Vendor
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
                      <InputLabel id="register-as-label">Register As</InputLabel>
                      <Select
                        labelId="register-as-label"
                        id="register-as"
                        value={formData.registerAs}
                        label="Register As"
                        name="registerAs"
                        onChange={handleInputChange}
                      >
                        <MenuItem value="Retailer">Retailer</MenuItem>
                        <MenuItem value="Wholesaler">Wholesaler</MenuItem>
                        <MenuItem value="Manufacturer">Manufacturer</MenuItem>
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

                <Grid item xs={4}>
                  <TextField
                    label="Business Name"
                    name="businessName"
                    value={formData.businessName}
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
                  <TextField
                    label="Referral Code"
                    name="referralCode"
                    value={formData.referralCode}
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
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="active-label">Active</InputLabel>
                      <Select
                        labelId="active-label"
                        id="active"
                        value={formData.active}
                        label="Active"
                        name="active"
                        onChange={handleInputChange}
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="kyc-label">KYC Verified</InputLabel>
                      <Select
                        labelId="kyc-label"
                        id="kyc"
                        value={formData.isKYCVerified}
                        label="KYC Verified"
                        name="isKYCVerified"
                        onChange={handleInputChange}
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={2} style={{marginTop:"20px"}}>
                <Grid item xs={12}>
                  <Box>
                    <Typography>Upload Pan Card Images</Typography>
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
                    <Typography>Upload Aadhar Card Images</Typography>
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
  