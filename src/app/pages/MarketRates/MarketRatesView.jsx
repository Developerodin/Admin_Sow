import {
    Box, Button, Card, CardContent, Typography,
    TextField
  } from '@mui/material';
  import React, { useEffect, useState } from 'react';
  import AddIcon from '@mui/icons-material/Add';
  import axios from 'axios';
  import { Base_url } from '../../Config/BaseUrl';
  import { useParams } from 'react-router-dom';
  import ArrowBackIcon from '@mui/icons-material/ArrowBack';
  
  export const MarketRatesView = () => {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [prices, setPrices] = useState({});
    const [history, setHistory] = useState([]);
    
    
    const getMandiById = async (id) => {
      try {
        const response = await axios.get(`${Base_url}api/mandi/${id}`);
        setData(response.data);
        
        const initialPrices = response.data.categories.reduce((acc, category) => {
          acc[category] = '';
          return acc;
        }, {});
        setPrices(initialPrices);
      } catch (error) {
        console.error(`Failed to retrieve Mandi with ID ${id}:`, error);
      }
    };
  

    const handleGetMandiHistory = async () => {
      try {
        const response = await axios.get(`${Base_url}api/mandi_rates/history/mandi/${id}`);
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching Mandi history:', error);
      }
    };
  
    useEffect(() => {
      getMandiById(id);
      handleGetMandiHistory(); 
    }, [id]);
  
    const handlePriceChange = (category, value) => {
      setPrices((prevPrices) => ({
        ...prevPrices,
        [category]: value,
      }));
    };
  
    const handleSave = async (category) => {
      const newPrice = prices[category];
      if (!newPrice) {
        alert("Price cannot be empty.");
        return;
      }
  
      try {
        const response = await axios.put(`${Base_url}api/mandi_rates/category-prices/${id}/${category}`, {
          newPrice,
        });
  
        if (response.status === 200) {
          alert(`Price for ${category} updated successfully.`);
          handleGetMandiHistory(); // Fetch history again after saving
        } else {
          alert(`Failed to update price for ${category}.`);
        }
      } catch (error) {
        console.error('Failed to save price:', error);
        alert(`Error updating price for ${category}: ${error.response ? error.response.data.error : error.message}`);
      }
    };

    const handleBackButton = () => {
        window.history.back();
      };
  
    const handleSaveAll = async () => {
      const categoryPrices = Object.entries(prices).map(([category, price]) => ({
        category,
        price,
      }));
  
      try {
        const result = await axios.post(`${Base_url}api/mandi_rates/category-prices`, {
          mandi: id,
          categoryPrices,
        });
  
        if (result.status === 200) {
          alert('All category prices saved successfully.');
          handleGetMandiHistory(); // Fetch history again after saving all
        } else {
          alert('All category prices saved successfully.');
        }
      } catch (error) {
        console.error('Error saving category prices:', error);
        alert(`Error saving category prices: ${error.response ? error.response.data.error : error.message}`);
      }
    };
  
    return (
      <Box>
        <Card sx={{ minHeight: "100vh" }}>
          <CardContent>
            <Box>
              <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}> 
              <Box
        onClick={handleBackButton}
        sx={{
          backgroundColor: "#7265bd",
          width: "35px",
          height: "35px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "10px",
          cursor: "pointer",
          marginRight: "10px" 
        }}
      >
        <ArrowBackIcon sx={{ fontSize: "16px", color: "#fff" }} />
      </Box>
                <Typography style={{ fontSize: "36px", fontWeight: 600, fontFamily: "sans-serif" }}>
                  View Market Rates
                </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  style={{ marginLeft: "20px", background: "#FF8604" }} 
                  startIcon={<AddIcon />} 
                  onClick={handleSaveAll}
                >
                  Save All
                </Button>
              </Box>
            </Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: "20px" }} />
  
            <Box style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
              {data.categories && data.categories.map((category, index) => (
                <Box key={index} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Box style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                    <TextField
                      required
                      sx={{ flex: 0.5 }}
                      id={`category-${index}`}
                      label="Category Name"
                      value={category}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      required
                      sx={{ flex: 0.5 }}
                      id={`price-${index}`}
                      label="Price"
                      value={prices[category] || ''}
                      onChange={(e) => handlePriceChange(category, e.target.value)}
                    />
                    <Button variant="contained" sx={{ background: "#FF8604" }} onClick={() => handleSave(category)}>
                      Save
                    </Button>
                  </Box>
                </Box>
              ))}
  
              
  <div>
      {history.length > 0 && (
        <Box style={{ marginTop: "40px" }}>
          <Typography variant="h6">Full Mandi Price History</Typography>
          {history.map((entry, idx) => (
            <Box key={idx} style={{ marginBottom: "20px" }}>
              <Typography variant="subtitle1">
                {new Date(entry.createdAt).toLocaleString()}
              </Typography>
              {entry.categoryPrices.map((categoryPrice) => (
                <Box
                  key={categoryPrice._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px 0",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <Typography>{categoryPrice.category}</Typography>
                  <Typography>{categoryPrice.price}</Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </div>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  };
  