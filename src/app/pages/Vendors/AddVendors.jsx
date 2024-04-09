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
    FormControl ,
    MenuItem ,
    InputLabel ,
    Checkbox,
    ListItemText

  } from "@mui/material";
  import React, { useState } from "react";
  import { ThemColor } from "../../Them/ThemColor";
  import ArrowBackIcon from "@mui/icons-material/ArrowBack";
  import { useNavigate } from "react-router-dom";
  import { BASE_URL, Base_url } from "../../Config/BaseUrl";
  import axios from "axios";
  import Grid from "@mui/material/Grid";
  export const AddVendors = () => {
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
      panNo:"",
      addharCardNo:"",
      addharAddress:""
     
    });
    const [Category, setCategory] = React.useState('');
    const [VendorType, setVendorType] = React.useState('');
    

    const [imageFile, setImageFile] = useState(null);
    const [PanimageFile1,setPanImageFile1] = useState(null)
    const [PanimageFile2,setPanImageFile2] = useState(null)
    const [AddharimageFile1,setAddharImageFile1] = useState(null)
    const [AddharimageFile2,setAddharImageFile2] = useState(null)
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
      formData.append("category", Category);
      formData.append("password", Formdata.password);
      formData.append("mobile", Formdata.mobile);
      formData.append("dob", Formdata.dob);
      formData.append("Address", Formdata.Address);
      formData.append("city", Formdata.city);
      formData.append("pincode", Formdata.pincode);
      formData.append("country", Formdata.country);
      formData.append("panNo",Formdata.panNo);
      formData.append("registerAs",VendorType);
      const SubCategoryData = [
        {name:"test",price:"20",unit:"kg"}
      ]
      formData.append("sub_category",JSON.stringify(SubCategoryData));
      const AdharData = {
            AdhharNo: Formdata.addharCardNo,
            Name: '',
            Address:Formdata.addharAddress
          }
          const Adhar = JSON.stringify(AdharData);
      formData.append("adharData",Adhar)
      // const ImageData = [PanimageFile1,PanimageFile2,AddharimageFile1,AddharimageFile2];
      // ImageData.forEach((image, index) => {
      //   formData.append("images", image);
        
      // });
  
      formData.append("images", []);
  
       console.log("Form Data ===>",formData);
      try {
        const response = await axios.post(`${Base_url}b2b`, formData);
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
            panNo:"",
            addharCardNo:"",
            addharAddress:""
          });
          
          handelGoBack();
        } else {
          console.error("Error creating product:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

   

      const Expertise = [
        "Hatha",
        "Vinyasa Flow",
        "Iyenger Yoga",
        "Power Yoga",
        "Ashtanga",
        "YIN",
        "Restorative",
        "Meditation",
        "Pranayama (Breath Work)",
        "Kids Yoga",
        "Pre & Postnatal",
        "Mudra",
        "Laughter Yoga",
        "Sound Healing",
      ];
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
                  Add new vendor
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
                      value={Formdata.name}
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
                      value={Formdata.gender}
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
                      value={Formdata.email}
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
                      value={Formdata.mobile}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      label="Password"
                      name="password"
                      value={Formdata.password}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      label="Confirm Password"
                      name="confirmPassword"
                      value={Formdata.confirmPassword}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  
  
                  <Grid item xs={4}>
                    <TextField
                      label="D O B"
                      name="dob"
                      value={Formdata.dob}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      label="Pan Card Number"
                      name="panNo"
                      value={Formdata.panNo}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      label="Addhar Card Number"
                      name="addharCardNo"
                      value={Formdata.addharCardNo}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  
  
                  <Grid item xs={4}>
                    <TextField
                      label="Address"
                      name="Address"
                      value={Formdata.Address}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      label="City"
                      name="city"
                      value={Formdata.city}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      label="Pincode"
                      name="pincode"
                      value={Formdata.pincode}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
  
                  <Grid item xs={4}>
                    <TextField
                      label="Country"
                      name="country"
                      value={Formdata.country}
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
                        Submit
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
  