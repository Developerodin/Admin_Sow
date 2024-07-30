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
    sub_category: ''
  });

  const [b2bVendors, setB2BVendors] = useState([]);
  const [CollectorsData, setCollectorsData] = useState([]);
  const [WholesalersData, setWholesalersData] = useState([]);
  const [MediatorsData, setMediatorsData] = useState([]);
  const [FactoryData, setFactoryData] = useState([]);
  const [toData, setToData] = useState([]);
  const [fromData, setFromData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [totalAmount, setTotalAmount] = useState("");
  const [selectedSubcategoryData, setSelectedSubcategoryData] = useState({});
  const [categoriesData, setCategoriesData] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${Base_url}api/category`);
      setCategoriesData(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log('Input Change:', { name, value });
  
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData, [name]: value };
  
      if (name === "from") {
        const selectedVendor = fromData.find((vendor) => vendor._id === value);
        console.log('Selected Vendor for "from":', selectedVendor);
  
        if (selectedVendor) {
          const newToData = selectedVendor.registerAs === 'Collectors'
            ? WholesalersData
            : selectedVendor.registerAs === 'Wholesalers'
            ? MediatorsData
            : selectedVendor.registerAs === 'Mediators'
            ? FactoryData
            : [];
          setToData(newToData);
        }
      }
  
      if (name === 'to') {
        const selectedVendor = fromData.find((vendor) => vendor._id === value);
        console.log('Selected Vendor for "to":', selectedVendor);
  
        if (selectedVendor) {
          newFormData.category = selectedVendor.category;
          setSubCategoryData(selectedVendor.sub_category || []);
        }
      }
  
      if (name === "category") {
        const selectedCategory = categoriesData.find((cat) => cat.name === value);
        if (selectedCategory) {
          setSubCategoryData(selectedCategory.sub_category || []);
        }
      }
  
      if (name === "sub_category") {
        const selectedSubcategory = subCategoryData.find((el) => el.name === value);
        console.log('Selected Subcategory:', selectedSubcategory);
        setSelectedSubcategoryData(selectedSubcategory || {});
      }
  
      if (name === "quantity") {
        console.log('Selected Subcategory Data for Quantity:', selectedSubcategoryData);
        if (selectedSubcategoryData && selectedSubcategoryData.price) {
          const quantity = parseInt(value, 10);
          const price = parseInt(selectedSubcategoryData.price, 10);
          const total = price * quantity;
          setTotalAmount(total);
        }
      }
  
      return newFormData;
    });
  };

  const handleSubmit = () => {
    const details = {
      category: formData.category,
      sub_category: formData.sub_category,
      quantity: formData.quantity,
    }
    createOrder(formData.from, formData.to, details, totalAmount, formData.status);
    setFormData({
      from: '',
      to: '',
      category: '',
      quantity: 0,
      totalAmount: 0,
      sub_category: ''
    });
    setTotalAmount("");
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
        console.log("Fetch users == >", fetchedB2BUsers);
        setFromData(fetchedB2BUsers);
        setB2BVendors(fetchedB2BUsers);
        setMediatorsData(fetchedB2BUsers.filter(el => el.registerAs === "Mediators"));
        setWholesalersData(fetchedB2BUsers.filter(el => el.registerAs === "Wholesalers"));
        setFactoryData(fetchedB2BUsers.filter(el => el.registerAs === "Factory"));
        setCollectorsData(fetchedB2BUsers.filter(el => el.registerAs === "Collectors"));
      } else {
        console.error('Error fetching vendors:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handelBack = () => {
    window.history.back();
  };

  useEffect(() => {
    fetchB2BUser();
    fetchCategories();  // Fetch categories when the component mounts
  }, []);

  return (
    <div>
      <Card sx={{ minHeight: "100vh" }}>
        <CardContent>
          <div onClick={handelBack} style={{ backgroundColor: "#7265bd", width: "35px", height: "35px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "10px", marginBottom: "15px" }}>
            <ArrowBackIosIcon style={{ fontSize: "16px", color: "#fff" }} />
          </div>
          <Box>
            <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography style={{ fontSize: "30px", fontWeight: 600, fontFamily: "sans-serif" }}>
                  Vendors Orders
                </Typography>
              </Box>
            </Box>
            <Grid container spacing={2} sx={{ marginTop: "20px" }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="from-select-label">From</InputLabel>
                  <Select
                    fullWidth
                    labelId="from-select-label"
                    label="From"
                    name="from"
                    value={formData.from}
                    onChange={handleInputChange}
                  >
                    {fromData.map(vendor => (
                      <MenuItem key={vendor._id} value={vendor._id}>
                        {vendor.name} {vendor.registerAs}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="to-select-label">To</InputLabel>
                  <Select
                    fullWidth
                    labelId="to-select-label"
                    label="To"
                    name="to"
                    value={formData.to}
                    onChange={handleInputChange}
                  >
                    {toData.map(vendor => (
                      <MenuItem key={vendor._id} value={vendor._id}>
                        {vendor.name} {vendor.registerAs}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    fullWidth
                    labelId="category-select-label"
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    {categoriesData.map(cat => (
                      <MenuItem key={cat.name} value={cat.name}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="sub-category-select-label">Sub Category</InputLabel>
                  <Select
                    fullWidth
                    labelId="sub-category-select-label"
                    label="Sub Category"
                    name="sub_category"
                    value={formData.sub_category}
                    onChange={handleInputChange}
                  >
                    {subCategoryData.map(el => (
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
              <Grid item xs={12} sx={{ textAlign: "right" }}>
                <Button variant="contained" sx={{ bgcolor: "orange" }} size='large' onClick={handleSubmit}>
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
