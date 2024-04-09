import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import { Box, Card, CardContent, FormControl, InputLabel, Typography } from '@mui/material';
import { Base_url } from '../../Config/BaseUrl';
import axios from 'axios';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export const AddOrder = () => {
  const [formData, setFormData] = useState({
    user: '',
    category: '',
    quantity: 0,
    totalAmount: 0,
    sub_category:''
  });

  const [update,setupdate] = useState(0)

  const [subCategoryData,setSubCategoryData] = useState([])
  const [totalAmount,setTotalAmount] = useState("")
  const [selectedSubcategoryData,setSelectedSubcategoryData] = useState({})
  const [usersData,setUsersdata] = useState([]);
  const [CategoriesData,setCategoriesData] = useState([])
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    

    if (name === 'category') {
      const selectedVendor = CategoriesData.find((vendor) => vendor._id === value);
  
      if (selectedVendor) {

        setSubCategoryData(selectedVendor.sub_category)
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if(name === "sub_category"){
      
      const selectedSubcategory = subCategoryData.find((el) => el.name === value);
      setSelectedSubcategoryData(selectedSubcategory);
      
    }
   
    if(name === "quantity"){
      const total = parseInt(selectedSubcategoryData.price) * value
       setTotalAmount(total)
    }
  };


  const handleSubmit = () => {
    const Data ={
        customer:formData.user, 
        details: {
          category: formData.category,
          sub_category: formData.sub_category,
          quantity: formData.quantity,
        },
        totalAmount: totalAmount,
        status: 'not assigned',
      }
  
    createOrder(Data);
    setFormData({
        user: '',
        category: '',
        quantity: 0,
        totalAmount: 0,
        sub_category:''
      })
    setTotalAmount("")
    handelBack();
  };

  const createOrder = async (Data) => {
    try {
      const response = await axios.post(`${Base_url}api/orders`, Data); // Adjust the endpoint accordingly
      setupdate((prev)=>prev+1)
    } catch (error) {
      console.error('Error creating new order:', error);
    }
  };


  const handelBack = ()=>{
    window.history.back();
   }

   const fetchUser = async () => {
    try {
      const response = await axios.get(`${Base_url}api/users`);

      if (response.status === 200) {
        const fetchedUsers = response.data;
        // setCategories(fetchedCategories);

        console.log("Fetch users == >",fetchedUsers)
        
        setUsersdata(fetchedUsers)

      } else {
        console.error('Error fetching users:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`${Base_url}api/category`);
      setCategoriesData(response.data);
      console.log("Categories all", response.data)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  useEffect(()=>{
    fetchUser()
    getCategories()
  },[update])
  return (
    <div>
      <Card sx={{minHeight:"100vh"}}>
        <CardContent>
        <div onClick={handelBack} style={{backgroundColor:"#7265bd",width:"35px",height:"35px",display:"flex",justifyContent:"center",alignItems:"center",borderRadius:"10px",marginBottom:"15px"}}>
                <ArrowBackIosIcon style={{fontSize:"16px",color:"#fff"}}/>
            </div>
          <Box >
          <Box style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <Box>
            <Typography style={{fontSize:"30px",fontWeight:600,fontFamily:"sans-serif"}} >
             Add Order
            </Typography>
            </Box>
           

            {/* <Box>
              
              <Button variant="contained" style={{marginLeft:"20px",background:"#FF8604"}} startIcon={<AddIcon />} onClick={handelOrderClick} >Add Order</Button>
            </Box> */}
          </Box>
             
          <Grid container spacing={2} sx={{marginTop:"20px"}}>
      <Grid item xs={12} sm={6}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">User</InputLabel>
        <Select
          fullWidth
          label="user"
          name="user"
          value={formData.user}
          onChange={handleInputChange}
        >
          {usersData.map((vendor) => (
            <MenuItem key={vendor._id} value={vendor._id}>
              {vendor.name} 
            </MenuItem>
          ))}
        </Select>
        </FormControl>
      </Grid>
     
     
      <Grid item xs={12} sm={6}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          fullWidth
          label="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
        >
          {CategoriesData.map((vendor) => (
            <MenuItem key={vendor._id} value={vendor._id}>
              {vendor.name} 
            </MenuItem>
          ))}
        </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        {/* <TextField
          fullWidth
          label="Sub Category"
          name="sub_category"
          value={formData.sub_category}
          onChange={handleInputChange}
        /> */}
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label"> sub_category</InputLabel>
        <Select
          fullWidth
          label="sub_category"
          name="sub_category"
          value={formData.sub_category}
          onChange={handleInputChange}
        >
          {subCategoryData.map((el) => (
            <MenuItem key={el.name} value={el.name}>
              {el.name} {el.price} / {el.unit}
            </MenuItem>
          ))}
        </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Quantity"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Total Amount"
          type="number"
          name="totalAmount"
          value={totalAmount}
         
        />
      </Grid>
      <Grid item xs={12} sx={{textAlign:"right"}}>
        <Button variant="contained" sx={{bgcolor:"orange"}} size='large' onClick={handleSubmit}>
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
