import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Checkbox,
  ListItemText,
} from "@mui/material";
import React, { useState, useCallback } from "react";
import { ThemColor } from "../../Them/ThemColor";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { BASE_URL, Base_url } from "../../Config/BaseUrl";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { SocialDistance } from "@mui/icons-material";
import styled from "@emotion/styled";


export const AddUsers = () => {
  const navigate = useNavigate();
  const [Formdata, setFormData] = useState({
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
  });
  const [Category, setCategory] = React.useState("");
  const [VendorType, setVendorType] = React.useState("");

  const [imageFile, setImageFile] = useState(null);
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
      setFormData({ ...Formdata, [name]: value });
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

  // const SubmitSigupData= async()=>{

  //   const Data = new FormData();
  //   console.log("FormData",Formdata)

  //   Data.append("name",Formdata.name)
  //   Data.append("gender",Formdata.gender)
  //   Data.append("email",Formdata.email)
  //   Data.append("password",Formdata.password)
  //   Data.append("mobile",Formdata.mobile)
  //   Data.append("dob",Formdata.dob)
  //   Data.append("Address",Formdata.Address)
  //   Data.append("city",Formdata.city)
  //   Data.append("pincode",Formdata.pincode)
  //   Data.append("country",Formdata.country)
  //   Data.append("panNo",Formdata.panNo)
  //   const AdharData = {
  //     AdhharNo: Formdata.addharCardNo,
  //     Name: '',
  //     Address:Formdata.addharAddress
  //   }
  //   Data.append("adharData",AdharData)
  //   Data.append("images",[])
  //   const DocumentsImages = [PanimageFile1,PanimageFile2,AddharimageFile1,AddharimageFile2]
  //   DocumentsImages.forEach((image, index) => {
  //     // Data.append(`images`, {
  //     //   uri: image.uri,
  //     //   type: 'image/jpeg', // or the appropriate MIME type
  //     //   name: `image_${index}_${Mobile}.jpg`, // or a name of your choice
  //     // });
  //     Data.append("images", image);
  //   });

  //   console.log("Data formdata ==>", Data)

  //   // try {
  //   //   const response = await axios.post(`${Base_url}/b2b`, Data); // Update the API endpoint accordingly
  //   //   console.log("Res ==>",response.data);
  //   //   if(response.data){
  //   //     console.log("DAta ==>",response.data);

  //   //   }

  //   // } catch (error) {
  //   //   console.error('Error creating user:', error);

  //   // }

  // }

  

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", Formdata.name);
    formData.append("gender", Formdata.gender);
    formData.append("email", Formdata.email);
    //   formData.append("category", Category);
    formData.append("password", Formdata.password);
    formData.append("mobile", Formdata.mobile);
    formData.append("dob", Formdata.dob);
    formData.append("Address", Formdata.Address);
    formData.append("city", Formdata.city);
    formData.append("pincode", Formdata.pincode);
    formData.append("country", Formdata.country);

    // const ImageData = [PanimageFile1,PanimageFile2,AddharimageFile1,AddharimageFile2];
    // ImageData.forEach((image, index) => {
    //   formData.append("images", image);

    // });

    formData.append("images", []);

    console.log("Form Data ===>", formData);
    try {
      const response = await axios.post(`${Base_url}user`, formData);
      if (response.status === 201) {
        const newProduct = response.data;
        console.log("New product created:", newProduct);
        setFormData({
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
        });

        handelGoBack();
      } else {
        console.error("Error creating product:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  
  const containerStyle = {
    marginTop: '30px',
    color: 'white',
  };
  
  const cardContentStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#CF9FFF',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
  };
  
  const arrowBackIconStyle = {
    marginRight: '20px',
    color: '#fff',
    cursor: 'pointer',
  };
  
  const formContainerStyle = {
    marginTop: '30px',
    borderRadius: '10px',
   
  };
  
  const inputFieldStyle = {
    height: '0.5em',
    width: '100%',
    outline: 'none',
    fontSize: '16px',
    
   
    
    paddingLeft: '15px',
  };
  
  
  
    

  
  
  const submitButtonStyle = {
    backgroundColor: '#59c0fa',
    marginTop: '40px',
    width: '300px',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
    height: '40px',
  };
  
  const StyledTextField = styled(TextField)`
  .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input {
    height: 0.5rem !important; 
    border: 1px solid #e4e6ef !important;
    opacity: 0.8 !important;
    border-radius: 8px ;
  }
`;
  
  
  return (
      <div style={containerStyle}>
        <div style={cardContentStyle}>
          <ArrowBackIcon style={arrowBackIconStyle} onClick={handelGoBack} />
          <Typography variant="h6" color="white" component="h2" gutterBottom style={{ fontWeight: 'bold' }}>
            Add New User
          </Typography>
        </div>
        <Card>
          <CardContent>
            <Box style={formContainerStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                <label className='form-label fw-bolder text-dark fs-6'>Name</label>
                  <TextField
                    
                    name="name"
                    value={Formdata.name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{inputFieldStyle,marginBottom: '10px'}}
                    
              
                    
                  />
                </Grid>
                <Grid item xs={12}>
                <label className='form-label fw-bolder text-dark fs-6'>Gender</label>
                  <TextField
                    
                    name="gender"
                    value={Formdata.gender}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{inputFieldStyle,marginBottom: '10px'}}
                  />
                </Grid>
                <Grid item xs={12}>
                <label className='form-label fw-bolder text-dark fs-6'>Email</label>
                  <TextField
                  
                    name="email"
                    value={Formdata.email}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{inputFieldStyle,marginBottom: '10px'}}
                  />
                </Grid>
                <Grid item xs={12}>
                <label className='form-label fw-bolder text-dark fs-6'>Mobile</label>
                  <TextField
                    
                    name="mobile"
                    value={Formdata.mobile}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{inputFieldStyle,marginBottom: '10px'}}
                  />
                </Grid>
                <Grid item xs={12}>
                <label className='form-label fw-bolder text-dark fs-6'>Password</label>
                  <TextField
                  
                    name="password"
                    value={Formdata.password}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{inputFieldStyle,marginBottom: '10px'}}
                  />
                </Grid>
                <Grid item xs={12}>
                <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
                  <TextField
                  
                    name="confirmPassword"
                    value={Formdata.confirmPassword}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{inputFieldStyle,marginBottom: '10px'}}
                  />
                </Grid>
                <Grid item xs={12}>
                <label className='form-label fw-bolder text-dark fs-6'>D O B</label>
                  <TextField
                  
                    name="dob"
                    value={Formdata.dob}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{inputFieldStyle,marginBottom: '10px'}}
                  />
                </Grid>
                <Grid item xs={12}>
                <label className='form-label fw-bolder text-dark fs-6'>Address</label>
                  <TextField
                    
                    name="Address"
                    value={Formdata.Address}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{inputFieldStyle,marginBottom: '10px'}}
                  />
                </Grid>
                <Grid item xs={12}>
                <label className='form-label fw-bolder text-dark fs-6'>City</label>
                  <TextField
                  
                    name="city"
                    value={Formdata.city}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{inputFieldStyle,marginBottom: '10px'}}
                  />
                </Grid>
                <Grid item xs={12}>
                <label className='form-label fw-bolder text-dark fs-6'>Pincode</label>
                  <TextField
                    
                    name="pincode"
                    value={Formdata.pincode}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{inputFieldStyle,marginBottom: '10px'}}
                  />
                </Grid>
                <Grid item xs={12}>
                <label className='form-label fw-bolder text-dark fs-6'>Country</label>
                  <TextField
                    
                    name="country"
                    value={Formdata.country}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{inputFieldStyle,marginBottom: '10px'}}
                  />
                </Grid>
                <Grid item xs={12}>

                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    size="large"
                    style={submitButtonStyle}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </div>
  );
};
