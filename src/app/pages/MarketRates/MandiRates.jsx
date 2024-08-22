import { Box, Button, Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, TextField ,Select, MenuItem} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Base_url } from '../../Config/BaseUrl';
import CloseIcon from '@mui/icons-material/Close';
import { SelectStateModel } from '../../../_metronic/layout/components/Model/SelectStateModel';

export const MandiRates = () => {
  const navigate = useNavigate();
  const [Data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [CategoriesData, setCategoriesData] = useState([]);

  const [open, setOpen] = useState(false);
  const [mandiData, setMandiData] = useState({
    title: '',
    category : '',
    city: '',
    state: ''
  });

  const handleAddClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
    getCategories();
  },[])

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${Base_url}api/excel_data/${id}`);
      console.log('Data deleted successfully!');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };


  const latestData = getLatestData();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMandiData({
      ...mandiData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    
    console.log('Mandi Data:', mandiData);
    setOpen(false);
  };
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
  };

  return (
    <Box>
      <Card sx={{ minHeight: "100vh" }}>
        <CardContent>
          <Box>
            <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography style={{ fontSize: "40px", fontWeight: 600, fontFamily: "sans-serif" }}>
                Mandi 
              </Typography>
              <Button variant="contained" style={{ marginLeft: "20px", background: "#FF8604" }} startIcon={<AddIcon />} onClick={handleAddClick}>
                Add Mandi
              </Button>
            </Box>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: "20px" }} />

          

          

        </CardContent>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography id="modal-modal-title" variant="h4" component="h2">
              Add Mandi
            </Typography>
            <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }} />
          </Box>

          <TextField
            fullWidth
            label="Title"
            name="title"
            value={mandiData.title}
            onChange={handleChange}
            sx={{ marginTop: "30px" }}
          />

          <TextField
            fullWidth
            label="Category"
            name="category"
            value={mandiData.category}
            onChange={handleChange}
            sx={{ marginTop: "20px" }}
            select
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {
              CategoriesData && CategoriesData.map((el, index) => {
                return <MenuItem key={index} value={el.name}>{el.name}</MenuItem>
              })
            }
          </TextField>




          

          <TextField
            fullWidth
            label="City"
            name="city"
            value={mandiData.city}
            onChange={handleChange}
            sx={{ marginTop: "20px" }}
          />

          <TextField
            fullWidth
            label="State"
            name="state"
            value={mandiData.state}
            onChange={handleChange}
            sx={{ marginTop: "20px" }}
          />

          <Box sx={{ display: "flex", justifyContent: "right", alignItems: "center", marginTop: "15px" }}>
            <Button variant='contained' size='small' sx={{ backgroundColor: "black" }} onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
