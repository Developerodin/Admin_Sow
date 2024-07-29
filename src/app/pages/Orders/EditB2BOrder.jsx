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
        from: '',
        to: '',
        category: '',
        sub_category: '',
        quantity: 0,
        totalAmount: 0,
    });
    const [b2bVendors, setB2BVendors] = useState([]);
    const [toData, setToData] = useState([]);
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [selectedSubcategoryData, setSelectedSubcategoryData] = useState({});

    useEffect(() => {
        const fetchB2BOrder = async () => {
            try {
                const response = await axios.get(`${Base_url}api/b2b_orders/${id}`);
                const orderData = response.data;

                // Debugging
                console.log('Order Data:', orderData);

                setFormData({
                    from: orderData.from._id,
                    to: orderData.to._id,
                    category: orderData.details.category,
                    sub_category: orderData.details.sub_category,
                    quantity: orderData.details.quantity,
                    totalAmount: orderData.totalAmount,
                });

                const fromVendor = orderData.from;
                const subCategories = fromVendor.categories.find(cat => cat.name === orderData.details.category)?.sub_category || [];
                setSubCategoryData(subCategories);

                const selectedSubcategory = subCategories.find(sc => sc.name === orderData.details.sub_category) || {};
                setSelectedSubcategoryData(selectedSubcategory);

                // Debugging
                console.log('Sub Categories:', subCategories);
                console.log('Selected Subcategory:', selectedSubcategory);

            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        const fetchB2BUser = async () => {
            try {
                const response = await axios.get(`${Base_url}api/b2b`);
                if (response.status === 200) {
                    const fetchedB2BUsers = response.data;
                    setB2BVendors(fetchedB2BUsers);
                    const fromVendor = fetchedB2BUsers.find(v => v._id === formData.from);
                    if (fromVendor) {
                        if (fromVendor.registerAs === 'Collectors') {
                            setToData(fetchedB2BUsers.filter(v => v.registerAs === 'Wholesalers'));
                        } else if (fromVendor.registerAs === 'Wholesalers') {
                            setToData(fetchedB2BUsers.filter(v => v.registerAs === 'Mediators'));
                        } else if (fromVendor.registerAs === 'Mediators') {
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
        // Update options when `from` changes
        if (formData.from) {
            const selectedVendor = b2bVendors.find(vendor => vendor._id === formData.from);
            if (selectedVendor) {
                if (selectedVendor.registerAs === 'Collectors') {
                    setToData(b2bVendors.filter(v => v.registerAs === 'Wholesalers'));
                } else if (selectedVendor.registerAs === 'Wholesalers') {
                    setToData(b2bVendors.filter(v => v.registerAs === 'Mediators'));
                } else if (selectedVendor.registerAs === 'Mediators') {
                    setToData(b2bVendors.filter(v => v.registerAs === 'Factory'));
                }
            }
        }
    }, [formData.from, b2bVendors]);

    useEffect(() => {
        // Update subcategories when `to` or `category` changes
        if (formData.to) {
            const selectedVendor = b2bVendors.find(vendor => vendor._id === formData.to);
            if (selectedVendor) {
                const subCategories = selectedVendor.categories.find(cat => cat.name === formData.category)?.sub_category || [];
                setSubCategoryData(subCategories);

                // Update selected subcategory if it exists
                const selectedSubcategory = subCategories.find(sc => sc.name === formData.sub_category) || {};
                setSelectedSubcategoryData(selectedSubcategory);
            }
        }
    }, [formData.to, formData.category, b2bVendors]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => {
            const updatedFormData = {
                ...prevState,
                [name]: value,
            };

            if (name === 'sub_category') {
                const selectedSubcategory = subCategoryData.find(el => el.name === value);
                setSelectedSubcategoryData(selectedSubcategory || {});
            }

            if (name === 'quantity') {
                const total = parseInt(selectedSubcategoryData.price || 0) * value;
                return {
                    ...updatedFormData,
                    totalAmount: total,
                };
            }

            return updatedFormData;
        });
    };

    const handleSubmit = async () => {
        try {
            await axios.put(`${Base_url}api/b2b_orders/${id}`, formData);
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
                                        value={formData.from || ''}
                                        onChange={handleInputChange}
                                    >
                                        {b2bVendors.map(vendor => (
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
                                        value={formData.to || ''}
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
                                <TextField
                                    fullWidth
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="sub-category-select-label">Sub Category</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="sub-category-select-label"
                                        label="Sub Category"
                                        name="sub_category"
                                        value={formData.sub_category || ''}
                                        onChange={handleInputChange}
                                    >
                                        {subCategoryData.map(sub => (
                                            <MenuItem key={sub._id} value={sub.name}>
                                                {sub.name} (Price: {sub.price} / {sub.unit})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Quantity"
                                    name="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Total Amount"
                                    name="totalAmount"
                                    value={formData.totalAmount}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                            <Button variant="contained" onClick={handleSubmit}>
                                Submit
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};
