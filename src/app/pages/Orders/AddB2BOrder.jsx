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

export const AddB2BOrder = () => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    category: '',
    quantity: 0,
    totalAmount: 0,
    sub_category:''
  });

  const [b2bVendors, setB2BVendors] = useState([]);
  const [CollectorsData,setCollectorsData] = useState([]);
  const [WholesalersData,setWholesalersData] = useState([]);
  const [MediatorsData,setMediatorsData] = useState([]);
  const [FactoryData,setFactoryData] = useState([]);
  const [update,setupdate] = useState(0)
  const [toData,setToData] = useState([])
  const [fromData,setFromData] = useState([])
  const [subCategoryData,setSubCategoryData] = useState([])
  const [totalAmount,setTotalAmount] = useState("")
  const [selectedSubcategoryData,setSelectedSubcategoryData] = useState({})
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if(name === "from"){
      const selectedVendor = fromData.find((vendor) => vendor._id === value);

      if (selectedVendor) {
        if (selectedVendor.registerAs === 'Collectors') {
          setToData(WholesalersData); // Replace with your collector data
        } else if (selectedVendor.registerAs === 'Wholesalers') {
          setToData(MediatorsData); // Replace with your mediator data
        } else if (selectedVendor.registerAs === 'Mediators') {
          setToData(FactoryData); // Replace with your factory data
        }
      }
    }

    if (name === 'to') {
      const selectedVendor = fromData.find((vendor) => vendor._id === value);
  
      if (selectedVendor) {
        setFormData({
          ...formData,
          to: value,
          category: selectedVendor.category,
        });

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

  const handleCategoryChange = (index, value) => {
    const updatedDetails = [...formData.details];
    updatedDetails[index].category = value;
    setFormData({
      ...formData,
      details: updatedDetails,
    });
  };

  const handleQuantityChange = (index, value) => {
    const updatedDetails = [...formData.details];
    updatedDetails[index].quantity = value;
    setFormData({
      ...formData,
      details: updatedDetails,
    });
  };

  const handleAddCategory = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { category: '', quantity: 0 }],
    });
  };

  const handleRemoveCategory = (index) => {
    const updatedDetails = [...formData.details];
    updatedDetails.splice(index, 1);
    setFormData({
      ...formData,
      details: updatedDetails,
    });
  };

  const handleSubmit = () => {
    const details ={
      category:formData.category,
      sub_category:formData.sub_category,
      quantity:formData.quantity,
    }
    createOrder(formData.from, formData.to,details,totalAmount,formData.status);
    setFormData({
      from: '',
      to: '',
      category: '',
      quantity: 0,
      totalAmount: 0,
      sub_category:''
    })
    setTotalAmount("")
    handelBack();
  };

  const createOrder = async (from, to, details, totalAmount, status) => {
    try {
      const response = await axios.post(`${Base_url}api/b2b_orders`, { from, to, details, totalAmount, status });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const fetchB2BUser = async () => {
    try {
      const response = await axios.get(`${Base_url}api/b2b`);

      if (response.status === 200) {
        const fetchedB2BUsers = response.data;
        // setCategories(fetchedCategories);

        console.log("Fetch users == >",fetchedB2BUsers)
        setFromData(fetchedB2BUsers)
         setB2BVendors(fetchedB2BUsers)
        const MediatorsData= fetchedB2BUsers.filter((el)=>{
          return el.registerAs === "Mediators"
        })

        const WholesalersData= fetchedB2BUsers.filter((el)=>{
          return el.registerAs === "Wholesalers"
        })

        const FactoryData= fetchedB2BUsers.filter((el)=>{
          return el.registerAs === "Factory"
        })

        const CollectorsData= fetchedB2BUsers.filter((el)=>{
          return el.registerAs === "Collectors"
        })
         
        setMediatorsData(MediatorsData);
        setWholesalersData(WholesalersData);
        setFactoryData(FactoryData);
        setCollectorsData(CollectorsData);

      } else {
        console.error('Error fetching categories:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handelBack = ()=>{
    window.history.back();
   }

  useEffect(()=>{
    fetchB2BUser()
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
             Vendors Orders
            </Typography>
            </Box>
           

            
          </Box>
             
          <Grid container spacing={2} sx={{marginTop:"20px"}}>
      <Grid item xs={12} sm={6}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">From</InputLabel>
        <Select
          fullWidth
          label="From"
          name="from"
          value={formData.from}
          onChange={handleInputChange}
        >
          {fromData.map((vendor) => (
            <MenuItem key={vendor._id} value={vendor._id}>
              {vendor.name} {vendor.registerAs}
            </MenuItem>
          ))}
        </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label"> To</InputLabel>
        <Select
          fullWidth
          label="To"
          name="to"
          value={formData.to}
          onChange={handleInputChange}
        >
          {toData.map((vendor) => (
            <MenuItem key={vendor._id} value={vendor._id}>
              {vendor.name} {vendor.registerAs}
            </MenuItem>
          ))}
        </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
        />
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
