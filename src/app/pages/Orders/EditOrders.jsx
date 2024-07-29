import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import { Box, Card, CardContent, FormControl, InputLabel, Typography } from '@mui/material';
import { Base_url } from '../../Config/BaseUrl';
import axios from 'axios';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export const EditOrder = () => {
  const { id } = useParams();
  const [orderId, setOrderId] = useState(id);
    const [totalAmount, setTotalAmount] = useState(0);
  const [formData, setFormData] = useState({
    user: '',
    category: '',
    quantity: '',
    totalAmount: '',
    sub_category: ''
  });

  const [update, setUpdate] = useState(0);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [selectedSubcategoryData, setSelectedSubcategoryData] = useState({});
  const [usersData, setUsersdata] = useState([]);
  const [CategoriesData, setCategoriesData] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => {
      const newFormData = {
        ...prevState,
        [name]: value,
      };

      if (name === 'category') {
        const selectedCategory = CategoriesData.find(vendor => vendor._id === value);
        if (selectedCategory) {
          setSubCategoryData(selectedCategory.sub_category);
        }
      } else if (name === 'sub_category') {
        const selectedSubcategory = subCategoryData.find(el => el.name === value);
        setSelectedSubcategoryData(selectedSubcategory);
      } else if (name === 'quantity') {
        const price = selectedSubcategoryData.price || 0;
        const total = parseInt(price) * value;
        setTotalAmount(total);
      }

      return newFormData;
    });
  };

  const handleSubmit = () => {
    const Data = {
      customer: formData.user,
      details: {
        category: formData.category,
        sub_category: formData.sub_category,
        quantity: formData.quantity,
      },
      totalAmount: totalAmount,
      status: 'not assigned',
    };

    updateOrder(Data);
    setFormData({
      user: '',
      category: '',
      quantity: 0,
      totalAmount: 0,
      sub_category: ''
    });
    setTotalAmount("");
    handelBack();
  };

  const updateOrder = async (Data) => {
    try {
      await axios.put(`${Base_url}api/orders/${orderId}`, {
        customer: {
          name: Data.customer
        },
        details: {
          category: {
            _id: Data.details.category
          },
          sub_category: Data.details.sub_category,
          quantity: Data.details.quantity
        },
        totalAmount: Data.totalAmount,
        status: Data.status
      });
      setUpdate(prev => prev + 1);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      if (orderId) {
        const response = await axios.get(`${Base_url}api/orders/${orderId}`);
        const data = response.data;

        // Extract relevant data from response
        const customerName = data.customer.name;
        const category = data.details.category._id;
        const subCategory = data.details.sub_category;
        const quantity = data.details.quantity;
        const totalAmount = data.totalAmount || 0; // Set default value

        // Update formData state
        setFormData({
          user: customerName,
          category: category,
          sub_category: subCategory,
          quantity: quantity,
          totalAmount: totalAmount,
        });

        // Set subCategoryData and selectedSubcategoryData based on fetched data
        const selectedCategory = CategoriesData.find(cat => cat._id === category);
        if (selectedCategory) {
          setSubCategoryData(selectedCategory.sub_category);
          const selectedSubcategory = selectedCategory.sub_category.find(sub => sub.name === subCategory);
          setSelectedSubcategoryData(selectedSubcategory);
        }
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${Base_url}api/users`);
      if (response.status === 200) {
        setUsersdata(response.data);
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
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  useEffect(() => {
    fetchUser();
    getCategories();
  }, [update]);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handelBack = () => {
    window.history.back();
  };

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
                  Edit Order
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ marginTop: "20px" }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="user-label">User</InputLabel>
                  <Select
                    fullWidth
                    label="User"
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
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    fullWidth
                    label="Category"
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
                <FormControl fullWidth>
                  <InputLabel id="sub-category-label">Sub Category</InputLabel>
                  <Select
                    fullWidth
                    label="Sub Category"
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
                  value={formData.totalAmount}
                    onChange={handleInputChange}
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
