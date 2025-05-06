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
import { useParams } from 'react-router-dom';

export const EditB2BOrder = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        orderBy: {
            id: '',
            name: '',
            phoneNumber: '',
            registerAs: ''
        },
        orderTo: {
            id: '',
            name: '',
            phoneNumber: '',
            registerAs: ''
        },
        category: '',
        subCategory: '',
        weight: '',
        unit: '',
        notes: '',
        value: 0,
        totalPrice: 0,
        orderStatus: 'New'
    });

    const [b2bVendors, setB2BVendors] = useState([]);
    const [toData, setToData] = useState([]);
    const [categoriesData, setCategoriesData] = useState([]);
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [selectedSubcategoryData, setSelectedSubcategoryData] = useState({});

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await axios.get(`${Base_url}categories`);
                setCategoriesData(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        getCategories();
    }, []);

    useEffect(() => {
        const fetchB2BOrder = async () => {
            try {
                const response = await axios.get(`${Base_url}b2bOrder/${id}`);
                const orderData = response.data;

                setFormData({
                    orderBy: {
                        id: orderData.orderBy.id,
                        name: orderData.orderBy.name,
                        phoneNumber: orderData.orderBy.phoneNumber,
                        registerAs: orderData.orderBy.registerAs
                    },
                    orderTo: {
                        id: orderData.orderTo.id,
                        name: orderData.orderTo.name,
                        phoneNumber: orderData.orderTo.phoneNumber,
                        registerAs: orderData.orderTo.registerAs
                    },
                    category: orderData.category,
                    subCategory: orderData.subCategory,
                    weight: orderData.weight,
                    unit: orderData.unit,
                    notes: orderData.notes || '',
                    value: orderData.value,
                    totalPrice: orderData.totalPrice,
                    orderStatus: orderData.orderStatus
                });

                // Set subcategories based on the selected category
                const selectedCategory = categoriesData.find(cat => cat.name === orderData.category);
                if (selectedCategory) {
                    setSubCategoryData(selectedCategory.sub_category || []);
                }

            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        const fetchB2BUser = async () => {
            try {
                const response = await axios.get(`${Base_url}b2bUser`);
                if (response.status === 200) {
                    const fetchedB2BUsers = response.data.results;
                    setB2BVendors(fetchedB2BUsers);
                    
                    // Filter vendors based on registerAs
                    const fromVendor = fetchedB2BUsers.find(v => v.id === formData.orderBy.id);
                    if (fromVendor) {
                        if (fromVendor.registerAs === 'Retailer') {
                            setToData(fetchedB2BUsers.filter(v => v.registerAs === 'Wholesaler'));
                        } else if (fromVendor.registerAs === 'Wholesaler') {
                            setToData(fetchedB2BUsers.filter(v => v.registerAs === 'Mediator'));
                        } else if (fromVendor.registerAs === 'Mediator') {
                            setToData(fetchedB2BUsers.filter(v => v.registerAs === 'Factory'));
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching vendors:', error);
            }
        };

        fetchB2BOrder();
        fetchB2BUser();
    }, [id]);

    useEffect(() => {
        if (formData.orderBy.id) {
            const selectedVendor = b2bVendors.find(vendor => vendor.id === formData.orderBy.id);
            if (selectedVendor) {
                if (selectedVendor.registerAs === 'Retailer') {
                    setToData(b2bVendors.filter(v => v.registerAs === 'Wholesaler'));
                } else if (selectedVendor.registerAs === 'Wholesaler') {
                    setToData(b2bVendors.filter(v => v.registerAs === 'Mediator'));
                } else if (selectedVendor.registerAs === 'Mediator') {
                    setToData(b2bVendors.filter(v => v.registerAs === 'Factory'));
                }
            }
        }
    }, [formData.orderBy.id, b2bVendors]);

    useEffect(() => {
        if (formData.category) {
            const selectedCategory = categoriesData.find(cat => cat.name === formData.category);
            if (selectedCategory) {
                setSubCategoryData(selectedCategory.sub_category || []);
            }
        }
    }, [formData.category, categoriesData]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => {
            const updatedFormData = {
                ...prevState,
                [name]: value,
            };

            if (name === 'weight') {
                const total = parseInt(value) * prevState.value;
                return {
                    ...updatedFormData,
                    totalPrice: total,
                };
            }

            return updatedFormData;
        });
    };

    const handleVendorChange = (event, type) => {
        const { value } = event.target;
        const selectedVendor = b2bVendors.find(v => v.id === value);
        
        if (selectedVendor) {
            setFormData(prevState => ({
                ...prevState,
                [type]: {
                    id: selectedVendor.id,
                    name: selectedVendor.name,
                    phoneNumber: selectedVendor.phoneNumber,
                    registerAs: selectedVendor.registerAs
                }
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            await axios.put(`${Base_url}b2bOrder/${id}`, formData);
            window.history.back();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    return (
        <div>
            <Card sx={{ minHeight: "100vh" }}>
                <CardContent>
                    <div
                        onClick={() => window.history.back()}
                        style={{
                            backgroundColor: "#7265bd",
                            width: "35px",
                            height: "35px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "10px",
                            marginBottom: "15px"
                        }}
                    >
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
                                    <InputLabel id="from-select-label">From</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="from-select-label"
                                        label="From"
                                        value={formData.orderBy.id || ''}
                                        onChange={(e) => handleVendorChange(e, 'orderBy')}
                                    >
                                        {b2bVendors.map(vendor => (
                                            <MenuItem key={vendor.id} value={vendor.id}>
                                                {vendor.name} ({vendor.registerAs})
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
                                        value={formData.orderTo.id || ''}
                                        onChange={(e) => handleVendorChange(e, 'orderTo')}
                                    >
                                        {toData.map(vendor => (
                                            <MenuItem key={vendor.id} value={vendor.id}>
                                                {vendor.name} ({vendor.registerAs})
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
                                        value={formData.category || ''}
                                        onChange={handleInputChange}
                                    >
                                        {categoriesData.map(category => (
                                            <MenuItem key={category._id} value={category.name}>
                                                {category.name}
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
                                        name="subCategory"
                                        value={formData.subCategory || ''}
                                        onChange={handleInputChange}
                                    >
                                        {subCategoryData.map(sub => (
                                            <MenuItem key={sub._id} value={sub.name}>
                                                {sub.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Weight"
                                    name="weight"
                                    type="number"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Unit"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Value per Unit"
                                    name="value"
                                    type="number"
                                    value={formData.value}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Total Price"
                                    name="totalPrice"
                                    value={formData.totalPrice}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Notes"
                                    name="notes"
                                    multiline
                                    rows={4}
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ marginTop: '20px', textAlign:'right' }}>
                            <Button variant="contained" onClick={handleSubmit}>
                                Update
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};
