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
  const [formData, setFormData] = useState({
    orderFrom: '',
    orderTo: '',
    category: '',
    quantity: 0,
    totalAmount: 0,
    sub_category: '',
    unit: '',
    weight: ''
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [selectedSubcategoryData, setSelectedSubcategoryData] = useState({});
  const [b2cUsers, setB2cUsers] = useState([]);
  const [b2bUsers, setB2bUsers] = useState([]);
  const [CategoriesData, setCategoriesData] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => {
      const newFormData = {
        ...prevState,
        [name]: value,
      };

      if (name === 'category') {
        const selectedCategory = CategoriesData.find(cat => cat.name === value);
        if (selectedCategory) {
          getSubCategoriesByCategoryName(value);
          setFormData({
            ...newFormData,
            sub_category: '',
            totalAmount: 0,
            unit: '',
            weight: ''
          });
          setTotalAmount(0);
        }
      } else if (name === 'sub_category') {
        const selectedSubcategory = subCategoryData.find(sub => sub.name === value);
        setSelectedSubcategoryData(selectedSubcategory);
        const price = selectedSubcategory ? parseFloat(selectedSubcategory.value) : 0;
        const total = price * formData.quantity;
        setTotalAmount(total);
        setFormData({
          ...newFormData,
          totalAmount: total,
          unit: selectedSubcategory?.unit || '',
          weight: selectedSubcategory?.weight || ''
        });
      } else if (name === 'quantity') {
        const price = selectedSubcategoryData.value ? parseFloat(selectedSubcategoryData.value) : 0;
        const total = parseInt(value) * price;
        setTotalAmount(total);
        setFormData({
          ...newFormData,
          totalAmount: total
        });
      }

      return newFormData;
    });
  };

  const handleSubmit = () => {
    const Data = {
      items: [{
        category: formData.category,
        subCategory: formData.sub_category,
        value: selectedSubcategoryData.value || 0,
        unit: formData.unit,
        weight: formData.weight,
        totalPrice: totalAmount
      }],
      orderStatus: 'New',
      orderBy: formData.orderFrom,
      orderTo: formData.orderTo
    };

    updateOrder(Data);
    setFormData({
      orderFrom: '',
      orderTo: '',
      category: '',
      quantity: 0,
      totalAmount: 0,
      sub_category: '',
      unit: '',
      weight: ''
    });
    setTotalAmount(0);
    handelBack();
  };

  const updateOrder = async (Data) => {
    try {
      await axios.put(`${Base_url}b2cOrder/${orderId}`, Data);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      if (orderId) {
        const response = await axios.get(`${Base_url}b2cOrder/${orderId}`);
        const data = response.data;

        if (data.items && data.items.length > 0) {
          const firstItem = data.items[0];
          setFormData({
            orderFrom: data.orderBy || '',
            orderTo: data.orderTo || '',
            category: firstItem.category,
            sub_category: firstItem.subCategory,
            quantity: firstItem.value,
            totalAmount: firstItem.totalPrice,
            unit: firstItem.unit,
            weight: firstItem.weight
          });
          setTotalAmount(firstItem.totalPrice);

          await getSubCategoriesByCategoryName(firstItem.category);
        }
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const fetchB2CUsers = async () => {
    try {
      const response = await axios.get(`${Base_url}b2cUser`);
      if (response.status === 200) {
        const users = response.data.results.map(user => ({
          _id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phoneNumber: user.phoneNumber
        }));
        setB2cUsers(users);
      } else {
        console.error('Error fetching B2C users:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const fetchB2BUsers = async () => {
    try {
      const response = await axios.get(`${Base_url}b2bUser`);
      if (response.status === 200) {
        const users = response.data.results.map(user => ({
          _id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber
        }));
        setB2bUsers(users);
      } else {
        console.error('Error fetching B2B users:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`${Base_url}categories`);
      setCategoriesData(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getSubCategoriesByCategoryName = async (categoryName) => {
    try {
      const response = await axios.post(`${Base_url}subcategories/category`, {
        categoryName: categoryName
      });
      console.log('Subcategories response:', response.data);
      setSubCategoryData(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubCategoryData([]);
    }
  };

  useEffect(() => {
    fetchB2CUsers();
    fetchB2BUsers();
    getCategories();
  }, []);

  useEffect(() => {
    if (CategoriesData.length > 0) {
      fetchOrderDetails();
    }
  }, [orderId, CategoriesData]);

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
                  <InputLabel id="order-from-label">Order From (B2C)</InputLabel>
                  <Select
                    fullWidth
                    label="Order From (B2C)"
                    name="orderFrom"
                    value={formData.orderFrom}
                    onChange={handleInputChange}
                  >
                    {b2cUsers.map((user) => (
                      <MenuItem key={user._id} value={user.name}>
                        {user.name} ({user.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="order-to-label">Order To (B2B)</InputLabel>
                  <Select
                    fullWidth
                    label="Order To (B2B)"
                    name="orderTo"
                    value={formData.orderTo}
                    onChange={handleInputChange}
                  >
                    {b2bUsers.map((user) => (
                      <MenuItem key={user._id} value={user.name}>
                        {user.name} ({user.email})
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
                    {CategoriesData.map((category) => (
                      <MenuItem key={category._id} value={category.name}>
                        {category.name}
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
                    {subCategoryData.map((sub) => (
                      <MenuItem key={sub._id} value={sub.name}>
                        {sub.name} {sub.value && `${sub.value} / ${sub.unit}`}
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

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Unit"
                  name="unit"
                  value={formData.unit}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight"
                  name="weight"
                  value={formData.weight}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Total Amount"
                  type="number"
                  name="totalAmount"
                  value={totalAmount}
                  InputProps={{ readOnly: true }}
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
