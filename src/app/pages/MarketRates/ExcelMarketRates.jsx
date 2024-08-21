import { Box, Button, Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Base_url } from '../../Config/BaseUrl';

export const ExcelMarketRates = () => {
  const navigate = useNavigate();
  const [Data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const handelAddClick = () => {
    navigate("create-excel-rates");
  };

  useEffect(() => {
    const fetchprice = async () => {
      try {
        const response = await axios.get(`${Base_url}api/excel_data`);
        console.log('Fetched price:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchprice();
  }, []);

  // Function to find the latest data by createdAt
  const getLatestData = () => {
    if (Data.length === 0) return null;
    return Data.reduce((latest, current) => {
      return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
    });
  };

  const handleCardClick = (items) => {
    setSelectedItems(items);
  };

  const latestData = getLatestData();

  return (
    <Box>
      <Card sx={{ minHeight: "100vh" }}>
        <CardContent>
          <Box>
            <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography style={{ fontSize: "40px", fontWeight: 600, fontFamily: "sans-serif" }}>
                Excel Market Rates
              </Typography>
              <Button variant="contained" style={{ marginLeft: "20px", background: "#FF8604" }} startIcon={<AddIcon />} onClick={handelAddClick}>
                Add
              </Button>
            </Box>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: "20px" }} />

          <Box style={{ marginTop: "20px" }}>
            {latestData && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div style={{ border: "1px solid #e0e0e0", padding: "20px", borderRadius: "20px", position: "relative", cursor: "pointer" }} onClick={() => handleCardClick(latestData.items)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "bold", fontSize: "21px" }}>Created Date: {new Date(latestData.createdAt).toLocaleString()}</span>
                      <span style={{ fontSize: "21px" }}>Total Items: {latestData.items.length}</span>
                    </div>
                  </div>
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Render Table When a Card is Clicked */}
          {selectedItems.length > 0 && (
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category Name</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Pincode</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedItems.map((item, idx) => (
                    <TableRow key={idx}>
                     <TableCell>{item['Category Name']?.toUpperCase()}</TableCell>
                      <TableCell>{item.City}</TableCell>
                      <TableCell>{item.Pincode}</TableCell>
                      <TableCell>{`Rs.${item.Price}`}</TableCell>
                      <TableCell>
                        <CancelOutlinedIcon style={{ fontSize: "24px", color: "crimson", marginRight: "20px" }} />
                        <EditRoundedIcon style={{ fontSize: "24px", color: "crimson" }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

        </CardContent>
      </Card>
    </Box>
  );
};
