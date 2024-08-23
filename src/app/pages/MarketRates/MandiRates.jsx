import {
  Box, Button, Card, CardContent, Typography,
  Modal, TextField, MenuItem
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import BorderColor from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Base_url } from '../../Config/BaseUrl';
import { GenralTabel } from '../../TabelComponents/GenralTable';

export const MandiRates = () => {
  const [Data, setData] = useState([]);
  const [CategoriesData, setCategoriesData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [mandiData, setMandiData] = useState({
    mandiname: '',
    city: '',
    state: '',
    categories: []
  });

  
  const handleAddClick = () => {
    setMandiData({
      mandiname: '',
      city: '',
      state: '',
      categories: []
    });
    setIsEditing(false);
    setOpen(true);
  };

 
  const handleEditClick = async (id) => {
    try {
      const mandi = await getMandiById(id);
      setMandiData({
        mandiname: mandi.mandiname,
        city: mandi.city,
        state: mandi.state,
        categories: mandi.categories || []
      });
      setEditingId(id);
      setIsEditing(true);
      setOpen(true);
    } catch (error) {
      console.error(`Failed to load Mandi with ID ${id} for editing:`, error);
    }
  };


  const handleClose = () => {
    setOpen(false);
  };

  
  const getCategories = async () => {
    try {
      const response = await axios.get(`${Base_url}api/category`);
      setCategoriesData(response.data);
      console.log("Categories all", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  
  const getMandi = async () => {
    try {
      const response = await axios.get(`${Base_url}api/mandi`);
      setData(response.data);
      console.log("Mandis all", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch mandis:", error);
    }
  };

  
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'category') {
      
      setMandiData((prevData) => ({
        ...prevData,
        categories: [value] 
      }));
    } else {
      setMandiData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  
  const handleSubmit = async () => {
    try {
      console.log('Mandi Data:', mandiData); 
      if (isEditing) {
        await updateMandi(editingId, mandiData);
        console.log(`Mandi with ID ${editingId} updated successfully.`);
      } else {
        await createMandi(mandiData);
        console.log('Mandi created successfully.');
      }
      getMandi(); 
      setOpen(false);
    } catch (error) {
      console.error('Failed to save Mandi:', error);
    }
  };


  const handleDelete = async (id) => {
    try {
      await deleteMandi(id);
      getMandi(); 
    } catch (error) {
      console.error('Failed to delete Mandi:', error);
    }
  };

  
  const deleteMandi = async (id) => {
    try {
      const response = await axios.delete(`${Base_url}api/mandi/${id}`);
      console.log("Mandi deleted", response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to delete Mandi:', error);
    }
  };

  const createMandi = async (mandiData) => {
    try {
      const response = await axios.post(`${Base_url}api/mandi`, mandiData);
      console.log("Mandi created", response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create Mandi:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  const updateMandi = async (id, mandiData) => {
    try {
      const response = await axios.put(`${Base_url}api/mandi/${id}`, mandiData);
      console.log("Mandi updated", response.data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update Mandi with ID ${id}:`, error);
    }
  };

  const getMandiById = async (id) => {
    try {
      const response = await axios.get(`${Base_url}api/mandi/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to retrieve Mandi with ID ${id}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    getCategories();
    getMandi();
  }, []);

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

  const columns = [
    { name: 'Mandi Name' },
    { name: 'Category' },
    { name: 'City' },
    { name: 'State' },
    { name: 'Delete' },
    { name: 'Update' }
  ];

  const rows = Data.map((el) => {
    return {
      title: el.mandiname || 'N/A',
      category: el.categories[0] || 'N/A',
      city: el.city || 'N/A',
      state: el.state || 'N/A',
      delete: <DeleteIcon onClick={() => handleDelete(el._id)} />,
      update: <BorderColor onClick={() => handleEditClick(el._id)} />
    };
  });

  

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
          <GenralTabel column={columns} rows={rows} />
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
              {isEditing ? 'Edit Mandi' : 'Add Mandi'}
            </Typography>
            <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }} />
          </Box>
          <TextField
            fullWidth
            label="Mandi Name"
            name="mandiname"
            value={mandiData.mandiname}
            onChange={handleChange}
            sx={{ marginTop: "30px" }}
          />
          <TextField
            fullWidth
            label="City"
            name="city"
            value={mandiData.city}
            onChange={handleChange}
            sx={{ marginTop: "30px" }}
          />
          <TextField
            fullWidth
            label="State"
            name="state"
            value={mandiData.state}
            onChange={handleChange}
            sx={{ marginTop: "30px" }}
          />
          <TextField
            fullWidth
            select
            label="Category"
            name="category"
            value={mandiData.categories[0] || ''}
            onChange={handleChange}
            sx={{ marginTop: "30px" }}
          >
            {CategoriesData.map((category) => (
              <MenuItem key={category._id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ marginTop: "30px", display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {isEditing ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
